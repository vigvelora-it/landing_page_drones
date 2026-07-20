---
phase: 03-servicios-y-drawer-de-detalle
plan: 01
subsystem: ui
tags: [dialog, drawer, overlay, focus-management, css, react-19, use-sync-external-store]

# Dependency graph
requires:
  - phase: 02-contenido-real-de-servicios
    provides: "lib/site-content.ts Service/ServiceGroup types with groups[]/note populated for all 5 ejes"
provides:
  - "hooks/use-overlay-coordination.ts — useOverlayCoordination(key,isOpen) + useOverlayOpen(key), module-scope useSyncExternalStore store for menu/drawer mutual exclusivity (SERV-03 substrate)"
  - "components/service-drawer.tsx — ServiceDrawer native-dialog component, imperative showModal()/close(), single animated requestClose() path, deferred lenis.scrollTo CTA"
  - "app/globals.css drawer CSS block — dialog reset, slide-in/out transform, flat-fill ::backdrop, panel/header/body/group/note/footer/CTA styling, codebase's first :focus-visible rules, reduced-motion collapse"
affects: [03-02-drawer-trigger-wiring, 03-03-inert-boundary-and-menu-coordination]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Mutual-exclusivity coordination via module-scope useSyncExternalStore store (not Context, not body-attribute + observer)"
    - "Native <dialog> driven imperatively (showModal()/close()) — never a JSX open={} binding"
    - "Animated dialog close via is-closing class + setTimeout(CLOSE_ANIMATION_MS) before the real .close() call, kept in sync with --motion-duration-base"
    - "Deferred CTA scroll (lenis.scrollTo after close animation + scroll-lock release) instead of a plain anchor"

key-files:
  created:
    - hooks/use-overlay-coordination.ts
    - components/service-drawer.tsx
  modified:
    - app/globals.css

key-decisions:
  - "Tablet width (721-1000px) explicitly set to 70vw via the codebase's existing 1000px breakpoint, since UI-SPEC's confirmed Sizing/position decision names a distinct tablet width that clamp(420px,44vw,560px) alone cannot produce (44vw floors below the 420px minimum at tablet widths)."
  - "Close button styled as plain text (no .menu-toggle-style icon lines) since Task 2's markup intentionally ships text-only ('Cerrar') with no <i> icon elements — CSS matches the actual DOM, not the UI-SPEC's icon-language aspiration."

patterns-established:
  - "Overlay coordination hook: any future full-viewport overlay adds itself to OverlayState and reads the others via useOverlayOpen/useOverlayCoordination, no new Context needed."
  - "Native <dialog> animated-close pattern (is-closing class + timed real close) is now the house pattern for any future modal in this codebase."

requirements-completed: [SERV-02, SERV-03]

# Metrics
duration: ~10min
completed: 2026-07-20
---

# Phase 3 Plan 1: Overlay Coordination Store + Service Drawer Foundation Summary

**Module-scope `useSyncExternalStore` mutual-exclusivity store plus a native `<dialog>` `ServiceDrawer` driven imperatively via `showModal()`/`close()`, with a single animated close path and deferred `lenis.scrollTo` CTA — no trigger wired yet.**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-20
- **Tasks:** 3
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- Built `hooks/use-overlay-coordination.ts`: a ~50-line module-scope store backed by React 19's `useSyncExternalStore`, exporting both the read+write `useOverlayCoordination(key, isOpen)` coordinator and the read-only `useOverlayOpen(key)` selector — the exact SERV-03 wiring mechanism and the read-only hook Plan 03's inert boundary will consume.
- Built `components/service-drawer.tsx`: a fully-styled, always-mounted native `<dialog>` opened only via `showModal()`, closed through one `requestClose()` function that routes Esc (`onCancel`), backdrop click, the close button, and the footer CTA through the same animated slide-out — never a bare `.close()` call and never a JSX `open={}` binding.
- Appended the drawer's complete CSS block to `app/globals.css`: dialog UA-chrome reset, `translateX` slide transform, `is-closing` slide-out target, flat-fill `::backdrop` (no blur/mix-blend-mode), full panel/header/body/group/note/footer/CTA styling per 03-UI-SPEC's literal-px spacing and 4-size type scale, tablet/mobile width overrides, and the codebase's first `:focus-visible` rules.
- Verified `npm run lint`, `npm run typecheck`, and `npm run build` all pass clean after each task and at wave merge.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the overlay-coordination store hook** - `1011d59` (feat)
2. **Task 2: Build the ServiceDrawer native-dialog component** - `0d31527` (feat)
3. **Task 3: Add drawer CSS to globals.css** - `890c410` (feat)

**Plan metadata:** (pending — final docs commit follows this summary)

