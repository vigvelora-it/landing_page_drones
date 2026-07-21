# Quick Task 260720-vda: Rediseñar el header a estilo Fugro - Context

**Gathered:** 2026-07-21
**Status:** Ready for planning

<domain>
## Task Boundary

Rediseñar el header del sitio a un estilo tipo Fugro (fugro.com), adaptado al contenido y
estructura de una sola página con anclas de SkyTech:

- Header transparente/degradado sobre el hero (logo y nav en blanco), que pasa a fondo
  blanco sólido con logo/nav oscuros al hacer scroll — reutilizando el hook
  `useHeaderScrollState` ya existente de HEAD-01 (Fase 4), solo cambia el contenido/estilo
  visual del header, no el mecanismo de detección de scroll.
- Nav horizontal siempre visible en escritorio (reemplaza el patrón actual de botón "Menú"
  que abre un overlay a pantalla completa).
- Al pasar el mouse sobre un ítem del nav en escritorio, se despliega un mega-menú con
  sub-contenido de esa sección.
- Referencia visual: capturas de fugro.com compartidas por el usuario (header transparente
  sobre hero y header blanco en scroll, con nav de texto en línea, iconos de
  búsqueda/cuenta y botón "Get in touch" con borde) — como referencia de estructura y
  composición, no para copiar literal (mismo criterio ya aplicado a Fugro/Seequent en todo
  este milestone).

</domain>

<decisions>
## Implementation Decisions

### Comportamiento en móvil/tablet
- Se conserva el overlay a pantalla completa actual (botón "Menú" → overlay con los 6
  enlaces numerados) para viewports sin hover confiable.
- El nav horizontal + mega-menú por hover es exclusivo de escritorio/puntero preciso
  (mismo criterio de detección ya usado por `custom-cursor.tsx` para activarse solo en
  dispositivos con puntero preciso).
- No se construye una variante de acordeón por tap — se reutiliza el overlay existente tal
  cual, sin regresiones sobre SERV-03 (exclusión mutua drawer/menú) ni sobre el mecanismo
  de bloqueo de scroll ya probado.

### Contenido de cada mega-menú
- **Nosotros** → Historia, Equipo, Valores, Sectores (anclas dentro de `#nosotros`,
  apuntando a los `id` de las regiones ya existentes en `brand-section.tsx`: hay que
  verificar/añadir anchors internos si no existen todavía como `id` navegable).
- **Capacidades** → los 5 ejes de servicio (mismo texto/orden que `services` en
  `lib/site-content.ts`), cada uno enlaza a `#capacidades` (no abre el drawer directamente
  desde el header — evita duplicar la lógica de estado de `CapabilitiesSection`).
- **Tecnología** → referencia a Equipo técnico / carrusel (`#tecnologia`).
- **Proyectos** → los 3 proyectos reales (`projects` de `lib/site-content.ts`), cada uno
  enlaza a `#proyectos`.
- **Proceso** y **Contacto** → sin mega-menú, navegación directa al ancla (son pasos
  únicos, no colecciones).

### Iconos de búsqueda/cuenta (referencia Fugro)
- Se omiten por completo — el sitio no tiene buscador ni login, no se fabrica
  funcionalidad inexistente. El header queda: logo, nav, botón de contacto.

### CTA del header ("Get in touch")
- Botón que hace scroll suave a `#contacto` vía Lenis, mismo patrón ya usado por
  `handleCtaClick` en `components/service-drawer.tsx` (scrollTo tras cerrar cualquier
  overlay abierto). No se abre ningún modal nuevo.

### Claude's Discretion
- Timing/delay exacto de apertura y cierre del mega-menú al hover (debe ser accesible:
  cumplir WCAG 1.4.13 — contenido revelado por hover debe ser "hoverable, dismissible,
  persistent"; también debe funcionar por teclado con foco, no solo con mouse).
- Estructura exacta del markup del mega-menú (contenedor por ítem vs. panel único
  compartido) y nombres de clases CSS, siempre reutilizando los tokens ya establecidos en
  Fase 1 (`--accent`, `--bg-surface`, `--border-subtle`, tamaños tipográficos existentes).
- Si el header transparente sobre el hero necesita un scrim adicional para legibilidad del
  texto blanco, reutilizar el patrón de gradiente ya existente en el hero en vez de crear
  uno nuevo.
- Qué pasa con el botón "Menú"/overlay actual en desktop: se retira del layout de
  escritorio (reemplazado por el nav horizontal), pero el componente y sus hooks
  (`useOverlayCoordination`, `useScrollLock`) se conservan intactos para el breakpoint
  móvil.

</decisions>

<specifics>
## Specific Ideas

- Las dos capturas de fugro.com compartidas por el usuario en el chat: header transparente
  sobre imagen de hero (logo blanco, nav en línea, icono de búsqueda/cuenta, botón "Get in
  touch") y header en scroll con fondo blanco, mismo layout pero en oscuro.

</specifics>

<canonical_refs>
## Canonical References

- `.planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-UI-SPEC.md`
  — tokens de color/tipografía/espaciado/movimiento LOCKEADOS, deben reutilizarse tal cual
  (no introducir tamaños de fuente o pesos nuevos).
- `hooks/use-header-scroll-state.ts` y su consumo en `components/menu-overlay.tsx` (HEAD-01,
  Fase 4) — mecanismo de scroll-reactive state a reutilizar sin modificar su lógica interna.
- `lib/site-content.ts` — fuente de verdad para el texto de cada sub-ítem de mega-menú
  (services, team-related headings, projects); no inventar copy nuevo.

</canonical_refs>
