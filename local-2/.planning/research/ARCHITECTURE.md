> Note: this file continues (does not replace) `.planning/archive/v1.0-dogstudio-superseded/research/ARCHITECTURE.md`, which documented the Lenis+GSAP foundation (root `SmoothScrollProvider`, per-section `useGSAP` scoping, the `FormConnector` fix). That foundation is unchanged and reused as-is. This file covers the four **new** UI capabilities for the current milestone: service drawer, carousel, sticky/reactive header, brochure download.

# Architecture Research

**Domain:** Integrating new interactive UI patterns (side-drawer, carousel, scroll-reactive sticky header, PDF download) into an existing Next.js 16 / React 19 component-per-section + Lenis/GSAP marketing site
**Researched:** 2026-07-18
**Confidence:** HIGH (derived directly from the current codebase — `components/`, `lib/`, `app/`, `.planning/codebase/CONCERNS.md` — plus official Lenis documentation for the one external claim, `data-lenis-prevent`)

## Current State (verified directly from code, not assumed)

- **Header is *already* `position: fixed`** (`.site-header{position:fixed;z-index:500;top:0}` in `app/globals.css`, rendered by `components/menu-overlay.tsx`). It is *always* visible today — there is no scroll-reactive behavior (no background solidify, no hide-on-scroll-down). "Encabezado fijo" in the brief is therefore not a positioning change, it's a **new scroll-reactive visual state** layered on top of positioning that already works.
- **`MenuOverlay`** is the one component that already colocates two visually-distinct DOM regions (`<header>` + full-viewport `<div className="menu-overlay">`) under one `menuOpen` `useState`. It has **zero `useGSAP`/ref usage today** — menu open/close is pure CSS class toggling driven by React state. Scroll lock while the menu is open is CSS-only (`body.menu-open{overflow:hidden}`), not `lenis.stop()`/`lenis.start()` — the prior architecture research recommended the `useLenis()` stop/start approach but it was never implemented; this is a real, small existing gap (see Pitfalls).
- **`CustomCursor`** attaches `pointerenter`/`pointerleave` listeners to a **fixed NodeList** captured once at mount: `Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"))` inside a `useEffect(..., [])`. Any `[data-cursor]` element that enters the DOM *after* this effect runs (i.e., anything conditionally mounted later — a drawer's close button, a carousel's arrow controls, a service link inside a drawer panel) **will never receive cursor listeners**. This is the same *class* of bug as the fixed `FormConnector` (implicit assumption about DOM timing, silent failure, no type safety) even though it isn't literally `querySelector`-to-wire-a-handler-across-components — it's `querySelector`-once-at-mount-to-wire-handlers-onto-elements-that-don't-exist-yet.
- **`useLegacyParallax`** (`hooks/use-legacy-parallax.ts`) is a second, independent scroll loop: a raw `window.addEventListener("scroll", ...)` + manual `requestAnimationFrame` + `getBoundingClientRect()` on every frame, running *alongside* the GSAP-ticker-synced Lenis loop that `SmoothScrollProvider` establishes. It is already flagged in `CONCERNS.md` ("Animation Frame Recalculation") and in the prior `ARCHITECTURE.md` (Anti-Pattern 3). It is legacy debt, out of scope to fix in this milestone, but it is the **exact anti-pattern to not repeat** when building the new scroll-reactive header.
- **Services grid** lives entirely in `components/sections/capabilities-section.tsx`, rendering `services` from `lib/site-content.ts` (a flat array of `{ number, title, detail }`). This is the natural trigger surface for the new drawer — there is currently no separate "detail" data per service, and no drawer/modal pattern anywhere in the codebase to extend.
- **No carousel library, no modal/drawer library, no client-side router-based UI state** exists anywhere in `package.json`. Zero global state library (confirmed constraint, matches `PROJECT.md`).
- **Lenis is configured with no custom `wrapper`/`content` options** (`<ReactLenis root options={{ autoRaf: false, syncTouch: true, anchors: true, lerp }}>`), meaning it scrolls the real `window`/`document.documentElement` — there is **no transformed wrapper `<div>`** around the app. This matters concretely: `position: fixed` elements (header, drawer, menu overlay) work correctly from anywhere in the React tree without needing a portal, because no ancestor establishes a new containing block via `transform`.
- `next.config.ts` has no `output: "export"` — only the single route is `force-static`. Dynamic routes/API routes coexist fine; this leaves room for a URL-driven drawer later if ever needed, but nothing in the brief requires it now.

