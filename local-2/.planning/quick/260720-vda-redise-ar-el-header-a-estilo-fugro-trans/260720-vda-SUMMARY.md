---
quick_id: 260720-vda
status: complete
---

# Summary: Rediseñar el header a estilo Fugro

**Status:** complete

## What changed

- **`components/menu-overlay.tsx`**: nuevo `.site-nav` horizontal (desktop) con 6 ítems.
  4 de ellos (Nosotros, Capacidades, Tecnología, Proyectos) abren un mega-panel al hover
  o al recibir foco de teclado (`onMouseEnter`/`onFocus` → `openPanel`, con un
  `scheduleClose` de 250ms en `onMouseLeave`/`onBlur` para cumplir WCAG 1.4.13
  hoverable/dismissible). Escape cierra el panel abierto y devuelve el foco al trigger
  exacto vía un mapa `triggerRefs`. El botón "Menú"/overlay móvil existente queda intacto
  byte a byte, ahora oculto solo en `@media(pointer:fine)`.
- **`components/sections/brand-section.tsx`**: 4 anchors nuevos (`id="historia"`,
  `id="equipo"`, `id="valores"`, `id="sectores"`) para que el mega-panel de "Nosotros"
  pueda enlazar a sub-secciones reales.
- **`app/globals.css`**: `.site-header` pasa de fondo sólido fijo a un scrim
  `linear-gradient` con `color-mix()` (transparente sobre el hero, texto blanco) que se
  reemplaza por `var(--bg-surface)` sólido cuando `useHeaderScrollState` añade
  `.is-scrolled` (mecanismo ya existente de HEAD-01, sin tocar su lógica). Nav/CTA
  visibles solo con `pointer:fine`; en `pointer:coarse` se oculta el nav y se muestra el
  botón "Menú" de siempre. `#historia/#equipo/#valores/#sectores` llevan
  `scroll-margin-top:140px` para no quedar tapados por el header fijo.

## Bug found and fixed during my own verification (not caught by plan-checker or executor)

El ejecutor implementó correctamente los 2 blockers que el plan-checker había encontrado
(selector `data-open` desalineado, foco no regresaba al trigger en Escape) y dejó
explícitamente anotado como "punto a verificar" que el fallback CSS `:focus-within`
podía dejar el panel visualmente abierto tras Escape. Verifiqué esto yo mismo con
Playwright — en efecto, `aria-expanded` pasaba a `false` y el foco volvía al trigger
correctamente, pero el panel seguía **visualmente visible** porque `:focus-within` en
`.nav-item` seguía siendo verdadero (el foco vuelve a un descendiente del propio
`.nav-item`). Solución: se eliminó la regla `:focus-within` del CSS de visibilidad — era
redundante (la apertura ya la maneja `onFocus` vía estado de React) y era la única causa
del bug. Verificado de nuevo tras el fix: el panel ahora se oculta correctamente en
Escape (`visibility:hidden`), sin afectar hover ni tab-dentro-del-panel.

## Verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build`: limpios (antes y después del fix
  de Escape).
- Verificación visual propia en build de producción (`npm start`, puerto 4173) vía
  Playwright, más allá del checkpoint que dejó el ejecutor:
  - Contraste del header transparente sobre el hero: muestreo de píxeles con `sharp`
    sobre capturas reales — texto blanco legible con amplio margen (~9:1 en la mayoría
    de puntos) incluso sobre las nubes más brillantes del video/imagen de fondo.
  - Header sólido correcto al hacer scroll (`.is-scrolled`).
  - Mega-panels de Nosotros y Capacidades verificados visualmente (hover real).
  - Teclado: foco en trigger abre el panel; Escape lo cierra visualmente y devuelve el
    foco exacto al trigger (tras el fix).
  - Clic en "Historia" (sub-ítem del mega-panel) aterriza con 25px de margen bajo el
    header fijo — sin solaparse.
  - Mobile/touch real (contexto Playwright con `hasTouch:true, isMobile:true`, no solo
    resize de viewport): `pointer:coarse` confirmado, nav horizontal oculto, botón
    "Menú" visible, overlay a pantalla completa abre igual que antes — sin regresión.
  - Drawer de servicio (Capacidades) sigue dejando el header `inert` (ancestro
    `<div inert>` de `InertBoundary` confirmado) — sin regresión de SERV-03.
  - 0 errores/advertencias de consola en toda la sesión; 0px de overflow horizontal.

## Not part of this task (out of scope, tracked separately if relevant)

- Rendimiento en viewports intermedios (~1024×768 con puntero fino) — documentado como
  aceptado/fuera de alcance en el plan, no bloqueante para un sitio desktop-first.
