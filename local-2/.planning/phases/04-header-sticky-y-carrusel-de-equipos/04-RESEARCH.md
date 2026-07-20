# Phase 4: Header Sticky y Carrusel de Equipos - Research

**Researched:** 2026-07-20
**Domain:** GSAP ScrollTrigger scroll-reactive header state (integrated with an existing single Lenis+GSAP ticker) + `embla-carousel-react@8.6.0` headless carousel, both layered onto an existing Next.js 16/React 19 codebase and stress-tested together per HEAD-02.
**Confidence:** HIGH — every claim below was verified directly against this repository's actual source files, the installed `node_modules` type definitions, or GSAP's official documentation (fetched this session), not training-data recall.

## Summary

This phase is almost entirely an **integration** problem, not a green-field build: `embla-carousel-react@8.6.0` is already installed (confirmed in `package.json` and via `npm view`), the Lenis+GSAP ticker already exists and is already wired to `ScrollTrigger.update()`, and the only genuinely new runtime dependency risk (a slopsquat or malicious carousel package) is cleared — `embla-carousel-react` is a 6-year-old, 35M-download/week, `OK`-verdict package with a legitimate GitHub source.

The header piece (HEAD-01/02) is a single new `ScrollTrigger.create({ trigger: document.body, start: "top -80px", end: "max", toggleClass: {...} })` call registered inside a new `hooks/use-header-scroll-state.ts`, called from `MenuOverlay` (the component that owns `.site-header`) via the existing `useGSAP` scaffolding — **not** a new `window.addEventListener("scroll", ...)`. Two codebase facts (already flagged in `04-UI-SPEC.md`, re-verified this session by reading the actual source) make this safe: (1) `.site-header` is `position: fixed`, not `sticky`, so it isn't independently exposed to the `overflow-x` class of bug; (2) `<ReactLenis root>` with no `wrapper`/`content` ref renders `children` directly with **zero wrapper `<div>`** (confirmed by reading `node_modules/lenis/dist/lenis-react.mjs`) — so `.site-header`'s nearest ancestors are `<InertBoundary>` (`display: contents`, no box, no transform) and `<body>`. There is no transformed/overflow ancestor between the header and the document root, which is exactly the precondition Pitfall 8 requires to hold.

The carousel piece (EQUIP-01) is a new `components/equipment-carousel.tsx` client component appended inside `TechnologySection` per the UI-SPEC's placement decision, using `useEmblaCarousel({ loop: false, align: "start", containScroll: "trimSnaps" })`, driving prev/next/dots off the confirmed `EmblaCarouselType` API (`scrollPrev`, `scrollNext`, `scrollTo`, `selectedScrollSnap`, `canScrollPrev`/`canScrollNext`, `on("select"/"reInit")`), with `data-lenis-prevent` on `.embla__container` (the exact same attribute already used once in this codebase, in `service-drawer.tsx`), and reduced-motion handled via each navigation method's own `jump: boolean` second argument rather than a global Embla option — this leaves drag-gesture physics untouched (correct per UI-SPEC) while making only click/dot-triggered `scrollTo()` calls instant under `prefers-reduced-motion`.

**Primary recommendation:** Build both pieces as small, isolated additions (`hooks/use-header-scroll-state.ts` + `components/equipment-carousel.tsx`) that plug into existing scaffolding (`useGSAP`, `lib/site-content.ts`, `data-lenis-prevent`, `.circle-link`/`.media-frame`/`.mono-label`/`.tech-caption` CSS classes) with zero new npm installs, then execute the concrete 5-step HEAD-02 stress sequence in this document's Common Pitfalls / Validation sections before marking the phase done.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Header scroll-reactive class toggle (HEAD-01/02) | Browser / Client | — | Pure client-side visual state driven by scroll position; `MenuOverlay` is already `"use client"`; no server involvement |
| Equipment carousel (EQUIP-01) | Browser / Client | CDN / Static | Carousel interaction/state is 100% client (Embla); the two source images (`equipos1.png`, `dron.png`) are static assets served from `public/` through Next.js's static file serving (`force-static` page) — no API/database tier involved |

## Project Constraints (from CLAUDE.md)

