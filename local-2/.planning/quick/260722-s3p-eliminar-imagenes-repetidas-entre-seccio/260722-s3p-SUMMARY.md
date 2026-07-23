# Quick Task 260722-s3p: Eliminar imágenes repetidas entre secciones - Summary

**Completed:** 2026-07-22
**Status:** Complete
**Rollback:** tag anotado `v2` -> `e1ee23a` (sin cambios)

## Resultado

- Auditadas todas las referencias de imágenes en `app/`, `components/` y `lib/`.
- Sustituidos los duplicados entre Tecnología, Proceso, carrusel, Hero, Proyectos y
  mega-menú por ocho imágenes fotorealistas nuevas y exclusivas.
- Tecnología usa ahora tres escenas propias: GNSS RTK costero, LiDAR geológico y
  estación CAD/GIS.
- Proceso usa tres escenas propias: lectura geológica, planificación de misión y
  captura con estación total; su cuarta escena ya era exclusiva.
- Los paneles Proyectos y Proceso del mega-menú usan dos miniaturas propias.
- La selección de Proceso quedó determinista por clic, foco y teclado; se retiró el
  cambio automático por hover/posición de scroll que podía reemplazar la elección.
- Los originales se generaron con `image_gen`; las versiones finales se convirtieron
  a WebP calidad 86 con `sharp`, conservando 1577–1672 px de ancho.
- La procedencia, resolución, uso exclusivo y prompt final resumido quedaron
  documentados en `public/IMAGENES_PAGINA_WEB/PROVENANCE.md`.

## Auditoría de exclusividad

- Imágenes referenciadas únicas: 26.
- Rutas repetidas entre archivos/secciones: 0.
- Archivos visualmente idénticos detectados por SHA-256 bajo rutas distintas: 0.
- Única ruta con dos apariciones: `topografia-con-drones.jpg`, ambas dentro de
  `hero-section.tsx` como imagen inicial y poster del mismo video; no cruza secciones.

## Verificación

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- Playwright desktop 1440×900:
  - tres imágenes de Tecnología cargan y alternan correctamente
  - cuatro imágenes de Proceso cargan y alternan correctamente
  - miniaturas nuevas de Proyectos y Proceso cargan en el mega-menú
  - overflow horizontal: 0px
- Playwright móvil 390×844:
  - recursos nuevos cargan con el layout apilado
  - overflow horizontal: 0px; errores de consola: 0

## Archivos de código y documentación

- `components/sections/technology-section.tsx`
- `components/sections/process-section.tsx`
- `components/menu-overlay.tsx`
- `public/IMAGENES_PAGINA_WEB/PROVENANCE.md`
- `.planning/STATE.md`

## Recursos nuevos

- `public/IMAGENES_PAGINA_WEB/section-unique/technology-rtk-coastal-hd.webp`
- `public/IMAGENES_PAGINA_WEB/section-unique/technology-lidar-geology-hd.webp`
- `public/IMAGENES_PAGINA_WEB/section-unique/technology-cad-gis-workstation-hd.webp`
- `public/IMAGENES_PAGINA_WEB/section-unique/process-terrain-geology-hd.webp`
- `public/IMAGENES_PAGINA_WEB/section-unique/process-mission-planning-hd.webp`
- `public/IMAGENES_PAGINA_WEB/section-unique/process-total-station-road-hd.webp`
- `public/IMAGENES_PAGINA_WEB/section-unique/menu-process-sensor-calibration-hd.webp`
- `public/IMAGENES_PAGINA_WEB/section-unique/menu-projects-bridge-valley-hd.webp`

## Seguridad y alcance

- Solo se modificó `local-2/`.
- No se instalaron dependencias.
- No se copiaron recursos de sitios de referencia.
- No hubo despliegue externo.
- El servidor local queda disponible en `http://127.0.0.1:4175`.