## Files Created/Modified
- `hooks/use-overlay-coordination.ts` - Module-scope `{menu, drawer}` store; `useOverlayCoordination` writes own key + returns the other's boolean, `useOverlayOpen` is a read-only selector for future consumers
- `components/service-drawer.tsx` - `ServiceDrawer({service, isOpen, onClose})`: imperative `showModal()`/`close()`, `requestClose()` animated-close funnel, `useScrollLock(isOpen)`, deferred `lenis.scrollTo("#contacto")` CTA, `data-lenis-prevent` on the scrollable body
- `app/globals.css` - New "Drawer de Servicio" section: dialog reset/backdrop/is-closing, panel/header/body/group/note/footer/CTA rules, tablet/mobile width media queries, reduced-motion collapse, first `:focus-visible` rules

## Decisions Made
- Added an explicit `@media(max-width:1000px){dialog.service-drawer{width:70vw}}` rule not spelled out verbatim in the plan's Task 3 action text, because 03-UI-SPEC.md's confirmed "Sizing/position" decision names a distinct tablet width (70vw, 721-1000px) that the desktop `clamp(420px,44vw,560px)` cannot produce at tablet viewport widths (44vw computes below the 420px floor there, so without this rule tablet would incorrectly render at 420px instead of the specified 70vw). This uses the codebase's existing 1000px breakpoint, no new breakpoint introduced.
- Close-button CSS matches the plain-text `<button><span>Cerrar</span></button>` markup Task 2 specifies (no icon lines), rather than replicating `.menu-toggle`'s icon+text visual language literally — the UI-SPEC's "matches .menu-toggle's existing hover language" note was read as "reuse the accent hover-color behavior," not "add matching `<i>` bars," since the plan's own Task 2 markup contains no icon elements to style.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed literal string "MutationObserver" from an explanatory comment**
- **Found during:** Task 1 (overlay-coordination hook)
- **Issue:** The hook's own acceptance criteria requires `grep -nE "createContext|MutationObserver|document\.body\." hooks/use-overlay-coordination.ts` to return zero hits, but an explanatory code comment describing what the store deliberately avoids used the literal word "MutationObserver," tripping the same grep meant to verify the pattern was never implemented.
- **Fix:** Reworded the comment to describe the avoided approach ("a body-attribute polled by a DOM observer") without using the banned literal string, preserving the same explanatory intent.
- **Files modified:** hooks/use-overlay-coordination.ts
- **Verification:** Re-ran the exact acceptance-criteria grep; confirmed zero hits (exit code 1). Re-ran lint/typecheck, both clean.
- **Committed in:** 1011d59 (part of Task 1 commit)

**2. [Rule 2 - Missing Critical] Added tablet-width (70vw) media query**
- **Found during:** Task 3 (drawer CSS)
- **Issue:** 03-UI-SPEC.md's confirmed Sizing/position decision specifies a distinct tablet width (721-1000px: 70vw) that the desktop `clamp(420px,44vw,560px)` rule alone cannot satisfy at tablet breakpoints (44vw floors under the 420px minimum, producing an incorrectly narrow panel instead of the wider tablet treatment the UI-SPEC locked in).
- **Fix:** Added `@media(max-width:1000px){dialog.service-drawer{width:70vw}}`, using the codebase's existing 1000px breakpoint, positioned before the existing `@media(max-width:720px)` mobile override so cascade order still yields 100vw on mobile.
- **Files modified:** app/globals.css
- **Verification:** `npm run build` succeeds; visual tablet-width verification deferred to the 03-03 phase gate per this plan's `<verification>` section (no automated visual check exists in this project).
- **Committed in:** 890c410 (part of Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 bug fix, 1 missing critical functionality)
**Impact on plan:** Both auto-fixes correct fidelity gaps against locked acceptance criteria / UI-SPEC decisions. No scope creep — no new files, no new dependencies, no architectural change.

## Issues Encountered
None.

## Known Stubs

None that block this plan's own goal. `ServiceDrawer` is intentionally **not yet wired to a trigger** — per this plan's own `<objective>`, it "produces no trigger yet"; `capabilities-section.tsx` still renders its rows as anchors to `#contacto` and does not import `ServiceDrawer`. This is the plan's documented scope boundary, not an unintended gap: Plan 02 converts the service rows to buttons and wires `activeService`/`ServiceDrawer`, and Plan 03 adds the `InertBoundary` + `useOverlayCoordination` calls on both `MenuOverlay` and `CapabilitiesSection`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `useOverlayCoordination`/`useOverlayOpen` and `ServiceDrawer` are both interface-complete and independently typecheck/lint/build clean — Plan 02 can now import `ServiceDrawer` and wire `activeService` state in `capabilities-section.tsx`, and Plan 03 can wire `useOverlayCoordination`/`useOverlayOpen` into `MenuOverlay` and the new `InertBoundary` without touching this plan's files again.
- No blockers. The one open structural question this plan's research flagged (exact `<main inert>` wiring across the Server/Client boundary) was already resolved by the orchestrator before this plan executed (option d — `InertBoundary` client wrapper, per 03-RESEARCH.md's "Open Questions (RESOLVED)" section) and is Plan 03's responsibility, not this plan's.

---
*Phase: 03-servicios-y-drawer-de-detalle*
*Completed: 2026-07-20*