## Standard Architecture (this milestone's additions)

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  app/layout.tsx (Server) → <SmoothScrollProvider> (UNCHANGED)             │
│  Single Lenis instance, ticked from gsap.ticker — foundation, untouched   │
├──────────────────────────────────────────────────────────────────────────┤
│  app/page.tsx (Server, force-static) — composition only, UNCHANGED shape  │
│                                                                            │
│  ┌────────────────────┐   owns menuOpen state (existing)                 │
│  │ MenuOverlay         │   + NEW: header scroll-reactive class            │
│  │ (client)            │   via useHeaderScrollState() hook (Pattern A)    │
│  │ <header> + overlay  │   header stays position:fixed (unchanged CSS)    │
│  └────────────────────┘                                                  │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────┐          │
│  │ ServicesSection (was CapabilitiesSection)  (client)         │          │
│  │  - renders service grid (existing)                          │          │
│  │  - NEW: owns activeService state (useState<Service|null>)   │          │
│  │  - NEW: renders <ServiceDrawer> as a sibling, passes state  │          │
│  │         down as props — no DOM query, no Context needed     │          │
│  │         (single producer, single consumer, same file)       │          │
│  └───────────────┬──────────────────────────────────────────┬─┘          │
│                  ▼ props (service, isOpen, onClose)          │            │
│      ┌─────────────────────────┐                              │            │
│      │ ServiceDrawer (client)  │  position:fixed panel         │            │
│      │  - presentational only  │  data-lenis-prevent on its    │            │
│      │  - useScrollLock(isOpen)│  own scrollable content       │            │
│      │    → useLenis().stop/  │  focus trap + Escape to close  │            │
│      │      start (NEW shared │                                │            │
│      │      hook, Pattern B)  │                                │            │
│      └─────────────────────────┘                              │            │
│                                                                            │
│  ┌────────────────────────────────────────┐                              │
│  │ TechnologySection (client)              │                              │
│  │  NEW: renders <EquipmentCarousel        │  self-contained,             │
│  │       items={equipment} />              │  CSS scroll-snap +           │
│  │       (Pattern C)                       │  data-lenis-prevent,         │
│  └────────────────────────────────────────┘  local activeIndex state     │
│                                                                            │
│  Brochure: no new component — <a href="/brochures/....pdf" download>     │
│  in MenuOverlay header and/or ContactSection, driven by a data constant   │
│  in lib/site-content.ts. Zero state, zero coupling. (Pattern D)          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `hooks/use-header-scroll-state.ts` (NEW) | Toggle a class on the header once the page has scrolled past a threshold, driven by the *existing* single Lenis/GSAP ticker | `useGSAP` + `ScrollTrigger.create({ start: "100px top", toggleClass: {...} })`, no manual scroll listener |
| `MenuOverlay` (existing, extended) | Still owns `menuOpen`; now also calls the new header-scroll hook on its own `<header>` ref | No structural change — one more hook call in the same file |
| `ServicesSection` (renamed/extended from `CapabilitiesSection`) | Owns `activeService` state; renders grid + drawer as siblings | `useState<Service \| null>`, passes whole object down, not an id to re-look-up |
| `ServiceDrawer` (NEW) | Pure presentational panel: renders whatever `service` prop it's given, calls `onClose` prop | `"use client"`, receives props only, contains zero data-fetching/lookup logic |
| `hooks/use-scroll-lock.ts` (NEW, shared) | Central place that stops/starts Lenis when *any* full-viewport overlay opens (menu OR drawer) | Wraps `useLenis()`, exposes `lock()`/`unlock()`; both `MenuOverlay` and `ServiceDrawer` (and future overlays) call this one hook |
| `EquipmentCarousel` (NEW) | Self-contained horizontal carousel of equipment/drone/camera media | Native CSS scroll-snap container + `data-lenis-prevent`, local `activeIndex` state, optional GSAP-driven programmatic `scrollTo` for prev/next buttons |
| `lib/site-content.ts` (existing, extended) | Single source of truth for service detail (used by both grid *and* drawer), equipment list, brochure metadata | Extend each `service` object with `longDetail`/`image`/`specs` fields; add `equipment` array and `brochure` constant |
| `CustomCursor` (existing, needs a fix alongside this milestone) | Currently queries `[data-cursor]` once at mount — must move to event delegation before drawer/carousel add new `[data-cursor]` elements | `document.addEventListener("pointerover", e => e.target.closest("[data-cursor]"))` instead of a static `querySelectorAll` snapshot |

## Recommended Project Structure

