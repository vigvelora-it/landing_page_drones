---
phase: 4
slug: header-sticky-y-carrusel-de-equipos
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-20
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — automated unit/E2E tests are explicitly Out of Scope for this milestone (`REQUIREMENTS.md`). No test config, no test runner in `package.json`, confirmed this session. |
| **Config file** | none |
| **Quick run command** | `npm run lint && npm run typecheck` |
| **Full suite command** | `npm run build` (verifies the `force-static` prerender path still succeeds with the new hook/component) |
| **Estimated runtime** | ~60-90 seconds |

---

## Sampling Rate

- **Per task commit:** `npm run lint && npm run typecheck`
- **Per wave merge:** `npm run build` (production build — catches `force-static` prerender + `next/image` static-import edge cases)
- **Phase gate:** Full 6-step manual HEAD-02 stress sequence (below) must be run and pass before considering the phase done — this is the phase's own explicit, named acceptance criterion.
- **Max feedback latency:** ~90 seconds (full build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-XX | 04-01 | 1 | HEAD-01 | — | `.site-header` gains `.is-scrolled` past 80px scroll, via `ScrollTrigger.create({toggleClass})`, no second scroll listener | manual + grep | `grep -c "addEventListener(\"scroll\"" -r components/ hooks/` → only the pre-existing `use-legacy-parallax.ts` hit, zero new ones; manual scroll test for `.is-scrolled` toggle | N/A — manual-only, no test file | ⬜ pending |
| 04-01-XX | 04-01 | 1 | HEAD-02 | — | Header verified with drawer open/closed and carousel present, no `overflow-x`/sticky breakage | manual | Full 6-step stress sequence (see Manual-Only Verifications below) | N/A — manual-only | ⬜ pending |
| 04-02-XX | 04-02 | 2 | EQUIP-01 | — | Carousel keyboard/touch parity, `data-lenis-prevent` on track, no auto-advance | manual + grep | `grep -ri "autoplay" components/equipment-carousel.tsx` → zero hits; manual keyboard/touch/dot navigation test | N/A — manual-only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs are placeholders — the planner's actual task IDs carry the authoritative numbering; this map's Req→Test mapping is what matters.*

---

## Wave 0 Requirements

*None — no test framework install needed. Explicitly out of scope per `.planning/REQUIREMENTS.md`. This gap is inherent and already acknowledged project-wide (see Phase 3's identical manual-verification precedent for drawer focus management).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Header scroll-reactive toggle | HEAD-01 | No automated visual-state test exists in this project | Scroll down past ~80px — confirm `.site-header` gains solid background/shadow (`.is-scrolled` class). Scroll back to top — confirm it reverts. |
| Header + drawer + carousel stress test (6 steps) | HEAD-02 | This is the phase's own named acceptance criterion; only a live interaction sequence can rule out the `overflow-x`/`position:sticky`/Lenis conflict class this milestone's research repeatedly flags | 1) Fast-flick scroll the full page, confirm no double-scroll/jitter and header toggles correctly. 2) Open the Phase 3 service drawer, scroll the (inert) background — confirm header still toggles correctly and no horizontal scrollbar appears. 3) Close drawer, scroll to the Technology section's `.tech-sticky` pinned block — confirm it still pins/releases correctly with the carousel present below it. 4) With the carousel in view, confirm the header's sticky/toggle behavior is unaffected by the carousel's own horizontal scroll container. 5) Tab through the carousel's prev/next/dot controls via keyboard, and swipe on a touch-emulated viewport — confirm both work. 6) Emulate `prefers-reduced-motion: reduce` — confirm carousel click/dot navigation still works (jump-only, no smooth animation) and drag physics are unaffected. |
| Carousel keyboard/touch/dot navigation | EQUIP-01 | No automated interaction test exists in this project | Tab to the carousel's prev/next buttons and dot indicators — confirm all are reachable and operable via Enter/Space. On a touch-emulated viewport, swipe left/right on the slide track — confirm it advances. Confirm no auto-advance occurs on page load (carousel stays on slide 1 until the user interacts). |

---

## Validation Sign-Off

- [x] All tasks have manual or grep/build-command verify (no unit-test framework exists or is being added this phase — explicit project decision)
- [x] Sampling continuity: N/A — single end-of-phase gate per project's established pattern
- [x] Wave 0 covers all MISSING references — none required
- [x] No watch-mode flags
- [x] Feedback latency < 90s (full build)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-20 (manual-interaction + grep/build strategy matches project's explicit "no automated tests" decision and this phase's scroll/interaction-behavior nature, which has no automated equivalent in this codebase; see `.planning/REQUIREMENTS.md` Out of Scope and `04-RESEARCH.md` Validation Architecture)
