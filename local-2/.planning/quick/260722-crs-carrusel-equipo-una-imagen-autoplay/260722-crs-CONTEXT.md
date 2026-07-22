# Quick Task 260722-crs: Carrusel de equipo a una imagen con autoavance

**Date:** 2026-07-22
**Status:** In progress
**Rollback:** `v2` permanece apuntando a `e1ee23a`

## Solicitud

Corregir el carrusel de "Equipo en campo" para que muestre una sola imagen completa
por vista. La siguiente imagen solo debe aparecer al navegar con los controles o por
autoavance después de unos segundos, con un comportamiento similar al carrusel de
Steam.

## Alcance

- Cambiar cada slide a 100% del viewport local y ocultar por completo los adyacentes.
- Mantener botones, puntos, teclado, touch/drag, contador y anuncio accesible.
- Añadir autoavance circular con temporizador reiniciado tras interacción manual.
- Pausar mientras el usuario interactúa y ofrecer un control visible de pausa.
- Desactivar el autoavance cuando el sistema solicita movimiento reducido.
- Validar lint, tipos, build y comportamiento real en escritorio/móvil.
- Trabajar exclusivamente dentro de `local-2/`; no desplegar.

## Archivos previstos

- `components/equipment-carousel.tsx`
- `app/globals.css`
- `.planning/quick/260722-crs-carrusel-equipo-una-imagen-autoplay/260722-crs-SUMMARY.md`