```
components/
├── providers/
│   └── smooth-scroll-provider.tsx     # UNCHANGED
├── sections/
│   ├── services-section.tsx           # renamed from capabilities-section.tsx
│   │                                   # owns activeService state, renders grid + <ServiceDrawer>
│   ├── technology-section.tsx         # extended: renders <EquipmentCarousel items={equipment} />
│   ├── hero-section.tsx               # UNCHANGED
│   ├── manifesto-section.tsx          # UNCHANGED
│   ├── process-section.tsx            # UNCHANGED
│   └── contact-section.tsx            # extended: brochure CTA link (optional, static <a>)
├── service-drawer.tsx                 # NEW — presentational, props-only, no data lookup
├── equipment-carousel.tsx             # NEW — self-contained, local state only
├── menu-overlay.tsx                   # extended: adds useHeaderScrollState() on header ref
├── custom-cursor.tsx                  # FIX: querySelectorAll-at-mount → event delegation
├── contact-form.tsx                   # UNCHANGED
└── intro-sequence.tsx                 # UNCHANGED
hooks/
├── use-header-scroll-state.ts         # NEW — ScrollTrigger toggleClass, single ticker
├── use-scroll-lock.ts                 # NEW — shared Lenis stop/start for any full-viewport overlay
└── use-legacy-parallax.ts             # UNCHANGED (existing debt, do not extend/copy its pattern)
lib/
├── gsap.ts                            # UNCHANGED
├── motion-preferences.ts              # UNCHANGED
└── site-content.ts                    # extended: richer `services`, new `equipment`, new `brochure`
public/
└── brochures/
    └── skytech-solutions-brochure.pdf # static asset, versioned filename for cache-busting
```

### Structure Rationale

