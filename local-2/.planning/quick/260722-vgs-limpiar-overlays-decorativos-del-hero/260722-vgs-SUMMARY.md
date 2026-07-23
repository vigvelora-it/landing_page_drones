# Quick task 260722-vgs — Resumen

## Resultado

El video del Hero se muestra sin cuadrícula, órbitas ni puntos animados
superpuestos. El sombreado se redujo y ahora se concentra detrás del texto, por
lo que la mina y sus terrazas conservan más detalle, color y luminosidad.

## Cambios

- `components/sections/hero-section.tsx`
  - Eliminados `hero-gridlines`, `hero-orbit`, `orbit-one`, `orbit-two` y el
    contenedor inactivo `hero-noise`.
  - Se mantienen el CTA `Explorar`, el rótulo, el video y los controles.
- `app/globals.css`
  - Eliminadas las reglas principales de cuadrícula, órbitas, puntos y la
    animación `orbit`.
  - Sombreado horizontal reducido de 86% a 58% en su punto máximo.
  - El sombreado cae a 8% al 68% del ancho y queda transparente al 82%.
  - Sombreado inferior reducido de 62% a 22%.

## Verificación

- `npm run lint`: aprobado.
- `npm run typecheck`: aprobado.
- `npm run build`: aprobado.
- Playwright desktop, 1536 × 864:
  - 0 nodos `.hero-gridlines`, `.hero-orbit`, `.orbit-one` o `.orbit-two`;
  - video activo a 1920 × 1080 y 18,48 s;
  - `readyState: 4`;
  - 0 px de overflow horizontal;
  - 0 errores de consola.
- Playwright móvil, 390 × 844:
  - 0 nodos decorativos retirados;
  - 0 px de overflow horizontal;
  - pausa y reanudación verificadas;
  - 0 errores de consola.

## Continuidad

- Vista local: <http://127.0.0.1:4175>.
- No se realizó ningún despliegue.
- El tag de rollback `v2` se mantiene sin cambios.
