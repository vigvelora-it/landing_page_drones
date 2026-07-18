---
phase: 1
slug: motion-foundation-architecture-cleanup
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-18
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — no test runner configured (`package.json` has no `test` script; `.planning/codebase/CONCERNS.md` confirms "No Unit Tests," "No E2E Tests"). Automated tests are explicitly Out of Scope for this milestone per `.planning/REQUIREMENTS.md`. |
| **Config file** | none |
| **Quick run command** | `npm run lint` (~30s), `npm run typecheck` (< 30s) |
| **Full suite command** | `npm run build` (full production build, includes type-check + static generation) |
| **Estimated runtime** | ~60-90 seconds for lint+typecheck+build combined |

---

## Sampling Rate

- **After every task commit:** No formal gate mid-phase per CONTEXT.md D-02 (YOLO mode, verify once at end). `npm run typecheck` is cheap and recommended informally between major sub-steps to avoid a large multi-file diff producing a hard-to-localize error at the final check.
- **After every plan wave:** N/A — single-wave-style phase per D-02.
- **Before `/gsd-verify-work`:** `npm run lint` + `npm run typecheck` + `npm run build` all green, plus manual visual comparison at 1440×900 and 390×844.
- **Max feedback latency:** ~90 seconds (full build command).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-XX | 01 | 1 | FOUND-01 | — | Single frame loop, no hydration/console errors from Lenis+GSAP wiring | build + manual | `npm run build` then manual fast-scroll-flick visual check | N/A — manual-only per D-02 | ⬜ pending |
| 01-01-XX | 01 | 1 | FOUND-02 | — | Reduced-motion toggles Lenis lerp 0.07→0.15, GSAP timelines soften (not off) | manual | DevTools "Emulate CSS prefers-reduced-motion: reduce" toggle, visual/feel check | N/A — manual-only | ⬜ pending |
| 01-01-XX | 01 | 1 | FOUND-03 | — | Clean build, no SSR/hydration errors | automated | `npm run build` (exit code 0, no console warnings) | N/A — build command is the check | ⬜ pending |
| 01-01-XX | 01 | 1 | ARCH-01 | T-01-01 | Form markup + handler co-located, no `FormConnector`/`querySelector`, no dead `.form-event-bridge` | code review + build | `npm run typecheck`; grep for `document.querySelector` and `form-event-bridge` in `contact-form.tsx` (expect zero matches) | N/A — manual code review, no live submission test per D-03 | ⬜ pending |
| 01-01-XX | 01 | 1 | ARCH-02 | — | `experience.tsx` decomposed, each section has own scoped `useGSAP`; parallax rAF loop and cursor listener stay single shared instances (not duplicated per-section) | code review + build | `npm run build`; grep for `experience.tsx` imports (expect zero after deletion) | N/A | ⬜ pending |
| 01-01-XX | 01 | 1 | ARCH-03 | T-01-02 | Legacy v4 files moved to `referencias/`, zero effect on live site | build + manual | `npm run build`; grep for `v4-template`/`v4-interactions`/`landing-page-v4` imports (expect zero) | N/A — pre-verified unreferenced in 01-RESEARCH.md | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Task IDs are placeholders (`01-01-XX`) — the planner assigns final task IDs; this map's Req→Test mapping is what matters and carries forward regardless of exact task numbering.*

---

## Wave 0 Requirements

*None — no test framework install needed. Explicitly out of scope for this phase and this project's v1 milestone (`.planning/REQUIREMENTS.md` Out of Scope table: "Tests automatizados (unit/E2E)"). Existing build tooling (`eslint`, `tsc --noEmit`, `next build`) fully covers this phase's verification needs per the project's own decided workflow (CONTEXT.md D-02).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Scroll feels physically smooth, single frame loop, no jitter | FOUND-01 | No automated test framework in project; "feels smooth" is not a build-checkable assertion | Scroll with mouse wheel and trackpad on desktop; fast-flick scroll to check for desync/double-scroll artifacts |
| Reduced-motion softens (not disables) Lenis + GSAP | FOUND-02 | Requires OS/DevTools-level media query emulation, not testable via build | Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce" → verify scroll snappier (lerp 0.15) and GSAP timelines shorter/gentler, not fully frozen nor full-intensity |
| No visual regression from component decomposition | ARCH-02 | UI-SPEC contract is "nothing may look different" — only a human visual comparison confirms this | Compare desktop (1440×900) and mobile (390×844) screenshots/live view before and after decomposition; confirm pixel-equivalent layout |
| Contact form submits correctly end-to-end | ARCH-01 | No `.env.local` with Supabase credentials exists in this environment (per CONTEXT.md D-03) | Deferred — code-level check only this phase (schema match, no `FormConnector`); live submission test requires test credentials, out of scope for Phase 1 |

---

## Validation Sign-Off

- [x] All tasks have manual or build-command verify (no unit-test framework exists or is being added this phase — explicit project decision)
- [x] Sampling continuity: N/A — single end-of-phase gate per D-02, not per-task automated sampling
- [x] Wave 0 covers all MISSING references — none required
- [x] No watch-mode flags
- [x] Feedback latency < 90s (full build command)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-18 (build-level + manual-visual strategy matches project's explicit "no automated tests" decision; see `.planning/REQUIREMENTS.md` Out of Scope and `01-CONTEXT.md` D-02/D-03)