- **`service-drawer.tsx` and `equipment-carousel.tsx` live as top-level files in `components/`, not nested inside `sections/`:** they are reusable UI primitives, not page sections themselves — mirrors the existing split between `components/sections/*` (page structure) and `components/contact-form.tsx`/`components/custom-cursor.tsx` (cross-cutting UI pieces).
- **`ServiceDrawer` takes props, not a lookup key:** the section that renders the grid already has the full `service` object in scope (it's mapping over `services` to render the grid). Passing that *same object* into drawer state means the drawer never needs to re-resolve "which service is this" from an id/string — eliminating a second, unnecessary string-keyed coupling point in a codebase whose one prior architectural failure was exactly a string-keyed (`#contact-form` id) coupling point.
- **`use-scroll-lock.ts` is shared, not duplicated per component:** both `MenuOverlay` and `ServiceDrawer` need "stop background scroll while I'm open." Writing this once and having both call it (rather than each re-implementing its own body-class toggle) is the direct application of Pattern 5 from the prior `ARCHITECTURE.md` ("centralize cross-cutting scroll concerns in one hook, don't scatter them").
- **`hooks/use-header-scroll-state.ts` is separate from `menu-overlay.tsx`'s own logic:** the header gains a second, unrelated concern (scroll-reactive styling vs. menu open/close). Keeping that concern in its own hook file — called from `MenuOverlay`, but not written inline in it — prevents `MenuOverlay` from re-accumulating the kind of multi-concern bloat that the original `experience.tsx` God-component anti-pattern was built from (see prior `ARCHITECTURE.md` Anti-Pattern 2).

## Architectural Patterns

### Pattern A: Scroll-reactive header via `ScrollTrigger.create` + `toggleClass` (not a scroll listener)

**What:** The header is already `position: fixed` — it does not itself move on scroll, so it cannot be scroll-triggered by its own bounding box in the usual "element enters viewport" sense. Instead, use `ScrollTrigger.create({ start: "100px top", toggleClass: { targets: headerRef.current, className: "is-scrolled" } })` inside a `useGSAP` scoped to the header's own ref, mounted in `MenuOverlay`. Because `SmoothScrollProvider` already ticks Lenis from `gsap.ticker` and `ScrollTrigger` reads native `window.scrollY`, this "just works" through the *same* single frame loop everything else already uses — no new `window.addEventListener("scroll", ...)`.

**When to use:** Always, for any scroll-position-driven visual change (header background solidify, hide-on-scroll-down, shrink-on-scroll). This is the one correct place in the codebase to add this kind of behavior; it is deliberately *not* going in `use-legacy-parallax.ts` or a new bespoke scroll listener.

**Trade-offs:** Requires giving the `<header>` element a ref and wrapping the toggle in `useGSAP`/`gsap.matchMedia()` — a few more lines than a naive `addEventListener`, but it is the only approach that doesn't reintroduce a second competing frame loop (the exact anti-pattern already flagged for `use-legacy-parallax.ts`).

**Example:**
```tsx
// hooks/use-header-scroll-state.ts
"use client"
import { RefObject } from "react"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

export function useHeaderScrollState(headerRef: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    if (!headerRef.current) return
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        start: "100px top",
        toggleClass: { targets: headerRef.current!, className: "is-scrolled" },
      })
      return () => trigger.kill()
    })
    // reduced-motion branch: apply the "scrolled" state instantly via a lighter check,
    // or skip the transition entirely — decide per the moderate-animation brief.
    return () => mm.revert()
  }, { dependencies: [headerRef] })
}
```
`MenuOverlay` calls `useHeaderScrollState(headerRef)` with a ref on its existing `<header>` element — no other code in `MenuOverlay` changes.

### Pattern B: One shared `useScrollLock` for every full-viewport overlay (menu, drawer)

**What:** A small hook wrapping `useLenis()` that both `MenuOverlay` (existing menu) and the new `ServiceDrawer` call with their own `isOpen` boolean. It calls `lenis.stop()`/`lenis.start()` (the officially documented Lenis pause mechanism) instead of relying only on `body{overflow:hidden}` (today's `MenuOverlay` behavior, which happens to work but leaves Lenis's internal velocity/target state unsynced with the visual lock).

**When to use:** Any component that needs to fully block page scroll while it's open. This directly replaces the ad-hoc `body.classList.toggle("menu-open", ...)` + CSS-only lock with the documented API, and is the single place both current and future overlays plug into — not duplicated per component.

**Trade-offs:** One more shared hook to maintain, but it collapses what would otherwise become two (or more, as overlays are added) near-identical, slightly-different lock implementations into one. Also must resolve the **mutual-exclusivity edge case**: the hamburger `MenuOverlay` and the `ServiceDrawer` are both full-viewport interactive layers; opening one while the other is open must close the other (two independent overlay `open` states with no coordination is a real regression risk here) — the cleanest fix without adding global state is to have `ServiceDrawer`'s open handler in `ServicesSection` also collapse `MenuOverlay`'s `menuOpen`... but `MenuOverlay` owns that state locally. Simplest resolution that doesn't require lifting state: give the drawer a **higher `z-index` than the header** but keep it visually incompatible with the menu overlay being open by disabling the service-grid trigger buttons (or the hamburger button) while the other is open, checked via `document.body`'s existing overlay-state class as a *read-only* CSS/attribute check (e.g., `body[data-overlay-open]`), not by one component reaching into another's React state. This is a legitimate, narrow use of a DOM *attribute* as a shared read-only signal (not a query-and-wire-a-handler pattern) — acceptable because it's one-directional (`body` attribute reflects state, nothing queries it to attach event listeners) and low-risk.

**Example:**
```tsx
// hooks/use-scroll-lock.ts
"use client"
import { useEffect } from "react"
import { useLenis } from "lenis/react"

export function useScrollLock(isLocked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    if (isLocked) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [lenis, isLocked])
}
```

### Pattern C: Self-contained carousel — native CSS scroll-snap, not a new dependency

**What:** `EquipmentCarousel` is a self-contained horizontal scroll container (`overflow-x: auto; scroll-snap-type: x mandatory`) with `data-lenis-prevent` (and `overscroll-behavior-x: contain`, per official Lenis guidance) so Lenis's document-level wheel/touch interception does not fight the carousel's own native horizontal scroll. Prev/next buttons call `container.scrollTo({ left, behavior: "smooth" })` or, if a GSAP-driven easing curve matching the rest of the site's motion language is wanted, `gsap.to(container, { scrollLeft: target, duration, ease })`. Active-slide state (`activeIndex`) is fully local `useState`, recalculated on `scroll` (debounced) or on button click — nothing outside this component needs to know which slide is active.

**When to use:** For the equipment/drone/camera carousel as specified in the brief. This is the right level of complexity for ~4-8 items with prev/next controls; no drag-momentum, no infinite-loop, no autoplay was requested.

**Trade-offs:** A dedicated library (e.g. Embla Carousel) would add drag-with-momentum, infinite loop, and built-in a11y affordances essentially for free, at the cost of one new dependency in a project that currently has zero UI dependencies and an explicit "evaluate new dependencies case by case" constraint. Given the modest scope (a handful of items, simple prev/next), the native scroll-snap approach is the better default; revisit only if design requires drag-to-scroll momentum or infinite looping that scroll-snap can't express cleanly.

**Example:**
```tsx
// components/equipment-carousel.tsx
"use client"
import { useRef, useState } from "react"
import { gsap } from "@/lib/gsap"

export function EquipmentCarousel({ items }: { items: { id: string; label: string; image: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function goTo(index: number) {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    if (!slide) return
    gsap.to(track, { scrollLeft: slide.offsetLeft, duration: 0.6, ease: "power3.out" })
    setActiveIndex(index)
  }

  return (
    <div className="equipment-carousel">
      <div ref={trackRef} className="equipment-track" data-lenis-prevent>
        {items.map((item) => (
          <figure key={item.id} className="equipment-slide">{/* image, label */}</figure>
        ))}
      </div>
      <button type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>Anterior</button>
      <button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === items.length - 1}>Siguiente</button>
    </div>
  )
}
```

### Pattern D: Brochure as a static public asset, not a generated document

**What:** The brochure is company-wide, static marketing collateral — not personalized or data-driven per user/session. It belongs in `public/brochures/skytech-solutions-brochure.pdf`, linked with a plain `<a href="/brochures/skytech-solutions-brochure.pdf" download>Descargar brochure</a>`. No route handler, no PDF-generation library (`react-pdf`, Puppeteer, etc.), no server logic at all.

**When to use:** Always, for this brief — "brochure descargable" is one static company document, not a per-service or per-user generated artifact. If per-service brochures are added later, keep the same pattern (one static file per service in `public/brochures/<slug>.pdf`, referenced by a `brochureHref` field on each `service` object in `lib/site-content.ts`) rather than introducing a generation pipeline.

**Trade-offs:** None meaningful for this use case — a generated-PDF approach would add a runtime dependency, cold-start latency on a serverless route, and zero benefit since the content isn't dynamic. The only real considerations are asset hygiene: keep the PDF file size reasonable (this codebase already has one flagged oversized-asset pitfall — the 9.37 MB hero video, per `CONCERNS.md` — don't repeat that class of mistake with an unoptimized PDF), and use a versioned filename (or a `?v=` query string) for cache-busting when the brochure content is updated, since Next.js does not hash `public/` assets automatically the way it hashes imported/bundled assets.