| Directive | Source | Applies to this phase |
|-----------|--------|------------------------|
| Work only inside `local-2/` — never touch `../local/` or `../produccion/` | `CLAUDE.md` Constraints | All file edits must stay under `local-2/` |
| No new heavy dependencies without explicit approval; GSAP+Lenis already approved | `CLAUDE.md` Constraints | `embla-carousel-react` is already installed/approved from a prior milestone decision — no new `npm install` needed or permitted without asking |
| `npm run deploy` stays blocked; no deploy to Vercel/any service without explicit in-conversation approval | `CLAUDE.md` Constraints | Do not run `npm run deploy` as part of this phase's verification |
| Contact form (`/api/contact` + Supabase) must keep working unchanged | `CLAUDE.md` Constraints | Not touched by this phase; verify no regression as a smoke check only |
| Only local assets in `public/IMAGENES_PAGINA_WEB/`/`public/video/` — no remote image URLs | `CLAUDE.md` Constraints | Carousel must use `equipos1.png`/`dron.png` already present in `public/IMAGENES_PAGINA_WEB/` (confirmed present this session) |
| `@/*` import alias required, no relative imports | `CLAUDE.md` Conventions | New hook/component files must import via `@/hooks/...`, `@/lib/...`, `@/components/...` |
| No semicolons, 2-space indent, named exports for components | `CLAUDE.md` Conventions | New files (`use-header-scroll-state.ts`, `equipment-carousel.tsx`) must match this style |
| BEM-ish class naming, CSS custom properties only, no Tailwind | `CLAUDE.md` Conventions / REQUIREMENTS.md Out of Scope | New CSS (`.equipment-showcase`, `.embla__*`, `.is-scrolled`) must be added to `app/globals.css` using existing token variables, no literals |

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HEAD-01 | Header gains a scroll-reactive visual state via `ScrollTrigger.create({ toggleClass })` on the existing ticker, not a second scroll listener | Exact `ScrollTrigger.create()` shape verified against GSAP official docs + the actual `smooth-scroll-provider.tsx`/`lib/gsap.ts` ticker wiring; see "Code Examples" |
| HEAD-02 | Header stress-tested with drawer open/closed and carousel present, to rule out the `overflow-x` + `position: sticky` + Lenis conflict | Concrete 5-step manual test sequence below, grounded in reading `inert-boundary.tsx`, `lenis-react.mjs`, and `app/globals.css`'s actual `overflow-x`/`.tech-sticky` rules |
| EQUIP-01 | Equipment/drone/camera carousel via `embla-carousel-react`, keyboard+touch parity, `data-lenis-prevent`, no auto-advance | Exact `useEmblaCarousel` options/API verified against installed `node_modules/embla-carousel` type defs; package legitimacy confirmed `OK` |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `gsap` (`ScrollTrigger` sub-module) | `3.15.0` [VERIFIED: package.json + `npm view gsap version` match] | Drives the header's scroll-reactive class toggle off the existing single ticker | Already installed, already registered (`gsap.registerPlugin(ScrollTrigger, useGSAP)` in `lib/gsap.ts`); zero new install |
| `embla-carousel-react` | `8.6.0` [VERIFIED: package.json + `npm view embla-carousel-react version` match, published 2025-04-04, package first published 2019-06-04] | Equipment carousel drag/gesture/index-state logic | Headless (no built-in transition engine to compete with the Lenis/GSAP ticker), ~7KB, React 19-compatible, already installed |
| `@gsap/react` (`useGSAP`) | `2.1.2` [VERIFIED: package.json] | React-safe scoping/cleanup for the new `ScrollTrigger.create()` call | Already the project's sole GSAP-in-React integration pattern (used in every section component and the ticker bridge) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lenis` | `1.3.25` [VERIFIED: package.json] | Provides `data-lenis-prevent` semantics the carousel track opts into | Already the project's sole scroll engine; no direct new API surface needed this phase beyond the existing `root` mode |

**No new packages to install this phase** — `embla-carousel-react` was already added in a prior milestone/session (confirmed present in `node_modules` and `package.json`); do not run `npm install embla-carousel-react` again.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `ScrollTrigger.create({ toggleClass })` on `document.body` | A raw `window.addEventListener("scroll", ...)` computing `window.scrollY > 80` | Explicitly forbidden by HEAD-01's own wording ("no un segundo listener de scroll") and by the codebase's own precedent — `hooks/use-legacy-parallax.ts` already does this and is flagged project-wide as the anti-pattern to avoid repeating, not a pattern to copy |
| `embla-carousel-react` | Swiper.js | Rejected in prior milestone research (`SUMMARY.md`) — full-featured library brings its own transition/autoplay engine that would compete with the already-synced Lenis/GSAP ticker (Pitfall 7); not re-litigated here |
| Embla's `scrollTo(index, jump)` second-arg for reduced motion | Setting a global `duration: 0` Embla option | A global `duration: 0` would also kill drag-gesture momentum feel, which UI-SPEC explicitly says must stay at Embla's default regardless of reduced-motion setting; the per-call `jump` boolean is the only way to gate click/dot navigation without touching drag |

**Installation:**
```bash
# No install needed — embla-carousel-react@8.6.0 already present.
# Verify only:
npm view embla-carousel-react version   # -> 8.6.0, matches package.json
```

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|--------------|---------|-------------|
| `embla-carousel-react` | npm | ~6 years (first published 2019-06-04) | 35,147,600/week | `github.com/davidjerleke/embla-carousel` | OK | Approved — already installed, no action needed |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

No new packages are introduced this phase (`gsap`, `@gsap/react`, `lenis`, `embla-carousel-react` are all already installed and were vetted in prior milestone research); this audit re-confirms `embla-carousel-react` specifically since it's the one library this phase's new code will actually import from and call APIs on for the first time in this codebase.

## Architecture Patterns

### System Architecture Diagram

```
Scroll input (wheel/touch/trackpad)
        |
        v
Lenis instance (root mode, native scroll-friendly — no wrapper div)
        |  emits "scroll" event every rAF tick
        v
LenisGsapBridge (components/providers/smooth-scroll-provider.tsx)
    useLenis(ScrollTrigger.update)  <-- keeps ScrollTrigger's internal
        |                               position cache in sync every tick
        |  gsap.ticker.add(update)  <-- update(t) => lenis.raf(t*1000)
        v                               (the ONE shared rAF loop)
GSAP ticker (single shared driver — Lenis rAF piggybacks on it)
        |
        +--> existing per-section ScrollTrigger/useGSAP calls (reveal, parallax)
        |
        +--> [NEW] hooks/use-header-scroll-state.ts
        |         ScrollTrigger.create({ trigger: document.body,
        |           start: "top -80px", end: "max",
        |           toggleClass: { targets: ".site-header", className: "is-scrolled" } })
        |         -> MenuOverlay's <header className="site-header"> gains/loses .is-scrolled
        |
        +--> [independent] EquipmentCarousel (components/equipment-carousel.tsx)
                  useEmblaCarousel() owns its OWN internal state (selectedIndex,
                  canScrollPrev/Next) — reacts to user drag/click/keyboard only,
                  NOT driven by the GSAP ticker; data-lenis-prevent on its track
                  tells Lenis to ignore touch/wheel input inside that element
                  so Embla's own gesture handling isn't fought by Lenis smoothing.
```

