---
phase: 01-motion-foundation-architecture-cleanup
plan: 04
subsystem: page-sections
tags: [react, gsap, intersection-observer, video]
requires: [01-01, 01-02]
provides:
  - Standalone HeroSection with ref-owned drone video controls
  - Standalone ManifestoSection
  - Standalone CapabilitiesSection with moving band
affects: [01-06]
tech-stack:
  added: []
  patterns: [section-scoped useGSAP lifecycle, ref-owned media controls]
key-files:
  created:
    - components/sections/hero-section.tsx
    - components/sections/manifesto-section.tsx
    - components/sections/capabilities-section.tsx
  modified: []
key-decisions:
  - "useGSAP remains a lifecycle wrapper around the existing reveal observer; no GSAP-native animation was introduced."
  - "The video toggle remains a sibling of the hero section and controls the video through a React ref."
requirements-completed: [ARCH-02]
duration: 5 min
completed: 2026-07-18
---

# Phase 1 Plan 04: First Page Sections Summary

**Hero, manifesto, and capabilities are isolated client sections with scoped reveal ownership and unchanged page markup.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-18T07:05:00Z
- **Completed:** 2026-07-18T07:10:15Z
- **Tasks:** 3
- **Files created:** 3

## Accomplishments

- Extracted the full hero, preserved its drone video, parallax marker, copy, and separate absolute video control.
- Replaced the hero video's global DOM lookup with a local `HTMLVideoElement` ref.
- Extracted manifesto and capabilities markup without content or layout changes.
- Scoped the behavior-identical reveal observer to each section through `useGSAP`.
- Kept all three components unmounted until the coordinated switchover in plan 06.

## Task Commits

1. **Task 1: Extract HeroSection** — `c5e904d`
2. **Task 2: Extract ManifestoSection** — `0c72a2a`
3. **Task 3: Extract CapabilitiesSection** — `b622938`
4. **Verification fix: Defer reduced-motion state update for React lint** — `e4b29ec`

## Files Created/Modified

- `components/sections/hero-section.tsx` — Hero markup, scoped reveals, reduced-motion pause, and ref-owned video toggle.
- `components/sections/manifesto-section.tsx` — Statement markup and scoped reveals.
- `components/sections/capabilities-section.tsx` — Services list, moving band, and scoped reveals.

## Decisions & Deviations

- React's `set-state-in-effect` lint rule rejected the plan's synchronous reduced-motion state update. The update now runs through a zero-delay timer with explicit cleanup, preserving the visible behavior while satisfying the project gate.

## Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- No `document.querySelector` remains in HeroSection.
- No `gsap.from`, `gsap.to`, or `ScrollTrigger.create` was introduced in the extracted sections.
- Observer threshold and root margin remain `0.12` and `0px 0px -8% 0px`.

## Self-Check: PASSED

## Next Phase Readiness

Ready to extract technology, process, and contact sections in plan 01-05.
