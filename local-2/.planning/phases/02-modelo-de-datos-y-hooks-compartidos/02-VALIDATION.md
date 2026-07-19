---
phase: 2
slug: modelo-de-datos-y-hooks-compartidos
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-19
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — automated unit/E2E tests are explicitly Out of Scope for this project (`REQUIREMENTS.md`, `CONCERNS.md`). |
| **Config file** | none |
| **Quick run command** | `npm run typecheck` (fast, catches field-rename/type-mismatch errors immediately) |
| **Full suite command** | `npm run lint && npm run typecheck && npm run build` |
| **Estimated runtime** | ~60-90 seconds for the full suite |

---

## Sampling Rate

- **Per task commit:** `npm run typecheck`
- **Per wave merge:** `npm run lint && npm run typecheck && npm run build`
- **Phase gate:** Full suite green + the two manual DOM checks below (ARCH-02, ARCH-03), before considering the phase done.
- **Max feedback latency:** ~90 seconds (full suite)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-XX | 02-01 | 1 | ARCH-01 | — | `lib/site-content.ts` exports typed `services`/`team`/`projects`/`brochure`; `capabilities-section.tsx` still compiles against preserved `number`/`title`/`detail` field names | typecheck | `npm run typecheck` | N/A — no test file, type-level gate | ⬜ pending |
| 02-02-XX | 02-02 | 1 | ARCH-02 | — | `useScrollLock` calls `lenis.stop()/start()` only (no `overflow:hidden`/body-class backstop); `menu-overlay.tsx` uses it; background scroll blocked while menu open | manual + grep | Open menu, attempt wheel/touch/keyboard/scrollbar-drag scroll on background → confirm none move the page; close menu → confirm scroll resumes. `grep -n "overflow\|document.body\|classList" hooks/use-scroll-lock.ts` → zero hits | N/A — manual-only per project's no-tests policy | ⬜ pending |
| 02-02-XX | 02-02 | 1 | ARCH-03 | — | `custom-cursor.tsx` uses `pointerover`/`pointerout` event delegation (not `pointerenter`/`pointerleave`, not mount-time `querySelectorAll`) with a same-target `relatedTarget` guard; reacts correctly to a `[data-cursor]` element inserted after mount | manual + grep | DevTools console: insert a new `[data-cursor]` element after mount, hover it, confirm cursor reacts. `grep -n "querySelectorAll\|pointerenter\|pointerleave" components/custom-cursor.tsx` → zero hits | N/A — manual-only per project's no-tests policy | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs are placeholders — the planner's actual task IDs in 02-01-PLAN.md/02-02-PLAN.md carry the authoritative numbering; this map's Req→Test mapping is what matters.*

---

## Wave 0 Requirements

*None — no test framework install needed. Explicitly out of scope per `.planning/REQUIREMENTS.md`. Verification is typecheck/build (automated) plus two short manual DOM checks, consistent with how Phase 1 was verified.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Background scroll fully blocked while menu is open, resumes on close | ARCH-02 | No automated test framework; Lenis's `stop()` has documented edge cases (scrollbar drag, some keyboard paths per Lenis GitHub issues #310/#107) that only a real interaction check can confirm | Open the menu overlay, try mouse wheel, touch/trackpad swipe, arrow keys, and scrollbar drag on the background — confirm none scroll the page. Close the menu, confirm normal scroll resumes immediately. |
| Cursor reacts correctly to a dynamically-inserted `[data-cursor]` element | ARCH-03 | Proves the event-delegation fix actually solves the problem it was built for (elements added after mount, e.g. by the future drawer/carousel) — not just that the code compiles | In DevTools console on the live page, insert a new element with `data-cursor` attribute into the DOM after initial load, then hover over it — confirm the custom cursor responds (grows/shows label) exactly as it does for elements present at mount. |

---

## Validation Sign-Off

- [x] All tasks have manual or typecheck/grep-command verify (no unit-test framework exists or is being added this phase — explicit project decision)
- [x] Sampling continuity: N/A — single end-of-phase gate per project's established pattern
- [x] Wave 0 covers all MISSING references — none required
- [x] No watch-mode flags
- [x] Feedback latency < 90s (full suite)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-19 (typecheck/build + manual DOM checks strategy matches project's explicit "no automated tests" decision and this phase's pure data/hook nature; see `.planning/REQUIREMENTS.md` Out of Scope and `02-RESEARCH.md` Validation Architecture)