Reading this diagram: user scroll -> Lenis (root, native) -> `ScrollTrigger.update()` (via the Lenis "scroll" event callback) keeps every registered `ScrollTrigger` instance (existing reveals + the new header toggle) positionally accurate against the *real* native scroll offset, because Lenis's `root` mode never transform-wraps the page. The carousel is drawn as a separate branch because it does **not** participate in the scroll-driven tree at all — it's a self-contained gesture/state machine that only asks Lenis to stay out of its way (`data-lenis-prevent`), which is exactly the isolation Pitfall 7 recommends.

### Recommended Project Structure
```
hooks/
├── use-header-scroll-state.ts   # NEW — ScrollTrigger.create({toggleClass}) registration
├── use-scroll-lock.ts           # existing, unchanged
└── use-overlay-coordination.ts  # existing, unchanged
components/
├── menu-overlay.tsx             # MODIFIED — calls useHeaderScrollState()
├── equipment-carousel.tsx       # NEW — Embla-driven carousel component
└── sections/
    └── technology-section.tsx   # MODIFIED — renders <EquipmentCarousel /> after .tech-sticky
lib/
└── site-content.ts              # MODIFIED — new `equipment` array + `EquipmentItem` type
app/
└── globals.css                  # MODIFIED — .is-scrolled, .equipment-showcase, .embla__*, .sr-only
```

### Pattern 1: Header scroll-reactive class toggle via a dedicated hook

**What:** A tiny `useGSAP`-scoped hook that registers exactly one `ScrollTrigger.create()` call and does nothing else.
**When to use:** Any binary (on/off) scroll-position-driven visual state that must NOT introduce a second scroll listener.
**Example:**
```typescript
// hooks/use-header-scroll-state.ts
// Source: verified against GSAP official docs (gsap.com/docs/v3/Plugins/ScrollTrigger/,
// fetched 2026-07-20) + this repo's lib/gsap.ts / smooth-scroll-provider.tsx ticker wiring
"use client"

import { useGSAP } from "@/lib/gsap"
import { ScrollTrigger } from "@/lib/gsap"

const HEADER_SCROLL_THRESHOLD = 80

export function useHeaderScrollState() {
  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: `top -${HEADER_SCROLL_THRESHOLD}px`,
      end: "max",
      toggleClass: { targets: ".site-header", className: "is-scrolled" },
    })

    return () => trigger.kill()
  }, [])
}
```
Called from `MenuOverlay` (the component that renders `<header className="site-header">`):
```typescript
// components/menu-overlay.tsx (excerpt — add near top of component body)
useHeaderScrollState()
```

**Why `trigger: document.body` + `start: "top -80px"` + `end: "max"`, not the UI-SPEC's placeholder `start: "80px top"`:** `04-UI-SPEC.md` itself flagged its own example string as needing verification ("exact syntax to be verified against the installed gsap@3.15.0/ScrollTrigger API during planning"). Verified this session against GSAP's official docs: `start` values are `"[trigger-edge] [scroller-edge]"` pairs (or a plain number of pixels). `"top -80px"` means "when the top of the trigger passes 80px above the top of the viewport" — i.e., fires once the page has scrolled 80px. `"80px top"` is not valid syntax (first token must be a trigger-edge keyword or number, not a raw offset). The default `end` for any trigger is `"bottom top"`; without an explicit `end`, GSAP's own docs confirm the toggle would fire, then untoggle prematurely as soon as the trigger's bottom edge passes the viewport top — `end: "max"` is GSAP's documented dynamic keyword for "the maximum possible scroll position," guaranteeing `.is-scrolled` stays applied for the rest of the page regardless of content length. [CITED: gsap.com/docs/v3/Plugins/ScrollTrigger — fetched 2026-07-20]

**Why this doesn't need a second scroll listener:** `ScrollTrigger.create()` registers with GSAP's own internal ScrollTrigger observer system, which is already kept in sync with Lenis via the existing `useLenis(ScrollTrigger.update)` call in `LenisGsapBridge` (`components/providers/smooth-scroll-provider.tsx` line 11) — every Lenis "scroll" event (itself driven by the single `gsap.ticker.add(update)` rAF loop) calls `ScrollTrigger.update()`, which re-evaluates every registered trigger including this new one. No new `addEventListener` is added anywhere. [VERIFIED: read `components/providers/smooth-scroll-provider.tsx` directly this session]

**Why `useGSAP`'s cleanup is sufficient:** `useGSAP` (from `@gsap/react`) wraps its callback in a `gsap.context()`; GSAP's context `revert()` (called automatically on unmount/dependency-change) also kills any `ScrollTrigger` instances created within that context. The explicit `return () => trigger.kill()` above is defensive/explicit (matches this codebase's existing style, e.g. `smooth-scroll-provider.tsx`'s `return () => gsap.ticker.remove(update)`), not strictly required, but costs nothing and makes intent obvious to a future reader. [CITED: `@gsap/react` official integration docs — GSAP context+ScrollTrigger interop is documented GSAP behavior]

### Pattern 2: Equipment carousel with `useEmblaCarousel`

