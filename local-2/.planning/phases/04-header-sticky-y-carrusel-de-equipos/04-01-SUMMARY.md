---
phase: 04-header-sticky-y-carrusel-de-equipos
plan: 01
subsystem: ui
tags: [gsap, scrolltrigger, lenis, react, css]

# Dependency graph
requires:
  - phase: 01-theme-foundation
    provides: locked light theme tokens (--bg-surface, --border-subtle, --ink-primary, --motion-duration-fast, --ease-moderate)
  - phase: 03-servicios-y-drawer-de-detalle
    provides: MenuOverlay component structure, existing useScrollLock/useOverlayCoordination hook pattern
provides:
  - useHeaderScrollState hook registering a single ScrollTrigger.create({toggleClass}) on the existing Lenis+GSAP ticker
  - .site-header.is-scrolled CSS state (white background + subtle shadow, 200ms transition)
affects: [04-02-carrusel-de-equipos]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dedicated useGSAP-scoped hook per scroll-reactive visual state, registering exactly one ScrollTrigger.create with an explicit trigger.kill() cleanup"

key-files:
  created: [hooks/use-header-scroll-state.ts]
  modified: [components/menu-overlay.tsx, app/globals.css]

key-decisions:
  - "Used ScrollTrigger.create({trigger: document.body, start: \"top -80px\", end: \"max\", toggleClass}) instead of the UI-SPEC placeholder \"80px top\" syntax, matching 04-RESEARCH.md's GSAP-docs-verified shape"
  - "end: \"max\" included explicitly to prevent the toggle from untoggling near the bottom of the page (GSAP's default end is bottom top, which is not equivalent for a document.body trigger)"

patterns-established:
  - "Scroll-reactive class toggles piggyback on the existing single Lenis+GSAP ticker via ScrollTrigger.create — never a second window.addEventListener(\"scroll\", ...)"

requirements-completed: [HEAD-01, HEAD-02]

# Metrics
duration: 8min
completed: 2026-07-20
---

# Phase 4 Plan 1: Header Scroll-Reactive State Summary

**`.site-header` gains a white background + subtle shadow past 80px scroll via a single `ScrollTrigger.create({toggleClass})` registered in a new `useHeaderScrollState` hook, with zero new scroll listeners and `position: fixed` untouched.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-20T22:14:07Z
- **Completed:** 2026-07-20T22:15:20Z
- **Tasks:** 2
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments
- Created `hooks/use-header-scroll-state.ts`, a `useGSAP`-scoped hook registering exactly one `ScrollTrigger.create()` with `trigger: document.body`, `start: "top -80px"`, `end: "max"`, and `toggleClass: { targets: ".site-header", className: "is-scrolled" }`.
- Wired `useHeaderScrollState()` into `MenuOverlay` (the component owning `.site-header`), called alongside the existing `useScrollLock(menuOpen)`.
- Added `.site-header.is-scrolled` (white `--bg-surface` background + hairline + soft ambient shadow) and a 200ms `background`/`box-shadow` transition to the base `.site-header` rule, appended without touching the existing `position: fixed` declaration.

## Task Commits

Each task was committed atomically:

1. **Task 1: Crear el hook use-header-scroll-state.ts** - `e4ed5b8` (feat)
2. **Task 2: Cablear el hook en MenuOverlay y añadir el CSS del estado scrolled** - `6919dad` (feat)

**Plan metadata:** (pending — see final commit below)

## Files Created/Modified
- `hooks/use-header-scroll-state.ts` - New client hook, single `ScrollTrigger.create({toggleClass})` on the existing ticker, `HEADER_SCROLL_THRESHOLD = 80` module-scope constant
- `components/menu-overlay.tsx` - Calls `useHeaderScrollState()` in the component body; no JSX change
- `app/globals.css` - Appended `.site-header` transition + `.site-header.is-scrolled` rule (white bg + shadow); base `.site-header{position:fixed;...}` rule left untouched

## Decisions Made
- Followed 04-RESEARCH.md's GSAP-docs-verified `ScrollTrigger.create()` shape (`trigger: document.body`, `start: "top -80px"`, `end: "max"`) rather than the UI-SPEC's own flagged-as-unverified placeholder (`start: "80px top"`), since the UI-SPEC explicitly deferred to research for exact syntax verification.
- `end: "max"` included per 04-RESEARCH.md Pitfall 2 — without it, GSAP's default `end: "bottom top"` risks the toggle flickering off near the bottom of the page.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- HEAD-01 satisfied: `.site-header` toggles `.is-scrolled` via a single `ScrollTrigger.create`, no second scroll listener (`grep -rn 'addEventListener("scroll"' components/ hooks/` returns only the pre-existing `hooks/use-legacy-parallax.ts` hit).
- `npm run lint`, `npm run typecheck`, and `npm run build` all pass; `force-static` prerendering still succeeds with the new client hook.
- HEAD-02's full stress-test sequence (header + drawer + carousel together) is deferred to Plan 02, once `EquipmentCarousel` exists, per this plan's own scope boundary — Plan 02 must run the complete 6-step manual sequence from 04-RESEARCH.md before the phase is marked done.
- No blockers for Plan 02 (equipment carousel); `.tech-sticky`, `.site-header`, and the Lenis/GSAP ticker are all confirmed unaffected by this plan's changes.

---
*Phase: 04-header-sticky-y-carrusel-de-equipos*
*Completed: 2026-07-20*

## Self-Check: PASSED

- FOUND: hooks/use-header-scroll-state.ts
- FOUND: components/menu-overlay.tsx
- FOUND: app/globals.css
- FOUND: .planning/phases/04-header-sticky-y-carrusel-de-equipos/04-01-SUMMARY.md
- FOUND: e4ed5b8 (Task 1 commit)
- FOUND: 6919dad (Task 2 commit)
- FOUND: 1b8750b (SUMMARY.md commit)
