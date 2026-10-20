// Puntuaciones de atractivo de mercado calculadas con Perplexity.
//
// REESCRITA en octubre de 2026. La version anterior fallaba por tres cosas:
//
//   1. La direccion no llevaba /v1:
//        https://api.perplexity.ai/chat/completions      <-- 404, nunca funciono
//      La correcta es  https://api.perplexity.ai/v1/chat/completions
//
//   2. Usaba Sonar Chat Completions, que Perplexity da por cerrada desde el
//      27 de septiembre de 2026. Ahora se usa el Agent API, que es la via
//      recomendada: se manda "input" en lugar de "messages", y el modelo se
//      elige con "preset" en lugar de "model".
//
//   3. Mandaba los 176 paises en una sola peticion. Eso es un prompt enorme:
//      o se corta la respuesta, o sale un JSON invalido, o cuesta una fortuna.
//      Aqui se trocea en lotes de 15 y se pede un JSON por lote.
//
// Uso desde el navegador:
//      fetch('/.netlify/functions/perplexity-score', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({
//            preset: 'fast',
//            input: '<instrucción>',
//            response_format: { type: 'json_schema', json_schema: { ... } }
//        })
//      })
//      -> { "puntuaciones": { "Germany": 85, ... } }
//
// Variable de entorno necesaria en Netlify:
//      PERPLEXITY_API_KEY
//
// Si existe el fichero estatico perplexity-scores.json, conviene usarlo en vez
// de llamar a esta funcion: leer un fichero no cuesta nada, y esta si.

const AGENT_URL = 'https://api.perplexity.ai/v1/agent';

// Netlify Functions da 10 s por defecto. 12 lotes en serie no caben, asi que
// se piden por grupos en paralelo. Si aun asi se pasa de tiempo, la funcion
// devuelve HTTP 504 y el navegador cae al fichero estatico.
const TAMANO_LOTE = 15;
const GRUPOS_EN_PARALELO = 3;
const REINTENTOS = 2;

function responder(statusCode, cuerpo) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(cuerpo)
    };
}

// El Agent API puede devolver el JSON dentro de un bloque de codigo, o
// acompanado de texto. Se recorta lo que no sea un objeto.
function extraerJson(texto) {
    if (typeof texto !== 'string') return null;
    let t = texto.trim();
    const vallas = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (vallas) t = vallas[1].trim();
    const primero = t.indexOf('{');
    const ultimo = t.lastIndexOf('}');
    if (primero === -1 || ultimo === -1 || ultimo <= primero) return null;
    t = t.slice(primero, ultimo + 1);
    try {
        return JSON.parse(t);
    } catch (e) {
        return null;
    }
}

function construirInstruccion(paises) {
    return [
        'Evalúa el atractivo del mercado de exportación para una empresa industrial española.',
        '',
        'Para CADA uno de los países de la lista, asigna una puntuación entera de 0 a 100 con estos criterios,',
        'ponderados como en un análisis de mercado real:',
        '  - Demanda y tamaño del mercado para producto industrial (25 %)',
        '  - Barreras comerciales y arancelarias, traité y logística de entrada (25 %)',
        '  - Riesgo país, estabilidad política y jurídica (20 %)',
        '  - Poder adquisitivo y crecimiento económico (15 %)',
        '  - Facilidad administrativa para una pyme española (15 %)',
        '',
        '100 = mercado muy atractivo para exportar. 50 = indiferente. 0 =|no recomendable.',
        '',
        'Responde EXCLUSIVAMENTE con este JSON y nada más, sin explicaciones ni texto alrededor:',
        '{"puntuaciones": {"<país>": <número 0-100>}}',
        '',
        'La clave debe ser el nombre del país exactamente como aparece en la lista,',
        'incluidos los acentos. Incluye una entrada por cada país, ni más ni menos.',
        '',
        'Lista de países:',
        paises.join(', ')
    ].join('\n');
}