**What:** A self-contained client component owning its own `selectedIndex`/`canScrollPrev`/`canScrollNext` state, driven entirely by Embla's own API — no GSAP ticker involvement.
**When to use:** Any drag/swipe/keyboard-navigable slide set that must not introduce a competing rAF loop.
**Example:**
```typescript
// components/equipment-carousel.tsx
// Source: verified against node_modules/embla-carousel/components/EmblaCarousel.d.ts
// and node_modules/embla-carousel-react/components/useEmblaCarousel.d.ts (installed 8.6.0)
"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"

import { equipment } from "@/lib/site-content"
import { prefersReducedMotion } from "@/lib/motion-preferences"

export function EquipmentCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Only click/dot-triggered transitions are gated by reduced-motion (jump = instant).
  // Drag-gesture physics are left at Embla's default regardless (user-initiated, not decorative).
  const scrollPrev = useCallback(
    () => emblaApi?.scrollPrev(prefersReducedMotion()),
    [emblaApi],
  )
  const scrollNext = useCallback(
    () => emblaApi?.scrollNext(prefersReducedMotion()),
    [emblaApi],
  )
  const scrollToIndex = useCallback(
    (index: number) => emblaApi?.scrollTo(index, prefersReducedMotion()),
    [emblaApi],
  )

  const onViewportKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") scrollPrev()
    if (event.key === "ArrowRight") scrollNext()
  }

  return (
    <div className="equipment-showcase" data-reveal>
      <div className="site-shell">
        <span className="mono-label">Equipo en campo</span>
        <h3>Instrumentos que usamos en cada levantamiento.</h3>
        <p>Equipos de captura aérea y fotogramétrica operados por el equipo técnico en cada proyecto.</p>
      </div>
      <div className="embla" aria-roledescription="carousel" aria-label="Equipo técnico">
        <div
          className="embla__viewport"
          ref={emblaRef}
          tabIndex={0}
          onKeyDown={onViewportKeyDown}
        >
          <div className="embla__container" data-lenis-prevent>
            {equipment.map((item, index) => (
              <div
                key={item.id}
                className="embla__slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${equipment.length}`}
              >
                <div className="media-frame embla__frame">
                  <Image src={item.image} alt={item.alt} fill sizes="(max-width: 720px) 84vw, (max-width: 1000px) 72vw, 58vw" />
                </div>
                <p className="tech-caption">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          className="circle-link embla__prev"
          type="button"
          aria-label="Equipo anterior"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
        >
          ←
        </button>
        <button
          className="circle-link embla__next"
          type="button"
          aria-label="Equipo siguiente"
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          →
        </button>
        <div className="embla__dots" role="tablist" aria-label="Seleccionar equipo">
          {equipment.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              aria-label={`Ir al equipo ${index + 1}`}
              aria-selected={index === selectedIndex}
              className={index === selectedIndex ? "is-active" : ""}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Equipo {selectedIndex + 1} de {equipment.length}
        </p>
      </div>
    </div>
  )
}
```

**Why `align: "start"` + `containScroll: "trimSnaps"`, not defaults:** UI-SPEC's slide-sizing table (58%/72%/84% `flex-basis` by breakpoint) implies each slide should snap flush to the viewport's start edge with the next slide peeking on the right — `align: "start"` is Embla's option for exactly this; `containScroll: "trimSnaps"` prevents excess empty scroll space after the last slide (relevant even with only 2 slides, since the last slide's peek would otherwise leave a visible gap). [ASSUMED — Embla's `align`/`containScroll` semantics are documented in Embla's official docs, not independently re-verified via WebFetch this session; low risk since these are purely visual/layout options, easily adjusted during planning if the peek behavior looks wrong]

**Why `scrollPrev(jump)`/`scrollNext(jump)`/`scrollTo(index, jump)`, not a plugin or global option:** Confirmed directly from the installed type definitions (`node_modules/embla-carousel/components/EmblaCarousel.d.ts`): `scrollNext: (jump?: boolean) => void`, `scrollPrev: (jump?: boolean) => void`, `scrollTo: (index: number, jump?: boolean) => void`. Passing `jump: true` skips the eased transition for that one call — exactly the per-call granularity UI-SPEC requires (only click/dot navigation gated, not drag). [VERIFIED: read `node_modules/embla-carousel/components/EmblaCarousel.d.ts` directly, matches installed `embla-carousel-react@8.6.0`]

**Reduced-motion helper — small addition needed to `lib/motion-preferences.ts`:** The file currently exports `LENIS_LERP` and `getLenisLerp()` (which internally calls `window.matchMedia("(prefers-reduced-motion: reduce)").matches` but returns a lerp *number*, not a boolean). Add a small standalone export:
```typescript
// lib/motion-preferences.ts — ADD this export, do not modify existing ones
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
```
This reuses the exact same media query the project already checks in two other places (`smooth-scroll-provider.tsx`'s `gsap.matchMedia()`, `use-legacy-parallax.ts`), satisfying UI-SPEC's "gated through the same `prefers-reduced-motion` check already established in `lib/motion-preferences.ts`" requirement literally, without duplicating the query string a third time. [VERIFIED: read `lib/motion-preferences.ts` directly this session — confirmed no boolean-returning export currently exists]

### New data structure — `lib/site-content.ts`

`lib/site-content.ts` currently has no `equipment` export (confirmed by reading the full file this session — it exports `services`, `process`, `team`/`TeamMember`, `projects`/`Project`, `brochure`/`Brochure`, and nothing equipment-related). Add, following the file's existing interface+array pattern exactly:

```typescript
// lib/site-content.ts — ADD near the TeamMember/Project interfaces
export interface EquipmentItem {
  id: string
  image: string
  alt: string
  caption: string
}

