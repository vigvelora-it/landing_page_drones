---
phase: 01-motion-foundation-architecture-cleanup
plan: 02
subsystem: motion-foundation
tags: [gsap, lenis, scrolltrigger, reduced-motion]
requires: []
provides:
  - Pinned GSAP, Lenis, and @gsap/react dependencies
  - Central plugin registration and motion preference tokens
  - Unmounted single-loop SmoothScrollProvider
  - Shared legacy parallax hook for the coordinated switchover
affects: [01-04, 01-05, 01-06, phase-2]
tech-stack:
  added: [gsap@3.15.0, lenis@1.3.25, @gsap/react@2.1.2]
  patterns: [gsap-ticker-driven Lenis, ReactLenis lifecycle recreation, centralized plugin registration]
key-files:
  created:
    - lib/gsap.ts
    - lib/motion-preferences.ts
    - hooks/use-legacy-parallax.ts
    - components/providers/smooth-scroll-provider.tsx
  modified:
    - package.json
    - package-lock.json
key-decisions:
  - "Lenis uses autoRaf:false and is driven only by gsap.ticker with matching cleanup."
  - "Reduced-motion switches ReactLenis between 0.07 and 0.15 through supported React lifecycle instead of mutating internal options."
  - "anchors:true preserves the site's real in-page links."
requirements-completed: [FOUND-01, FOUND-02, FOUND-03]
duration: 5 min
completed: 2026-07-18
---

# Phase 1 Plan 02: Motion Foundation Summary

**The pinned GSAP/Lenis stack and a StrictMode-safe, single-ticker scroll provider are ready for the coordinated root switchover.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-18T06:56:59Z
- **Completed:** 2026-07-18T07:01:45Z
- **Tasks:** 3
- **Files created/modified:** 6

## Accomplishments

- Passed the supply-chain checkpoint using registry evidence: official repositories, high adoption, no deprecation, and no install lifecycle scripts; npm audit found zero vulnerabilities.
- Installed exact versions of GSAP, Lenis, and the official React binding.
- Centralized `ScrollTrigger`/`useGSAP` registration and locked the 0.07/0.15 Lenis lerp pair.
- Built an unmounted `ReactLenis` provider whose active instance is fed by one GSAP ticker callback and recreated safely when reduced-motion changes.
- Ported the existing page-wide parallax loop into one shared temporary hook without converting its behavior ahead of Phase 2.

## Task Commits

1. **Task 1: Package legitimacy gate** — approved from recorded user authorization; read-only evidence, no commit.
2. **Task 2: Install stack and create shared libraries** — `b15f772`
3. **Task 3: Build legacy parallax hook and provider** — `d3fc49d`

## Files Created/Modified

- `lib/gsap.ts` — Registers and re-exports GSAP, ScrollTrigger, and useGSAP.
- `lib/motion-preferences.ts` — Exposes locked normal/reduced lerp values.
- `hooks/use-legacy-parallax.ts` — Single shared port of the current parallax behavior.
- `components/providers/smooth-scroll-provider.tsx` — ReactLenis, anchor support, ticker bridge, and live reduced-motion mode.
- `package.json` / `package-lock.json` — Exact dependency versions and registry integrity.

## Decisions & Deviations

The implementation uses a nested `LenisGsapBridge` and ReactLenis option-driven recreation. This resolves the research question without relying on undocumented mutable options. No scope deviation.

## Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm ls` confirms `gsap@3.15.0`, `lenis@1.3.25`, and `@gsap/react@2.1.2`.
- Provider contains one `ticker.add` with the exact `ticker.remove` cleanup, `autoRaf:false`, and `anchors:true`.
- Provider is intentionally not mounted under `app/` yet; the active app still has only its original loop.

## Self-Check: PASSED

## Next Phase Readiness

Ready for chrome extraction (01-03), then section decomposition and the coordinated provider switchover.
