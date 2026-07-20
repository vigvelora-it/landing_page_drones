---
phase: 03-servicios-y-drawer-de-detalle
plan: 02
subsystem: ui
tags: [services, cards, drawer, css, accessibility, wiring]

# Dependency graph
requires:
  - phase: 03-servicios-y-drawer-de-detalle
    plan: 01
    provides: "hooks/use-overlay-coordination.ts useOverlayCoordination/useOverlayOpen, components/service-drawer.tsx ServiceDrawer, app/globals.css drawer CSS block"
provides:
  - "components/sections/capabilities-section.tsx — service rows as <button> drawer triggers holding activeService state, wired to ServiceDrawer and useOverlayCoordination(\"drawer\", ...)"
  - "app/globals.css .service-row button reset + :focus-visible + [aria-disabled] + .service-row-selected-indicator CSS"
affects: [03-03-inert-boundary-and-menu-coordination]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Codebase's first :focus-visible rule outside the drawer (.service-row:focus-visible, inset outline)"
    - "useSyncExternalStore server-snapshot pattern: any future consumer of use-overlay-coordination.ts rendered on the force-static prerender path needs getServerSnapshot too (fixed once, reused by all)"

key-files:
  created: []
  modified:
    - components/sections/capabilities-section.tsx
    - app/globals.css
    - hooks/use-overlay-coordination.ts

key-decisions:
  - "Selected-trigger indicator implemented as a 4px persistent accent left-edge bar (position:absolute, overriding the existing .service-row>*{position:relative} rule via source-order tie-break), not a full pinned-open version of the existing :before hover-sweep — the plan's own read_first text (\"accent left-edge marker...pinned-open accent bar\") takes precedence over the UI-SPEC states table's more ambiguous \"reuse the existing :before accent-fill treatment\" wording, since a full accent fill would require an additional text-color change (to white) that the UI-SPEC's Selected-state row does not specify, and is not needed for text to stay readable."
  - "Fixed hooks/use-overlay-coordination.ts (a Plan 01 file, outside this plan's declared file scope) to add getServerSnapshot to its useSyncExternalStore call — Task 1's wiring made this hook's return value part of CapabilitiesSection's render output for the first time, and CapabilitiesSection sits on the force-static prerender path (via app/page.tsx), which surfaced a latent gap: without getServerSnapshot, npm run build fails with 'Missing getServerSnapshot, which is required for server-rendered content.' Rule 3 (auto-fix blocking issue)."

requirements-completed: [SERV-01, SERV-02, SERV-03]

# Metrics
duration: ~15min
completed: 2026-07-20
---

# Phase 3 Plan 2: Service Row → Drawer Trigger Wiring Summary

**Converted the 5 `.service-row` anchors into `<button>` drawer triggers holding `activeService` state, wired to `ServiceDrawer`/`useOverlayCoordination` from Plan 01, plus the button-reset/focus-visible/disabled/selected CSS layer — including a one-line fix to Plan 01's hook so the now-exercised `useSyncExternalStore` call doesn't break the static build.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-20
- **Tasks:** 2
- **Files modified:** 3 (0 created, 3 modified)