export const equipment: EquipmentItem[] = [
  {
    id: "captura-fotogrametrica",
    image: "/IMAGENES_PAGINA_WEB/equipos1.png",
    alt: "Equipo de captura fotogramétrica utilizado en campo",
    caption: "Equipo de captura fotogramétrica",
  },
  {
    id: "matrice-350-rtk",
    image: "/IMAGENES_PAGINA_WEB/dron.png",
    alt: "Drone Matrice 350 RTK, plataforma aérea de precisión",
    caption: "Matrice 350 RTK / Plataforma aérea",
  },
]
```
Both source images (`equipos1.png`, `dron.png`) are confirmed present in `public/IMAGENES_PAGINA_WEB/` this session (`ls` output: `dron.png`, `equipos1.png`, `topografia-con-drones.jpg`, `usar-drones-en-topografia.jpg`). [VERIFIED: filesystem listing this session]

Note: `04-UI-SPEC.md` describes the 2 slides as "static/hardcoded for this phase (no `equipment` array exists yet)" and treats this as acceptable since there's no runtime empty-state to design for. Adding the array to `lib/site-content.ts` anyway (rather than inlining the 2 objects in the component) is a **recommendation**, not a contradiction of the UI-SPEC — it costs nothing extra, matches this codebase's established data-single-source-of-truth convention (`services`, `team`, `projects` all live in `site-content.ts`, not inlined in their section components), and makes the "swap in a distinct photo later" follow-up noted in the UI-SPEC's Content Note trivially a one-line data edit instead of a component-code edit.

### Anti-Patterns to Avoid
- **A second `window.addEventListener("scroll", ...)` for the header:** `hooks/use-legacy-parallax.ts` already does this in the codebase — it is legacy/pre-existing, not a pattern to copy for new scroll-reactive UI. HEAD-01 explicitly forbids adding another one.
- **Literal `position: sticky` on `.site-header`:** `.site-header` is `position: fixed` today (`app/globals.css` line 21); do not change this. The codebase's one real `position: sticky` consumer is `.tech-sticky` (line 35), which is the element HEAD-02's stress test must actually exercise.
- **Global Embla `duration: 0` option for reduced-motion:** would also flatten drag-gesture momentum, contradicting UI-SPEC's explicit "drag physics stay default regardless of reduced-motion" requirement. Use the per-call `jump` argument instead (see Pattern 2).
- **`overflow-x: hidden` anywhere new:** `body{overflow-x:hidden}` already exists (`app/globals.css` line 13) and must remain the only occurrence. If the carousel's `.embla__viewport` needs horizontal clipping, scope it locally: `.embla__viewport{overflow:hidden}` (a normal, non-root-level `overflow` — this does **not** create the page-level scroll container that breaks `position: sticky`; only `overflow` on `html`/`body`/a `position: sticky` element's ancestor chain does that).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Carousel drag/swipe/snap physics, index tracking, disabled-state calculation | A custom `translateX` + `requestAnimationFrame` slider, or manual touch-event math | `embla-carousel-react`'s `useEmblaCarousel` hook (already installed) | Embla already solves drag momentum, snap points, resize handling, and exposes `canScrollPrev`/`canScrollNext`/`selectedScrollSnap` directly — reimplementing this is exactly the kind of "deceptively complex" problem this project already chose Embla over Swiper/hand-rolled to avoid (Pitfall 7) |
| Scroll-position threshold detection for the header | A `useEffect` with `window.addEventListener("scroll")` computing `window.scrollY > 80` manually | `ScrollTrigger.create({ toggleClass })` | GSAP's ScrollTrigger already handles the sync-with-Lenis problem via the existing `ScrollTrigger.update()` bridge; a hand-rolled listener would be the exact "competing frame loop" anti-pattern this project is trying to avoid re-introducing |
| Reduced-motion detection | A new `useState` + `useEffect` + `matchMedia` listener inside the carousel component | The small `prefersReducedMotion()` addition to `lib/motion-preferences.ts` (reusing the existing query) | Three independent `matchMedia("(prefers-reduced-motion: reduce)")` checks already exist in this codebase (`smooth-scroll-provider.tsx`, `use-legacy-parallax.ts`, and now the new helper) — centralizing avoids yet another divergent copy of the query string |

**Key insight:** Every piece this phase needs (ticker sync, scroll-lock precedent, reduced-motion query, `data-lenis-prevent` usage, `.circle-link`/`.media-frame` visual components) already exists once in this codebase from a prior phase. The correct approach is almost entirely "find the existing pattern and reuse it," not "design something new."

## Common Pitfalls

### Pitfall 1: Placing `useHeaderScrollState()` inside a component that isn't a direct/untransformed ancestor path to `.site-header`

**What goes wrong:** If the hook (or the `ScrollTrigger.create()` call) is registered inside a component that gets remounted or wrapped by something with its own transform/overflow (e.g., accidentally nesting it inside `InertBoundary`'s children in a way that changes when `inert` toggles), the trigger could be killed/recreated unexpectedly when the drawer opens, or the header could pick up an unexpected containing-block ancestor.
**Why it happens:** `MenuOverlay` (which owns `.site-header`) is itself wrapped in `<InertBoundary>` in `app/page.tsx`. `InertBoundary` uses `display: contents` (verified — no box, no transform), so this is currently safe, but any future change to `InertBoundary`'s implementation (e.g., switching away from `display: contents` to a real wrapper `<div>` for some other reason) would silently reintroduce Pitfall 8's transformed-ancestor risk.
**How to avoid:** Call `useHeaderScrollState()` directly inside `MenuOverlay`'s function body (not inside a child that could be conditionally unmounted), and if `InertBoundary` is ever modified, explicitly re-verify it still renders with `display: contents` (or equivalent no-box passthrough).
**Warning signs:** Header stops toggling `.is-scrolled` specifically only while the drawer is open, or the header's fixed positioning subtly shifts when `inert` toggles.

### Pitfall 2: Forgetting `end: "max"` on the header's `ScrollTrigger.create()`

**What goes wrong:** Without an explicit `end`, GSAP defaults to `"bottom top"` — for a `trigger: document.body` this is close to "end of page" but not guaranteed identical across all page-height edge cases (e.g., if body's rendered box height differs from the scrollable document height due to absolutely-positioned overflow content). The safer, explicitly-documented-for-this-use-case value is `end: "max"`.
**Why it happens:** `04-UI-SPEC.md`'s own placeholder example omitted `end` entirely, and it's easy to assume a start-only ScrollTrigger just "stays on" once toggled — it does not, by default.
**How to avoid:** Always include `end: "max"` explicitly for a persistent-until-bottom-of-page toggle (confirmed via GSAP's own docs this session).
**Warning signs:** Header briefly loses its `.is-scrolled` background/shadow near the bottom of a long page, then most likely re-applies — a subtle flicker that's easy to miss in a quick manual test but obvious on a slow scroll-through.

### Pitfall 3: Testing the carousel or header in isolation, not together with the drawer (violates the literal point of HEAD-02)

**What goes wrong:** Each piece works fine alone; the interaction bug (if any) only appears when the drawer's `lenis.stop()`/`start()` scroll-lock, the header's `ScrollTrigger`, and the carousel's own `overflow: hidden` viewport are all active on the page simultaneously.
**Why it happens:** It's the natural order to build and smoke-test each piece as it's written; the cross-feature stress test is easy to defer or skip once each piece "looks done."
**How to avoid:** Run the full manual sequence below as an explicit, required verification step — not an optional nice-to-have.
**Warning signs:** None visible until the specific combined sequence is run — this is exactly why HEAD-02 exists as its own requirement rather than being folded into HEAD-01.

**HEAD-02 manual stress-test sequence (concrete, run in this order):**
1. Load the page fresh (scrollY = 0). Confirm `.site-header` has no `.is-scrolled` class (DevTools Elements panel or `document.querySelector(".site-header").className`).
2. Fast flick-scroll (trackpad/mouse-wheel a large distance in one gesture) past 80px and immediately back to the top. Confirm `.is-scrolled` toggles on, then off, with no visible flicker/lag and no console errors.
3. Scroll to ~200px (past threshold, `.is-scrolled` active). Open the service drawer (Phase 3's `ServiceDrawer`, triggered from a `.service-row`). Confirm: (a) background page cannot be scrolled (via wheel/trackpad) while the drawer is open — `lenis.stop()` is working; (b) `.site-header` still shows `.is-scrolled` (should hold its last state, not reset — drawer-open freezes scroll, it should not desync the header's class). Close the drawer. Confirm `.is-scrolled` is still correctly applied (or removed, if you scrolled back up) and the page resumes scrolling normally.
4. Scroll down to the Technology section until `.tech-sticky` pins (fills the viewport, `position: sticky` engaged). Continue scrolling until the pinned section releases and the equipment carousel (rendered directly below `.tech-sticky` in the same section) becomes visible. Confirm `.tech-sticky` pinned and released cleanly (no jump/snap glitch), and `.site-header`'s `.is-scrolled` state remained correct throughout.
5. With the carousel visible: (a) Tab to the carousel viewport, press `ArrowRight`/`ArrowLeft` — confirm slides navigate; (b) click the prev/next `.circle-link` buttons — confirm they work and correctly disable at each end (since `loop: false`); (c) drag/swipe the carousel on a touch device or via DevTools touch emulation — confirm smooth native-feeling drag, not fighting Lenis; (d) run `document.querySelectorAll('[style*="overflow-x"]')` and grep `app/globals.css` for `overflow-x` — confirm the only occurrence is still `body{overflow-x:hidden}` (pre-existing, line 13) and no new rule was added anywhere as a side effect of building the carousel.
6. Toggle DevTools' `prefers-reduced-motion: reduce` emulation. Click a carousel dot — confirm the slide transition is instant (no eased scroll). Drag the carousel — confirm drag physics feel unchanged (not gated by reduced-motion, per UI-SPEC).

## Code Examples

### Registering the header scroll hook in `MenuOverlay`
```typescript
// components/menu-overlay.tsx — add the import and the call, no other structural change
"use client"

