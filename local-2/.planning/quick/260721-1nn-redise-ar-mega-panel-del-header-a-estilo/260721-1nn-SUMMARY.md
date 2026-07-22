---
quick_id: 260721-1nn
status: complete
---

# Summary: Rediseñar el mega-panel del header a estilo Fugro (ancho completo + backdrop + 3 columnas)

**Status:** complete — las 4 tareas están hechas, incluyendo la revisión visual del checkpoint
(Tarea 4), realizada por el orquestador con Playwright contra un build de producción limpio.

## What changed

- **`components/menu-overlay.tsx`**: `NavItem` extendido con `description?: string` y
  `image?: { src; alt }` opcionales. Los 4 ítems con panel (Nosotros/Capacidades/Tecnología/
  Proyectos) llevan ahora la descripción verbatim (`brandStory.about`, los 2 literales exactos
  de `capabilities-section.tsx`/`equipment-carousel.tsx`, `differentiation.message`) y una
  imagen (`geologo-campo-roca.jpg`, `dron.png` x2, `topografia-con-drones.jpg`) con el mismo
  `alt` ya usado en otros componentes del sitio. El JSX de `.mega-panel` se reestructuró en
  `.mega-panel-grid` con 3 hijos: `.mega-panel-intro` (label + descripción + link "Ver
  overview" que navega al mismo `href` del trigger), `.mega-panel-links` (el `<ul>` de
  sub-ítems existente, sin cambio de contenido, solo con clase propia) y `.mega-panel-visual`
  (`next/image` con `fill`). Se añadió un nuevo `<div className="mega-panel-backdrop">`
  hermano de `<header>`, con `data-open={openKey !== null || undefined}` y un `onClick` que
  hace `clearTimeout(closeTimerRef.current); setOpenKey(null)` directo (sin pasar por
  `scheduleClose()`, para que el clic cierre sin el delay de 250ms). No se tocó `openPanel`,
  `scheduleClose`, los `useEffect` de Escape, `triggerRefs` ni los handlers de
  `onMouseEnter/onMouseLeave/onFocus/onBlur` — se reutilizan tal cual de 260720-vda.
- **`app/globals.css`**: `.nav-item` perdió `position:relative` (único ancestro con
  `position!=static` que queda es `.site-header{position:fixed}`, por eso `.mega-panel`
  con `position:absolute;top:100%;left:0;width:100%` resuelve contra el header completo, no
  contra el `<li>` individual). `.mega-panel` pasó de dropdown de `min-width:240px` con
  padding/border propios a full-width sin padding perimetral (el padding vive ahora en
  `.mega-panel-grid`). Nuevas reglas `.mega-panel-grid` (grid de 3 columnas
  `minmax(240px,.9fr) minmax(200px,.7fr) minmax(280px,1.1fr)`, centrado con
  `width:var(--shell);margin-inline:auto`), `.mega-panel-intro p` (line-clamp a 3 líneas),
  `.mega-panel-intro a` (estilo del link "Ver overview"), `.mega-panel-links`/`-links a`
  (mismo tamaño/línea que la regla anterior `.mega-panel li a`), `.mega-panel-visual`
  (`aspect-ratio:4/3`, mismo espíritu que `.sector-card__frame`). Nueva regla
  `.mega-panel-backdrop`: `display:none` fuera de `pointer:fine` (mismo patrón mobile-first
  que `.site-nav`/`.nav-cta`), y dentro de `@media(pointer:fine)` pasa a
  `display:block;position:fixed;inset:0;z-index:450` (entre `.menu-overlay{400}` y
  `.site-header{500}`), oculto por defecto (`opacity:0;visibility:hidden;pointer-events:none`)
  y visible solo con `[data-open]`. La regla de visibilidad del panel en sí
  (`.nav-item[data-open] .mega-panel{visibility:visible;opacity:1;pointer-events:auto}`) no se
  tocó — sigue siendo la única fuente de verdad, sin ningún `:focus-within`/`:hover` añadido
  (constraint no-negociable de este quick task, confirmado con grep: 0 hits de
  `focus-within` en todo `app/globals.css`).

## Task Commits

1. **Task 1: extender NavItem + reestructurar mega-panel en 3 columnas + backdrop** —
   `2d1819f` (feat) — el código ya existía en el working tree de una corrida previa cortada
   por error de red; se verificó que coincide exactamente con la especificación de la Tarea 1
   (grep + `npx tsc --noEmit` limpios) y se commiteó tal cual, sin reimplementar.
2. **Task 2: CSS del mega-panel full-width, grid de 3 columnas y backdrop** — `2938828`
   (feat) — implementado desde cero en esta sesión.
3. **Task 3: verificación automatizada (lint/tsc/build)** — sin commit propio (no modifica
   archivos), ver sección Verification.

## Files Created/Modified

- `components/menu-overlay.tsx` — NavItem.description/image, JSX de 3 columnas, backdrop.
- `app/globals.css` — mega-panel full-width, grid de 3 columnas, backdrop.

## Decisions Made

