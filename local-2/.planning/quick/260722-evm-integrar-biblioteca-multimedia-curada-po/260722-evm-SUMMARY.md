---
quick_id: 260722-evm
status: complete
---

# Summary: Integrar biblioteca multimedia curada por el usuario

**Status:** complete — prioridades 1-4 del `README.md` del usuario implementadas y
verificadas. Prioridad 5 (b-roll 4K de sectores) diferida explícitamente.

## What changed

- **Hero** (`hero-section.tsx`): video de fondo cambiado a
  `public/video/hero-drone-in-flight.mp4` (1920×1080, 14.28s, 7.96MB — listo para
  producción, sin necesidad de derivado). El dron aparece claramente en cuadro y en
  movimiento, cumpliendo el requisito original de forma más literal que el video anterior
  (`drone-flight-close.mp4`, conservado sin usar por si se necesita revertir).
- **Capacidades** (`capabilities-section.tsx`): nuevo panel visual `.capabilities-visual`
  (no existía ninguna imagen antes) con `capabilities-total-station.jpg` (principal,
  vertical) y `technology-rtk-quarry.jpg` (secundaria) — exactamente como pide el README.
- **Sectores** (`lib/site-content.ts`, banda "Sectores que atendemos" ya existente): 3 de
  4 imágenes actualizadas — Minería → `projects-open-pit-mine.jpg`, Infraestructura →
  `projects-bridge-construction.jpg`, Geología → `geology-rock-formations.jpg`.
  Topografía sin cambio (sin reemplazo en la biblioteca nueva). Las imágenes anteriores
  (sourced de Unsplash en la ronda de QA-03) se conservan en el filesystem sin
  referenciarse.
- **Proceso** (`process-section.tsx`): nuevo bloque `.process-visual` con
  `process-engineers-plans.jpg` + leyenda "Coordinación técnica en cada etapa del
  proyecto", insertado entre la lista de 4 pasos y el bloque "El resultado" (que no se
  tocó).
- **Contacto** (`contact-section.tsx`): `.contact-backdrop` cambiado de `equipos1.png` a
  `contact-drone-pilot.jpg` (vertical, con espacio negativo, tal como recomienda el
  README para esta composición).
- **Procedencia**: `public/IMAGENES_PAGINA_WEB/PROVENANCE.md` y `public/video/CREDITS.md`
  actualizados con entradas nuevas (fuente/fotógrafo/licencia/URL) para cada archivo
  copiado desde `public/media-library/`, siguiendo el formato ya establecido en esos
  documentos.

## Explicitly deferred (not a gap — matches the user's own priority list)

- `videos/projects-bridge-construction-4k.mp4` (97.6MB) y
  `videos/projects-open-pit-mine-4k.mp4` (92.7MB): ambos 3840×2160 reales. El propio
  `README.md` del usuario exige generar derivados web de 1080p (8-20MB) antes de
  servirlos en producción — este entorno no tiene `ffmpeg` disponible (verificado:
  `ffmpeg: command not found`), así que no se pueden generar esos derivados aquí. Servir
  los archivos maestros tal cual habría violado la propia regla del usuario y el
  estándar de rendimiento ya establecido en el sitio. Quedan en
  `public/media-library/videos/` sin usar, documentado como bloqueo técnico honesto.
- `technology-drone-operator-hd.jpg` y `videos/technology-drone-field-4k.mp4`: no están
  en la lista de prioridad 1-4 del usuario (opcionales/"apoyo" para Tecnología) — no se
  usaron en esta ronda.

## No se tocó (regla explícita del propio README, respetada)

- Retratos del equipo (siguen con iniciales).
- Carrusel de equipos (sigue mostrando solo equipos reales).
- Brochure.
- Las 3 fichas de proyectos reales con nombre (GESAC/Lezard/Las Dunas) — ningún medio de
  stock nuevo se asoció a ellas.

## Verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build`: limpios.
- Verificación visual en las 4 secciones nuevas/modificadas + Sectores, en build de
  producción (1440×900): hero con el dron visible en movimiento, panel de Capacidades
  con las 2 imágenes, banda de Sectores con las 3 imágenes actualizadas, bloque de
  Proceso con imagen + leyenda, backdrop de Contacto con la nueva foto.
- Responsive: 0px de overflow horizontal en 1440×900, 1280×800, 768×1024 y 390×844;
  confirmado el stacking a 1 columna del panel de Capacidades en mobile.
- Lighthouse (Chrome DevTools MCP), build de producción: 100/100/100/100
  (accesibilidad/best practices/SEO/agentic), 61/61 audits, sin regresión respecto a la
  ronda anterior.
- Performance trace: LCP 1585ms, CLS 0.00 — sin regresión por el nuevo video del hero
  (7.96MB, similar orden de magnitud al anterior).
- 0 errores de consola en toda la sesión de verificación.

## Commits

Pendiente — se hace en el mismo turno tras este SUMMARY.
