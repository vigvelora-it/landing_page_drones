# Quick Task 260722-2up: Carrusel doble con imágenes HD

**Date:** 2026-07-22
**Status:** In progress
**Rollback:** `v2` permanece apuntando a `e1ee23a`

## Solicitud

Reconfigurar "Equipo en campo" para mostrar siempre dos imágenes completas al mismo
tiempo. La navegación debe avanzar una posición (`1–2 -> 2–3 -> 3–4`) y conservar
el autoavance. Sustituir los dos archivos verticales de baja resolución por imágenes
HD que encajen naturalmente en las tarjetas sin ampliación excesiva.

## Alcance

- Ventana de dos slides al 50%, con separación controlada y overflow oculto.
- Avance de una imagen por interacción o por temporizador.
- Al menos cuatro imágenes panorámicas HD con relación consistente.
- Visuales generados documentados como referenciales; no atribuirlos a proyectos,
  clientes o inventario real de SkyTech.
- Mantener teclado, drag/touch, puntos, contador, pausa y reduced-motion.
- Validar escritorio y móvil con dos imágenes simultáneas, sin overflow.
- Trabajar exclusivamente dentro de `local-2/`; no desplegar.

