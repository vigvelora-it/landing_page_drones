# Quick Task 260722-rmd: Eliminar sección de diferenciación

**Date:** 2026-07-22
**Status:** In progress
**Rollback:** `v2` permanece apuntando a `e1ee23a`

## Solicitud

Eliminar por completo el bloque visible "Evidencia técnica / Diferenciación" mostrado
debajo de las tarjetas de proyectos.

## Alcance

- Retirar título, descripción, cuatro métricas y mensaje inferior.
- Eliminar estilos exclusivos del bloque y sus reglas responsive.
- Mantener intactas las tres tarjetas de proyectos y el bloque de brochure siguiente.
- Conservar el texto canónico `differentiation.message` usado como descripción del
  mega-panel de Proyectos; la solicitud afecta a la sección visible, no a ese menú.
- Verificar que no quede hueco vertical ni overflow en escritorio/móvil.
- Trabajar exclusivamente dentro de `local-2/`; no desplegar.