## Data Flow

### Service Drawer Flow

```
User clicks a service row in ServicesSection (button/anchor, NOT a link to #contacto anymore
  for the drawer-triggering rows — or kept as a secondary CTA inside the drawer itself)
    ↓
onClick={() => setActiveService(service)}   ← same component, same file, full object, not an id
    ↓
ServicesSection re-renders → <ServiceDrawer service={activeService} isOpen={!!activeService}
                                             onClose={() => setActiveService(null)} />
    ↓
ServiceDrawer (presentational) renders service.longDetail/image/specs from props
    ↓
useScrollLock(isOpen) → lenis.stop() / lenis.start()  (Pattern B)
    ↓
Escape key / backdrop click / close button → onClose() prop → setActiveService(null)
```

### Header Scroll-Reactive Flow

```
User scrolls (wheel/touch) → Lenis (unchanged) → lenis.raf() ticked from gsap.ticker (unchanged)
    ↓
ScrollTrigger reads native window.scrollY (unchanged, no scrollerProxy)
    ↓
ScrollTrigger instance created by useHeaderScrollState (Pattern A) crosses its "100px top" threshold
    ↓
toggleClass adds/removes "is-scrolled" on the header DOM node directly (GSAP-managed, not React state)
    ↓
CSS transition on .site-header.is-scrolled handles the visual change (background, size, etc.)
```
Note: this deliberately does **not** flow through React state (`useState`) for the class toggle — `ScrollTrigger`'s `toggleClass` mutates the DOM directly, exactly like the existing reveal-on-scroll pattern already used in every section (`IntersectionObserver` → `classList.add("is-visible")`). This is consistent with how the rest of the codebase already handles scroll-driven visual state, not a new paradigm.

### Carousel Flow

```
User clicks prev/next (or drags/scrolls natively within the carousel's own scroll container)
    ↓
data-lenis-prevent on the track element stops Lenis from intercepting these wheel/touch events
    ↓
gsap.to(track, { scrollLeft: ... }) or native container.scrollTo(...)
    ↓
Local activeIndex state updates (for dot indicators / disabled prev-next buttons)
```
This flow never touches Lenis, `ScrollTrigger`, or any other section — it is fully self-contained inside `EquipmentCarousel`.

