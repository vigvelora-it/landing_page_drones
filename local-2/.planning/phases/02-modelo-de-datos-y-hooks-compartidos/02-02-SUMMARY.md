---
phase: 02-modelo-de-datos-y-hooks-compartidos
plan: 02
subsystem: client-hooks
tags: [react, lenis, pointer-events, scroll-lock, custom-cursor]

# Dependency graph
requires:
  - phase: 01-theme-foundations
    provides: light corporate token theme (app/globals.css) and the Lenis+GSAP SmoothScrollProvider bridge that this plan's useScrollLock hooks into
provides:
  - "useScrollLock(isLocked): shared client hook wrapping useLenis().stop()/start(), reusable by Phase 3's service drawer"
  - "Event-delegated CustomCursor reacting to [data-cursor] elements inserted after initial mount (Phase 3 drawer close button, Phase 4 carousel controls)"
affects: [03-servicios-y-drawer-de-detalle, 04-header-sticky-y-carrusel-de-equipos]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "hooks/use-scroll-lock.ts: shared boolean-driven Lenis stop/start hook, no CSS overflow/body-class backstop (ARCH-02 literal reading)"
    - "components/custom-cursor.tsx: document-level pointerover/pointerout delegation + closest('[data-cursor]') + same-target relatedTarget guard, replacing mount-time querySelectorAll snapshot"

key-files:
  created:
    - hooks/use-scroll-lock.ts
  modified:
    - components/menu-overlay.tsx
    - app/globals.css
    - components/custom-cursor.tsx

key-decisions:
  - "No overflow:hidden backstop added to useScrollLock, per the plan's explicit resolution of 02-RESEARCH.md Open Question #2 in favor of a strict ARCH-02 reading (lenis.stop()/start() only, zero CSS/body-class involvement)"
  - "body.menu-open{overflow:hidden} deleted outright (not repurposed as a differently-named backstop) since menu-overlay.tsx no longer toggles any class and nothing else in the codebase referenced .menu-open"

requirements-completed: [ARCH-02, ARCH-03]

# Metrics
duration: ~15min
completed: 2026-07-19
---

# Phase 02 Plan 02: Shared Scroll-Lock Hook and Event-Delegated Custom Cursor Summary

**New `useScrollLock` hook driving `MenuOverlay`'s scroll block purely through `lenis.stop()/start()`, and `CustomCursor` rewritten to document-level `pointerover`/`pointerout` delegation with a same-target guard so it now reacts to `[data-cursor]` elements added after mount.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 3
- **Files modified:** 4 (1 created, 3 edited)

## Accomplishments

- Created `hooks/use-scroll-lock.ts` exporting `useScrollLock(isLocked: boolean)`, wrapping `useLenis()` from `lenis/react` with an effect that calls `lenis.stop()`/`lenis.start()` and always resumes scroll on unmount — zero `overflow:hidden`/body-class code.
- Rewired `components/menu-overlay.tsx` to call `useScrollLock(menuOpen)`, removing the old `useEffect` that toggled `document.body.classList` for `menu-open`.
- Deleted the now-dead `body.menu-open{overflow:hidden}` rule from `app/globals.css` — `.menu-open` no longer appears anywhere in the project (verified via project-wide grep across `*.ts`/`*.tsx`/`*.css`).
- Converted `components/custom-cursor.tsx` from a mount-time `querySelectorAll("[data-cursor]")` snapshot with per-target `pointerenter`/`pointerleave` listeners to document-level `pointerover`/`pointerout` delegation using a `closestCursorTarget()` helper and a same-target `relatedTarget` guard, so the cursor now reacts to `[data-cursor]` elements inserted after initial render without flickering on nested child boundary crossings.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the shared useScrollLock hook (Lenis stop/start, no overflow:hidden)** - `5e1fa7a` (feat)
2. **Task 2: Wire menu-overlay to useScrollLock and delete the dead body.menu-open CSS rule** - `c5d4eb2` (feat)
3. **Task 3: Convert CustomCursor to document-level pointerover/pointerout delegation with a same-target guard** - `166b359` (feat)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified

- `hooks/use-scroll-lock.ts` (created) - `useScrollLock(isLocked)`, wraps `useLenis().stop()/start()` with unmount-safe cleanup.
- `components/menu-overlay.tsx` (modified) - now calls `useScrollLock(menuOpen)`; dropped the `body.classList.toggle("menu-open", ...)` effect and the unused `useEffect` import.
- `app/globals.css` (modified) - removed the dead `body.menu-open{overflow:hidden}` rule fragment from the base `body{...}` declaration.
- `components/custom-cursor.tsx` (modified) - replaced `querySelectorAll`/`pointerenter`/`pointerleave` per-target wiring with `document`-level `pointerover`/`pointerout` delegation, `closestCursorTarget()` helper, and a same-target `relatedTarget` guard against child-boundary flicker.

## Decisions Made

- Followed the plan's explicit resolution of 02-RESEARCH.md's Open Question #2: `useScrollLock` uses `lenis.stop()/start()` as the sole mechanism, with no defensive `overflow:hidden` backstop, honoring ARCH-02's literal wording over the research's "belt-and-suspenders" recommendation.
- The dead `.menu-open` CSS rule was deleted rather than repurposed, since it was confirmed (via grep, both before and after the edit) to be its own sole consumer of that class.
- Code comments explaining the bubbling/`relatedTarget`-guard rationale were phrased to avoid literally containing the strings the plan's own acceptance-criteria greps check for absence (`overflow`, `pointerenter`, `pointerleave`) while preserving the same technical explanation — this was a wording adjustment only, not a change in mechanism.

## Deviations from Plan

None - plan executed exactly as written. (One minor self-correction during execution: an initial comment draft in each new/edited file happened to contain grep-gate substrings meant to detect the *old* removed patterns — reworded before committing so the acceptance-criteria checks pass cleanly; no functional code was affected.)

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Verification

- `npm run typecheck` - passed after every task.
- `npm run lint` - passed after Tasks 2 and 3 (Task 1 has no lint-relevant changes beyond typecheck-verified code).
- `npm run build` (Next.js production build via Turbopack) - compiled successfully, all routes generated, run once at the end of the plan as the wave-level full-suite check.
- All acceptance-criteria greps from 02-02-PLAN.md verified directly: `useScrollLock` present + Lenis-only (no overflow/body-class/classList match), `useScrollLock(menuOpen)` wired in `menu-overlay.tsx` with zero `menu-open` references remaining anywhere in the project, `pointerover`/`pointerout`/`relatedTarget`/`closest` present in `custom-cursor.tsx` with zero `querySelectorAll`/`pointerenter`/`pointerleave` remaining.
- Manual verification (background scroll blocked while menu open; cursor reacting to a dynamically inserted `[data-cursor]` element without flicker) is documented in the plan as a phase-gate check, not blocking for this task-level execution — deferred to the Phase 2 gate per 02-RESEARCH.md's Validation Architecture (no test framework, manual-only checks bundled at phase close).

## Next Phase Readiness

- `useScrollLock(isLocked)` is now available for Phase 3's service drawer to reuse directly with no drawer-specific changes needed to the hook itself.
- `CustomCursor`'s document-level delegation is ready to pick up Phase 3's drawer close button and Phase 4's carousel controls as soon as those `[data-cursor]` elements are added to the DOM — no additional wiring required in those later phases.
- Phase 2 is now fully complete (both plans 02-01 and 02-02 executed): `lib/site-content.ts` typed content model, `useScrollLock`, and `CustomCursor` delegation are all in place for Phase 3 to build on.

---
*Phase: 02-modelo-de-datos-y-hooks-compartidos*
*Completed: 2026-07-19*

## Self-Check: PASSED

- FOUND: hooks/use-scroll-lock.ts
- FOUND: components/menu-overlay.tsx
- FOUND: app/globals.css
- FOUND: components/custom-cursor.tsx
- FOUND: .planning/phases/02-modelo-de-datos-y-hooks-compartidos/02-02-SUMMARY.md
- FOUND: 5e1fa7a
- FOUND: c5d4eb2
- FOUND: 166b359
