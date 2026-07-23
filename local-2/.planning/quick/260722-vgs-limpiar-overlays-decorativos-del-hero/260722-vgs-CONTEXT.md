# Quick task 260722-vgs — Limpiar overlays del hero

## Objetivo

Hacer que el video aéreo del Hero se vea claro y nítido, retirando la cuadrícula,
los círculos y los puntos decorativos que se dibujan encima.

## Alcance

- Eliminar del DOM `hero-gridlines`, `hero-orbit`, `orbit-one` y `orbit-two`.
- Eliminar los estilos y la animación de esos elementos.
- Retirar el contenedor `hero-noise`, que no tiene representación visual activa.
- Mantener el punto pequeño del eyebrow, porque pertenece al rótulo y no cubre el
  video.
- Mantener el botón circular `Explorar`, porque es un CTA funcional y no una
  decoración superpuesta.
- Reducir el sombreado del video a una protección localizada para el texto.
- No cambiar video, textos, navegación, controles ni otras secciones.

## Verificación

- Revisión visual desktop y móvil.
- Cero cuadrícula y órbitas renderizadas.
- Video, CTA y control de pausa funcionales.
- Cero overflow horizontal y errores de consola.
- `npm run lint`, `npm run typecheck` y `npm run build` aprobados.
