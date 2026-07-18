---
phase: 01-motion-foundation-architecture-cleanup
plan: 06
subsystem: application-composition
tags: [nextjs, lenis, gsap, architecture]
requires: [01-03, 01-04, 01-05]
provides:
  - Single root SmoothScrollProvider mount
  - Composition-only page root
  - Removal of the monolithic Experience runtime
affects: [01-07]
tech-stack:
  added: []
  patterns: [server-layout client-boundary, coordinated runtime switchover]
key-files:
  created:
    - app/layout.tsx
  modified:
    - app/page.tsx
  deleted:
    - components/experience.tsx
key-decisions:
  - "Provider activation and Experience removal landed in one commit to prevent any dual-frame-loop state."
  - "The server layout owns one client provider boundary and imports the official Lenis stylesheet globally."
requirements-completed: [FOUND-01, FOUND-02, FOUND-03, ARCH-02]
duration: 2 min
completed: 2026-07-18
---

# Phase 1 Plan 06: Coordinated Runtime Switchover Summary

**The application now runs through one Lenis/GSAP provider and a composition-only page, with the old Experience monolith removed.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-07-18T07:12:10Z
- **Completed:** 2026-07-18T07:14:02Z
- **Tasks:** 2, committed atomically
- **Files changed:** 3

## Accomplishments

- Mounted `SmoothScrollProvider` exactly once from the server layout and loaded Lenis's official global CSS.
- Replaced all inline page sections with the six extracted section components in their original order.
- Rendered intro, menu, and cursor exactly once outside the main content.
- Preserved `force-static`, footer markup, and the `LOCAL · 2` environment badge.
- Deleted `components/experience.tsx`, removing its competing reveal, parallax, cursor, menu, and video ownership.

## Task Commits

1. **Tasks 1–2: Mount provider, compose page, and remove Experience as one safe switchover** — `5e2b189`

## Files Created/Modified

- `app/layout.tsx` — Root provider mount and Lenis stylesheet import.
- `app/page.tsx` — Ordered composition of global chrome and six sections.
- `components/experience.tsx` — Removed after all responsibilities moved to owned components.

## Decisions & Deviations

- The two planned tasks were intentionally committed together. A separate provider-mount commit would have activated Lenis while the old Experience animation loop was still live, violating the single-loop invariant documented by the research and plan objective.

## Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- Exactly one `<SmoothScrollProvider>` mount exists.
- No Experience import or render remains.
- The only application `requestAnimationFrame` call is in `hooks/use-legacy-parallax.ts`.
- The only ReactLenis integration is inside the root provider.

## Self-Check: PASSED

## Next Phase Readiness

The architecture is live and ready for the full build and browser regression gate in plan 01-07.
