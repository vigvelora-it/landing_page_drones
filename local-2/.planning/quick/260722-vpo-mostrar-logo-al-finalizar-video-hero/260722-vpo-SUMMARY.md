# Quick task 260722-vpo — Resumen

## Resultado

El video del Hero se reproduce una sola vez. Al llegar a 18,48 s queda detenido
en su último fotograma y el logo horizontal de SkyTech aparece suavemente en el
espacio derecho. El botón cambia a `Reproducir` y permite iniciar nuevamente el
ciclo desde cero.

## Implementación

- `components/sections/hero-section.tsx`
  - Eliminado el atributo `loop`.
  - Estado `showEndLogo` conectado al evento `ended`.
  - Eventos `play`, `pause` y `ended` sincronizan el botón y la marca final.
  - Al reproducir después del final, `currentTime` vuelve a `0`.
  - Reutilizado `public/brand/skytech-logo-horizontal.png`.
  - En movimiento reducido, el video permanece pausado y el estado final queda
    visible.
- `app/globals.css`
  - Logo final posicionado en el tercio derecho.
  - Transición de 1,35 s con opacidad, desplazamiento vertical y escala leves.
  - Sombra suave para mantener contraste sobre el terreno.
  - Posición móvil específica en la zona superior derecha.

## Verificación

- `npm run lint`: aprobado.
- `npm run typecheck`: aprobado.
- `npm run build`: aprobado.
- Playwright desktop, 1536 × 864:
  - `loop: false`;
  - video detenido con `ended: true`;
  - `currentTime: 18.476792`, igual a `duration`;
  - logo con clase `is-visible` y opacidad `1`;
  - botón `Reproducir video de fondo`;
  - 0 px de overflow y 0 errores de consola.
- Reinicio:
  - video en reproducción, `ended: false`;
  - logo con opacidad `0`;
  - botón `Pausar video de fondo`.
- Playwright móvil, 390 × 844:
  - logo visible en la zona superior sin tapar titular, descripción ni CTA;
  - 0 px de overflow;
  - 0 errores de consola.

## Continuidad

- Vista local: <http://127.0.0.1:4175>.
- No se realizó ningún despliegue.
- El tag de rollback `v2` permanece intacto.
