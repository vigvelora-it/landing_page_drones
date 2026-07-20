# Phase 3: Servicios y Drawer de Detalle - Research

**Researched:** 2026-07-20
**Domain:** Native `<dialog>` side-drawer pattern, React 19/Next.js 16 state ownership, mutual-exclusivity coordination between two independently-owned full-viewport overlays, on top of an existing Lenis+GSAP marketing site with zero UI-component dependencies.
**Confidence:** HIGH (this phase's core question — exact `<dialog>` wiring, exact state ownership, exact mutual-exclusivity mechanism — is answered by direct inspection of the actual current codebase plus cross-checked MDN/WHATWG-spec facts about `<dialog>` behavior; the one genuinely new design decision this research contributes beyond the milestone-level ARCHITECTURE.md — the mutual-exclusivity coordination hook — is a first-party recommendation, flagged as such below, not an external citation)

## Summary

This phase adds the milestone's first interactive component that didn't exist before: a native `<dialog>` service-detail drawer triggered from the existing 5-row service list in `components/sections/capabilities-section.tsx`. The UI-SPEC (`03-UI-SPEC.md`, user-approved 2026-07-19) has already resolved every visual/copy/motion decision — this research answers the *structural* questions the UI-SPEC deliberately left to engineering: exactly where new state lives, exactly how the native `<dialog>` API is driven from React 19, exactly what `inert` is applied to and why that's safe, and exactly how two independently-owned overlays (`MenuOverlay`'s `menuOpen`, `CapabilitiesSection`'s new `activeService`) enforce SERV-03's mutual exclusivity without Context or a state library.

Three findings materially sharpen the milestone-level `ARCHITECTURE.md`/`PITFALLS.md` (which were written before any of this milestone's code existed in its current post-Phase-2 form):

1. **`inert` on `<main>` is safe by spec, not just "belt-and-suspenders."** WHATWG HTML explicitly exempts a modal dialog (and its descendants) from inertness inherited from an ancestor once it's promoted to the top layer via `showModal()`. `showModal()` *already* makes the rest of the document inert automatically — the explicit `<main inert>` this phase adds is genuinely redundant with native behavior, but it is cheap, harmless, and it is the only way to make SERV-02's literal "inert en el fondo" wording independently verifiable in DevTools without relying on undocumented browser internals. Do it anyway, but plan for zero behavioral change from adding it.
2. **Animating a native `<dialog>`'s close is not free.** `dialog.close()` removes the `open` attribute immediately, which triggers the UA style `dialog:not([open]){display:none}` with no transition — a naive `onClick={() => dialogRef.current?.close()}` on the close button/backdrop/Escape produces an instant jump-cut, not the slide-out UI-SPEC requires. This needs an explicit delayed-close pattern (or the newer `@starting-style`/`transition-behavior:allow-discrete` CSS, which this codebase does not yet use anywhere and should not adopt for the first time here — see Pitfall 1below). None of the milestone-level PITFALLS.md's 9 pitfalls name this specific gotcha; it is native-`<dialog>`-specific and this milestone's first `<dialog>` instance.
3. **Mutual exclusivity (SERV-03) needs one new, small, first-party hook — not a DOM-attribute read, not Context.** The milestone `ARCHITECTURE.md`'s Pattern B proposes a read-only `body` attribute both sides "defensively check." In practice, disabling a trigger correctly (not just visually, but so `aria-disabled` is real and keyboard activation is actually blocked) requires each side to hold a *boolean in React state* reflecting "is the other overlay open" — a body attribute alone doesn't get you that without also wiring a `MutationObserver`, which is strictly more code than the alternative below. Recommendation: a ~25-line shared hook, `hooks/use-overlay-coordination.ts`, using React 19's built-in `useSyncExternalStore` over a tiny module-scope store. Same shape as the already-existing shared `useScrollLock` hook (a small hook both `MenuOverlay` and the drawer call), zero new dependency, no Context provider to wire into `app/layout.tsx` or `app/page.tsx` (which is a Server Component and cannot hold client state anyway).

**Primary recommendation:** Build `components/service-drawer.tsx` as a presentational, always-mounted `<dialog>` driven imperatively (`showModal()`/`close()`) from an `isOpen` prop; keep `activeService` state in `capabilities-section.tsx` (do not rename the file/component — UI-SPEC references it by its current name and no requirement mandates the milestone-research's cosmetic rename); introduce `hooks/use-overlay-coordination.ts` as the SERV-03 wiring mechanism; reuse `useScrollLock` verbatim inside `ServiceDrawer`; and build the close-animation via a JS-timed deferred `.close()` call (matching `--motion-duration-base`), not the newer CSS-only `allow-discrete` mechanism, to stay consistent with this codebase's existing plain-CSS-transition conventions.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Service grid/list rendering (SERV-01) | Browser/Client (React CSR component, statically generated HTML) | — | Pure presentational list, no data fetching; `force-static` page, hydrates client-side |
| Drawer open/close state (`activeService`) | Browser/Client | — | Local `useState` in `capabilities-section.tsx`; no server involvement, no URL state |
| Drawer modality/focus-trap/inert (SERV-02) | Browser/Client (native platform API) | — | Delegated entirely to the browser's native `<dialog>` top-layer implementation, not hand-rolled JS |
| Scroll lock while drawer/menu open | Browser/Client | — | `useScrollLock` wraps `lenis.stop()/start()`, itself client-side; no SSR concern (Lenis never runs on the server) |
| Mutual exclusivity signal (SERV-03) | Browser/Client | — | New `useOverlayCoordination` hook, in-memory module-scope store, no persistence, no server round-trip |
| Service content (`groups`, `note`, `tagline`) | Database/Storage tier equivalent = `lib/site-content.ts` (build-time static data) | — | Authored once, read by both grid and drawer; no runtime data source, this is a static-site content module, not a live tier |

No CDN/edge or API/backend tier involvement in this phase — everything is client-rendered interaction on an already-static page.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SERV-01 | Los 5 ejes de servicio se presentan como tarjetas navegables (grid), no como texto corrido | UI-SPEC's user-confirmed Decision #1 keeps the existing `.service-row` list layout (not a CSS grid) as satisfying this requirement's *intent* — each row is already a discrete, fully-clickable unit with title/tagline/affordance, not flowing prose. This research documents the exact button-conversion needed (see "Don't Hand-Roll" / Code Examples) so the row remains SERV-01-compliant once its semantics change from anchor-to-`#contacto` to dialog-trigger. |
| SERV-02 | Al seleccionar un eje, se abre un panel lateral (drawer) con el detalle del servicio, usando `<dialog>` nativo con `inert` en el fondo y retorno de foco al cerrar | This research provides the exact `showModal()`/`close()`/`cancel`-event wiring, confirms native focus-return is automatic (no manual `triggerRef` bookkeeping needed), and confirms `inert` on `<main>` is spec-safe alongside a nested open dialog. See "Architecture Patterns" and "Code Examples." |
| SERV-03 | El drawer y el menú overlay existente son mutuamente excluyentes y comparten el mecanismo de bloqueo de scroll | This research's core original contribution: the `useOverlayCoordination` hook (exact API below) plus reuse of the existing `useScrollLock` hook by both `MenuOverlay` and `ServiceDrawer`. See "Architecture Patterns" Pattern 3 and "Code Examples." |
</phase_requirements>

## Current State (verified directly from this codebase, post-Phase-2)

- `components/sections/capabilities-section.tsx` still exports `CapabilitiesSection` (not renamed) and renders `services.map(...)` as `<a className="service-row" href="#contacto" key={service.number} data-reveal data-cursor="Cotizar">` — an **anchor**, not a button, currently navigating straight to `#contacto`. This must become a `<button type="button">` per UI-SPEC's explicit "Focus-visible (new — element becomes a `<button>`, not an `<a href="#contacto">`)" line. `key` currently uses `service.number`; `lib/site-content.ts` already has a more semantic `service.id` field available (unused in JSX today) — prefer `key={service.id}` when touching this line anyway.
- `lib/site-content.ts`'s `Service` interface already has exactly the shape the drawer needs — `groups: ServiceGroup[]` (`heading?`, `items: string[]`) and `note?: string` — populated for all 5 real services (Phase 2/ARCH-01 already done). **No data model changes are needed in this phase.** `note` is present only on ejes 01 and 05, matching UI-SPEC's "Note callout (ejes 1 and 5 only)" line exactly.
- `hooks/use-scroll-lock.ts` already exists exactly as the milestone `ARCHITECTURE.md` Pattern B specifies — `useScrollLock(isLocked: boolean)`, wraps `useLenis()`, calls `lenis.stop()`/`lenis.start()`, resumes on unmount. **Reuse verbatim, zero changes needed.** `MenuOverlay` already calls it (`useScrollLock(menuOpen)`).
- `components/custom-cursor.tsx` already uses `pointerover`/`pointerout` event delegation with `closest("[data-cursor]")` (ARCH-03 already done in Phase 2). **No changes needed to this file for this phase.** Changing `data-cursor="Cotizar"` → `data-cursor="Ver detalle"` on the service-row buttons works automatically with zero code change to `custom-cursor.tsx` — this is exactly what the delegation fix was for.
- `app/globals.css` has **no existing `:focus-visible` rule anywhere in the stylesheet** (verified: zero hits for `focus-visible`; the only `outline` hit is `.contact-form input{outline:0}`, an unrelated pre-existing removal). `--focus-ring:var(--accent)` is defined as a token but never consumed. **This phase introduces the codebase's first `:focus-visible` CSS rules** — for the service-row trigger, the drawer close button, and the drawer footer CTA, per UI-SPEC's Color section. This is new pattern, not a reuse.
- `app/globals.css` also has **no spacing-scale custom properties** (`--space-sm`, `--space-md`, etc.) despite the UI-SPEC's Spacing Scale table describing an "8-point scale... established in Phase 1." Direct inspection of `:root` confirms only color/motion/font tokens exist — every existing spacing value in the stylesheet is a literal (`gap:2rem`, `padding:1.35rem 2rem`, etc.), not a `var(--space-*)` reference. **The UI-SPEC's xs/sm/md/lg/xl/2xl/3xl table is a design-value reference, not a literal CSS custom-property contract** — implement the drawer's spacing as literal values matching those pixel targets (8px, 16px, 24px, 32px, 48px), consistent with how every other section in this codebase is styled, not by inventing new `--space-*` custom properties this phase (that would be a scope-creeping tokenization effort no other section follows).
- `z-index` map (verified from `globals.css`): `.site-header` 500, `.menu-overlay` 400, `.custom-cursor` 900, `.environment-badge` 999, `.intro` 10000. **None of this matters for the drawer.** `showModal()` promotes `<dialog>` into the browser's top layer, which renders above every one of these regardless of their `z-index` — the drawer needs no `z-index` declaration at all (this is the correct native behavior UI-SPEC already relies on for the custom-cursor interaction call).
- `components/providers/smooth-scroll-provider.tsx` confirms `<ReactLenis root options={{ autoRaf: false, syncTouch: true, anchors: true, lerp }}>` wraps the whole app (verified in `app/layout.tsx` — not reproduced here, but this is the provider all client components sit inside, so `useLenis()` is callable from `ServiceDrawer` directly, same as it's callable from `use-scroll-lock.ts`). The `anchors: true` option means Lenis has its own global click-interception for `<a href="#hash">` elements — **do not rely on this for the drawer's footer CTA** (see Pitfall 2 below); the CTA should be a `<button>` with an explicit, sequenced scroll call, not a plain anchor tag, because the CTA's scroll must happen *after* the drawer's close animation and after `useScrollLock` calls `lenis.start()` again, not at the moment of click while scroll is still locked.
- `lib/motion-preferences.ts` exports only `LENIS_LERP`/`getLenisLerp()` — there is **no shared `prefersReducedMotion()` boolean helper** in this codebase. Every reduced-motion check inline-calls `window.matchMedia("(prefers-reduced-motion: reduce)").matches` (see `getLenisLerp` itself, and `smooth-scroll-provider.tsx`'s `gsap.matchMedia()` usage). The drawer's reduced-motion branch (instant show/hide per UI-SPEC) should follow this same inline-`matchMedia` convention, not invent a new shared utility this phase.
- `package.json` has zero modal/dialog/focus-trap library installed (`embla-carousel-react` is present for a *later* phase's carousel, irrelevant here). Confirms the native-`<dialog>`-only decision has no dependency-installation step in this phase at all.

## Package Legitimacy Audit

**Not applicable this phase.** No new npm packages are introduced — the drawer is built entirely on the native `<dialog>` element, existing `lenis`/`gsap` (already installed, already audited in prior phases), and this codebase's existing vanilla-CSS conventions. Package Legitimacy Gate protocol is skipped per its own trigger condition ("every phase that installs external packages") — this phase installs none.

## Architecture Patterns

### System Architecture Diagram

```
app/page.tsx (Server, force-static, unchanged import list/order)
  │
  ├── <MenuOverlay />  (client, existing)
  │     useState<menuOpen>
  │     useScrollLock(menuOpen)                    ← existing, unchanged
  │     useOverlayCoordination("menu", menuOpen)   ← NEW call, returns drawerIsOpen:boolean
  │       └─ if drawerIsOpen: .menu-toggle gets aria-disabled + disabled CSS treatment
  │
  ├── <main>                                       ← gains `inert` while drawer open
  │     │
  │     ├── ... other sections unchanged ...
  │     │
  │     └── <CapabilitiesSection />  (client, existing file/name kept)
  │           useState<activeService: Service | null>
  │           useOverlayCoordination("drawer", !!activeService) ← NEW call, returns menuIsOpen:boolean
  │             └─ if menuIsOpen: every .service-row button gets aria-disabled + disabled CSS treatment
  │           onClick on a row (only when not disabled) → setActiveService(service)
  │           renders <ServiceDrawer service={activeService} isOpen={!!activeService}
  │                                  onClose={() => setActiveService(null)} /> as a SIBLING
  │             (NOT inside the inert-toggled subtree conceptually — see below)
  │
  └── <ServiceDrawer />  (client, NEW, components/service-drawer.tsx)
        dialogRef = useRef<HTMLDialogElement>
        useScrollLock(isOpen)                       ← reused, unchanged hook
        useEffect: isOpen && !dialog.open → dialog.showModal()
        onCancel (Escape) → preventDefault + requestClose()  [animate, don't jump-cut]
        onClick   (backdrop, e.target === dialog)   → requestClose()
        onClose (native event, fires after real .close()) → onClose() prop → setActiveService(null)
        close button (autoFocus) → requestClose()
        footer CTA → requestClose() + deferred lenis.scrollTo("#contacto") after animation window
```

**Where does `<ServiceDrawer>` physically render relative to `<main inert>`?** It does not matter for correctness — see Pattern 1 below (dialogs escape ancestor inertness by spec) — but for cleanliness, render `<ServiceDrawer>` as a **sibling of `<main>`**, directly inside `app/page.tsx`'s top-level fragment (next to `<MenuOverlay />` and `<CustomCursor />`), not nested inside `<CapabilitiesSection>`'s own JSX subtree. This means `capabilities-section.tsx` needs to either (a) export both the row list and drawer render from one component (drawer rendered as a JSX sibling *within* `CapabilitiesSection`'s own return, which itself sits inside `<main>`), or (b) lift `activeService` differently. **Recommendation: keep it simple — render `<ServiceDrawer>` as a JSX sibling inside `CapabilitiesSection`'s own return value**, i.e. still physically inside `<main>` in the DOM tree. This is fine and does not need the extra indirection of rendering it from `page.tsx`, *because* of the spec fact in Pattern 1: even though the dialog is a DOM descendant of the soon-to-be-`inert` `<main>`, the dialog's own top-layer promotion exempts it from that inertness. Simpler component boundary (drawer owned/rendered by the same component that owns the triggering data) beats a marginal, spec-unnecessary DOM-position purity concern.

### Pattern 1: `inert` on `<main>` is safe with a nested open `<dialog>` — verified against WHATWG spec, not assumed

**What:** Apply the `inert` attribute to the `<main>` element (a plain `<main inert={!!activeService}>` or equivalent conditional prop in `app/page.tsx`, or — given the recommendation above — realistically this should happen in `page.tsx` since that's where `<main>` is declared, which means `CapabilitiesSection` needs to surface its `activeService` boolean upward *just for this one attribute*). This is the one piece of wiring that legitimately needs to cross the `CapabilitiesSection` → `page.tsx` boundary (page.tsx being a Server Component makes this specifically awkward — see the Open Question below).

**Why it's safe:** [CITED: WHATWG HTML spec / cross-checked via MDN, dialog and inert reference pages — confidence MEDIUM (websearch cross-checked against two independent official-doc-citing sources), see Sources] "The `inert` attribute... indicate[s]... the element and all its flat tree descendants which don't otherwise escape inertness (such as modal dialogs) are to be made inert." A `<dialog>` shown via `showModal()` is explicitly one of the elements that "escapes inertness" from an ancestor — this is intentional spec design specifically so patterns like "wrap the whole page in `inert`, but the modal itself stays interactive" work without extra effort, even when the dialog is a DOM descendant of the inert container.

**Practical consequence for this phase:** the explicit `<main inert>` this phase adds on top of `showModal()`'s own automatic document-wide inert-ing is **belt-and-suspenders in the literal sense the UI-SPEC already calls it** — it changes nothing observable, because `showModal()` already made everything outside the dialog's top-layer subtree inert. Do it anyway (SERV-02's requirement wording explicitly names `inert`, and having it as an explicit, grep-able attribute in the DOM is a legitimate acceptance-test hook that "trust the browser's implicit modal behavior" is not), but do not expect it to fix any bug that native `showModal()` modality wasn't already fixing — if background content is somehow still reachable while the drawer is open, the bug is in the `showModal()`/`open` wiring itself (e.g. `open` attribute set directly via JSX instead of via imperative `showModal()` call — see Pitfall 1), not in a missing/misplaced `inert`.

**Open question this research surfaces (see "Open Questions" below):** since `app/page.tsx` is a Server Component and cannot hold the `activeService` boolean, and lifting it there would require converting `page.tsx` (or a wrapper) to a client component, the pragmatic options are: (a) skip the explicit `<main inert>` at the `page.tsx` level entirely and rely on native `showModal()` modality alone (defensible given the spec fact above — literally zero behavioral difference), or (b) have `CapabilitiesSection` itself apply `inert` to a wrapping `<div>` around *its own* content only (not true `<main>`, but the one section most likely to have other interactive siblings a screen-reader swipe-navigation user could reach) — this only partially satisfies "inert en el fondo" (other sections' links remain technically reachable), or (c) accept a tiny, justified client-side island: wrap `<main>`'s children in a small client component (e.g. `<MainInertBoundary activeService={...}><...sections.../></MainInertBoundary>`) that needs `activeService` passed down from... which still doesn't solve the Server/Client boundary problem, since `page.tsx` itself doesn't have `activeService`. **The cleanest real resolution is (d): don't try to toggle `inert` from outside `CapabilitiesSection` at all — apply `inert` to a wrapper `<div>` that groups every *other* section (Hero, Manifesto, Technology, Process, Contact) plus the header, and have `CapabilitiesSection` broadcast its `activeService` boolean through the same `useOverlayCoordination` store this research already introduces for SERV-03, letting a tiny new client wrapper subscribe to it.** Flag this precisely for the planner: the exact mechanics of wiring `inert` across the Server/Client boundary is the one piece of this phase that benefits from a plan-time decision rather than being fully resolved here — the options above are all viable, ranked (a) simplest/defensible-by-spec, (d) most literal, and the planner should pick one explicitly rather than an executor improvising mid-implementation.

### Pattern 2: Native `<dialog>` driven imperatively, never via a JSX `open` boolean prop

**What:** `<dialog>` supports a non-modal `open` boolean attribute that JSX could bind directly (`<dialog open={isOpen}>`) — **do not do this.** Setting `open` directly renders the dialog as a plain in-flow block element with no backdrop, no top-layer promotion, no focus-trap, and no Escape-to-close — none of SERV-02's requirements. The dialog must always be **imperatively** driven: call `dialogRef.current.showModal()` to open, `dialogRef.current.close()` to close, from a `useEffect` keyed on the `isOpen` prop. Render the `<dialog>` element unconditionally in JSX (never `{isOpen && <dialog>...}`) — conditionally unmounting it would destroy the ref/DOM node mid-close-animation and lose the native top-layer machinery each time.

**When to use:** Always, for this component — this is the only correct way to get native modal semantics from React.

**Trade-offs:** One extra `useEffect` + ref versus a naive `open={isOpen}` binding that looks like it works in a first glance (the dialog *does* become visible) but silently fails every one of SERV-02's actual requirements (no backdrop, no focus trap, background remains fully clickable) — this is exactly the kind of "looks done but isn't" gap PITFALLS.md's checklist warns about, just one level more specific to native `<dialog>` than that document anticipated.

**Example:**
```tsx
// components/service-drawer.tsx (sketch — see Code Examples for the fuller version)
useEffect(() => {
  const dialog = dialogRef.current
  if (!dialog) return
  if (isOpen && !dialog.open) dialog.showModal()
}, [isOpen])
```

### Pattern 3: Mutual exclusivity via a shared module-scope store (`useSyncExternalStore`), not Context, not a body-attribute poll

**What:** `hooks/use-overlay-coordination.ts` — a small hook, same shape and same directory as the existing `hooks/use-scroll-lock.ts`, used by both `MenuOverlay` and `CapabilitiesSection` (or wherever `ServiceDrawer`'s `isOpen` state lives). It holds `{ menu: boolean, drawer: boolean }` in a module-level (not React-tree-level) variable, notifies subscribers on change via a `Set<() => void>`, and is read via React 19's built-in `useSyncExternalStore` — no new dependency, no Context provider to add to `app/layout.tsx`.

**Why this, not the milestone `ARCHITECTURE.md`'s body-attribute suggestion:** the milestone-level research (`Pattern B`, written before this phase's UI-SPEC existed) proposed "a read-only `body` attribute/class one side writes and the other reads defensively." That's workable for *pure CSS* disabling (a `body.menu-open .service-row{opacity:.6;pointer-events:none}` rule needs no JS at all) — but the UI-SPEC also requires `aria-disabled="true"` as a real DOM attribute on the disabled trigger, and requires the click handler itself to be a no-op while disabled (not just visually blocked), because `pointer-events:none` alone doesn't stop keyboard-Enter activation on an already-focused element. Getting `aria-disabled`/guarded-onClick right from a body-attribute source requires *also* wiring a `MutationObserver` in each consuming component to notice the attribute change and turn it into React state anyway — at which point the body-attribute is pure ceremony around the exact same "React state driven by an external signal" problem `useSyncExternalStore` solves directly, with less code and full type safety.

**When to use:** Specifically for this kind of "two independently-mounted-forever client components need to know a boolean about each other, with no natural parent to lift state into" — this is not a general-purpose global-state recommendation and should not be reached for outside this narrow SERV-03 case (respects the project's explicit no-global-state-library constraint; this is a 25-line bespoke module, not Redux/Zustand).

**Trade-offs:** Module-scope mutable state is normally a code smell in React, but here it is exactly appropriate: this is a single-page, no-routing, no-SSR-hydration-mismatch-risk app (`"use client"` hook, browser-only, module state naturally resets on full page reload, and there is no server-rendering of this state to mismatch against). The alternative (lifting `menuOpen`/`activeService` into one shared parent) would require either converting `app/page.tsx` to a client component (losing `force-static` benefits/adding unnecessary client-side data for every other section) or inserting a new always-present client wrapper purely to hold two booleans neither of which it otherwise needs — strictly more architectural disruption than one small hook.

**Example:**
```tsx
// hooks/use-overlay-coordination.ts
"use client"
import { useEffect, useSyncExternalStore } from "react"

type OverlayKey = "menu" | "drawer"
type OverlayState = Record<OverlayKey, boolean>

let state: OverlayState = { menu: false, drawer: false }
const listeners = new Set<() => void>()

function setOverlay(key: OverlayKey, open: boolean) {
  if (state[key] === open) return
  state = { ...state, [key]: open }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

// Call with your OWN key + isOpen; returns whether the OTHER overlay is open.
export function useOverlayCoordination(key: OverlayKey, isOpen: boolean): boolean {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)

  useEffect(() => {
    setOverlay(key, isOpen)
    return () => setOverlay(key, false)
  }, [key, isOpen])

  const otherKey: OverlayKey = key === "menu" ? "drawer" : "menu"
  return snapshot[otherKey]
}
```
Usage in `MenuOverlay`: `const drawerOpen = useOverlayCoordination("menu", menuOpen)` → spread `aria-disabled={drawerOpen}` and a `disabled-treatment` class onto `.menu-toggle`, and guard its `onClick` to no-op when `drawerOpen`.
Usage in `CapabilitiesSection`: `const menuIsOpen = useOverlayCoordination("drawer", !!activeService)` → same treatment per service-row button.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap while drawer is open | A manual Tab-keydown cycler (`element.focus()` on Tab/Shift+Tab boundary) | Native `<dialog>` + `showModal()` | PITFALLS.md Pitfall 4, confirmed again here: hand-rolled traps miss Shift+Tab wrap-around and — critically — provide zero boundary for swipe-based screen-reader navigation (VoiceOver/TalkBack), which don't use Tab at all. `showModal()` handles all of this natively, for free. |
| Focus-return to trigger on close | A `triggerRef`/`lastFocusedElement` ref manually saved on open and `.focus()`-restored on close | Nothing — it's automatic | [CITED: MDN, cross-checked — MEDIUM confidence] "When a dialog is closed... focus is returned to the element that opened the dialog" is native `showModal()` behavior. Building manual focus-return bookkeeping here would be redundant code solving an already-solved problem. |
| Backdrop dimming | A custom full-viewport `<div className="scrim">` with its own `background`/opacity/transition | The dialog's own `::backdrop` pseudo-element | UI-SPEC's own confirmed decision #2; matches this codebase's convention of not introducing extra wrapper divs where a native mechanism exists (mirrors how `.menu-overlay` needs no separate backdrop element either, since it *is* the backdrop). |
| Mutual-exclusivity signal between two always-mounted sibling components | A new React Context provider wired into `app/layout.tsx`/`app/page.tsx`, or a state-management library | `hooks/use-overlay-coordination.ts` (Pattern 3 above) | A Context provider would require converting a Server Component ancestor to Client, or inserting a new always-mounted client wrapper — more disruption than a 25-line module-scope store hook that mirrors the already-accepted `useScrollLock` shape. |

**Key insight:** every one of this phase's "don't hand-roll" traps is a case where the native platform (or this codebase's own existing shared hook) already solves the exact problem — the risk in this phase is specifically *underestimating* how much `showModal()` already does for free and adding redundant/competing JS on top of it (e.g., a manual focus trap alongside `showModal()`'s own, which is unnecessary and provides no defense against the same swipe-navigation gap it doesn't fix either).

## Common Pitfalls

### Pitfall 1: Instant jump-cut close instead of a slide-out, because `dialog.close()` hides the element before any CSS transition can run

**What goes wrong:** `close()` (whether called programmatically, or triggered natively by the browser on Escape) immediately removes the `open` attribute. The UA stylesheet rule `dialog:not([open]){display:none}` then applies instantly — `display` has no meaningful CSS transition by default, so any `transform:translateX(...)` slide-out transition declared on the panel never gets to play; the drawer simply vanishes on the same frame `close()` runs.

**Why it happens:** This is specific to native `<dialog>` and did not exist as a risk in the milestone-level `PITFALLS.md` because that document was written before any `<dialog>` existed in this codebase — it's a first-instance gap, not a previously-known one.

**How to avoid:**
- Never call `.close()` directly from the close-button/backdrop/CTA click handlers. Route every closing action through one `requestClose()` function that: (1) checks `prefers-reduced-motion` inline (matching this codebase's existing `getLenisLerp`-style convention, no new shared utility); if reduced, calls `.close()` immediately; otherwise (2) adds a `.is-closing` class (triggering the CSS slide-out via the existing `translateX` transition already declared for open state) and (3) calls the *actual* `dialogRef.current.close()` only after a `setTimeout` matching `--motion-duration-base` (450ms).
- For the Escape key specifically: `<dialog>` fires a `cancel` event *before* its default close behavior. Attach `onCancel={(e) => { e.preventDefault(); requestClose() }}` on the dialog element so Escape routes through the same animated path instead of the browser's own instant default.
- The newer CSS-only alternative — `transition: display, overlay, transform; transition-behavior: allow-discrete;` plus `@starting-style` — [CITED: web.dev/Chrome for Developers entry-animations articles, cross-checked against CSS-Tricks — MEDIUM confidence] is the modern, JS-free way to solve this exact problem, and would eliminate the need for a `setTimeout`. **Recommendation for this phase: don't adopt it here.** This codebase has zero existing usage of `@starting-style`/`allow-discrete` anywhere, uses only plain `transition:` declarations with `cubic-bezier` easing throughout `globals.css`, and this is exactly the kind of "first-ever adoption of a cutting-edge CSS feature buried inside an unrelated feature phase" this project's own "moderate, sober, not experimental" ethos argues against introducing quietly. The JS-timed `requestClose()` pattern is more code but zero new platform-feature risk and matches this codebase's existing house style (e.g., `.intro`/`.menu-overlay` already use a similar manually-tuned `transition-delay` trick for a conceptually adjacent problem — delaying `visibility:hidden`).

**Warning signs:** Clicking the close button (or pressing Escape) makes the drawer disappear instantly with no slide, even though the CSS declares a `translateX` transition; the panel's open-transition looks correct but close does not (a very common asymmetry once someone tests only "does it open nicely" and not "does it close nicely").

### Pitfall 2: The footer CTA's "close drawer + scroll to `#contacto`" sequencing races the scroll lock

**What goes wrong:** A plain `<a href="#contacto">` for the footer CTA looks like the obvious implementation (Lenis's global `anchors: true` option normally makes same-page anchor clicks smooth-scroll automatically) — but at the moment the CTA is clicked, `useScrollLock(isOpen)` has Lenis `stop()`-ped (the drawer is still open, mid-close). Whether Lenis's anchor-click handler queues, drops, or mishandles a `scrollTo` request issued while `lenis.stop()` is active is not something this codebase has ever exercised before (no prior anchor click has ever happened while Lenis was stopped) — relying on unverified behavior here is exactly the kind of thing that "works in a quick manual click-test" and then intermittently fails.

**Why it happens:** Two independently-correct-looking mechanisms (Lenis's automatic anchor interception, and the scroll-lock this same phase introduces) interact in a specific, narrow window (mid-close-animation) that's easy to not think to test.

**How to avoid:** Make the CTA a `<button type="button">`, not an anchor. Its `onClick` should: (1) call the same `requestClose()` used elsewhere (so the close animation plays), and (2) schedule `lenis.scrollTo("#contacto")` (via `useLenis()`, already available anywhere inside `<ReactLenis root>`) on the *same* delay used for the deferred `.close()` call (or, more robustly, inside the dialog's native `close` event handler — which fires only after the real close has happened and, by then, `useScrollLock`'s cleanup/effect has already called `lenis.start()` again). Explicitly test this exact interaction manually (click CTA, confirm the page smooth-scrolls to the contact form only after the drawer has visually finished closing, not before/during).

**Warning signs:** Clicking the CTA scrolls the page instantly (no smooth Lenis easing) or scrolls while the drawer panel is still visibly sliding away, or doesn't scroll at all on some clicks.

### Pitfall 3: Converting `.service-row` from `<a>` to `<button>` without resetting UA button chrome

**What goes wrong:** `<button>` elements carry browser default styling (padding, border, background, `text-align` sometimes centered) that `<a>` never had. `.service-row`'s existing CSS (`display:grid`, hover fill sweep, etc.) was written assuming an anchor with no UA-imposed box-model surprises. Swapping the tag without an explicit reset produces a row with unexpected padding/border/centered content, or — worse — a row that only partially fills its grid track width because buttons don't default to `width:100%`/block-level sizing the way anchors-as-grid-items effectively do once `display:grid` is applied to them via CSS (anchors have no competing UA button padding to override, so this asymmetry between the two tags is easy to miss if only briefly eyeballed).

**How to avoid:** Add an explicit reset alongside the tag change: `.service-row{ ...existing rules...; width:100%; text-align:left; background:transparent; border:0; padding:0; font:inherit; cursor:pointer; }` (the existing hover-state `padding-inline:1.4rem` rule already overrides `padding` on `:hover`, so the base reset must set `padding:0` explicitly, not rely on inheriting "no padding" the way the anchor implicitly had).

**Warning signs:** The row visually shifts (extra padding/border) immediately after swapping `<a>` → `<button>`, before any of the new interactive-state CSS is even added.

### Pitfall 4: Forgetting `data-lenis-prevent` on the drawer's own scrollable body

**What goes wrong:** If a service's `groups` content is long enough to overflow the panel's fixed height (eje 05, "Servicios Complementarios," has 5 sub-groups — the most content of any service, and the most likely to overflow on shorter viewports/mobile), the drawer body needs its own `overflow-y:auto`. Per this milestone's own `PITFALLS.md` UX-pitfalls table ("Applying the same aggressive Lenis touch-smoothing to the drawer's internal scrollable content as the main page... reserving Lenis's smoothing for the main marketing-page scroll experience"), the drawer's internal scroll should feel native/responsive, not Lenis-smoothed — and separately, since the main document's Lenis instance is `stop()`-ped while the drawer is open anyway, any confusion about whether wheel/touch events over the drawer are still being intercepted by the (stopped) Lenis instance should be pre-empted by explicitly excluding the region regardless.

**How to avoid:** Add `data-lenis-prevent` to `.service-drawer-body` (the scrollable content wrapper) unconditionally — this is the documented, official Lenis mechanism for exactly this case (already cited in the milestone `ARCHITECTURE.md`), and costs nothing even in the specific case where it turns out not to have been strictly necessary given `lenis.stop()`.

## Code Examples

### `ServiceDrawer` — full sketch incorporating Patterns 1–3 and Pitfalls 1–4

```tsx
// components/service-drawer.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"

import { useScrollLock } from "@/hooks/use-scroll-lock"
import type { Service } from "@/lib/site-content"

const CLOSE_ANIMATION_MS = 450 // matches --motion-duration-base, keep in sync with globals.css

interface ServiceDrawerProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function ServiceDrawer({ service, isOpen, onClose }: ServiceDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [isClosing, setIsClosing] = useState(false)
  const lenis = useLenis()

  useScrollLock(isOpen)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
  }, [isOpen])

  useEffect(() => () => clearTimeout(closeTimeoutRef.current), [])

  function requestClose() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      dialogRef.current?.close()
      return
    }
    setIsClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      dialogRef.current?.close()
    }, CLOSE_ANIMATION_MS)
  }

  function handleCtaClick() {
    requestClose()
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.setTimeout(() => lenis?.scrollTo("#contacto"), reduced ? 0 : CLOSE_ANIMATION_MS)
  }

  return (
    <dialog
      ref={dialogRef}
      className={`service-drawer ${isClosing ? "is-closing" : ""}`}
      aria-labelledby="service-drawer-title"
      onCancel={(event) => {
        event.preventDefault() // stop the browser's own instant Escape-close
        requestClose()
      }}
      onClose={() => {
        setIsClosing(false)
        onClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose() // click landed on ::backdrop
      }}
    >
      {service && (
        <div className="service-drawer-panel">
          <header className="service-drawer-header">
            <span className="mono-label">{service.number}</span>
            <h2 id="service-drawer-title">{service.title}</h2>
            <p>{service.tagline}</p>
            <button type="button" autoFocus className="service-drawer-close" onClick={requestClose}>
              <span>Cerrar</span>
            </button>
          </header>

          <div className="service-drawer-body" data-lenis-prevent>
            {service.groups.map((group, index) => (
              <div className="service-drawer-group" key={group.heading ?? index}>
                {group.heading && <p className="service-drawer-group-heading">{group.heading}</p>}
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {service.note && <p className="service-drawer-note">{service.note}</p>}
          </div>

          <footer className="service-drawer-footer">
            <button type="button" className="service-drawer-cta" onClick={handleCtaClick}>
              Cotizar este servicio
            </button>
          </footer>
        </div>
      )}
    </dialog>
  )
}
```

### `capabilities-section.tsx` — trigger conversion sketch

```tsx
// components/sections/capabilities-section.tsx (excerpt, existing file, name unchanged)
"use client"
import { useState } from "react"
import { ServiceDrawer } from "@/components/service-drawer"
import { useOverlayCoordination } from "@/hooks/use-overlay-coordination"
import { services, type Service } from "@/lib/site-content"

export function CapabilitiesSection() {
  const [activeService, setActiveService] = useState<Service | null>(null)
  const menuIsOpen = useOverlayCoordination("drawer", !!activeService)

  return (
    <>
      {/* ...existing <section>/<div className="site-shell"> wrapper unchanged... */}
      <div className="service-list">
        {services.map((service) => {
          const isSelected = activeService?.id === service.id
          return (
            <button
              type="button"
              className="service-row"
              key={service.id}
              data-reveal
              data-cursor="Ver detalle"
              aria-disabled={menuIsOpen}
              onClick={() => {
                if (menuIsOpen) return
                setActiveService(service)
              }}
            >
              <span className="service-number">{service.number}</span>
              <span className="service-title">{service.title}</span>
              <span className="service-detail">{service.detail}</span>
              <Arrow />
              {isSelected && <span className="service-row-selected-indicator" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
      <ServiceDrawer
        service={activeService}
        isOpen={!!activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  )
}
```
*(`<Arrow />` import and the surrounding `<section>`/`moving-band` markup are omitted for brevity — unchanged from the current file.)*

### CSS additions needed (sketch — exact values per UI-SPEC's Spacing/Typography/Color tables)

```css
/* Button reset for .service-row (Pitfall 3) — append to existing .service-row rule */
.service-row{width:100%;text-align:left;background:transparent;border:0;padding:0;font:inherit;cursor:pointer}
.service-row[aria-disabled="true"]{opacity:.6;cursor:not-allowed;pointer-events:none;transition:opacity var(--motion-duration-fast)}

/* First :focus-visible rules in this codebase (Current State finding) */
.service-row:focus-visible{outline:2px solid var(--focus-ring);outline-offset:-2px}

/* Native <dialog> reset — UA stylesheet otherwise adds centering/border/padding/max-width */
dialog.service-drawer{position:fixed;inset:0 0 0 auto;top:0;right:0;height:100%;margin:0;border:0;padding:0;max-width:none;max-height:none;background:transparent;width:clamp(420px,44vw,560px);transform:translateX(100%);transition:transform var(--motion-duration-base) var(--ease-moderate)}
dialog.service-drawer[open]{transform:translateX(0)}
dialog.service-drawer.is-closing{transform:translateX(100%)}
dialog.service-drawer::backdrop{background:color-mix(in srgb,var(--ink-primary) 45%,transparent);opacity:0;transition:opacity var(--motion-duration-fast) linear}
dialog.service-drawer[open]::backdrop{opacity:1}
.service-drawer-panel{background:var(--bg-surface);height:100%;overflow-y:auto;padding:32px}
@media(max-width:720px){dialog.service-drawer{width:100vw}}
@media(prefers-reduced-motion:reduce){dialog.service-drawer{transition:none}dialog.service-drawer::backdrop{transition:none}}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hand-rolled focus-trap libraries (`focus-trap-react`, custom Tab-cyclers) for modals | Native `<dialog>` + `showModal()` | Broad browser support reached ~2022 (Chrome/Edge/Firefox/Safari all shipped); [CITED: MDN dialog reference — HIGH confidence, official platform docs] this is now Baseline/widely-available | Zero new dependency for full modal semantics; this project's explicit "no shadcn/no component library" constraint is easier to satisfy than it would have been 3-4 years ago |
| `aria-hidden` + manual Tab trapping for background-content hiding | `inert` attribute | Broad support reached ~2023 (all major engines); already the milestone `PITFALLS.md`'s explicit recommendation | Covers pointer/keyboard/gesture-based screen-reader navigation in one declarative attribute instead of three separate hand-rolled mechanisms |
| Manual `dialog.close()` + hoping CSS transitions play | `@starting-style` + `transition-behavior: allow-discrete` for animatable open/close | Reached broad support roughly 2024-2025 across Chromium/Safari/Firefox | Available but **deliberately not adopted this phase** (see Pitfall 1) — flagged here so the planner/executor knows it was a considered-and-rejected option, not an oversight |

**Deprecated/outdated:** None specific to this phase beyond the above — no prior drawer/modal implementation exists in this codebase to deprecate.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Lenis's `lenis.stop()` will not itself throw or misbehave if `lenis.scrollTo(...)` is called on an already-stopped instance (used in the deferred-CTA-scroll pattern, Pitfall 2) — this codebase has never exercised this exact call sequence before. | Pitfall 2 / Code Examples | If `lenis.scrollTo` silently no-ops while stopped, the deferred call after `lenis.start()` (per the recommended sequencing) should still work correctly since `start()` runs first in the timeout order — but this exact sequencing has not been executed against the installed `lenis@1.3.25` version in this session. Verify manually during execution; low risk since the fallback (native `scrollIntoView`) is a trivial one-line swap if `lenis.scrollTo` proves unreliable post-stop. |
| A2 | Keeping `capabilities-section.tsx`/`CapabilitiesSection` unrenamed (deviating from the milestone `ARCHITECTURE.md`'s suggested `services-section.tsx`/`ServicesSection` rename) is the right call for this phase, since no REQUIREMENTS.md item or UI-SPEC line mandates the rename and UI-SPEC references the file by its current name throughout. | Summary / Current State | If a later phase (or the user) actually wants the semantic rename, it becomes a small, isolated follow-up (rename file + import in `page.tsx` + component name) — low risk, purely cosmetic, no behavior change. |
| A3 | The exact mechanism for wiring `<main inert>` across the Server/Client boundary (Pattern 1's "Open question") is left as a planner-time decision among the four options listed, rather than resolved to one single answer in this research. | Architecture Patterns, Pattern 1 | If the planner picks option (a) — skip explicit `<main inert>`, rely on native `showModal()` modality alone — and a reviewer/checker later insists on a literal `inert` attribute somewhere in the DOM to satisfy SERV-02's wording, this becomes a small follow-up task, not a redesign, since the underlying modal behavior is already correct either way (per the spec fact cited). |

## Open Questions (RESOLVED)

1. **Exactly where does `<main inert>` (or an equivalent wrapper) get applied, given `app/page.tsx` is a Server Component?**
   - What we know: the underlying modal behavior (background unreachable) is already fully correct via `showModal()` alone, regardless of whether an explicit `inert` attribute is also present anywhere (Pattern 1, spec-cited).
   - What's unclear: whether SERV-02's literal wording ("usando `<dialog>` nativo con `inert` en el fondo") is satisfied by "the browser does this natively and it's independently verifiable via `document.activeElement`/tab-order testing" or requires a grep-able `inert` HTML attribute physically present in the rendered markup for a future auditor/checker to find.
   - **RESOLVED (orchestrator, 2026-07-20): option (d) — explicit `InertBoundary` client wrapper**, applied around every section except `CapabilitiesSection` (Hero, Manifesto, Technology, Process, Contact, header), driven by `useOverlayOpen("drawer")` from the same `useOverlayCoordination` store. Implemented in `03-03-PLAN.md` Task 2 (`components/inert-boundary.tsx`, wired into `app/page.tsx`). `app/page.tsx` remains a Server Component; only the new wrapper is a client component. This makes SERV-02's "inert en el fondo" wording independently grep-able in rendered markup, not just implicitly true via native `showModal()` behavior.

2. **Does the drawer need to handle the case where a user opens a *different* service while one is already open (row A open, user clicks row B)?**
   - What we know: `activeService` is a single `useState<Service|null>`, so clicking row B while row A's drawer is open simply calls `setActiveService(serviceB)` — React re-renders, the `service` prop changes, but the `<dialog>`'s own `isOpen` prop stays `true` throughout (never goes through `false`), so the existing `showModal()`-only-if-`!dialog.open` effect never re-fires `showModal()` — the dialog just re-renders its content in place with the new service's data, with no close/reopen animation.
   - What's unclear: whether that's actually the desired UX (instant content swap while panel stays open) or whether UI-SPEC's mutual-exclusivity design (which only addresses drawer-vs-menu, not drawer-vs-drawer) implicitly assumes a user must close the drawer before opening a different service.
   - **RESOLVED (orchestrator, 2026-07-20): ship the safer/simpler default — instant in-place content swap**, no close/reopen animation cycle, no special-case handling added. This is what the existing `setActiveService`/`showModal()-only-if-!dialog.open` pattern already does correctly with zero extra code. Referenced in `03-02-PLAN.md` Task 1. Re-open-cycle polish deferred indefinitely unless explicitly requested later.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none — automated tests (unit/E2E) are explicitly out of scope for this entire milestone (`REQUIREMENTS.md` "Out of Scope" table: "Tests automatizados (unit/E2E) \| Fuera de alcance, ya documentado en `CONCERNS.md`"). Verified: no test config files, no test framework in `package.json` devDependencies (only ESLint/TypeScript). |
| Config file | none |
| Quick run command | `npm run lint && npm run typecheck` (fastest automatable signal for this phase — catches type errors in the new `Service`-typed props/hook, and any obvious JSX/attribute mistakes, but not runtime/interaction correctness) |
| Full suite command | `npm run lint && npm run typecheck && npm run build` (QA-01's actual gate, per REQUIREMENTS.md) — no test-runner command exists to add here |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | Manual Verification |
|--------|----------|-----------|-------------------|-------------|
| SERV-01 | 5 rows render as distinct clickable units, not flowing text | manual-only | `npm run typecheck` (structural safety net only) | Visual scan: 5 rows visible, each independently clickable/hoverable |
| SERV-02 | Click a row → drawer opens with that service's `groups`/`note`; Esc/backdrop/close-button all close it; focus starts on close button, returns to the trigger row on close; background is unreachable via Tab and via mouse click while open | manual-only | none (interaction/focus-order testing has no automated command in this project) | Tab through the page with drawer open (confirm background unreachable); confirm focus lands on close button on open and back on the trigger button on close; click backdrop and press Esc, confirm both animate-close correctly (Pitfall 1) |
| SERV-03 | Opening the drawer disables the hamburger trigger (visually + `aria-disabled` + click no-ops); opening the menu disables every service row the same way; neither force-closes the other; scroll is locked while either is open | manual-only | none | Open drawer, attempt to open menu (should be visually disabled, click no-ops); open menu, attempt to open drawer (same); confirm background page does not scroll via wheel/trackpad while either is open |

### Sampling Rate
- **Per task commit:** `npm run lint && npm run typecheck`
- **Per wave merge:** `npm run build` (production build, since `npm run dev` has known discrepancies for some browser-API-dependent behavior per this milestone's own `PITFALLS.md` Pitfall 9 precedent — worth re-verifying the drawer specifically in a production build too, not just brochure downloads)
- **Phase gate:** All three manual verification rows above walked through explicitly before `/gsd-verify-work`, since none have an automated substitute

### Wave 0 Gaps
None — no test infrastructure exists to gap-fill, since automated testing is explicitly out of scope for this milestone. The gap is inherent and already acknowledged in `REQUIREMENTS.md`/`STATE.md`, not something this phase should attempt to fill unilaterally.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth surface touched by this phase |
| V3 Session Management | no | No session/cookie surface touched |
| V4 Access Control | no | No access-control surface — all 5 services' content is public, identical for every visitor |
| V5 Input Validation | no | The drawer is entirely read-only/display-only content sourced from `lib/site-content.ts` (static, build-time, not user input); the only interactive element that writes anywhere is the pre-existing contact form, unmodified by this phase |
| V6 Cryptography | no | Not applicable |
| V11 (informational) Business Logic — content integrity | n/a, informational only | `service.groups`/`note` are typed (`ServiceGroup[]`, `string`) and statically authored — a missing/malformed entry is a build-time content bug (already correctly identified as N/A in UI-SPEC's Copywriting Contract "Error state" row), not a runtime security surface |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| N/A this phase | — | This phase introduces no new attack surface: no new form fields, no new API routes, no new user-controlled input, no new external data source. The one XSS-adjacent question — does any of `service.title`/`tagline`/`groups[].items`/`note` ever render via `dangerouslySetInnerHTML`? — is answered by direct inspection of the Code Examples above: every field renders via plain JSX text interpolation (`{service.title}`, `<li key={item}>{item}</li>`), which React escapes by default. No `dangerouslySetInnerHTML` is used or needed anywhere in this component. |

## Environment Availability

Skipped — this phase has no external tool/service/CLI dependency beyond already-installed npm packages (`lenis`, `gsap`, both already verified present and in use by prior phases) and native browser platform features (`<dialog>`, `inert`, `::backdrop`), which are runtime browser-engine capabilities, not local development-environment dependencies to probe for.

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: `components/sections/capabilities-section.tsx`, `lib/site-content.ts`, `components/custom-cursor.tsx`, `components/menu-overlay.tsx`, `hooks/use-scroll-lock.ts`, `components/arrow.tsx`, `app/globals.css`, `app/page.tsx`, `components/providers/smooth-scroll-provider.tsx`, `lib/motion-preferences.ts`, `lib/gsap.ts`, `package.json`, `.planning/config.json` — all read directly this session, post-Phase-2 state, not assumed from prior milestone research
- [MDN — `<dialog>` HTML dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) — HIGH confidence (official platform documentation)
- [MDN — HTMLDialogElement: showModal() method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) — HIGH confidence (official platform documentation)

### Secondary (MEDIUM confidence — WebSearch cross-checked against official/authoritative sources)
- WHATWG HTML spec interaction/inert semantics (dialogs escape ancestor inertness) — cross-checked via search results citing the WHATWG HTML Standard directly plus MDN's `inert` reference page
- [Go Make Things — How to dismiss native HTML dialog elements when the backdrop is clicked](https://gomakethings.com/articles/how-to-dismiss-native-html-dialog-elements-when-the-backdrop-is-clicked/) and its follow-up "Revisiting..." post — the `event.target === dialog` backdrop-click-close pattern, cross-checked against multiple independent implementation write-ups converging on the same technique
- [web.dev — Now in Baseline: animating entry effects](https://web.dev/blog/baseline-entry-animations) / [Chrome for Developers — Four new CSS features for smooth entry and exit animations](https://developer.chrome.com/blog/entry-exit-animations) / [CSS-Tricks — transition-behavior](https://css-tricks.com/almanac/properties/t/transition/transition-behavior/) — `@starting-style`/`allow-discrete` mechanics, considered and explicitly not adopted this phase (Pitfall 1)

### Tertiary (LOW confidence — carried forward from milestone-level research, not independently re-verified this session)
- `.planning/research/ARCHITECTURE.md` (2026-07-18) — milestone-level component/data-flow recommendations, largely confirmed by this session's direct codebase re-inspection, with two explicit deviations noted (component naming kept as-is; mutual-exclusivity mechanism upgraded from body-attribute to shared hook)
- `.planning/research/PITFALLS.md` (2026-07-18) — milestone-level pitfalls (Pitfall 4/5, `inert` vs `aria-hidden`, Lenis scroll-lock) — this session's Current State findings confirm the underlying hooks (`useScrollLock`) already correctly implement the recommended fix from that document

## Metadata

**Confidence breakdown:**
- Standard stack (native `<dialog>`, no new dependency): HIGH — directly verified against this codebase's `package.json` and cross-checked platform docs
- Architecture (state ownership, mutual-exclusivity hook): HIGH for the state-ownership location (directly verified against existing file structure); MEDIUM for the specific `useOverlayCoordination` hook design (first-party recommendation this session, not externally validated against a similar production implementation, though it uses only built-in React 19 APIs)
- Pitfalls (dialog close-animation timing, CTA scroll sequencing): MEDIUM — cross-checked against multiple independent sources for the general mechanism, but the exact interaction with this project's specific `lenis@1.3.25` + `useScrollLock` combination has not been runtime-tested this session (see Assumption A1)

**Research date:** 2026-07-20
**Valid until:** Native `<dialog>`/`inert` platform behavior: effectively indefinite (Baseline web platform features, not a fast-moving target). Project-specific findings (exact file states, exact CSS): valid until the next phase touches any of `capabilities-section.tsx`, `globals.css`, or `use-scroll-lock.ts` — re-verify Current State section if execution is delayed significantly past this research date.