import { useState } from "react"

import { useHeaderScrollState } from "@/hooks/use-header-scroll-state"
import { useOverlayCoordination } from "@/hooks/use-overlay-coordination"
import { useScrollLock } from "@/hooks/use-scroll-lock"

export function MenuOverlay() {
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerOpen = useOverlayCoordination("menu", menuOpen)

  useScrollLock(menuOpen)
  useHeaderScrollState()

  // ...unchanged JSX below (className="site-header" stays exactly as-is;
  // the new .is-scrolled class is applied/removed entirely by ScrollTrigger,
  // not by any React state here)
```

### CSS additions (append to `app/globals.css`, do not restructure existing rules)
```css
/* Header scroll-reactive state (HEAD-01/02) — additive, .site-header base rule (line 21) untouched */
.site-header{transition:background var(--motion-duration-fast) var(--ease-moderate),box-shadow var(--motion-duration-fast) var(--ease-moderate)}
.site-header.is-scrolled{background:var(--bg-surface);box-shadow:0 1px 0 var(--border-subtle),0 8px 24px color-mix(in srgb,var(--ink-primary) 6%,transparent)}

/* Equipment carousel (EQUIP-01) */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.equipment-showcase{padding-top:32px}
.embla{position:relative}
.embla__viewport{overflow:hidden}
.embla__container{display:flex;gap:24px;touch-action:pan-y}
.embla__slide{flex:0 0 58%;min-width:0}
.embla__frame{aspect-ratio:4/5}
.embla__prev,.embla__next{position:absolute;top:40%}
.embla__prev{left:-22px}
.embla__next{right:-22px}
.embla__prev:disabled,.embla__next:disabled{opacity:.4;cursor:not-allowed;pointer-events:none}
.embla__dots{display:flex;gap:8px;justify-content:center;margin-top:16px}
.embla__dots button{width:8px;height:8px;border-radius:50%;border:1px solid var(--border-subtle);background:transparent;padding:0}
.embla__dots button.is-active{background:var(--accent);border-color:var(--accent)}
.embla__dots button:focus-visible,.embla__prev:focus-visible,.embla__next:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
@media (max-width:1000px){.embla__slide{flex-basis:72%;gap:16px}.embla__container{gap:16px}}
@media (max-width:720px){.embla__slide{flex-basis:84%}}
```
Exact pixel offsets for `.embla__prev`/`.embla__next` positioning and the 44×44px circle sizing (already inherited from `.circle-link`'s existing `width:84px` — UI-SPEC calls for 44px specifically for this icon-only touch-target exception) need a `width`/`aspect-ratio` override alongside `.circle-link`'s base rule; treat the exact values above as a starting point to be refined visually during implementation, not a pixel-perfect final spec. [ASSUMED — layout offsets not verified against a rendered browser this session, flagged for visual QA during planning/execution]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-------------------|---------------|--------|
| GSAP plugins (ScrollTrigger included) required a Club GreenSock membership/license for commercial use | All GSAP plugins including ScrollTrigger are 100% free under standard MIT, bundled in the core `gsap` package | GSAP's 2025 relicensing (already reflected in this project's `gsap@3.15.0` — no separate ScrollTrigger install/license needed) | No membership token/env var needed; `import { ScrollTrigger } from "gsap/ScrollTrigger"` just works, as already done in `lib/gsap.ts` |

**Deprecated/outdated:** None specific to this phase — both `gsap@3.15.0` and `embla-carousel-react@8.6.0` are current major versions per `npm view`, not superseded APIs.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | Embla's `align: "start"` + `containScroll: "trimSnaps"` options produce the exact peek behavior UI-SPEC describes (58/72/84% flex-basis with visible next-slide peek) | Architecture Patterns / Pattern 2 | Low — these are well-documented, low-risk Embla layout options; worst case is a visual tweak during implementation, not a functional break |
| A2 | The exact pixel offsets for `.embla__prev`/`.embla__next` absolute positioning in the CSS example | Code Examples | Low — purely cosmetic; will be visually obvious and easy to adjust during implementation/QA, does not affect functionality or accessibility |

**If this table is empty:** N/A — see above; both entries are low-risk cosmetic/layout details, not architectural or compliance claims.

## Open Questions

1. **Exact `.embla__prev`/`.embla__next` desktop-vs-mobile positioning (overlaid on the frame vs. below it)**
   - What we know: UI-SPEC specifies 44×44px circles reusing `.circle-link`'s visual treatment, but doesn't pixel-specify their exact placement relative to the slide frame across all three breakpoints.
   - What's unclear: Whether buttons should overlay the image edges (common carousel convention) or sit in a control row below the frame (safer for touch, avoids obscuring the photo).
   - Recommendation: Default to overlaying at the vertical center of the frame (as sketched in the Code Examples CSS above) since that's the most common accessible-carousel convention (Chrome for Developers' accessible-carousel guide shows this pattern) — but treat as a planning-time visual decision, not a blocker.

## Environment Availability

Pure code/config phase — no new external services, databases, or CLI tools are introduced. Verified this session:

| Dependency | Required By | Available | Version | Fallback |
|------------|--------------|-----------|---------|----------|
| `gsap`/`ScrollTrigger` | HEAD-01/02 | ✓ | 3.15.0 (matches `npm view`) | — |
| `embla-carousel-react` | EQUIP-01 | ✓ | 8.6.0 (matches `npm view`) | — |
| `lenis` | Both (ticker sync, `data-lenis-prevent`) | ✓ | 1.3.25 | — |
| `public/IMAGENES_PAGINA_WEB/equipos1.png` | EQUIP-01 slide 1 | ✓ | — (static asset) | — |
| `public/IMAGENES_PAGINA_WEB/dron.png` | EQUIP-01 slide 2 | ✓ | — (static asset, already reused as `.tech-media` hero image) | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none.

## Validation Architecture

**No automated test framework exists in this repository** (confirmed this session — no `*.test.*`/`*.spec.*` files, no `vitest.config.*`/`jest.config.*`/`playwright.config.*`, no `test` script in `package.json`). This matches REQUIREMENTS.md's explicit Out of Scope entry: "Tests automatizados (unit/E2E) | Fuera de alcance." Validation for this phase is therefore **manual verification against `npm run build`/lint/typecheck plus the concrete manual test sequences below**, consistent with QA-01/QA-02's own literal wording ("revisión visual manual").

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none — automated tests explicitly out of scope per REQUIREMENTS.md |
| Config file | none |
| Quick run command | `npm run lint && npm run typecheck` |
| Full suite command | `npm run build` (verifies the `force-static` prerender path still succeeds with the new hook/component) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|---------------------|--------------|
| HEAD-01 | `.site-header` gains `.is-scrolled` past 80px scroll, via `ScrollTrigger.create({toggleClass})`, no second listener | manual | Step 1-2 of HEAD-02 sequence above (Common Pitfalls) + `grep -c "addEventListener(\"scroll\"" -r components/ hooks/` should return only the pre-existing `use-legacy-parallax.ts` hit, no new one | N/A — manual-only, no test file |
| HEAD-02 | Header verified with drawer open/closed and carousel present | manual | Full 6-step sequence in Common Pitfalls / Pitfall 3 above | N/A — manual-only |
| EQUIP-01 | Carousel keyboard/touch parity, `data-lenis-prevent`, no auto-advance | manual | Step 5 of HEAD-02 sequence (keyboard/touch/dot checks) + confirm no `autoplay`/`Autoplay` plugin import anywhere in `equipment-carousel.tsx` | N/A — manual-only |

### Sampling Rate
- **Per task commit:** `npm run lint && npm run typecheck`
- **Per wave merge:** `npm run build` (production build, catches the `force-static` prerender + `next/image` static-import edge cases)
- **Phase gate:** Full manual HEAD-02 sequence (6 steps above) must be run and pass before `/gsd-verify-work`, since this is the phase's own explicit, named acceptance criterion.

### Wave 0 Gaps
None — no test infrastructure exists project-wide and none is being introduced (out of scope). The "gap" is fully covered by the manual sequences documented above, which are the project's established verification method for this class of phase (see Phase 3's own drawer focus-management verification, done identically via manual Tab/screen-reader passes per `PITFALLS.md`).

## Security Domain

`security_enforcement` is enabled in `.planning/config.json` (`security_asvs_level: 1`). This phase's surface area is minimal — no authentication, no session state, no new user input, no data persistence, no new network calls.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|----------------|---------|--------------------|
| V2 Authentication | No | Not touched by this phase |
| V3 Session Management | No | Not touched by this phase |
| V4 Access Control | No | Not touched by this phase |
| V5 Input Validation | No | No new user input; carousel `alt`/`caption`/`image` values are static, developer-authored constants in `lib/site-content.ts`, never derived from request/query/form data |
| V6 Cryptography | No | Not touched by this phase |
| V11 Business Logic (focus/interaction integrity) | Yes, minor | Carousel keyboard handler must only respond to `ArrowLeft`/`ArrowRight` while the carousel viewport itself has focus (via the `onKeyDown` handler scoped to the `.embla__viewport` element, not a document-level listener) — prevents the carousel from hijacking arrow-key input intended for other focused elements elsewhere on the page |

### Known Threat Patterns for {stack}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|-----------------------|
| Global (document-level) keydown listener for carousel arrow-key navigation, unintentionally capturing input meant for other focused controls (e.g. a form field elsewhere on the page) | Tampering (of user intent/focus behavior) | Scope the `onKeyDown` handler to the `.embla__viewport` element itself via React's `onKeyDown` prop (only fires when that element or a descendant has focus), not `document.addEventListener("keydown", ...)` — exactly as shown in the Pattern 2 code example above |
| Carousel image `src` ever becoming attacker/user-controlled (e.g. if `equipment` were later sourced from a CMS/API without validation) | Tampering / Injection | Not applicable this phase — `equipment` is a hardcoded TypeScript constant in `lib/site-content.ts`, not fetched at runtime; flag as a re-review item only if a future phase moves this to dynamic content |

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection this session: `components/providers/smooth-scroll-provider.tsx`, `components/menu-overlay.tsx`, `components/sections/technology-section.tsx`, `components/inert-boundary.tsx`, `components/custom-cursor.tsx`, `components/service-drawer.tsx`, `hooks/use-scroll-lock.ts`, `hooks/use-overlay-coordination.ts`, `hooks/use-legacy-parallax.ts`, `lib/gsap.ts`, `lib/motion-preferences.ts`, `lib/site-content.ts`, `app/globals.css`, `app/page.tsx`, `app/layout.tsx`, `package.json`
- `node_modules/lenis/dist/lenis-react.mjs` (read directly) — confirms `<ReactLenis root>` renders children with zero wrapper `<div>` when no `wrapper`/`content` refs are set
- `node_modules/embla-carousel/components/EmblaCarousel.d.ts`, `node_modules/embla-carousel/components/Options.d.ts`, `node_modules/embla-carousel-react/components/useEmblaCarousel.d.ts` (read directly) — exact installed `embla-carousel-react@8.6.0` API surface
- `npm view gsap version`, `npm view embla-carousel-react version`, `npm view lenis version`, `npm view embla-carousel-react time.created` — version/age verification, all match `package.json` exactly
- `gsd-tools query package-legitimacy check --ecosystem npm embla-carousel-react` — `OK` verdict, 35.1M weekly downloads, confirmed GitHub source repo
- [ScrollTrigger | GSAP Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — fetched twice this session (toggleClass/trigger syntax; default `end` behavior and `"max"` keyword)
- `.planning/phases/04-header-sticky-y-carrusel-de-equipos/04-UI-SPEC.md` — approved design contract for this phase
- `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, `.planning/config.json` — phase requirements, current milestone state, workflow config

### Secondary (MEDIUM confidence)
- `.planning/research/SUMMARY.md`, `.planning/research/PITFALLS.md` — prior milestone-level research (Pitfalls 5-8 specifically, on Lenis+sticky+overflow interactions), cross-referenced against this session's direct codebase reads to confirm they still apply to the actual current code (they do)
- WebSearch: "embla-carousel-react keyboard arrow key navigation" — confirms native/documented keyboard-navigation expectations for Embla-based carousels, cross-checked against the ARIA APG carousel pattern already cited in `PITFALLS.md`

### Tertiary (LOW confidence)
- None used as the basis for any recommendation in this document — all carousel API claims were verified against installed type definitions, not WebSearch alone.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version number verified against both `package.json` and a live `npm view` call this session; no drift found
- Architecture: HIGH — ticker wiring, `InertBoundary` behavior, and Lenis's `root`-mode no-wrapper-div behavior all confirmed by reading actual source files (not training-data assumption)
- Pitfalls: HIGH for the Lenis/sticky/overflow-x interaction (re-verified against actual current CSS/component code this session, not just carried over from milestone research); MEDIUM for the exact carousel CSS positioning values (flagged as ASSUMED/low-risk in Assumptions Log)

**Research date:** 2026-07-20
**Valid until:** 2026-08-19 (30 days — stable stack, no fast-moving dependencies; re-verify package versions if planning is delayed past this window)
