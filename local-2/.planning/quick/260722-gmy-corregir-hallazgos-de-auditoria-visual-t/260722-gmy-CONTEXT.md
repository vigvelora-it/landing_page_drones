# Quick Task 260722-gmy: Correcciones visuales y funcionales posteriores a auditoria - Context

**Gathered:** 2026-07-22
**Status:** Ready for implementation

<domain>
## Task Boundary

Corregir los hallazgos de la auditoria visual solicitada por el usuario en `local-2`:
contraste y composicion del hero, vacio en el mosaico de Capacidades, scroll muerto en
Tecnologia, escala del carrusel, densidad excesiva en Nosotros/Proceso, proyectos con
apariencia incompleta y fotografia de Contacto superpuesta al formulario.

El trabajo es exclusivamente local. No se despliega y no se modifica `../local/` ni
`../produccion/`.

</domain>

<decisions>
## Implementation Decisions

### Punto de restauracion previo

Antes de editar se creo el tag anotado `v2` sobre `e1ee23a`. Este tag representa el
estado visual rastreado de `local-2` anterior a esta tarea. La orden futura del usuario
"regresa a v2" significa restaurar los archivos rastreados de `local-2` desde ese tag,
sin tocar los otros ambientes del repositorio.

### Hero

- Mantener el video real ya integrado y su control pausa/reproduccion.
- Crear una zona de lectura inequívoca con scrim funcional y texto claro.
- Reducir la escala y los offsets del titulo, especialmente en 390x844.
- No cambiar el mensaje de marca del hero.

### Ritmo y scroll

- Eliminar el sticky de 180vh de Tecnologia: contradice la especificacion de movimiento
  moderado y genera aproximadamente 720px de scroll sin cambio en 1440x900.
- Reducir espacios verticales estructurales sin retirar contenido canonico.
- Mantener Lenis/GSAP y `prefers-reduced-motion`; el problema es de layout, no del motor.

### Imagenes y carrusel

- Capacidades pasa a una composicion editorial de una imagen vertical y dos capturas
  apiladas, usando medios locales con procedencia ya documentada.
- El carrusel conserva solo los dos equipos reales. No se agregan fotografias de stock
  como si probaran propiedad de equipos de SkyTech.
- Las diapositivas cambian a formato horizontal con una siguiente tarjeta visible,
  contador/progreso y altura limitada.

### Contenido de marca y proyectos

- Los textos canonicos de `.planning/BRAND-CONTENT.md` permanecen verbatim.
- Nosotros se compacta mediante composicion, tarjetas y comportamiento horizontal en
  movil; no se elimina historia, mision, vision, valores ni equipo.
- Los proyectos reales no reciben fotografias de stock. Se crea evidencia visual
  abstracta/editorial con ubicacion y datos reales, evitando atribucion falsa.
- Se retiran las cifras/modelos tecnicos no confirmados por el brief (`240K`, `45MP`,
  `Matrice 350 RTK`) y se sustituyen por capacidades canonicas (RTK/PPK, LiDAR, CAD/GIS).

### Contacto y proceso

- La imagen de Contacto pasa a ser un panel contenido, no un fondo debajo de campos.
- Proceso mantiene todos los pasos y entregables, con menor altura y mejor ritmo.

</decisions>

<validation>
## Validation

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Auditoria real con Playwright en 1440x900 y 390x844.
- Verificar scrollHeight, overflow horizontal, hero, Tecnologia, carrusel, drawer,
  header, Proyectos y Contacto.
- Confirmar que no se produjeron cambios fuera de `local-2` y que no hubo despliegue.

</validation>
