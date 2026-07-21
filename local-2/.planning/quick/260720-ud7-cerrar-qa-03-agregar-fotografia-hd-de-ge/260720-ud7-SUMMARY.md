---
quick_id: 260720-ud7
status: complete
---

# Summary: Cerrar QA-03 — fotografía HD de geología/minería/infraestructura

**Status:** complete

## What changed

- 3 fotos HD nuevas descargadas de Unsplash (licencia libre, uso comercial, verificada
  individualmente como "Unsplash License" antes de descargar): `geologo-campo-roca.jpg`,
  `mineria-tajo-abierto.jpg`, `infraestructura-obra-civil.jpg` en
  `public/IMAGENES_PAGINA_WEB/`.
- Procedencia documentada en `public/IMAGENES_PAGINA_WEB/PROVENANCE.md` (fotógrafo, licencia,
  URL de origen para las 3 nuevas; nota sobre las preexistentes como material propio del
  cliente).
- Nuevo export `sectors: SectorImage[]` en `lib/site-content.ts` (4 sectores: Topografía,
  Geología, Minería, Infraestructura e ingeniería civil — Topografía reutiliza la imagen
  existente `monumentacion_puntos_referencia.png`).
- Nueva sección "Sectores que atendemos" en `components/sections/brand-section.tsx`
  (`components/sections/brand-section.tsx`), ubicada entre Misión/Visión y Valores
  corporativos.
- CSS nuevo en `app/globals.css`: `.sectors-region`, `.sectors-grid`, `.sector-card`,
  `.sector-card__frame` + reglas responsive (4 col → 2 col en ≤1000px → 1 col en ≤720px).
  Reutiliza los tamaños/pesos tipográficos ya establecidos en el sitio (`.68rem/500` para
  la etiqueta, patrón idéntico a `.team-card__role`) — no introduce tamaños nuevos.

## Verification

- `npm run lint`: limpio.
- `npx tsc --noEmit`: limpio.
- `npm run build` (producción, Turbopack): limpio.
- Verificación visual en `npm start` (puerto 4173) vía Playwright:
  - Desktop 1440×900: grid de 4 imágenes se renderiza correctamente con encabezado
    "Sectores que atendemos" y etiquetas (Topografía / Geología / Minería / Infraestructura
    e ingeniería civil).
  - Mobile 390×844: layout de 1 columna, sin overflow horizontal
    (`scrollWidth - clientWidth === 0`).
  - Consola del navegador: 0 errores, 0 warnings.

## Requirement closed

- QA-03 marcado `[x]` en `.planning/REQUIREMENTS.md` — milestone v1.0-corporate ahora en
  22/22 (100%).
