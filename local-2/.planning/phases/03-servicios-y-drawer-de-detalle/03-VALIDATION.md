---
phase: 3
slug: servicios-y-drawer-de-detalle
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-20
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — automated unit/E2E tests are explicitly Out of Scope for this milestone (`REQUIREMENTS.md`, `CONCERNS.md`). No test config, no test runner in `package.json`. |
| **Config file** | none |
| **Quick run command** | `npm run lint && npm run typecheck` |
| **Full suite command** | `npm run lint && npm run typecheck && npm run build` |
| **Estimated runtime** | ~60-90 seconds |

---

## Sampling Rate

- **Per task commit:** `npm run lint && npm run typecheck`
- **Per wave merge:** `npm run build` (production build — several past regressions in this milestone only surfaced there, not in `npm run dev`)
- **Phase gate:** Full suite green + the three manual verification rows below, walked through explicitly (none have an automated substitute).
- **Max feedback latency:** ~90 seconds (full suite)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-XX | 03-01 | 1 | SERV-01 | — | 5 rows render as distinct clickable units, not flowing text | manual + typecheck | `npm run typecheck` (structural safety net); visual scan for 5 independently clickable/hoverable rows | N/A — manual-only per project's no-tests policy | ⬜ pending |
| 03-02-XX | 03-02 | 1 | SERV-02 | — | Click row → drawer opens via `showModal()` with that service's data; Esc/backdrop/close-button all close it; focus starts on close button, returns to trigger on close; background unreachable via Tab/click while open | manual | Tab through page with drawer open (background unreachable); confirm focus lands on close button on open, returns to trigger row on close; click backdrop and press Esc, confirm both animate-close correctly | N/A — manual-only, no automated interaction/focus-order test exists in this project | ⬜ pending |
| 03-03-XX | 03-03 | 1 | SERV-03 | — | Opening drawer disables hamburger trigger (visual + `aria-disabled` + click no-op); opening menu disables every service row the same way; neither force-closes the other; scroll locked while either is open | manual | Open drawer, attempt to open menu (visually disabled, click no-ops); open menu, attempt to open drawer (same); confirm no background scroll via wheel/trackpad while either is open | N/A — manual-only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs are placeholders — the planner's actual task IDs in the PLAN.md files carry the authoritative numbering; this map's Req→Test mapping is what matters.*

---

## Wave 0 Requirements

*None — no test framework install needed. Explicitly out of scope per `.planning/REQUIREMENTS.md`. This gap is inherent and already acknowledged project-wide, not something this phase should attempt to fill unilaterally.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Drawer focus trap and focus-return | SERV-02 | Focus-order/keyboard-trap testing has no automated command in this project | Open a service drawer via click; confirm focus lands on the close button. Press Tab repeatedly — confirm focus cycles only within the drawer (never escapes to background content). Close via Esc — confirm focus returns exactly to the row that opened it. Repeat closing via backdrop click and via the close button — same focus-return expected both times. |
| Background truly unreachable while drawer is open | SERV-02 | Native `showModal()` + `inert` behavior can only be confirmed by actual interaction, not a build check | With drawer open, try clicking a background link/button — confirm no click registers. Try Tab-ing — confirm background elements never receive focus. |
| Drawer vs. menu mutual exclusivity | SERV-03 | No automated test framework; this is a live-interaction state machine check | With a service drawer open, click the hamburger menu trigger — confirm it's visually disabled (reduced opacity) and the click does nothing. Close the drawer, open the menu, then try clicking a service row — confirm the same disabled treatment in reverse. |
| Scroll lock consistency across both overlays | SERV-02, SERV-03 | Lenis `stop()`/`start()` interaction with two independent overlays needs a real scroll attempt, not a static check | With drawer open, scroll via wheel, trackpad, and (if applicable) keyboard — confirm the page behind does not move. Close the drawer — confirm normal scroll resumes immediately. Repeat for the menu overlay. |

---

## Validation Sign-Off

- [x] All tasks have manual or typecheck/lint/build-command verify (no unit-test framework exists or is being added this phase — explicit project decision)
- [x] Sampling continuity: N/A — single end-of-phase gate per project's established pattern
- [x] Wave 0 covers all MISSING references — none required
- [x] No watch-mode flags
- [x] Feedback latency < 90s (full suite)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-20 (manual-interaction + typecheck/lint/build strategy matches project's explicit "no automated tests" decision and this phase's focus-order/modal-behavior nature, which has no automated equivalent in this codebase; see `.planning/REQUIREMENTS.md` Out of Scope and `03-RESEARCH.md` Validation Architecture)
