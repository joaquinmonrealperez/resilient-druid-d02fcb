# Sistema Operativo del Este

Web estática de **GEM (Global Export Market Intelligence)**, herramienta de
análisis de mercados de exportación para empresas españolas.

## Qué hace

El visitante describe su producto (CNAE) y su perfil —recursos disponibles y
orientación al riesgo— y la web le devuelve, para cada mercado:

- una puntuación de atractivo de 0 a 100
- los 17 criterios evaluados, agrupados en 7 dimensiones
- los tres puntos fuertes y los tres débiles, con su justificación y sus fuentes
- un informe PDF descargable con todo el detalle

El modelo combina dos factores mediante la media geométrica:

```
Atractivo del mercado ajustado = √( Capacidad de exportar × Atractivo del mercado )
```

- **Capacidad de exportar**: 22 preguntas en 6 bloques, sobre la empresa.
- **Atractivo del mercado**: 17 criterios en 7 dimensiones, sobre el país.

## Estructura

```
index.html          marcado de toda la página
styles.css          estilos, incluida la animación del logotipo
script.js           modelo de puntuación, mapa, informes PDF, cuentas
404.html            página de error
assets/
  audio/            música de fondo (Canon de Pachelbel, dominio público)
  logos/            logotipos de los colaboradores
```

## Cómo ejecutarlo

Es una web estática: no hay servidor ni base de datos. Para verla en local con
Python:

```bash
python -m http.server 8000
```

Y abrir `http://localhost:8000`. Abre el fichero con doble clic también
funciona, salvo el mapa, que necesita `http://` para cargar el GeoJSON.

## Despliegue

Pensada para Netlify. Se sube la carpeta completa arrastrándola a
<https://app.netlify.com/drop>. También funciona en GitHub Pages.

## Dependencias externas

Cargadas por CDN, no incluidas en el repositorio:

| Qué | De dónde |
|---|---|
| Leaflet 1.9.4 (mapa) | unpkg.com |
| jsPDF 2.5.1 (informes) | cdnjs.cloudflare.com |
| Roboto / Roboto Condensed | fonts.googleapis.com |
| Fotografías de los servicios | images.unsplash.com |
| Teselas del mapa | tile.openstreetmap.org |
| Contornos de países | raw.githubusercontent.com (datasets/geo-countries) |

## Estado actual

**Prototipo funcional.** Aún no es un producto en producción:

- Las cuentas y contraseñas se guardan en el navegador (`localStorage`), sin
  servidor ni cifrado. Sirve para hacer demostraciones, no para cobrar.
- El contenido está abierto: `CIERRE_ACTIVO = false` en `script.js`.
- Las fotografías de Unsplash **no cubren uso comercial** sin registro.
- OpenStreetMap usa la licencia ODbL, cuya política **bloquea el uso comercial**
  sin hablarlo con ellos. Es el punto que más limita el uso comercial.

## Autoría

Proyecto desarrollado por el autor, técnico de Comercio Exterior y profesor
universitario, con la colaboración de la Universidad de Murcia (OTRI y
Umu Aprende).

## Licencia

Ver el fichero `LICENSE` del repositorio.