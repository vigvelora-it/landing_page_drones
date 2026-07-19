---
phase: 1
slug: fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado
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
| **Framework** | None installed — `package.json` has no `jest`/`vitest`/`playwright`. Automated tests are explicitly Out of Scope for this milestone (`REQUIREMENTS.md`). |
| **Config file** | none |
| **Quick run command** | `npm run lint && npm run typecheck` |
| **Full suite command** | `npm run build` (production build — closest thing to an integration check; several past regressions in this codebase only surface in production build, not `next dev`) |
| **Estimated runtime** | ~60-90 seconds |

---

## Sampling Rate

- **Per task commit:** `npm run lint && npm run typecheck` (cheap, informal, recommended between major sub-steps per this milestone's YOLO/end-of-phase-verification pattern)
- **Per wave/phase merge:** `npm run build` + manual visual/contrast pass
- **Phase gate:** all grep audits below return the expected hit count (zero outside comments/archive), and a full-page scroll-through at 1440px and 375px shows no dark backgrounds, no washed-out/illegible text, consistent reveal timing.
- **Max feedback latency:** ~90 seconds (full build command)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-XX | 01 | 1 | THEME-01 | — | Light/celeste palette, single restricted accent, no dark backgrounds remain | manual visual + grep audit | `npm run build`; `grep -n "#0c0e12\|#0c0f12\|#0a0c0f\|#080a0d\|--ink:\|--soft:\|--paper:\|--orange:\|--hot:" app/globals.css` → expect zero hits outside comments | N/A — manual gate | ⬜ pending |
| 01-01-XX | 01 | 1 | THEME-02 | — | All text/background/focus-ring pairs meet WCAG AA (4.5:1 / 3:1) | manual contrast-tool check | Verify each pair in UI-SPEC's Color section against a contrast checker (e.g. WebAIM), including the 6 newly-flagged `--ink`-on-accent pairings (`.circle-link:hover`, `.service-row:hover`, `.submit-button`, `.custom-cursor`, `::selection`) not pre-verified in the UI-SPEC | N/A — manual gate | ⬜ pending |
| 01-01-XX | 01 | 1 | THEME-03 | — | Zero surviving dark-theme literals/blend-modes/filters | grep audit | `grep -n "mix-blend-mode\|backdrop-filter\|filter:" app/globals.css` reviewed line-by-line against this phase's full migration catalogue (UI-SPEC Retirement Checklist + 01-RESEARCH.md's 8 additional findings: `.intro` splash, 3 extra near-black hex families, `.contact-backdrop img` grayscale filter, `.contact-section:before` glow, 3 extra `infinite` animations) | `npm run lint` (confirms no `.tsx` regression from any incidental touch) | N/A | ⬜ pending |
| 01-01-XX | 01 | 1 | THEME-04 | — | Literal "moderate motion" spec applied consistently: Lenis lerp 0.1/0.15, translate ≤24px, duration ≤700ms, stagger cap 60ms/6-sibling, no pin/scrub | manual + source check | Verify `lib/motion-preferences.ts`'s `LENIS_LERP.normal` changed to `0.1`; verify new CSS custom properties (`--motion-distance-max`, `--motion-duration-base`, etc.) exist and are referenced; confirm no `pin:`/`scrub:` in any `ScrollTrigger`/ GSAP call | `npm run typecheck` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs are placeholders (`01-01-XX`) — the planner assigns final task IDs; this map's Req→Test mapping carries forward regardless of exact task numbering.*

---

## Wave 0 Requirements

*None — no test framework install needed. Explicitly out of scope per `.planning/REQUIREMENTS.md` and this milestone's already-decided workflow. Verification is entirely grep-audit + manual visual/contrast-tool based, per `01-RESEARCH.md`'s Validation Architecture section.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No dark backgrounds anywhere, including `.intro` splash | THEME-01, THEME-03 | Requires full-page visual scroll-through; grep catches CSS literals but not rendered visual result | Load the site fresh (triggers intro), scroll through all sections at 1440px and 375px, confirm zero dark surfaces including the intro splash overlay |
| WCAG AA contrast on all text/background/focus-ring pairs | THEME-02 | Requires a contrast-checking tool (e.g. WebAIM contrast checker) applied to each pair, not just a build-pass | Check all pairs listed in UI-SPEC Color section, plus the 6 newly-flagged `--ink`-on-accent pairings from `01-RESEARCH.md` |
| Consistent "moderate" motion feel across sections | THEME-04 | "Feels moderate, not cinematic" is not a build-checkable assertion | Scroll through the site, confirm reveal timing/distance feels consistent (not per-section-varying), confirm no infinite-loop animations remain uncontrolled (`.pulse-dot`, `.scroll-cue i:after`, `.intro-brand span`, `.hero-orbit`, `.moving-band`) |
| Hero text legibility after filter/scrim removal | THEME-02, THEME-03 | Visual legibility check against real (currently dark-tuned) photography, open design question flagged by research | Confirm hero heading/subheading text remains readable against the un-filtered hero media; if not, apply a light-theme-appropriate legibility treatment (not a reintroduced dark filter) |

---

## Validation Sign-Off

- [x] All tasks have manual or grep/build-command verify (no unit-test framework exists or is being added this phase — explicit project decision)
- [x] Sampling continuity: N/A — single end-of-phase gate per project's established YOLO pattern
- [x] Wave 0 covers all MISSING references — none required
- [x] No watch-mode flags
- [x] Feedback latency < 90s (full build command)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-18 (grep-audit + manual-visual strategy matches project's explicit "no automated tests" decision and this phase's pure-CSS/constant-migration nature; see `.planning/REQUIREMENTS.md` Out of Scope and `01-CONTEXT.md`)