### Key Data Flows

1. **Service data → both grid and drawer, single source:** `lib/site-content.ts`'s `services` array is read once by `ServicesSection`, and the *same* objects (not a second lookup) flow into both the grid rendering and the drawer's `service` prop. There is exactly one place service content is authored.
2. **Overlay coordination via a read-only DOM attribute, not cross-component state reads:** if `MenuOverlay` and `ServiceDrawer` need to know about each other's open state to enforce mutual exclusivity, the *only* sanctioned channel is a `body` attribute/class that one side writes and the other reads defensively (e.g., disable a trigger button) — never a `document.querySelector` reach into the other component's rendered DOM to attach or infer behavior.
3. **Scroll lock flows through one hook, not two independent implementations:** `useScrollLock` is the single point where "is anything full-viewport open right now" translates into `lenis.stop()`/`lenis.start()`.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (6 services, ~4-8 equipment items, 1 brochure) | Everything above is sufficient as-is: local component state, one shared scroll-lock hook, no library additions. |
| Growth (10+ services with rich detail, multiple carousels across sections, per-service brochures) | `ServiceDrawer` content payload grows — consider `next/dynamic` for any heavy media inside the drawer (video, high-res imagery) so it isn't bundled into the initial page load. `EquipmentCarousel` becomes reusable as-is (already takes `items` as a prop) — no rework needed to add a second carousel elsewhere. |
| Multi-page site added later (dedicated `/servicios/[slug]` pages for SEO) | This is the point where the drawer's local-state approach would be revisited in favor of the URL-driven / intercepting-route pattern mentioned above — not needed now, but the fact that `ServiceDrawer` is already a pure, props-only presentational component means it could be reused (or trivially adapted) as the content of a real route/modal without rewriting its internals. |

### Scaling Priorities

1. **First likely friction point:** drawer content payload size if service detail grows to include video or many high-res images — mitigate with `next/dynamic(..., { ssr: false })` on the heaviest media inside `ServiceDrawer`, and lazy-load images with `next/image` (already the convention elsewhere in this codebase).
2. **Second likely friction point:** if a second/third carousel is added elsewhere on the page, confirm each carousel instance's `data-lenis-prevent` container is uniquely scoped (it is, by construction — no shared/global carousel state) and that `ScrollTrigger.refresh()` (existing centralized concern per the prior `ARCHITECTURE.md`, Pattern 5) is called after carousel-driven layout shifts if any carousel affects surrounding section height.

## Anti-Patterns (specific to this milestone — do not reintroduce this class of bug)

### Anti-Pattern 1: Looking up drawer/carousel content by a string id instead of holding the object

**What people do:** Store `activeServiceId: string | null` and re-look-up `services.find(s => s.id === activeServiceId)` inside `ServiceDrawer` (or worse, via a DOM `data-service-id` attribute read by another component).

**Why it's wrong:** This is structurally the same class of fragility as the fixed `FormConnector` bug — a string key is the only thing connecting two places, with no type safety, and it silently returns `undefined` if the id is ever renamed, duplicated, or the lookup array changes shape.

**Do this instead:** Store the *entire* `Service` object as state (`activeService: Service | null`) and pass it directly as a prop. `ServiceDrawer` never performs a lookup — it only renders what it's given.

### Anti-Pattern 2: A second `document.querySelectorAll` snapshot for new `[data-cursor]`/`[data-reveal]` elements introduced by the drawer or carousel

**What people do:** Assume `CustomCursor`'s existing `[data-cursor]` wiring or a section's `IntersectionObserver`-based reveal wiring will "just work" for new elements added inside the drawer or carousel, without checking that those wiring mechanisms actually re-scan after the new elements mount.

**Why it's wrong:** `CustomCursor` queries `[data-cursor]` exactly once, at its own mount time (see Current State above) — elements added later (anything inside a conditionally-rendered `ServiceDrawer`) are invisible to it. This reproduces the "silent failure, no type safety, DOM-timing-dependent" failure mode the codebase already paid down once for the form.

**Do this instead:** Before (or alongside) building the drawer, convert `CustomCursor` to event delegation (`document.addEventListener("pointerover", (e) => (e.target as HTMLElement).closest("[data-cursor]"))`) so it works for any current or future `[data-cursor]` element regardless of when it mounts — this is already the exact fix CONCERNS.md itself suggests. If the drawer/carousel don't need custom-cursor interactivity, skip `data-cursor` on their elements entirely rather than adding it and assuming it works.

