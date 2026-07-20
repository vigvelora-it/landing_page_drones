---
phase: 03-servicios-y-drawer-de-detalle
plan: 03
subsystem: ui
tags: [overlay, mutual-exclusivity, inert, accessibility, css]

# Dependency graph
requires:
  - phase: 03-servicios-y-drawer-de-detalle
    plan: 01
    provides: "hooks/use-overlay-coordination.ts useOverlayCoordination/useOverlayOpen, components/service-drawer.tsx ServiceDrawer, app/globals.css drawer CSS block"
  - phase: 03-servicios-y-drawer-de-detalle
    plan: 02
    provides: "components/sections/capabilities-section.tsx service rows wired to useOverlayCoordination(\"drawer\", ...) and ServiceDrawer; hooks/use-overlay-coordination.ts getServerSnapshot fix"
provides:
  - "components/menu-overlay.tsx — calls useOverlayCoordination(\"menu\", menuOpen), disables .menu-toggle while drawer is open"
  - "components/inert-boundary.tsx — InertBoundary client wrapper toggling inert from useOverlayOpen(\"drawer\")"
  - "app/page.tsx — header + all non-CapabilitiesSection sections wrapped in InertBoundary"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "InertBoundary: display:contents wrapper toggling the inert attribute from a read-only useOverlayOpen selector, keeping layout unaffected while making SERV-02's 'inert en el fondo' wording grep-able in rendered DOM"

key-files:
  created:
    - components/inert-boundary.tsx
  modified:
    - components/menu-overlay.tsx
    - app/page.tsx
    - app/globals.css

key-decisions:
  - "Reworded an explanatory code comment in components/inert-boundary.tsx to avoid the literal string \"useOverlayCoordination\" (used to explain what the component deliberately does NOT call), since the plan's own acceptance criteria greps for zero hits of that exact string in the file — same class of self-referential grep gotcha Plan 01 hit with \"MutationObserver\"."

requirements-completed: [SERV-02, SERV-03]

# Metrics
duration: ~10min
completed: 2026-07-20
---

# Phase 3 Plan 3: Menu-Side Mutual Exclusivity + InertBoundary Summary

**Wired the mirror half of SERV-03 (hamburger disables while the drawer is open, via the same `useOverlayCoordination` store the drawer rows already use) and closed SERV-02's "inert en el fondo" wording with a new `InertBoundary` client wrapper around the header and every non-`CapabilitiesSection` section in `app/page.tsx`.**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-20
- **Tasks:** 2
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- `components/menu-overlay.tsx` now calls `const drawerOpen = useOverlayCoordination("menu", menuOpen)`, broadcasting the menu's own open state into the shared store (Plan 02's rows already read this) and reading back whether the drawer is open. The `.menu-toggle` button gets `aria-disabled={drawerOpen}` and its `onClick` is guarded with `if (drawerOpen) return` before toggling `menuOpen` — a real no-op, not just a visual/pointer-events block. The drawer is never force-closed from `MenuOverlay`.
- Appended `.menu-toggle[aria-disabled="true"]{opacity:.6;cursor:not-allowed;pointer-events:none;transition:opacity var(--motion-duration-fast)}` to `app/globals.css`, matching the existing `.service-row[aria-disabled]`/`.submit-button:disabled` visual convention exactly.
- Built `components/inert-boundary.tsx`: a `"use client"` wrapper exporting `InertBoundary({ children })`, reading `useOverlayOpen("drawer")` (the read-only selector from Plan 01 — never `useOverlayCoordination`, so it cannot clobber store state) and rendering `<div style={{ display: "contents" }} inert={drawerOpen || undefined}>{children}</div>`. `display:contents` keeps the wrapper box-free so layout is unaffected; `inert={... || undefined}` ensures the attribute is absent (not the string `"false"`) when the drawer is closed.
- Restructured `app/page.tsx` (still a Server Component, `force-static` preserved) into three `InertBoundary` groups: one wrapping `<MenuOverlay />`, one wrapping `<HeroSection />`/`<ManifestoSection />`, and one wrapping `<TechnologySection />`/`<ProcessSection />`/`<ContactSection />` — with `<CapabilitiesSection />` (and the drawer it renders) sitting directly under `<main>`, outside any `InertBoundary`, so it and the drawer stay fully interactive while the drawer is open.
- Verified `npm run lint`, `npm run typecheck` after Task 1, and `npm run lint && npm run typecheck && npm run build` after Task 2 all pass clean.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire menu-overlay mutual exclusivity + disabled CSS** - `6454520` (feat)
2. **Task 2: Create InertBoundary and apply it in page.tsx** - `8e47521` (feat)

**Plan metadata:** (pending — final docs commit follows this summary)

