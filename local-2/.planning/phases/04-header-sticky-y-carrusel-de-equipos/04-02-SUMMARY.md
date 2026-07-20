---
phase: 04-header-sticky-y-carrusel-de-equipos
plan: 02
subsystem: ui
tags: [embla, carousel, accessibility, lenis, responsive, playwright]

# Dependency graph
requires:
  - phase: 04-header-sticky-y-carrusel-de-equipos
    plan: 01
    provides: scroll-reactive header state driven by the existing Lenis and ScrollTrigger bridge
  - phase: 03-servicios-y-drawer-de-detalle
    provides: ServiceDrawer and Lenis-owned scroll locking used by the HEAD-02 stress test
provides:
  - Accessible two-slide equipment carousel with keyboard, controls, dots, drag and live status
  - Per-call reduced-motion jumps without changing user-driven drag physics
  - Technology stage boundary that preserves sticky pin and release before the carousel
  - Full HEAD-02 browser evidence across header, drawer, sticky section and carousel
affects: [05-contenido-de-marca, 06-calidad-y-regresion-final]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Embla owns horizontal gesture and snap state while data-lenis-prevent isolates its track from Lenis"
    - "A dedicated stage wrapper bounds a viewport-height sticky scene before normal-flow content"

key-files:
  created: [components/equipment-carousel.tsx]
  modified: [lib/site-content.ts, lib/motion-preferences.ts, components/sections/technology-section.tsx, app/globals.css]

key-decisions:
  - "Kept reduced-motion local to scrollPrev, scrollNext and scrollTo through Embla's jump argument; drag remains library-owned"
  - "Introduced .technology-stage at the original 180vh/130vh heights so .tech-sticky releases before the carousel without overlapping Proceso"
  - "Placed carousel controls 16px inside the viewport instead of negative offsets after Playwright proved the latter expanded document scrollWidth"

patterns-established:
  - "Carousel arrow-key handling stays scoped to the focusable viewport and never attaches a document-level listener"
  - "Interactive carousel tracks carry data-lenis-prevent; root overflow policy remains unchanged"

requirements-completed: [EQUIP-01, HEAD-02]

# Metrics
duration: 29min
completed: 2026-07-20
---

# Phase 4 Plan 2: Equipment Carousel and Combined Header Stress Test Summary

**Two-slide Embla equipment carousel with scoped keyboard/touch navigation, reduced-motion jumps, responsive peek sizing, and a production-local HEAD-02 stress pass across the header, drawer, sticky technology scene, and carousel.**

## Performance

- **Duration:** 29 min
- **Started:** 2026-07-20T22:29:25Z
- **Completed:** 2026-07-20T22:58:14Z
- **Tasks:** 3
- **Files modified:** 5 (1 created, 4 modified)

## Accomplishments

- Added typed equipment content for `equipos1.png` and `dron.png`, plus the shared `prefersReducedMotion()` helper without changing the existing Lenis lerp behavior.
- Built `EquipmentCarousel` with Embla `loop: false`, focus-scoped ArrowLeft/ArrowRight, real prev/next buttons, accessible dots, disabled edge states, live slide status, no autoplay, and `data-lenis-prevent` on the track.
- Preserved the original Technology sticky duration through `.technology-stage` while placing the carousel after the sticky scene in normal flow, with no collision against Proceso.
- Completed the six-step HEAD-02 browser stress sequence in a clean production server at desktop 1440x900 and mobile 390x844.

## Task Commits

Each task was committed atomically:

1. **Task 1: Añadir datos equipment y el helper prefersReducedMotion** - `1df2a20` (feat)
2. **Task 2: Crear el componente EquipmentCarousel y su CSS** - `dbb6bf0` (feat)
3. **Task 3: Cablear EquipmentCarousel y ejecutar HEAD-02** - `954b309` (feat)

**Plan metadata:** this close-out commit.

## Files Created/Modified

- `lib/site-content.ts` - Exports `EquipmentItem` and the two-item `equipment` source of truth.
- `lib/motion-preferences.ts` - Exports boolean `prefersReducedMotion()` alongside the unchanged Lenis helpers.
- `components/equipment-carousel.tsx` - Owns Embla state, controls, scoped keyboard input, dots, live region and local images.
- `components/sections/technology-section.tsx` - Renders the carousel after a bounded `.technology-stage` containing the unchanged sticky scene.
- `app/globals.css` - Responsive 58/72/84% carousel layout, focus/disabled states, below-image captions and overflow-safe controls.

## Decisions Made

