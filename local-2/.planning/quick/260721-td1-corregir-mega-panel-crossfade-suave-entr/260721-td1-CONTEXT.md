# Quick Task 260721-td1: Corregir mega-panel (crossfade, Proceso/Contacto, imagen) - Context

**Gathered:** 2026-07-21
**Status:** Ready for planning

<domain>
## Task Boundary

Tres correcciones sobre el mega-panel de ancho completo ya implementado (quick tasks
260720-vda y 260721-1nn):

1. **Parpadeo al cambiar de ítem**: mover el mouse de un ítem del nav a otro (ej.
   Nosotros → Capacidades) produce un corte visual brusco en vez de una transición suave.
   Debe sentirse como una transición cruzada con un ligero movimiento, estilo Fugro.
2. **Proceso y Contacto no abren panel**: hoy solo Nosotros/Capacidades/Tecnología/
   Proyectos tienen mega-panel (decisión de 260720-vda). Ahora los 6 ítems deben abrir
   panel — y el de Contacto debe contener el **formulario de contacto funcional
   completo**, no solo enlaces.
3. **Capacidades y Tecnología comparten la misma imagen** (`dron.png`) en su columna
   visual — deben ser distintas.

</domain>

<decisions>
## Implementation Decisions

### Causa raíz del parpadeo (diagnóstico, no pregunta al usuario)
Cada ítem con panel tiene su propio `<div className="mega-panel">` anidado en su propio
`<li>`. Los 4 (pronto 6) paneles están posicionados de forma idéntica
(`position:absolute;top:100%;left:0;width:100%` respecto a `.site-header`), pero son
nodos DOM separados. Al cambiar `openKey` de un ítem a otro, el panel saliente pierde
`data-open` y su `visibility` vuelve a `hidden` **instantáneamente** (la regla
`.nav-item[data-open] .mega-panel{visibility:visible}` no tiene transición en
`visibility`, solo en `opacity`), mientras el panel entrante recién empieza a animar su
`opacity` de 0 a 1. Es decir: el panel viejo desaparece de golpe, el nuevo aparece con
fade — no hay una transición cruzada real, lo que se percibe como parpadeo.

### Arquitectura del fix (decisión técnica — no requiere input del usuario)
Se reemplazan los N paneles independientes por **un único panel compartido** cuyo
contenido cambia según `openKey` (el mismo patrón real de Fugro: el contenedor no se
desmonta/remonta al cambiar de sección, solo cambia lo que hay dentro). Esto:
- Elimina el parpadeo de raíz (no hay dos nodos DOM compitiendo por visibilidad).
- Permite una transición de contenido controlada (crossfade + un desplazamiento vertical
  sutil de ~8px, reutilizando `--motion-duration-fast`/`--ease-moderate` ya lockeados).
- Simplifica agregar Proceso y Contacto (un solo panel que sabe renderizar 3 tipos de
  contenido: intro+enlaces+imagen, o intro+formulario).
No se toca el mecanismo de apertura/cierre por hover/foco/Escape/backdrop ya verificado
(`openKey`, `closeTimerRef`, `triggerRefs`, `openPanel`, `scheduleClose`,
`.mega-panel-backdrop`) — solo cómo se renderiza el contenido del panel una vez abierto.

### Contenido del panel de Proceso
Los 4 pasos ya redactados en `process` (`lib/site-content.ts`): "Leemos el terreno",
"Diseñamos la misión", "Capturamos la realidad", "Convertimos datos" — mismo patrón que
Capacidades/Tecnología (cada uno enlaza a `#proceso`, no hay anclas individuales por
paso).

### Layout del panel de Contacto
2 columnas en vez de 3: izquierda = intro (label "Contacto" + descripción corta ya
existente — el párrafo `"Cuéntanos qué necesitas medir. Nuestro equipo responderá con el
enfoque técnico adecuado."` de `contact-section.tsx` — sin "Ver overview" porque no tiene
sentido duplicar el link al ancla que ya es su propio destino); derecha = el componente
`<ContactForm />` ya existente (`components/contact-form.tsx`), reutilizado tal cual —
misma validación, mismo POST a `/api/contact`, sin reescribir lógica.

**Nota técnica a resolver en el plan**: `ContactForm` usa ids fijos (`#submit-button`,
`#form-status`) consultados vía `form.querySelector` (correctamente escopados al form, no
rompe funcionalmente al haber dos instancias en la página), pero **sí produce HTML
inválido** (ids duplicados) al renderizarse dos veces (la del mega-panel + la de la
sección de Contacto). El plan debe evitarlo — opción más simple: no montar el `<ContactForm />`
del panel en el DOM hasta que `openKey === "contacto"` (montaje condicional, evita el
duplicado en el 99% del tiempo) y/o añadir un prop de prefijo de id al componente. Detalle
de implementación a definir por el planner con apoyo de research.

### Imagen distinta para Capacidades
`mineria-tajo-abierto.jpg` (ya presente en `public/IMAGENES_PAGINA_WEB/`, usado hoy solo
en la banda "Sectores que atendemos" de `brand-section.tsx`, con su alt ya redactado:
"Operación minera a tajo abierto con maquinaria pesada"). Tecnología conserva `dron.png`.

### Claude's Discretion
- Duración/easing exactos de la transición cruzada — reutilizar
  `--motion-duration-fast`/`--ease-moderate` ya lockeados, sin introducir nuevos tokens de
  movimiento.
- Cómo estructurar internamente el panel compartido en JSX/TS (un componente que recibe
  el `NavItem` activo y decide qué renderizar, vs. una función de render por tipo) —
  detalle de implementación, no de producto.
- Si el ancho fijo de 2 columnas de Contacto reutiliza las mismas proporciones de grid
  que las 3 columnas de los demás paneles o define las suyas propias — debe verse
  visualmente consistente con el resto (mismo padding, mismo `--shell`, misma tipografía).

</decisions>

<specifics>
## Specific Ideas

- Captura de pantalla del usuario mostrando el parpadeo al pasar de "Nosotros" a
  "Capacidades" (corte visual brusco entre paneles).
- Referencia repetida a fugro.com: transición "de forma desapercibida con un ligero
  movimiento".

</specifics>

<canonical_refs>
## Canonical References

- `.planning/quick/260720-vda-redise-ar-el-header-a-estilo-fugro-trans/` — mecanismo base
  de apertura/cierre (hover/foco/Escape), no se modifica.
- `.planning/quick/260721-1nn-redise-ar-mega-panel-del-header-a-estilo/` — el mega-panel
  full-width + backdrop + 3 columnas actual, que esta tarea reestructura internamente
  (panel único) sin deshacer el trabajo de ancho completo/backdrop ya verificado.
- `components/contact-form.tsx`, `components/sections/contact-section.tsx` — formulario
  real a reutilizar en el panel de Contacto, sin reescribir su lógica de envío/validación.
- `lib/site-content.ts` — fuente de `process` (4 pasos) y de la ruta/alt de
  `mineria-tajo-abierto.jpg` (ya usada en `sectors`).

</canonical_refs>
