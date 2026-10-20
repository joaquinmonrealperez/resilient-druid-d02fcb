(function () {
  'use strict';

  // Motor activo. Por defecto 'space-bunny', que es el modelo propio de GEM y
  // el que debe verse al abrir la pagina.
  //
  // Antes arrancaba vacio, y aplicarSeleccion() ocultaba el mapa, el bloque de
  // los tres mercados principales y su introduccion para esperar a que el
  // visitante eligiera un motor. Eso dejaba la web en blanco al abrirla: el
  // mapa no se veia y el resto de la pagina tampoco. El selector es una
  // opcion para comparar modelos, no una puerta que haya que crosses para ver
  // nada.
  let seleccion = 'space-bunny';
  let puntuacionesPerplexity = null;
  let cargandoPerplexity = false;
  // De donde salieron los numeros, para poder decirlo en la interfaz.
  let origenPuntuaciones = '';

  function claveSegura(pais) {
    if (typeof window.clavePais === 'function') {
      const clave = window.clavePais(pais);
      if (clave) return clave;
    }
    return pais;
  }

  function puntuacionPerplexity(pais) {
    if (!puntuacionesPerplexity) return null;
    const clave = claveSegura(pais);
    if (Object.prototype.hasOwnProperty.call(puntuacionesPerplexity, clave)) {
      return puntuacionesPerplexity[clave];
    }
    return null;
  }

  function crearSelector() {
    const mapa = document.getElementById('map');
    if (!mapa || document.getElementById('selector-motor')) return;

    const control = document.createElement('div');
    control.id = 'selector-motor';
    control.style.cssText = 'display:flex;gap:10px;align-items:center;justify-content:center;margin:0 auto 18px;max-width:900px;padding:12px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);';

    const etiqueta = document.createElement('label');
    etiqueta.htmlFor = 'selector-motor-select';
    etiqueta.textContent = 'Motor de puntuación:';
    etiqueta.style.cssText = 'font-family:Inter,sans-serif;font-weight:600;color:#1f2937;';

    const selector = document.createElement('select');
    selector.id = 'selector-motor-select';
    selector.style.cssText = 'font-family:Inter,sans-serif;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#111827;min-width:260px;';
    selector.innerHTML = [
      '<option value="">Selecciona un motor para ver las puntuaciones</option>',
      '<option value="space-bunny">Space Bunny — cálculos anteriores</option>',
      '<option value="perplexity">Perplexity — nuevo cálculo</option>'
    ].join('');
    // Space Bunny viene ya seleccionado, que es el motor activo por defecto.
    selector.value = seleccion;

    control.appendChild(etiqueta);
    control.appendChild(selector);

    // Nota de procedencia, debajo del desplegable. Sin esto el visitante no
    // sabe si los numeros los ha calculado una IA ahora mismo o si son un
    // fichero guardado, que es la diferencia entre "lo acaba de mirar" y
    // "lo del mes pasado".
    const nota = document.createElement('small');
    nota.id = 'selector-motor-nota';
    nota.style.cssText = 'flex-basis:100%;text-align:center;font-family:Inter,sans-serif;font-size:.76rem;color:#6b7280;';
    nota.textContent = 'Space Bunny: modelo propio de GEM, calculado en tu navegador.';
    control.appendChild(nota);

    mapa.parentNode.insertBefore(control, mapa);

    selector.addEventListener('change', async function () {
      seleccion = selector.value;
      await aplicarSeleccion();
    });
  }

  async function aplicarSeleccion() {
    const mapa = document.getElementById('map');
    const grid = document.getElementById('top-markets-grid');
    const intro = document.getElementById('top-markets-intro');

    // Sin motor elegido no se oculta nada. Este rama solo se alcanza si el
    // visitante elige la opcion en blanco, y en ese caso se deja la pagina tal
    // cual estaba en lugar de esconder media web.
    if (!seleccion) {
      return;
    }

    if (mapa) mapa.style.display = '';
    if (grid) grid.style.display = '';
    if (intro) intro.style.display = '';

    if (seleccion === 'perplexity' && !puntuacionesPerplexity) {
      if (cargandoPerplexity) return;
      cargandoPerplexity = true;
      const nota = document.getElementById('selector-motor-nota');
      if (nota) nota.textContent = 'Perplexity: calculando puntuaciones, espera un momento...';
      try {
        await cargarPerplexity();
      } catch (error) {
        console.error('No se pudieron calcular las puntuaciones de Perplexity:', error);
        if (nota) {
          nota.textContent = 'Perplexity no disponible: ' + error.message +
            ' — se mantiene Space Bunny.';
        }
        seleccion = 'space-bunny';
        document.getElementById('selector-motor-select').value = 'space-bunny';
        cargandoPerplexity = false;
        return;
      }
      const n = Object.keys(puntuacionesPerplexity || {}).length;
      if (nota) {
        nota.textContent = 'Perplexity: ' + n + ' países puntuados (' + origenPuntuaciones + ').';
      }
      cargandoPerplexity = false;
    }

    if (typeof window.initMap === 'function') window.initMap();
    if (typeof window.renderTopMarkets === 'function') window.renderTopMarkets();
  }

  // Origen de las puntuaciones, en este orden:
  //
  //   1. perplexity-scores.json  -> fichero estatico del repositorio. Gratis.
  //   2. /.netlify/functions/... -> llamada de pago, solo si el fichero falta.
  //
  // El fichero estatico es lo que hay que usar en produccion. Leer un JSON del
  // servidor no cuesta nada, mientras que la funcion hace 12 llamadas de pago
  // cada vez que alguien elige este motor: con Deep Research son 4,28 USD por
  // visita, y con el preset fast, 0,04 USD. Ver README para el detalle.
  // La tabla de paises.
  //
  // OJO: no se puede leer como window.extendedCountryScores. En script.js es un
  // 'const' de nivel superior, y los const de ese nivel NO se convierten en
  // propiedades de window (las declaraciones de funcion si, y por eso
  // window.clavePais funciona). Con window.extendedCountryScores salia
  // undefined, la lista se quedaba vacia y el motor Perplexity no arrancaba
  // nunca con el error "No hay paises disponibles".
  //
  // Al referenciar la variable directamente si funciona: los const de nivel
  // superior viven en el ambito global del guion, que es compartido con este
  // fichero. Se comprueba primero window por si el dia de manana alguien la
  // expone a proposito, y luego la variable directa.
  function listaDePaises() {
    let origen = null;
    if (typeof window !== 'undefined' && window.extendedCountryScores) {
      origen = window.extendedCountryScores;
    } else if (typeof extendedCountryScores !== 'undefined' && extendedCountryScores) {
      origen = extendedCountryScores;
    }
    if (origen) return Object.keys(origen);

    // Ultimo recurso: los paises que ya estan en el mapa o en el ranking.
    try {
      const nodos = document.querySelectorAll('[data-pais], [data-country]');
      if (nodos.length) return Array.prototype.map.call(nodos, function (n) {
        return n.getAttribute('data-pais') || n.getAttribute('data-country');
      }).filter(Boolean);
    } catch (e) { /* sin DOM */ }

    return [];
  }

  async function cargarPerplexity() {
    // 1) Fichero estatico. Va PRIMERO y no necesita la lista de paises: el
    // propio JSON trae dentro las claves. Antes se pedia la lista antes de
    // nada y, como fallaba, el motor no llegaba ni a intentar el fichero.
    try {
      const r = await fetch('perplexity-scores.json?v=2', { cache: 'no-store' });
      if (r.ok) {
        const datos = await r.json();
        const puntuaciones = datos && (datos.puntuaciones || datos);
        if (puntuaciones && Object.keys(puntuaciones).length) {
          puntuacionesPerplexity = puntuaciones;
          origenPuntuaciones = 'fichero estatico';
          return;
        }
      }
    } catch (e) {
      // Sin fichero, se sigue con la funcion. No es un error.
    }

    // 2) Fichero no disponible: llamada de pago. Aqui si hace falta la lista.
    const paises = listaDePaises();
    if (!paises.length) {
      throw new Error('No hay países en los datos y tampoco está el fichero perplexity-scores.json');
    }

    const respuesta = await fetch('/.netlify/functions/perplexity-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paises: paises, preset: 'fast' })
    });

    if (!respuesta.ok) {
      let detalle = 'HTTP ' + respuesta.status;
      try {
        const cuerpo = await respuesta.json();
        if (cuerpo && cuerpo.error) detalle = cuerpo.error;
      } catch (e) { /* la respuesta no era JSON */ }
      throw new Error(detalle);
    }
    const datos = await respuesta.json();
    if (!datos || !datos.puntuaciones) throw new Error('La respuesta no trae puntuaciones');
    puntuacionesPerplexity = datos.puntuaciones;
    origenPuntuaciones = 'funcion de Netlify';
  }

  function instalarSustituciones() {
    const findCountryInfoOriginal = window.findCountryInfo;
    if (typeof findCountryInfoOriginal === 'function') {
      window.findCountryInfo = function (countryName) {
        if (seleccion === 'perplexity' && puntuacionesPerplexity) {
          const score = puntuacionPerplexity(countryName);
          if (typeof score === 'number') {
            return {
              score: score,
              level: window.getScoreLevel(score),
              clave: claveSegura(countryName)
            };
          }
        }
        return findCountryInfoOriginal(countryName);
      };
    }

    const calculateCountryScoreOriginal = window.calculateCountryScore;
    if (typeof calculateCountryScoreOriginal === 'function') {
      window.calculateCountryScore = function (pais, perfil, cnae) {
        if (seleccion === 'perplexity' && puntuacionesPerplexity) {
          const atractivo = puntuacionPerplexity(pais);
          if (typeof atractivo === 'number') {
            let fmfs = 100;
            if (typeof window.calcularFMFS === 'function') {
              const datos = window.calcularFMFS();
              if (datos && typeof datos.score === 'number') fmfs = datos.score;
            }
            return Math.round(Math.sqrt(atractivo * fmfs));
          }
        }
        return calculateCountryScoreOriginal(pais, perfil, cnae);
      };
    }

    const obtenerGEMScoreOriginal = window.obtenerGEMScore;
    if (typeof obtenerGEMScoreOriginal === 'function') {
      window.obtenerGEMScore = function (pais, perfil, cnae) {
        const resultado = obtenerGEMScoreOriginal(pais, perfil, cnae);
        if (seleccion === 'perplexity' && puntuacionesPerplexity && resultado) {
          const atractivo = puntuacionPerplexity(pais);
          if (typeof atractivo === 'number') {
            resultado.atractivo = atractivo;
            const fmfs = typeof resultado.fmfs === 'number' ? resultado.fmfs : 100;
            resultado.score = Math.round(Math.sqrt(atractivo * fmfs));
          }
        }
        return resultado;
      };
    }
  }

  function iniciar() {
    crearSelector();
    instalarSustituciones();
    aplicarSeleccion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
