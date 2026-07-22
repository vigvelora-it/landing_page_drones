# Quick Task 260721-1nn: Rediseñar mega-panel del header a estilo Fugro - Context

**Gathered:** 2026-07-21
**Status:** Ready for planning

<domain>
## Task Boundary

Rediseñar el mega-panel del header (implementado en la quick task 260720-vda como un
dropdown pequeño de ~240px anclado al ítem del nav) a un panel de ancho completo estilo
Fugro (sección "Expertise" de fugro.com, referencia visual compartida por el usuario):

- El panel pasa de estar anclado bajo el ítem individual a ocupar **todo el ancho del
  viewport**, posicionado debajo del header completo (no debajo del ítem).
- Aparece un **scrim/backdrop** detrás del panel que oscurece el resto de la página
  (contenido "en segundo plano" visualmente) mientras el panel está abierto.
- El panel se reorganiza en **3 columnas**:
  1. Izquierda: título de la sección + descripción corta + link "Ver overview" (navega al
     ancla principal de la sección, igual que el trigger del nav).
  2. Centro: los enlaces relacionados que ya existen hoy (sin cambios en su contenido,
     solo en el layout que los contiene).
  3. Derecha: una tarjeta visual grande con imagen destacada.
- Aplica a los 4 ítems del nav que ya tienen submenú: Nosotros, Capacidades, Tecnología,
  Proyectos. Proceso y Contacto siguen sin mega-panel (decisión ya bloqueada en
  260720-vda-CONTEXT.md, no se revisita).

</domain>

<decisions>
## Implementation Decisions

### Descripción corta por sección (columna izquierda)
Se reutiliza texto verbatim ya existente en el sitio — cero copy nuevo:
- **Nosotros**: `brandStory.about` (`lib/site-content.ts`) — el mismo párrafo usado en
  "¿Quiénes somos?" en `brand-section.tsx`. Es más largo que las 2-3 líneas típicas de un
  mega-panel; se trunca visualmente con `-webkit-line-clamp` (CSS, no reescritura de
  contenido) a ~3 líneas.
- **Capacidades**: el párrafo ya existente en `capabilities-section.tsx`:
  "Tecnología aeroespacial aplicada a los sectores más exigentes del Perú." — ya tiene el
  largo correcto, sin truncar.
- **Tecnología**: el párrafo ya existente en `equipment-carousel.tsx`:
  "Equipos de captura aérea y fotogramétrica operados por el equipo técnico en cada
  proyecto."
- **Proyectos**: `differentiation.message` (`lib/site-content.ts`) — párrafo a nivel
  empresa pero temáticamente relevante ("...para proyectos de minería, infraestructura y
  gestión del territorio"); truncar visualmente igual que Nosotros si excede ~3 líneas.

Ninguna de estas cadenas se reescribe ni resume manualmente — se importan/reutilizan tal
cual desde su fuente actual (ya sea el export de `lib/site-content.ts` o literal ya
presente en el JSX del componente correspondiente).

### Imagen destacada por sección (columna derecha)
Asignación fija, con repetición aceptada entre secciones (no hay una foto única por cada
una todavía):
- **Nosotros** → `/IMAGENES_PAGINA_WEB/geologo-campo-roca.jpg` (mismo asset que `sectors`
  usa para "Geología" en `lib/site-content.ts`).
- **Capacidades** → `/IMAGENES_PAGINA_WEB/dron.png`.
- **Tecnología** → `/IMAGENES_PAGINA_WEB/dron.png` (mismo asset que Capacidades — es la
  imagen tecnológica principal del sitio, se acepta la repetición).
- **Proyectos** → `/IMAGENES_PAGINA_WEB/topografia-con-drones.jpg`.

### Comportamiento del backdrop
- Clic en el backdrop cierra el mega-panel (mismo patrón ya usado por el drawer de
  servicio: clic fuera del panel = cierre), además de Escape y mouse-leave (ya
  implementados en 260720-vda, no se tocan).
- El backdrop cubre visualmente el resto de la página (main content) pero **no** debe
  tapar el propio header/nav — el usuario debe poder mover el mouse a otro ítem del nav
  sin que el backdrop se interponga.

### Claude's Discretion
- Altura/posicionamiento exacto del panel (si usa `position:fixed` con `top` igual a la
  altura del header, o se ancla de otra forma) — decisión de implementación, siempre que
  el resultado visual sea "aparece debajo de todo el header, a lo ancho completo".
- Nivel de oscurecimiento del scrim (opacidad exacta) — reutilizar la técnica
  `color-mix()` ya establecida en el proyecto (mismo patrón que `.hero-shade` y el scrim
  del propio header de 260720-vda), no introducir una técnica nueva.
- Si el backdrop necesita gestionar foco/tabindex de alguna manera especial más allá de lo
  ya cubierto por el mega-panel existente (Escape ya devuelve foco al trigger; clic en
  backdrop es una interacción de mouse adicional, no cambia el flujo de teclado ya
  verificado en 260720-vda).
- Breakpoint/comportamiento en anchos de escritorio angostos (misma nota ya aceptada en
  260720-vda-CONTEXT.md: fuera de alcance pixel-perfect bajo 1000px con puntero fino).

</decisions>

<specifics>
## Specific Ideas

- Captura de fugro.com compartida por el usuario: sección "Expertise" con panel a todo el
  ancho, backdrop oscuro detrás, 3 columnas (Expertise/descripción/"Expertise overview" a
  la izquierda, "Case studies"/"Technical papers" al centro, tarjeta de imagen grande con
  overlay de texto y botón de flecha circular a la derecha).

</specifics>

<canonical_refs>
## Canonical References

- `.planning/quick/260720-vda-redise-ar-el-header-a-estilo-fugro-trans/` — el mega-panel
  actual (dropdown pequeño), su CONTEXT/RESEARCH/PLAN/SUMMARY. Esta tarea reemplaza SOLO
  el layout visual del panel (`.mega-panel` en `app/globals.css` y el JSX correspondiente
  en `components/menu-overlay.tsx`); toda la lógica de apertura/cierre por
  hover/foco/Escape/timers ya implementada y verificada ahí se conserva sin tocar.
- `.planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-UI-SPEC.md`
  — tokens LOCKEADOS a reutilizar (colores, tipografía, espaciado, `--motion-*`).
- `lib/site-content.ts` — fuente de las cadenas de descripción reutilizadas (ver
  decisiones arriba).

</canonical_refs>