### Anti-Pattern 3: A second scroll listener for the header, running alongside the Lenis/GSAP ticker

**What people do:** Add `window.addEventListener("scroll", () => setIsScrolled(window.scrollY > 100))` directly in `MenuOverlay` because it looks like the fastest way to get "sticky header changes on scroll" working.

**Why it's wrong:** This is a second, independent frame-adjacent update source competing with the single ticked Lenis+GSAP loop that the whole rest of the site depends on — the exact anti-pattern already flagged for `use-legacy-parallax.ts` (`CONCERNS.md`, "Animation Frame Recalculation"; prior `ARCHITECTURE.md`, Anti-Pattern 3). It also routes a scroll-driven visual change through React state/re-render for something that doesn't need one.

**Do this instead:** `ScrollTrigger.create({ ..., toggleClass })` (Pattern A) — DOM class mutation driven by the existing ticker, no React state, no second listener.

### Anti-Pattern 4: Letting the carousel and Lenis fight over wheel/touch events

**What people do:** Build the carousel's horizontal scroll without excluding it from Lenis, assuming Lenis (a vertical-scroll smoother) won't interfere with horizontal interaction.

**Why it's wrong:** Lenis listens for wheel/touch at the document level by default; without `data-lenis-prevent` (and `overscroll-behavior: contain`) on the carousel's own scroll container, drag/scroll gestures inside the carousel can be captured or fought over by Lenis, producing jittery or unresponsive carousel interaction — a new, avoidable instance of the "two systems disagree about what should own an interaction" class of bug.

**Do this instead:** `data-lenis-prevent` + `overscroll-behavior-x: contain` on the carousel's scrollable track (Pattern C), confirmed as the documented, official mechanism for exactly this case.

### Anti-Pattern 5: Two independent full-viewport overlays with no coordination

**What people do:** Build `ServiceDrawer`'s open/close entirely inside `ServicesSection`, with no awareness that `MenuOverlay`'s hamburger menu is also a full-viewport interactive layer — both can end up open simultaneously, with unpredictable z-index/focus/scroll-lock interaction.

**Why it's wrong:** Two independently-owned "is something covering the whole screen" states with no coordination is a real UX and focus-management bug, not a hypothetical one, given both already exist as fixed/full-viewport elements with defined z-indices in this codebase.

**Do this instead:** Coordinate via the shared `useScrollLock` hook plus a read-only `body` attribute/class one side sets and the other defensively checks (Pattern B) — not by reaching into each other's component state or the DOM to query "is the other one open."

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `lenis` (npm, already installed) | New: `data-lenis-prevent` attribute on the carousel's scroll track; `useLenis()` inside the new `use-scroll-lock.ts` hook | Both are documented, official mechanisms (Lenis README) — no custom scroll-interception code needed |
| `gsap`/`@gsap/react` (already installed) | New: `ScrollTrigger.create({ toggleClass })` for the header (Pattern A); optional `gsap.to(track, { scrollLeft })` for carousel prev/next easing | No new plugins required — `ScrollTrigger` is already registered once in `lib/gsap.ts` |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `ServicesSection` ↔ `ServiceDrawer` | Props only (`service`, `isOpen`, `onClose`) | `ServiceDrawer` has no state of its own beyond local UI concerns (e.g. focus trap); it never reads `lib/site-content.ts` directly, it only renders what it's handed |
| `MenuOverlay` ↔ `ServiceDrawer` | Read-only `body` attribute/class for mutual-exclusivity, plus shared `useScrollLock` hook | No direct component-to-component reference; no context needed for two independently-owned overlays that occasionally need to know "is the other one open" |
| `EquipmentCarousel` ↔ rest of the page | None — fully self-contained, receives `items` as a prop, exposes nothing outward | Confirms this is the lowest-risk of the four new capabilities |
| `CustomCursor` ↔ any new `[data-cursor]` element (drawer, carousel) | Event delegation on `document` (after the recommended fix), not a static per-mount snapshot | This boundary is currently broken for anything mounted after `CustomCursor`'s own mount — must be fixed for the drawer/carousel to have consistent cursor behavior |

## Suggested Build Order

This maps directly onto phase structure for the roadmap. Numbers indicate dependency order; items on the same number can run in parallel.

1. **Data model first.** Extend `lib/site-content.ts`: richer `services` objects (`longDetail`, `image`, `specs`), new `equipment` array, new `brochure` constant. Zero UI risk, unblocks everything else. Add the brochure PDF itself to `public/brochures/`.

