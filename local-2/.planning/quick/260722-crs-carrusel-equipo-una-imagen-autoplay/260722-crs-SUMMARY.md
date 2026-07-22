# Quick Task 260722-crs: Carrusel de equipo a una imagen con autoavance - Summary

**Completed:** 2026-07-22
**Status:** Complete
**Rollback:** tag anotado `v2` -> `e1ee23a` (sin cambios)

## Resultado

- Cada slide ocupa el 100% del viewport local del carrusel.
- El viewport oculta completamente los slides adyacentes; no existe adelanto visual
  de la imagen siguiente.
- El marco de escritorio usa todo el ancho disponible con altura máxima de 580px.
- El carrusel avanza circularmente cada 6.5 segundos.
- Botones, puntos, flechas de teclado y drag/touch reinician el temporizador.
- Se añadió un control visible `Pausar` / `Reproducir`.
- `prefers-reduced-motion: reduce` desactiva el autoavance y mantiene la navegación
  manual instantánea.
- Contador, puntos, barra de progreso y anuncio `aria-live` permanecen sincronizados.

## Verificación

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- Playwright desktop 1440x900:
  - viewport 1376px; cada slide 1376px
  - slide 2 inicia en x=1408, exactamente después del borde derecho del viewport
  - marco visual 1376x580 y flecha siguiente superpuesta sobre la imagen
  - autoavance confirmado `01 -> 02` después de 7 segundos
  - pausa confirmada: `02 -> 02` después de otros 7 segundos
  - navegación manual confirmada `01 -> 02`
  - overflow horizontal: 0px; errores de consola: 0
- Playwright móvil 390x844:
  - viewport 358px; cada slide 358px
  - slide 2 inicia en x=374, exactamente después del borde derecho del viewport
  - overflow horizontal: 0px

## Archivos

- `components/equipment-carousel.tsx`
- `app/globals.css`
- `.planning/STATE.md`

## Seguridad y alcance

- Solo se modificó `local-2/`.
- No se instalaron dependencias.
- No hubo despliegue externo.
- El servidor local de revisión queda disponible en `http://127.0.0.1:4175`.