- Used Embla's per-call `jump` argument for reduced motion rather than a global zero-duration option, preserving drag physics as required.
- Added `.technology-stage` because the prior fixed height belonged to the sticky scene, not to the sticky scene plus a new 1,200px carousel; this retains the exact desktop/mobile pin durations and gives the carousel normal document flow.
- Kept controls overlaid but moved them inside the viewport by 16px after browser measurement showed negative 22px offsets produced `scrollWidth: 1462` at a 1440px viewport.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prevented Technology/Proceso overlap and preserved a real sticky release**
- **Found during:** Task 3 browser stress test.
- **Issue:** Appending the carousel to `.technology{height:180vh}` made the carousel extend 520px into Proceso. A provisional auto-height treatment removed the overlap but kept the sticky active behind the carousel instead of releasing first.
- **Fix:** Added a `.technology-stage` wrapper at the original 180vh desktop / 130vh mobile height, set the outer Technology section to natural height, and kept `EquipmentCarousel` after the stage.
- **Files modified:** `components/sections/technology-section.tsx`, `app/globals.css`.
- **Verification:** Playwright measured sticky `top: 0` while pinned, `top: -170` while releasing, `top: -890` when the carousel reached the viewport, and no overlap with Proceso.
- **Committed in:** `954b309`.

**2. [Rule 1 - Bug] Removed carousel-induced horizontal document overflow**
- **Found during:** Task 3 browser stress test.
- **Issue:** Initial `left/right: -22px` control offsets expanded the desktop document to 1462px on a 1440px viewport.
- **Fix:** Positioned both 44px controls 16px inside the carousel edges and retained the single pre-existing root `overflow-x` declaration.
- **Files modified:** `app/globals.css`.
- **Verification:** `scrollWidth === innerWidth` at 1440px and 390px; `grep -c overflow-x app/globals.css` remains 1.
- **Committed in:** `954b309`.

**3. [Rule 1 - Bug] Restored captions to the required below-image position**
- **Found during:** Task 3 visual review.
- **Issue:** Reusing `.tech-caption` also inherited its absolute positioning from the pinned Technology hero, causing both slide captions to overlap instead of sitting below their images.
- **Fix:** Scoped a static-position override to `.embla__slide>.tech-caption` with the specified 8px gap.
- **Files modified:** `app/globals.css`.
- **Verification:** Desktop and mobile screenshots show one caption beneath each corresponding frame.
- **Committed in:** `954b309`.

---

**Total deviations:** 3 auto-fixed bugs.
**Impact on plan:** All fixes were required to satisfy the existing HEAD-02, responsive-layout and copy-placement contracts; no new feature scope or dependency was introduced.

## Issues Encountered

- The first browser run was invalid because an old `next dev` process was writing development/HMR chunks into `.next` during `next build`. This prevented hydration and made the header appear broken. Only the verified `local-2` dev/start processes were stopped, then the application was rebuilt with no concurrent writer and served through `next start`; clean production-local hydration showed the header implementation was correct.
- A mobile reload performed while the browser preserved a deep scroll position emitted one existing Next Image preload warning for `topografia-con-drones.jpg`; final console evidence had zero application errors, and this warning is unrelated to the carousel changes.

## Verification Evidence

- `npm run lint`, `npm run typecheck`, and a clean `npm run build` all pass; `/` remains statically prerendered.
- Header flick test: y=697 -> `.site-header.is-scrolled`; return to y=2 -> base `.site-header`, with no flicker or console error.
- Drawer test: y=220 remains fixed while open and the header retains `.is-scrolled`; after close animation Lenis resumes scrolling (y=720 -> 1219).
- Carousel controls: ArrowRight/ArrowLeft, next button and dots move between slides; prev/next disable at the correct ends; the live region reports `Equipo 1 de 2` / `Equipo 2 de 2`; selection remains unchanged without interaction.
- Drag test moves slide 1 -> 2 in normal and reduced-motion modes. Under reduced motion, dot navigation transforms immediately from 0 to -254px and stays unchanged after 350ms.
- Responsive measurements: desktop `scrollWidth 1440 / innerWidth 1440`; mobile `390 / 390`, 84vw slide measured 328px, 130vh stage measured 1097px, and both 44px controls remain within x=16..374.
- Visual artifacts: `.playwright-cli/phase4-equipment-desktop.png` and `.playwright-cli/phase4-equipment-mobile.png` (local-only, intentionally not committed).

## User Setup Required

None - no external service configuration or package installation required.

## Next Phase Readiness

- Phase 4 is technically complete: EQUIP-01 and the deferred combined HEAD-02 gate both pass.
- Phase 5 can start after user confirmation. `BROCH-01` remains dependent on the real client brochure PDF and must not be fabricated.

---
*Phase: 04-header-sticky-y-carrusel-de-equipos*
*Completed: 2026-07-20*

## Self-Check: PASSED

- FOUND: `components/equipment-carousel.tsx`
- FOUND: `lib/site-content.ts` equipment exports
- FOUND: `lib/motion-preferences.ts` reduced-motion helper
- FOUND: `components/sections/technology-section.tsx` single carousel render
- FOUND: `app/globals.css` Embla styles with one root overflow-x occurrence
- FOUND: task commits `1df2a20`, `dbb6bf0`, `954b309`
- PASS: lint, typecheck, clean production build, structural grep gates and browser stress sequence
