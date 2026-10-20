"""
Genera perplexity-scores.json: las puntuaciones de atractivo de mercado que
usa el motor Perplexity en la web.

Se ejecuta UNA VEZ para tener el fichero guardado. A partir de entonces la web
lo lee del servidor y no llama a Perplexity nunca mas, asi que el coste es cero
para siempre. Cuando quieras actualizar los datos, lo vuelves a ejecutar.

COMO SE USA

    python generar-puntuaciones-perplexity.py

Te pedira la clave de API. No se escribe en ningun fichero ni se guarda: se
usa solo mientras el script corre. Si prefieres no teclearla, puedes dejarla
en la variable de entorno PERPLEXITY_API_KEY antes de lanzarlo.

    set PERPLEXITY_API_KEY=pplx-...            (Windows cmd)
    $env:PERPLEXITY_API_KEY = 'pplx-...'       (PowerShell)

La clave se crea en https://console.perplexity.ai/settings/api

COSTE

    preset fast    0,04 USD por los 176 paises (12 lotes de 15)
    preset medium  0,08 USD

VERSION

    Python 3.8 o superior. No instala nada: solo usa la biblioteca estandar.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

# --- Direccion de la API ----------------------------------------------------
# Agent API. El endpoint antiguo /v1/chat/completions dio por cerrado el
# 27 de septiembre de 2026, asi que aqui se usa el nuevo.
URL_API = "https://api.perplexity.ai/v1/agent"

# --- Costes reales, de docs.perplexity.ai/getting-started/pricing ------------
# Se usan solo para mostrar el presupuesto estimado. No afectan al resultado.
PRECIOS = {
    # preset: (modelo, $/1M entrada, $/1M salida, busquedas web, fetch_url)
    "fast":   ("gpt-5.6-luna", 0.20, 1.20, 1, 0),
    "low":    ("gpt-5.6-luna", 0.20, 1.20, 1, 1),
    "medium": ("gpt-5.6-luna", 0.20, 1.20, 2, 2),
    "high":   ("gpt-5.6-sol",  2.00, 10.00, 3, 3),
}
PRECIO_WEB_SEARCH = 0.0025
PRECIO_FETCH_URL = 0.0005

TAMANO_LOTE = 15
TOKENS_ENTRADA_ESTIMADOS = 1100
TOKENS_SALIDA_ESTIMADOS = 350


def pedir_clave():
    """Pregunta la clave sin escribirla en disco ni en el historial."""
    clave = os.environ.get("PERPLEXITY_API_KEY", "").strip()
    if clave:
        return clave

    print()
    print("  Necesito tu clave de API de Perplexity.")
    print("  Se crea en  https://console.perplexity.ai/settings/api")
    print()
    try:
        import getpass
        clave = getpass.getpass("  Clave (no se mostrara): ").strip()
    except Exception:
        clave = input("  Clave: ").strip()

    if not clave:
        print("\n  Sin clave no se puede continuar. Saliendo.")
        sys.exit(1)
    return clave


def leer_paises():
    """Saca la lista de paises del propio script.js, para que no haya dos
    listas que se puedan desincronizar."""
    aqui = os.path.dirname(os.path.abspath(__file__))
    candidatos = [
        os.path.join(aqui, "..", "script.js"),
        os.path.join(aqui, "script.js"),
        os.path.join(os.getcwd(), "script.js"),
    ]
    for ruta in candidatos:
        if os.path.isfile(ruta):
            with open(ruta, encoding="utf-8") as f:
                texto = f.read()
            bloque = re.search(r"const extendedCountryScores = \{(.*?)\n\};", texto, re.S)
            if bloque:
                paises = re.findall(r"'([^']+)':\s*\d+", bloque.group(1))
                return paises, ruta
    return [], None


def construir_instruccion(paises):
    return "\n".join([
        "Evalua el atractivo del mercado de exportacion para una empresa industrial espanola.",
        "",
        "Para CADA uno de los paises de la lista, asigna una puntuacion entera de 0 a 100",
        "con estos criterios, ponderados como en un analisis de mercado real:",
        "  - Demanda y tamano del mercado para producto industrial (25 %)",
        "  - Barreras comerciales y arancelarias, tratados y logistica de entrada (25 %)",
        "  - Riesgo pais, estabilidad politica y juridica (20 %)",
        "  - Poder adquisitivo y crecimiento economico (15 %)",
        "  - Facilidad administrativa para una pyme espanola (15 %)",
        "",
        "100 = mercado muy atractivo para exportar. 50 = indiferente. 0 = no recomendable.",
        "",
        "Responde EXCLUSIVAMENTE con este JSON y nada mas, sin explicaciones ni texto",
        "alrededor, sin bloques de codigo:",
        '{"puntuaciones": {"<pais>": <numero 0-100>}}',
        "",
        "La clave debe ser el nombre del pais exactamente como aparece en la lista,",
        "incluidos los acentos. Incluye una entrada por cada pais, ni mas ni menos.",
        "",
        "Lista de paises:",
        ", ".join(paises),
    ])


def extraer_json(texto):
    """Saca el objeto JSON de la respuesta, aunque venga envuelto en texto o en
    un bloque de codigo."""
    if not isinstance(texto, str):
        return None

    t = texto.strip()

    vallas = re.search(r"```(?:json)?\s*([\s\S]*?)```", t, re.I)
    if vallas:
        t = vallas.group(1).strip()

    primero = t.find("{")
    ultimo = t.rfind("}")
    if primero == -1 or ultimo <= primero:
        return None

    try:
        return json.loads(t[primero:ultimo + 1])
    except Exception:
        return None


def contenido_de_la_respuesta(datos):
    """El Agent API devuelve la respuesta en distintos sitios segun la version.
    Se prueban todos."""
    # Formato nuevo: output
    salida = datos.get("output")
    if isinstance(salida, str):
        return salida
    if isinstance(salida, list) and salida:
        primero = salida[0]
        if isinstance(primero, str):
            return primero
        if isinstance(primero, dict):
            if isinstance(primero.get("text"), str):
                return primero["text"]
            contenido = primero.get("content")
            if isinstance(contenido, str):
                return contenido
            if isinstance(contenido, list):
                for parte in contenido:
                    if isinstance(parte, dict) and isinstance(parte.get("text"), str):
                        return parte["text"]

    # Formato antiguo: choices
    opciones = datos.get("choices")
    if isinstance(opciones, list) and opciones:
        mensaje = opciones[0].get("message") if isinstance(opciones[0], dict) else None
        if isinstance(mensaje, dict) and isinstance(mensaje.get("content"), str):
            return mensaje["content"]

    for clave in ("content", "text", "answer"):
        if isinstance(datos.get(clave), str):
            return datos[clave]

    return None


def pedir_lote(paises, preset, clave, intentos=3):
    cuerpo = json.dumps({
        "preset": preset,
        "input": construir_instruccion(paises),
    }).encode("utf-8")

    peticion = urllib.request.Request(
        URL_API,
        data=cuerpo,
        headers={
            "Authorization": "Bearer " + clave,
            "Content-Type": "application/json",
        },
        method="POST",
    )

    ultimo_error = None

    for intento in range(intentos):
        if intento > 0:
            espera = 2 * (3 ** intento)
            print("      reintento en %d s (intento %d de %d)" % (espera, intento + 1, intentos))
            time.sleep(espera)
        try:
            with urllib.request.urlopen(peticion, timeout=180) as r:
                datos = json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            detalle = e.read().decode("utf-8", "replace")[:300]
            if e.code == 429:
                ultimo_error = "Limite de peticiones alcanzado (429)"
                continue
            ultimo_error = "HTTP %d: %s" % (e.code, detalle)
            if e.code in (401, 403):
                # Una clave mala no mejora si se reintenta
                break
            continue
        except Exception as e:
            ultimo_error = str(e)
            continue

        objeto = extraer_json(contenido_de_la_respuesta(datos))
        if objeto and isinstance(objeto.get("puntuaciones"), dict):
            return objeto["puntuaciones"], None
        ultimo_error = "La respuesta no traia un JSON con 'puntuaciones'."

    return {}, ultimo_error or "Error desconocido"


def estimar_presupuesto(preset, lotes):
    modelo, ent, sal, web, fetch = PRECIOS[preset]
    por_lote = (
        TOKENS_ENTRADA_ESTIMADOS / 1e6 * ent
        + TOKENS_SALIDA_ESTIMADOS / 1e6 * sal
        + web * PRECIO_WEB_SEARCH
        + fetch * PRECIO_FETCH_URL
    )
    return por_lote, por_lote * lotes


def main():
    print()
    print("=" * 66)
    print("  Puntuaciones de Perplexity para GEM")
    print("=" * 66)
    print()

    paises, origen = leer_paises()
    if not paises:
        print("  ERROR: no se ha encontrado la lista de paises en script.js.")
        print("  Coloca este script en la carpeta del proyecto y vuelve a lanzarlo.")
        return 1
    print("  %d paises, leidos de %s" % (len(paises), os.path.basename(origen)))

    preset = "fast"
    print()
    print("  Modelo:  1) fast    el mas barato y suficiente para puntuaciones")
    print("           2) medium  mas prudente, el doble de precio")
    print("           3) high    el mas caro, para el informe justificativo")
    respuesta = input("  Elige [1]: ").strip()
    if respuesta == "2":
        preset = "medium"
    elif respuesta == "3":
        preset = "high"

    lotes = -(-len(paises) // TAMANO_LOTE)
    por_lote, total = estimar_presupuesto(preset, lotes)
    modelo, _, _, _, _ = PRECIOS[preset]

    print()
    print("  Se haran %d peticiones a %s" % (lotes, URL_API))
    print("  Modelo: %s" % modelo)
    print("  Coste estimado: %.4f USD por lote, %.2f USD en total" % (por_lote, total))
    print()

    clave = pedir_clave()

    print()
    print("  Calculando... puede tardar un par de minutos.")
    print()

    puntuaciones = {}
    fallos = []

    for i in range(lotes):
        trozo = paises[i * TAMANO_LOTE:(i + 1) * TAMANO_LOTE]
        print("  Lote %2d de %2d  (%2d paises)  %s"
              % (i + 1, lotes, len(trozo), ", ".join(trozo[:3]) + "..."))

        resultado, error = pedir_lote(trozo, preset, clave)

        if error:
            print("      ERROR: " + error)
            fallos.append((trozo, error))
            continue

        recibidos = 0
        for pais, valor in resultado.items():
            try:
                n = float(valor)
            except (TypeError, ValueError):
                continue
            if n < 0 or n > 100:
                continue
            puntuaciones[pais] = int(round(n))
            recibidos += 1

        print("      %d puntuaciones recibidas" % recibidos)

    print()
    print("=" * 66)

    if not puntuaciones:
        print("  No se ha obtenido ninguna puntuacion. No se escribe ningun fichero.")
        print("=" * 66)
        for trozo, error in fallos[:3]:
            print("  %s -> %s" % (trozo[:3], error))
        return 1

    faltan = [p for p in paises if p not in puntuaciones]
    sobran = [p for p in puntuaciones if p not in paises]

    print("  Puntuaciones obtenidas: %d de %d" % (len(puntuaciones), len(paises)))

    if sobran:
        # No es un fallo: el modelo puede devolver el nombre en castellano.
        print("  Devueltas con otro nombre (%d): %s"
              % (len(sobran), ", ".join(sobran[:8])))
    if faltan:
        print("  SIN puntuacion (%d): %s" % (len(faltan), ", ".join(faltan[:12])))
        print("  Esos paises quedaran en su color por defecto en el mapa.")

    print()
    print("  Los 10 primeros valores:")
    for pais in paises[:10]:
        if pais in puntuaciones:
            print("    %-28s %3d / 100" % (pais, puntuaciones[pais]))

    print()
    print("  Escribiendo el fichero...")

    destino_base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    destinos = [
        os.path.normpath(os.path.join(destino_base, "..", "GEM-GITHUB", "perplexity-scores.json")),
        os.path.normpath(os.path.join(destino_base, "..", "GEM-NETLIFY", "perplexity-scores.json")),
    ]

    documento = {
        "generado": time.strftime("%Y-%m-%d"),
        "preset": preset,
        "modelo": PRECIOS[preset][0],
        "paises": len(puntuaciones),
        "nota": "Calculado con Perplexity. Fichero estatico: la web lo lee sin coste.",
        "puntuaciones": puntuaciones,
    }

    texto = json.dumps(documento, ensure_ascii=False, indent=1, sort_keys=True)
    for ruta in destinos:
        carpeta = os.path.dirname(ruta)
        if os.path.isdir(carpeta):
            with open(ruta, "w", encoding="utf-8") as f:
                f.write(texto)
            tam = os.path.getsize(ruta)
            print("    %s  (%.1f KB)" % (os.path.basename(os.path.dirname(ruta)), tam / 1024))

    print()
    print("  Coste real de esta ejecucion: alrededor de %.2f USD" % total)
    print()
    print("  QUE HACE DESPUES")
    print("    1. Sube el fichero a GitHub:")
    print("         cd \"C:\\Users\\joaqu\\Documents\\Proyecto predeterminado\\GEM-GITHUB\"")
    print("         git add perplexity-scores.json")
    print("         git commit -m \"Anade las puntuaciones de Perplexity\"")
    print("         git push")
    print("    2. Vuelve a subir el ZIP a Netlify para que se actualice la web.")
    print("    3. Ya no hara falta la clave PERPLEXITY_API_KEY en Netlify.")
    print("=" * 66)
    print()

    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n  Cancelado por el usuario. No se ha escrito ningun fichero.")
        sys.exit(1)