async function pedirLote(paises, preset, apiKey) {
    const cuerpo = {
        preset: preset,
        input: construirInstruccion(paises),
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'puntuaciones_paises',
                schema: {
                    type: 'object',
                    properties: {
                        puntuaciones: {
                            type: 'object',
                            additionalProperties: { type: 'number' }
                        }
                    },
                    required: ['puntuaciones'],
                    additionalProperties: false
                }
            }
        }
    };

    let ultimoError = null;
    for (let intento = 0; intento <= REINTENTOS; intento++) {
        if (intento > 0) {
            // Espera creciente: 400 ms, 1.2 s. Sirve para el 429 de limite.
            await new Promise(r => setTimeout(r, 400 * Math.pow(3, intento - 1)));
        }
        try {
            const r = await fetch(AGENT_URL, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cuerpo)
            });

            if (r.status === 429) {
                ultimoError = 'Limite de peticiones alcanzado (429)';
                continue;
            }
            if (!r.ok) {
                const texto = await r.text();
                ultimoError = 'HTTP ' + r.status + ': ' + texto.slice(0, 300);
                continue;
            }

            const datos = await r.json();

            // El Agent API devuelve el resultado en "output", con esta estructura:
            //   { "output": [ { "type": "message", "content": [ { "type": "output_text", "text": "..." } ] } ] }
            // Y el atajo response.output_text trae el texto ya unido.
            // Se prueban todas las formas antes de rendirse.
            let contenido = null;

            if (typeof datos.output_text === 'string') {
                contenido = datos.output_text;
            }

            const salida = datos.output;
            if (contenido === null && typeof salida === 'string') {
                contenido = salida;
            } else if (contenido === null && Array.isArray(salida) && salida.length) {
                for (const bloque of salida) {
                    if (typeof bloque === 'string') { contenido = bloque; break; }
                    if (bloque && typeof bloque.text === 'string') { contenido = bloque.text; break; }
                    if (bloque && Array.isArray(bloque.content)) {
                        for (const parte of bloque.content) {
                            if (parte && typeof parte.text === 'string') { contenido = parte.text; break; }
                        }
                        if (contenido) break;
                    }
                }
            }

            if (contenido === null && datos.choices && datos.choices[0]) {
                const m = datos.choices[0].message;
                contenido = m && (typeof m.content === 'string' ? m.content : null);
            }
            if (contenido === null && typeof datos.content === 'string') {
                contenido = datos.content;
            }
            if (contenido === null && typeof datos.text === 'string') {
                contenido = datos.text;
            }

            const objeto = extraerJson(contenido);
            if (objeto && objeto.puntuaciones) {
                return { ok: true, puntuaciones: objeto.puntuaciones };
            }
            ultimoError = 'La respuesta no traia un JSON con "puntuaciones".';
        } catch (e) {
            ultimoError = e && e.message ? e.message : String(e);
        }
    }
    return { ok: false, error: ultimoError || 'Error desconocido' };
}

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return responder(405, { error: 'Método no permitido. Se espera POST.' });
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
        return responder(500, {
            error: 'PERPLEXITY_API_KEY no esta configurada en Netlify.',
            pista: 'Site settings > Environment variables > New variable'
        });
    }

    let paises = [];
    let preset = 'fast';
    try {
        const datos = JSON.parse(event.body || '{}');
        paises = Array.isArray(datos.paises) ? datos.paises.filter(p => typeof p === 'string') : [];
        if (typeof datos.preset === 'string') preset = datos.preset;
    } catch (e) {
        return responder(400, { error: 'El cuerpo de la peticion no es JSON valido.' });
    }

    if (!paises.length) {
        return responder(400, { error: 'No se ha recibido ninguna lista de paises.' });
    }

    const permitidos = ['fast', 'low', 'medium', 'high'];
    if (permitidos.indexOf(preset) === -1) preset = 'fast';

    // Troceado en lotes de 15
    const lotes = [];
    for (let i = 0; i < paises.length; i += TAMANO_LOTE) {
        lotes.push(paises.slice(i, i + TAMANO_LOTE));
    }

    const puntuaciones = {};
    const fallos = [];

    // Por grupos, para no disparar el limite de peticiones ni el tiempo de
    // ejecucion de Netlify Functions.
    for (let g = 0; g < lotes.length; g += GRUPOS_EN_PARALELO) {
        const grupo = lotes.slice(g, g + GRUPOS_EN_PARALELO);
        const resultados = await Promise.all(grupo.map(lote => pedirLote(lote, preset, apiKey)));

        resultados.forEach((res, i) => {
            if (res.ok) {
                Object.keys(res.puntuaciones).forEach(function (pais) {
                    const v = Number(res.puntuaciones[pais]);
                    if (!isNaN(v)) {
                        puntuaciones[pais] = Math.max(0, Math.min(100, Math.round(v)));
                    }
                });
            } else {
                fallos.push(grupo[i].slice(0, 4).join(', ') + ' -> ' + res.error);
            }
        });
    }

    if (!Object.keys(puntuaciones).length) {
        return responder(502, {
            error: 'No se obtuvo ninguna puntuacion.',
            fallos: fallos.slice(0, 5)
        });
    }

    return responder(200, {
        puntuaciones: puntuaciones,
        preset: preset,
        lotes: lotes.length,
        pedidos: paises.length,
        recibidos: Object.keys(puntuaciones).length,
        // Los lotes que fallaron no se silencian: si faltan paises, el mapa
        // mostraria colores inventados.
        fallidos: fallos.length ? fallos.slice(0, 5) : undefined
    });
};