## Files Created/Modified
- `components/menu-overlay.tsx` - Calls `useOverlayCoordination("menu", menuOpen)`; `.menu-toggle` gets `aria-disabled={drawerOpen}` and a guarded no-op `onClick` while the drawer is open
- `app/globals.css` - Added `.menu-toggle[aria-disabled="true"]` disabled treatment (appended to the existing `.site-header` CSS block, matching this file's existing per-section single-line convention)
- `components/inert-boundary.tsx` - New: `InertBoundary({ children })`, `display:contents` wrapper toggling `inert` from `useOverlayOpen("drawer")`
- `app/page.tsx` - Header + Hero/Manifesto + Technology/Process/Contact wrapped in three `InertBoundary` instances; `CapabilitiesSection` unwrapped, sitting between the two section-group wrappers

## Decisions Made
- Reworded an explanatory comment in `components/inert-boundary.tsx` that originally read "...never useOverlayCoordination, so it never writes to the shared store" to avoid the literal string `useOverlayCoordination`, because the plan's own acceptance criteria requires `grep -n "useOverlayCoordination" components/inert-boundary.tsx` to return **zero** hits (verifying the file only ever calls the read-only `useOverlayOpen` selector). This is the same self-referential-grep class of issue Plan 01 hit with the word "MutationObserver" in its own hook's comments — the fix reworded the comment to convey the same intent ("read-only selector only... must never write to the shared overlay-coordination store") without the banned literal substring.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Reworded a self-defeating comment in `components/inert-boundary.tsx`**
- **Found during:** Task 2 acceptance-criteria verification (`grep -c "useOverlayCoordination" components/inert-boundary.tsx` returned 1, expected 0)
- **Issue:** The file's own top-of-file explanatory comment used the literal string "useOverlayCoordination" to describe the hook it deliberately does *not* call, which tripped the exact acceptance-criteria grep meant to confirm the file never references the write-capable hook.
- **Fix:** Reworded the comment to preserve the same explanatory intent ("read-only selector only... must never write to the shared overlay-coordination store") without using the literal banned string.
- **Files modified:** `components/inert-boundary.tsx`
- **Verification:** Re-ran `grep -c "useOverlayCoordination" components/inert-boundary.tsx` — 0 hits (exit code 1). Re-ran `npm run lint && npm run typecheck && npm run build`, all clean.
- **Committed in:** `8e47521` (part of Task 2 commit)

---

**Total deviations:** 1 auto-fixed (bug fix, self-referential grep in own comment)
**Impact on plan:** No scope creep — comment wording only, no behavior change. No new files, no new dependencies, no architectural change.

## Issues Encountered
None beyond the deviation above.

## Known Stubs

None. Both halves of SERV-03's mutual exclusivity are now real and symmetric: the drawer disables service rows while the menu is open (Plan 02), and the menu-toggle disables while the drawer is open (this plan), each via a real guarded `onClick` plus `aria-disabled`, never force-closing the other. SERV-02's `inert` requirement is now a literal, grep-able DOM attribute via `InertBoundary`, in addition to native `showModal()` modality.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- This is the final plan of Phase 3 (Servicios y Drawer de Detalle). SERV-01, SERV-02, and SERV-03 are all fully wired and build-clean:
  - SERV-01: 5 service rows as distinct clickable buttons (Plan 02).
  - SERV-02: native `<dialog>` drawer with real content, focus-trap/return via `showModal()`, and an explicit `InertBoundary`-driven `inert` attribute on the background (this plan).
  - SERV-03: drawer disables the menu-toggle and the menu disables the service rows, both via the shared `useOverlayCoordination` store, neither force-closing the other; both share `useScrollLock`.
- Three manual verification rows remain, deferred to the phase gate per `config.human_verify_mode: end-of-phase` and this plan's own `<verify><human-check>` sections (no automated substitute exists in this project, confirmed in `03-RESEARCH.md`'s Validation Architecture):
  1. Drawer focus trap + focus-return to the triggering row on close.
  2. Background truly unreachable via Tab and mouse click while the drawer is open (native modality + `inert` DevTools check on the two section-group wrappers and the header, confirming `CapabilitiesSection`'s subtree is NOT inert).
  3. Drawer<->menu mutual exclusivity (disable-not-close, both directions) + scroll-lock consistency across both overlays.
- No blockers. `npm run build` succeeds with the final page structure; no changes needed to `hooks/use-overlay-coordination.ts` in this plan (both its `useOverlayCoordination` writer/reader and its read-only `useOverlayOpen` selector were already complete and `getServerSnapshot`-safe from Plans 01/02).

---
*Phase: 03-servicios-y-drawer-de-detalle*
*Completed: 2026-07-20*

## Self-Check: PASSED

All created/modified files verified on disk (`components/menu-overlay.tsx`, `app/globals.css`, `components/inert-boundary.tsx`, `app/page.tsx`, this summary) and both task commit hashes (`6454520`, `8e47521`) verified present in `git log`.