## Accomplishments
- Rewrote the `services.map(...)` block in `components/sections/capabilities-section.tsx`: each row is now `<button type="button" className="service-row" key={service.id} data-reveal data-cursor="Ver detalle" aria-disabled={menuIsOpen}>`, guarded with `if (menuIsOpen) return` before `setActiveService(service)`. Added `activeService: Service | null` state and `const menuIsOpen = useOverlayCoordination("drawer", !!activeService)`. Rendered `<ServiceDrawer service={activeService} isOpen={!!activeService} onClose={...} />` as a sibling inside the component's own returned fragment, next to the existing `<section>`/`moving-band` markup — both preserved verbatim, including the `useGSAP` reveal observer (`[data-reveal]` still matches, buttons still get observed/revealed identically to the prior anchors).
- Added a persistent `<span className="service-row-selected-indicator" aria-hidden="true" />` inside the button when `activeService?.id === service.id`.
- Appended `.service-row` CSS to `app/globals.css`: UA button-chrome reset (`background:transparent`, `border-left/right/top:0` while keeping the existing `border-bottom`, `text-align:left`, `padding:0`, `font:inherit`, `cursor:pointer`, `width:100%`) so the `<a>`→`<button>` swap stays pixel-identical to before; the codebase's first `.service-row:focus-visible` inset-outline rule; `.service-row[aria-disabled="true"]` dim/disable treatment mirroring `.submit-button:disabled`; and `.service-row-selected-indicator` as a 4px persistent accent left-edge bar.
- Verified `npm run lint`, `npm run typecheck` after Task 1, and `npm run lint && npm run typecheck && npm run build` after Task 2 all pass clean.
- Fixed a build-blocking gap in `hooks/use-overlay-coordination.ts` (Plan 01's file): its `useSyncExternalStore(subscribe, getSnapshot)` call had no `getServerSnapshot`, which only became a real production-build failure once Task 1 made `CapabilitiesSection` — a component on the `force-static` prerender path — actually call the hook during render for the first time. Added a `getServerSnapshot` returning the same module-scope `state`, deterministic and consistent with the client's own initial state (both start `{menu:false, drawer:false}`), so there is no hydration mismatch.

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert service rows to drawer-trigger buttons** - `bda3a1b` (feat)
2. **Task 2: Add service-row button-reset, focus-visible, disabled and selected CSS** - `ee27071` (feat, includes the `use-overlay-coordination.ts` deviation fix)

**Plan metadata:** (pending — final docs commit follows this summary)

## Files Created/Modified
- `components/sections/capabilities-section.tsx` - Rows are now `<button>` drawer triggers keyed by `service.id`; holds `activeService` state; calls `useOverlayCoordination("drawer", ...)`; renders `<ServiceDrawer>`
- `app/globals.css` - `.service-row` button reset, `.service-row:focus-visible`, `.service-row[aria-disabled="true"]`, `.service-row-selected-indicator`
- `hooks/use-overlay-coordination.ts` - Added `getServerSnapshot` to `useSyncExternalStore` (deviation fix, see below)

## Decisions Made
- Selected-indicator visual: a 4px persistent accent left-edge bar (`position:absolute;top:0;bottom:0;left:0;width:4px;background:var(--accent)`), not a full pinned-open accent fill of the whole row. The plan's own Task 2 `read_first`/`action` text calls this an "accent left-edge marker... pinned-open accent bar," which is more concrete than the UI-SPEC's states-table phrase ("reuse the existing `:before` accent-fill treatment, but pinned open") — a full fill would silently require a text-color change to white that is not specified anywhere for the selected (non-hover) state, so the left-edge-bar reading avoids introducing an unspecified readability change. The span's `position:absolute` correctly overrides the existing `.service-row>*{position:relative}` rule via CSS source-order tie-break (equal specificity, later rule in the same file wins).
- `border:0` was intentionally NOT used as a shorthand for the button reset (the plan's Pitfall-3 reference sketch shows `border:0`) — using the shorthand after the existing `border-bottom:1px solid var(--border-subtle)` declaration in the same rule would have zeroed out that bottom border too. Used `border-left:0;border-right:0;border-top:0` instead, positioned after `border-bottom` in the property list, to reset only the three sides `<button>`'s UA chrome actually adds while preserving the existing row-divider look pixel-for-pixel.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Added `getServerSnapshot` to `useOverlayCoordination`'s `useSyncExternalStore` call**
- **Found during:** Task 2 (`npm run build` verification gate)
- **Issue:** `npm run build` failed with `Error: Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.` during `/` prerendering. `hooks/use-overlay-coordination.ts` (built in Plan 01) called `useSyncExternalStore(subscribe, getSnapshot)` with no third argument. This was latent and untriggered in Plan 01 because nothing called the hook from a component on the render path yet; Task 1 of this plan made `CapabilitiesSection` — which sits on `app/page.tsx`'s `force-static` prerender path — call `useOverlayCoordination("drawer", ...)` during render for the first time, surfacing the gap.
- **Fix:** Added a `getServerSnapshot()` function returning the same module-scope `state` object as `getSnapshot()`, and passed it as the third argument to `useSyncExternalStore`. Deterministic and hydration-safe: both client and server start from the same `{menu:false, drawer:false}` initial state, and the store is a browser-only, no-persistence module (per Plan 01's own documented design), so there is no possible mismatch.
- **Files modified:** `hooks/use-overlay-coordination.ts`
- **Verification:** Re-ran `npm run lint && npm run typecheck && npm run build` — all pass; the previously-failing `/` prerender now succeeds (`Generating static pages using 7 workers (7/7)`).
- **Committed in:** `ee27071` (part of Task 2 commit, since it was required for Task 2's own `npm run build` acceptance gate to pass)

---

**Total deviations:** 1 auto-fixed (blocking issue in a dependency file from Plan 01)
**Impact on plan:** No scope creep — the fix is a one-line addition to an existing function signature in a hook this plan already depends on and does not modify otherwise. No new files, no new dependencies, no architectural change. This fix also benefits Plan 03, which will make `MenuOverlay` call the same hook from the same prerendered page.

## Issues Encountered
None beyond the deviation above.

## Known Stubs

None. Both `ServiceDrawer` (from Plan 01) and the row triggers (this plan) are now fully wired: clicking any of the 5 rows opens the drawer populated with that exact service's `groups`/`note`, and the drawer's own CTA/close paths (built in Plan 01) are unchanged and already functional.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- SERV-01 (rows as distinct clickable units) and the trigger half of SERV-02 (click → drawer with correct content) are now real and grep-verified (zero `<a ... service-row>`/`href="#contacto"` rows remain; `data-cursor="Ver detalle"` present; `data-cursor="Cotizar"` absent).
- The drawer-side half of SERV-03 (service rows disable while the menu is open) is wired via `useOverlayCoordination("drawer", ...)` — `menuIsOpen` correctly drives `aria-disabled` and the click no-op guard. What remains for SERV-03/SERV-02 is Plan 03's responsibility: wiring `MenuOverlay` to call `useOverlayCoordination("menu", menuOpen)` (the mirror side of this plan's call) so the hamburger disables while the drawer is open, and adding the `InertBoundary` client wrapper around the non-`CapabilitiesSection` sections per the orchestrator-resolved Open Question #1 in `03-RESEARCH.md`.
- Manual verification of the 5 human-check items this plan deferred to the phase gate (row clickability, drawer content-swap on a different-row click, cursor label, focus ring, selected indicator, disabled dimming) is still owed at `03-03`'s phase gate per this plan's own `<verify><human-check>` sections — no automated substitute exists in this project (confirmed in `03-RESEARCH.md`'s Validation Architecture).
- No blockers for Plan 03. `hooks/use-overlay-coordination.ts`'s `getServerSnapshot` fix (this plan) means Plan 03's `MenuOverlay` call to the same hook will not re-trigger the same build failure.

---
*Phase: 03-servicios-y-drawer-de-detalle*
*Completed: 2026-07-20*

## Self-Check: PASSED

All created/modified files verified on disk (`components/sections/capabilities-section.tsx`, `app/globals.css`, `hooks/use-overlay-coordination.ts`, this summary) and both task commit hashes (`bda3a1b`, `ee27071`) verified present in `git log`.
