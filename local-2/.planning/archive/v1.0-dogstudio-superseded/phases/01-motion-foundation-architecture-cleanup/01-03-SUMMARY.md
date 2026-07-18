---
phase: 01-motion-foundation-architecture-cleanup
plan: 03
subsystem: global-chrome
tags: [react, intro, menu, cursor]
requires: []
provides:
  - Standalone IntroSequence component
  - Standalone header and MenuOverlay component
  - Single-instance CustomCursor component
affects: [01-06]
tech-stack:
  added: []
  patterns: [global chrome components, StrictMode-safe listener cleanup]
key-files:
  created:
    - components/intro-sequence.tsx
    - components/menu-overlay.tsx
    - components/custom-cursor.tsx
  modified: []
key-decisions:
  - "Header and overlay remain one component because they share menuOpen state."
  - "Cursor uses a local ref for its rendered element but retains one global target listener set."
requirements-completed: [ARCH-02]
duration: 3 min
completed: 2026-07-18
---

# Phase 1 Plan 03: Global Chrome Extraction Summary

**Intro, navigation overlay, and contextual cursor now have isolated client components with behavior-identical state and cleanup.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-18T07:01:46Z
- **Completed:** 2026-07-18T07:04:51Z
- **Tasks:** 3
- **Files created:** 3

## Accomplishments

- Preserved the intro's 1450ms/100ms timing and exact markup in `IntroSequence`.
- Preserved the menu's body class, five anchors, accessibility state, and close-on-navigation behavior in one component.
- Preserved the contextual cursor interaction with complete pointer listener cleanup while replacing only the cursor element query with a React ref.
- Kept all three components unmounted until the coordinated composition switchover in plan 06.

## Task Commits

1. **Task 1: Extract IntroSequence** — `4f2b7ad`
2. **Task 2: Extract MenuOverlay** — `d591784`
3. **Task 3: Extract CustomCursor** — `6db68ad`

## Files Created/Modified

- `components/intro-sequence.tsx` — Intro state, timer, and overlay markup.
- `components/menu-overlay.tsx` — Header, menu state, overlay navigation, and body class cleanup.
- `components/custom-cursor.tsx` — One cursor instance and global pointer target handling.

## Decisions & Deviations

None — plan executed as specified. Video reduced-motion ownership remains with the future HeroSection, avoiding a new selector from IntroSequence.

## Verification

- `npm run typecheck` — passed after each extraction.
- `npm run lint` — passed after the full plan.
- No Lenis scroll lock was introduced in the menu.
- Cursor add/remove listener pairs and all five menu anchors were verified structurally.

## Self-Check: PASSED

## Next Phase Readiness

Wave 1 is complete. Ready for section extraction in plans 01-04 and 01-05.
