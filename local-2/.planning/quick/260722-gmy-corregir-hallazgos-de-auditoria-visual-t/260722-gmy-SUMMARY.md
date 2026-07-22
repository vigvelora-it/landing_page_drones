# Quick Task 260722-gmy: Correcciones visuales y funcionales posteriores a auditoria - Summary

**Completed:** 2026-07-22
**Status:** Complete
**Rollback:** tag anotado `v2` -> `e1ee23a`

## Resultado

Se corrigieron los hallazgos de la auditoria visual sin copiar recursos de Fugro, sin
reescribir el contenido canonico del cliente y sin desplegar.

- Hero: contraste fuerte y estable sobre el video, titulo proporcionado y composicion
  responsive legible en 1440x900 y 390x844.
- Capacidades: mosaico equilibrado de una imagen vertical y dos capturas apiladas; el
  vacio de aproximadamente 406px desaparecio.
- Tecnologia: eliminado el sticky de 180vh. El escenario paso de 1620px/sticky a
  810px/flujo normal en escritorio y 621px en movil.
- Texto tecnico: retiradas las cifras/modelo no confirmados (`240K`, `45MP`,
  `Matrice 350 RTK`); reemplazados por capacidades presentes en el brief:
  RTK/PPK, LiDAR y entregables CAD/GIS.
- Carrusel: conserva solo dos equipos reales, ahora con formato horizontal, siguiente
  slide visible, contador, puntos y barra de progreso. Cada slide desktop paso de
  835x1067 a 936x550.
- Nosotros: nueva imagen editorial de geologia, mejor composicion, sectores en carrusel
  horizontal movil, tarjetas de equipo compactas y divulgacion progresiva accesible de
  valores/biografias en movil.
- Proyectos: tarjetas con lenguaje cartografico abstracto y datos reales, sin atribuir
  fotografias stock a proyectos de clientes.
- Proceso: pasos, imagen y entregables conservados con menor altura estructural.
- Contacto: fotografia contenida en columna propia; ya no queda debajo de los campos.

## Metricas visuales

| Vista | Antes | Despues | Resultado |
|---|---:|---:|---|
| Desktop 1440x900 | 16,909px | 14,754px | -2,155px, sin overflow |
| Movil 390x844 | 21,761px | 16,563px | -5,198px, sin overflow |
| Tecnologia desktop | 1,620px sticky | 810px relative | sin scroll muerto |
| Capacidades desktop | 2 imagenes desiguales | 3 imagenes 811x893 + 2x541x434 | mosaico completo |

## Verificacion

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- Build Next.js: pagina estatica `/`, API `/api/contact` intacta
- Playwright desktop 1440x900: 0 errores de consola, 0px overflow horizontal
- Playwright movil 390x844: 0 errores de consola, 0px overflow horizontal
- Drawer: abre, Escape cierra y devuelve el flujo correctamente
- Carrusel: boton siguiente cambia seleccion de equipo 1 a equipo 2
- Valores/perfiles movil: `aria-expanded` cambia `false -> true` y revela el texto
- No hubo despliegue ni cambios en `../local/` o `../produccion/`

## Archivos de aplicacion

- `app/globals.css`
- `components/equipment-carousel.tsx`
- `components/sections/brand-section.tsx`
- `components/sections/capabilities-section.tsx`
- `components/sections/contact-section.tsx`
- `components/sections/projects-section.tsx`
- `components/sections/technology-section.tsx`
- `lib/site-content.ts`

## Restauracion

Si el usuario ordena `v2`, restaurar solo `local-2` desde el tag `v2`. Como es una
operacion destructiva sobre cambios posteriores, verificar el estado y confirmar el
alcance exacto antes de ejecutar la restauracion.
