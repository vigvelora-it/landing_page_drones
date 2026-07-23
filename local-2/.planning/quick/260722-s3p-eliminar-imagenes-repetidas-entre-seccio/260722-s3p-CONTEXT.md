# Quick Task 260722-s3p: Eliminar imágenes repetidas entre secciones

**Date:** 2026-07-22
**Status:** Complete
**Rollback:** `v2` permanece apuntando a `e1ee23a`

## Solicitud

Auditar todas las fotografías e imágenes renderizadas en `local-2` y garantizar que
ningún recurso visual se repita entre secciones. Cada duplicado debe sustituirse por
un visual HD nuevo y exclusivo, descargado con licencia adecuada o generado para el
contexto técnico de SkyTech.

## Duplicados confirmados

- `topografia-con-drones.jpg`: Hero y mega-menú de Proyectos.
- `monumentacion_puntos_referencia.png`: Proyectos y mega-menú de Proceso.
- `technology-rtk-quarry.jpg`: Capacidades y Proceso.
- `equipment-gnss-rtk-hd.png`: explorador de Tecnología y carrusel de equipos.
- `equipment-drone-andes-hd.png`: explorador de Tecnología, Proceso y carrusel.
- `equipment-aerial-survey-hd.png`: Proceso y carrusel.
- `process-engineers-plans.jpg`: explorador de Tecnología y Proceso.

El poster y la imagen del Hero comparten ruta dentro de la misma sección como fallback
del video; no constituyen repetición entre secciones.

## Estrategia

- Generar ocho visuales HD nuevos: tres para Tecnología, tres para Proceso y dos para
  los paneles del mega-menú que repiten Hero/Proyectos.
- Mantener las imágenes únicas actuales de Hero, Capacidades, Marca, Proyectos,
  Contacto y carrusel.
- Usar nombres de archivo semánticos y documentar origen/prompt en `PROVENANCE.md`.
- Verificar por código que cada ruta de imagen se use en una sola sección visual.

## Restricciones

- Trabajar exclusivamente dentro de `local-2/`.
- No copiar recursos de Fugro ni Seequent.
- No modificar textos canónicos de la marca.
- No instalar dependencias ni desplegar.
