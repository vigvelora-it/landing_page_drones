# Quick Task 260722-2up: Carrusel doble con imágenes HD - Summary

**Completed:** 2026-07-22
**Status:** Complete
**Rollback:** tag anotado `v2` -> `e1ee23a` (sin cambios)

## Resultado

- El carrusel muestra exactamente dos tarjetas completas al mismo tiempo.
- Cada avance desplaza una sola tarjeta: `1–2 -> 2–3 -> 3–4 -> 4–1`.
- Se conservan autoavance circular de 6.5s, botones, puntos, teclado, touch/drag,
  pausa manual y desactivación bajo `prefers-reduced-motion`.
- Se reemplazaron dos archivos verticales de baja resolución (685×835 y 675×782)
  por cuatro imágenes 3:2 de 1536×1024 generadas para este componente.
- Las imágenes y captions se identifican como visuales referenciales; no se atribuyen
  a inventario, personal, ubicaciones ni proyectos reales de SkyTech.
- Procedencia y restricciones registradas en
  `public/IMAGENES_PAGINA_WEB/PROVENANCE.md`; prompts en `260722-2up-IMAGE-PROMPTS.md`.

## Verificación

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- Playwright desktop 1440×900:
  - viewport 1376px; dos tarjetas visibles de 678px con gap de 20px
  - navegación manual confirmada `02 -> 03`, desplazando una tarjeta
  - ambos marcos 3:2 completos; flechas sobre los extremos del conjunto
  - overflow horizontal: 0px
- Playwright móvil 390×844:
  - viewport 358px; dos tarjetas visibles de 174px con gap de 10px
  - autoavance confirmado `01 -> 02` después de 7 segundos
  - overflow horizontal: 0px; errores y warnings de consola: 0

## Archivos de aplicación

- `app/globals.css`
- `components/equipment-carousel.tsx`
- `lib/site-content.ts`
- `public/IMAGENES_PAGINA_WEB/PROVENANCE.md`
- `public/IMAGENES_PAGINA_WEB/equipment-carousel/*.png`

## Seguridad y alcance

- Solo se modificó `local-2/`.
- No se instalaron dependencias.
- No hubo despliegue externo.
- El servidor local queda disponible en `http://127.0.0.1:4175`.