2. **Fix `CustomCursor` to event delegation** (parallel to step 1). Small, isolated, no dependency on anything else in this milestone — but should land *before* step 4/5 below add new `[data-cursor]` elements, otherwise those elements will silently lack cursor behavior (Anti-Pattern 2).

3. **Build `hooks/use-scroll-lock.ts`** (parallel to 1/2). Standalone hook, no dependents yet — needed by both the drawer (step 4) and, ideally, retrofitted into `MenuOverlay`'s existing menu (replacing today's CSS-only lock) in the same pass, since both consumers are known upfront.

4. **Build `ServiceDrawer` + wire into `ServicesSection`.** Depends on 1 (data), 2 (cursor, if the drawer uses `data-cursor`), and 3 (scroll lock). This is the most structurally involved of the four — component boundaries, props contract, focus trap, Escape/backdrop close, mutual-exclusivity with the menu (Anti-Pattern 5).

5. **Build `EquipmentCarousel` + wire into `TechnologySection`** (can run in parallel with step 4 — no shared dependency beyond step 1's data). Lowest risk, fully self-contained.

6. **Build `hooks/use-header-scroll-state.ts` + wire into `MenuOverlay`** (can run in parallel with 4/5 — independent of both). Only real dependency is the existing `SmoothScrollProvider` foundation, already in place.

7. **Brochure CTA placement** (trivial, any time after step 1). Add the `<a download>` link(s) in `MenuOverlay` header and/or `ContactSection` using the `brochure` constant from step 1.

8. **Polish pass across all four:** `gsap.matchMedia()` reduced-motion audit for the header transition and any GSAP-eased carousel scroll (drawer open/close transition should also respect reduced motion — instant show/hide instead of slide); verify the mutual-exclusivity edge case (Anti-Pattern 5) manually; confirm `data-lenis-prevent` is present on both the carousel track and the drawer's own scrollable content region if its content can overflow the viewport.

**Ordering rationale:** Steps 1-3 are pure foundation (data + two small shared hooks) with no visual output yet, and have no dependency on each other. Steps 4, 5, and 6 are the three genuinely new *visual* capabilities — they depend on the step 1-3 foundation but not on each other, so they can be built in any order or in parallel by different phases. Step 7 is trivial and has no real ordering constraint beyond needing the data constant from step 1. Step 8 must come last because it audits behavior across all of the above once it exists.

## Sources

- Direct codebase inspection (HIGH confidence, primary source): `local-2/app/layout.tsx`, `local-2/app/page.tsx`, `local-2/app/globals.css`, `local-2/components/providers/smooth-scroll-provider.tsx`, `local-2/components/menu-overlay.tsx`, `local-2/components/custom-cursor.tsx`, `local-2/components/sections/capabilities-section.tsx`, `local-2/components/sections/technology-section.tsx`, `local-2/components/sections/contact-section.tsx`, `local-2/hooks/use-legacy-parallax.ts`, `local-2/lib/site-content.ts`, `local-2/lib/gsap.ts`, `local-2/lib/motion-preferences.ts`, `local-2/package.json`, `local-2/next.config.ts`
- `.planning/codebase/CONCERNS.md` and `.planning/codebase/ARCHITECTURE.md` (HIGH confidence, this repository's own audit, 2026-07-18) — source of the `FormConnector`/querySelector precedent, the `CustomCursor` event-delegation suggestion, and the `use-legacy-parallax.ts` "second scroll loop" flag
- `.planning/archive/v1.0-dogstudio-superseded/research/ARCHITECTURE.md` (HIGH confidence, prior milestone's research, foundation reused as-is) — source of Patterns 1, 2, 3, 5 referenced throughout this file
- [darkroomengineering/lenis README — `data-lenis-prevent` / nested scrollable elements](https://github.com/darkroomengineering/lenis/blob/main/README.md) — HIGH confidence (official Lenis maintainer repository); confirms `data-lenis-prevent`, `overscroll-behavior: contain` guidance used in Pattern C and Anti-Pattern 4
- [darkroomengineering/lenis — modal/overlay scroll-stop discussion #292](https://github.com/darkroomengineering/lenis/discussions/292) — MEDIUM confidence (official repo discussion thread, not a versioned doc page); corroborates `lenis.stop()`/`lenis.start()` as the recommended pattern for modal/drawer scroll locking, used in Pattern B

---
*Architecture research for: side-drawer, carousel, sticky header, brochure download integration into existing Lenis+GSAP component-per-section Next.js site (Sky Tech Perú local-2)*
*Researched: 2026-07-18*