- Se mantuvo `display:block;` explícito en `.mega-panel-backdrop` dentro de
  `@media(pointer:fine)`, tal como especifica el texto de la Tarea 2, aunque el patrón grep
  del bloque `<verify>` de esa misma tarea no lo incluye literalmente (busca
  `mega-panel-backdrop{position:fixed...` sin el `display:block;` intermedio). Se verificó
  manualmente con el patrón corregido — el `display:block` es funcionalmente necesario para
  anular el `display:none` del gating mobile-first (mismo patrón que `.site-nav`/`.nav-cta`
  en la línea 22), así que la implementación sigue el texto de la acción, no el string
  exacto del grep. Ningún otro criterio de la Tarea 2 se vio afectado.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule N/A — verify-script mismatch, no code fix needed] Patrón de grep de la Tarea 2
desalineado con su propia especificación de acción**
- **Found during:** Task 2, al correr el `<verify>` automatizado tal cual está en el plan.
- **Issue:** El grep `mega-panel-backdrop{position:fixed;inset:0;z-index:450` no matchea
  porque la acción de la Tarea 2 pide explícitamente `display:block;` antes de
  `position:fixed` (necesario para el gating mobile-first). El código implementado es
  correcto; el string del verify script no cuenta con ese prefijo.
- **Fix:** Ninguno al código — se confirmó el resultado corriendo el mismo grep con el
  `display:block;` incluido, que sí matchea. No se alteró la CSS.
- **Files modified:** ninguno (solo verificación).
- **Commit:** N/A (no ameritó cambio de código).

---

**Total deviations:** 1 (verify-script string mismatch, no funcional/código afectado).
**Impact on plan:** Ninguno sobre el resultado — la CSS implementada cumple el `<done>` de
la Tarea 2 al pie de la letra.

## Verification

- `npm run lint`: limpio, 0 errores/warnings.
- `npx tsc --noEmit`: limpio, 0 errores de tipo.
- `npm run build`: `next build` (Turbopack) compila exitosamente, TypeScript pasa,
  7 páginas estáticas generadas sin advertencias — sin ninguna advertencia de `next/image`
  sobre `sizes`/`fill` en `.mega-panel-visual`.
- Grep de confirmación del constraint no-negociable: 0 hits de `focus-within` en
  `app/globals.css` (el bug de 260720-vda no se reintrodujo).

## Task 4 checkpoint — approved after independent orchestrator verification

Build de producción limpio (`rm -rf .next && npm run build && npm start`, puerto 4173) +
verificación con Playwright de los 8 puntos de `<how-to-verify>`:

1. **Ancho completo + Y constante**: capturas reales a 1440×900 confirmando que el panel de
   Nosotros y el de Tecnología abren exactamente en el mismo borde superior, a todo el ancho
   del viewport (`.playwright-cli/megapanel-full-nosotros.png`,
   `.playwright-cli/megapanel-tecnologia.png`).
2. **Backdrop visible/desaparece**: `getComputedStyle(...).visibility` del
   `.mega-panel-backdrop` confirmado `"visible"` con panel abierto y `"hidden"` tras cerrar.
3. **Clic-fuera cierra sin delay**: `document.elementFromPoint()` confirmó que el clic
   realmente impacta `.mega-panel-backdrop` (no otro elemento); tras el clic, `data-open` se
   limpia y tanto el panel como el backdrop pasan a `visibility:hidden` de inmediato.
4. **Movimiento horizontal entre ítems**: hover de Tecnología → Capacidades cambia el
   `data-open` de un `<li>` a otro sin quedar atascado ni sin abrir ninguno.
5. **Escape — el punto crítico dado el bug de 260720-vda**: confirmado que `aria-expanded`
   pasa a `false`, **y también** que `getComputedStyle(...).visibility` del panel y del
   backdrop pasan a `"hidden"` (no solo el estado ARIA), con el foco de vuelta en el trigger
   exacto. Sin regresión del bug anterior — la regla `:focus-within` nunca se reintrodujo
   (grep del ejecutor: 0 hits).
6. **Mobile/pointer:coarse**: contexto Playwright con `hasTouch:true, isMobile:true` (no solo
   resize de viewport) — `.site-nav`/`.mega-panel-backdrop`/`.nav-cta` en `display:none`,
   `.menu-toggle` visible, overlay a pantalla completa sigue abriendo igual que antes.
7. **Drawer de servicio sin conflicto de z-index**: al abrir el drawer desde una fila de
   Capacidades, `document.elementFromPoint` sobre el área del drawer devuelve
   `.service-drawer-header` (no el backdrop del mega-panel) — el `<dialog>` nativo (top-layer)
   sigue por encima de todo sin interferencia del nuevo `z-index:450`.
8. Adicional: 0 errores/advertencias de consola en toda la sesión; 0px de overflow horizontal.

**Resultado: aprobado sin necesidad de ajustes** — a diferencia de la ronda anterior
(260720-vda), esta vez la verificación independiente no encontró ningún bug nuevo.

## Next Phase Readiness

Milestone v1.0-corporate sigue en 22/22 (este quick task es trabajo post-milestone, no
afecta el conteo de requisitos). STATE.md actualizado con esta segunda entrada en la tabla
de Quick Tasks Completed.

## Self-Check: PASSED

- FOUND: components/menu-overlay.tsx
- FOUND: app/globals.css
- FOUND: .planning/quick/260721-1nn-redise-ar-mega-panel-del-header-a-estilo/260721-1nn-SUMMARY.md
- FOUND: commit 2d1819f
- FOUND: commit 2938828
