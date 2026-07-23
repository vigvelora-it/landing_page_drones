# Quick Task 260722-t0y: Tecnología horizontal y separación estática

**Date:** 2026-07-22
**Status:** Complete
**Rollback:** `v2` permanece apuntando a `e1ee23a`

## Solicitud

Corregir la sección Tecnología porque el titular vertical empuja los selectores hacia
la parte inferior y parte del contenido se pierde en la primera vista. Eliminar además
el banner azul con texto en loop infinito y sustituirlo por una separación visual más
sobria entre Capacidades y Tecnología.

## Decisión visual

### Tecnología

- Encabezado ancho: título de máximo dos líneas y descripción lateral.
- Debajo, una franja horizontal con imagen 65% y tres controles 35%.
- Altura visual acotada, sin sticky ni espacio muerto.
- Tablet y móvil mantienen una composición apilada legible sin overflow.

### Separación

- Eliminar marquee, duplicación de texto y animación infinita.
- Usar transición estática clara con numeración `02 / Capacidades` y
  `03 / Tecnología`, conectadas por una línea fina y un marcador azul.
- Mantener fondo neutro para no competir con fotografías ni titulares.

## Restricciones

- Trabajar únicamente dentro de `local-2/`.
- Conservar textos canónicos e imágenes exclusivas ya auditadas.
- No instalar dependencias ni desplegar.
