# Architecture Research

**Domain:** GSAP + Lenis animation layer inside a Next.js App Router marketing site
**Researched:** 2026-07-18
**Confidence:** HIGH (core Lenis/GSAP patterns, corroborated by official docs); MEDIUM (ScrollTrigger.refresh orchestration specifics — community-derived, no single canonical Next.js guide)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       app/layout.tsx (Server)                       │
│  - Fonts, <html>/<body>, metadata                                   │
│  - Wraps {children} in <SmoothScrollProvider>                       │
├───────────────────────────┬───────────────────────────────────────┤
│  components/providers/smooth-scroll-provider.tsx  ("use client")    │
│  - ONE <ReactLenis root> instance (lenis/react)                     │
│  - autoRaf: false → Lenis.raf() fed manually from gsap.ticker       │
│  - lib/gsap.ts registers ScrollTrigger + useGSAP once, module-level │
│  - gsap.matchMedia() branch for prefers-reduced-motion              │
├───────────────────────────────────────────────────────────────────┤
│              app/page.tsx (Server Component, force-static)          │
│  - Renders static markup + imports client section components       │
│  - Owns ZERO animation logic, ZERO DOM query wiring                 │
│                                                                       │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌────────────────┐  │
│  │ HeroSection│ │ Manifesto  │ │ Capabilities │ │ ProcessSection │  │
│  │ (client)   │ │ Section    │ │ Section      │ │ (client)       │  │
│  │ useGSAP    │ │ (client)   │ │ (client)     │ │ useGSAP        │  │
│  │ scope=ref  │ │ useGSAP    │ │ useGSAP      │ │ scope=ref      │  │
│  └────────────┘ └────────────┘ └──────────────┘ └────────────────┘  │
│                                                                       │
│  ┌───────────────────────┐   ┌─────────────────────────────────┐   │
│  │  ContactSection        │   │  MenuOverlay / Cursor / Nav      │   │
│  │  renders <ContactForm/>│   │  (client, global chrome)         │   │
│  │  ContactForm OWNS both │   │  calls lenis.stop()/start() +    │   │
│  │  <form> markup AND     │   │  ScrollTrigger.refresh() on      │   │
│  │  onSubmit handler      │   │  open/close                      │   │
│  └───────────┬─────────────┘   └───────────────────────────────┘   │
└──────────────┼───────────────────────────────────────────────────┘
               ▼
  fetch POST /api/contact → Zod safeParse (server) → Supabase insert
  (unchanged — this contract already works correctly, don't touch it)
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `SmoothScrollProvider` | Own the single Lenis instance for the whole app; sync it into GSAP's ticker; register GSAP plugins once | Client component wrapping `{children}` in root `layout.tsx`, using `lenis/react`'s `<ReactLenis root>` |
| `lib/gsap.ts` | Single source of truth for `gsap.registerPlugin(...)`; re-export configured `gsap`, `ScrollTrigger`, `useGSAP` | Module-level `registerPlugin` call, imported everywhere instead of each component registering its own |
| Section components (`HeroSection`, `ManifestoSection`, etc.) | Own their own animation timeline, scoped to their own root ref | `"use client"` + `useGSAP(() => {...}, { scope: rootRef })` from `@gsap/react` |
| `ContactForm` | Own the `<form>` markup AND the `onSubmit` handler in one component (fixes `FormConnector`) | Client component, no `document.querySelector`, uses `FormData` + existing `contactSchema` |
| `MenuOverlay` / `Cursor` | Global interaction chrome that isn't scroll-scoped but must coordinate with Lenis (pause/resume) and ScrollTrigger (refresh after layout shift) | Client component using `useLenis()` from `lenis/react` |
| Reusable hooks (`use-reveal`, `use-parallax`, `use-magnetic`) | Encapsulate the current `[data-reveal]` / `[data-parallax]` / `[data-cursor]` behaviors as GSAP-native, reusable primitives | Thin wrappers around `useGSAP` that accept a ref + options, return nothing (side-effect only) |
| `app/page.tsx` | Static content + composition only | Server component (`force-static` preserved), imports client components, passes no refs/DOM ids across boundaries |

## Recommended Project Structure

```
components/
├── providers/
│   └── smooth-scroll-provider.tsx   # Lenis root instance + gsap.ticker sync + reduced-motion branch
├── sections/
│   ├── hero-section.tsx             # owns hero timeline (video reveal, headline split)
│   ├── manifesto-section.tsx        # scroll-narrative timeline
│   ├── capabilities-section.tsx     # reveal grid
│   ├── process-section.tsx          # reveal/step timeline
│   └── contact-section.tsx          # layout wrapper, renders <ContactForm />
├── contact-form.tsx                 # form markup + onSubmit + fetch (replaces FormConnector entirely)
├── menu-overlay.tsx                 # nav/menu, calls useLenis().stop()/start()
├── cursor.tsx                       # contextual cursor, event-delegated
└── experience.tsx                   # REMOVED once decomposed (or reduced to a thin composer, see Build Order)
hooks/
├── use-reveal.ts                    # useGSAP wrapper: fade/slide-up on [data-reveal] within scope
├── use-parallax.ts                  # ScrollTrigger `scrub` tween, replaces rAF+getBoundingClientRect loop
├── use-magnetic.ts                  # magnetic hover micro-interaction
└── use-scroll-refresh.ts            # centralizes ScrollTrigger.refresh() triggers (fonts, video, images, menu)
lib/
├── gsap.ts                          # gsap.registerPlugin(ScrollTrigger, useGSAP) — imported everywhere
├── motion-preferences.ts            # gsap.matchMedia() conditions object incl. reduceMotion
└── contact-schema.ts                # UNCHANGED — already correctly shared client/server
```

### Structure Rationale

- **`components/providers/`:** Isolates the one piece of global, app-wide state (the Lenis instance and plugin registration) from page content. This is the *only* thing that belongs in `layout.tsx`'s client boundary — everything else stays scoped to the section that needs it.
- **`components/sections/`:** Mirrors the current visual sections in `app/page.tsx` 1:1. Each section becomes its own client component with its own `useGSAP` scope, replacing the single monolithic `experience.tsx` that currently owns menu + scroll + reveals + cursor + form all at once (see `CONCERNS.md` — "Direct DOM Manipulation at Scale").
- **`components/contact-form.tsx` as its own file (not nested inside another component):** This is the direct fix for the `FormConnector` fragility. The form's markup and its submit handler must live in the *same* component so React wires `onSubmit` at JSX-authoring time, not via a DOM query after mount.
- **`hooks/`:** Extracts the three existing vanilla-JS behaviors (`[data-reveal]`, `[data-parallax]`, `[data-cursor]`) into GSAP-native, reusable hooks. This directly answers "how to structure reusable animation hooks" — one hook per *behavior*, not per *section*, so `use-reveal.ts` can be called from any section component without duplicating IntersectionObserver/GSAP boilerplate.
- **`lib/gsap.ts`:** A single module-level `registerPlugin` call avoids duplicate-registration warnings (especially under React Strict Mode's double-invoke in dev) and gives every component the same configured `gsap`/`ScrollTrigger` instances.

## Architectural Patterns

### Pattern 1: Root Smooth-Scroll Provider (single Lenis instance, ticker-synced)

**What:** One client component, mounted once in `app/layout.tsx`, creates the app's only Lenis instance via the official `lenis/react` package's `<ReactLenis root>`. Lenis's own internal RAF loop is disabled (`autoRaf: false`) and its `raf()` method is instead called from inside `gsap.ticker.add(...)`. This guarantees Lenis and every GSAP/ScrollTrigger animation share exactly one frame loop, which eliminates the classic "ScrollTrigger reads a stale scroll position vs. Lenis" jitter bug.

**When to use:** Always, first — this is the foundation everything else in the animation layer depends on. It must exist before any section builds a `ScrollTrigger`.

**Trade-offs:** Slightly more setup than the default `<ReactLenis root />` with `autoRaf` left on, but required for scrub-based `ScrollTrigger` accuracy. No custom `scrollerProxy` is needed — Lenis writes to native `window.scrollY`, so `ScrollTrigger` reads it directly.

**Example:**
```tsx
// components/providers/smooth-scroll-provider.tsx
"use client";
import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap, { ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000); // gsap ticker: seconds → lenis: ms
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
```
`app/layout.tsx` stays a server component; it only imports and renders `<SmoothScrollProvider>{children}</SmoothScrollProvider>` — no `"use client"` needed at the layout level itself.

### Pattern 2: Per-section `useGSAP` with a scoped ref (replaces monolithic `experience.tsx`)

**What:** Every animated section owns a root ref and a single `useGSAP(() => {...}, { scope: rootRef })` call. `useGSAP` (from `@gsap/react`) is a drop-in `useLayoutEffect`/`useEffect` replacement built on `gsap.context()` — every tween/timeline/ScrollTrigger created inside it is automatically reverted (killed) on unmount or on Strict Mode's double-invoke, with zero manual cleanup code.

**When to use:** In every client component that creates GSAP animations — this is the direct replacement for the current pattern of one giant `useEffect` in `experience.tsx` running `document.querySelectorAll` across the whole page.

**Trade-offs:** Requires each section to be its own `"use client"` component (already true for `experience.tsx` today, just split up). Selectors passed to `gsap.utils.toArray()` inside `useGSAP` are automatically scoped to the ref, so `.reveal` in `HeroSection` can never accidentally match a `.reveal` in `ProcessSection`.

**Example:**
```tsx
// components/sections/manifesto-section.tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

export function ManifestoSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 44,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  }, { scope: root });

  return <section ref={root} className="manifesto">{/* content */}</section>;
}
```

### Pattern 3: `gsap.matchMedia()` for `prefers-reduced-motion`

**What:** Wrap animation setup in `gsap.matchMedia()` conditions (e.g. `{ reduceMotion: "(prefers-reduced-motion: reduce)" }`). Inside the callback, branch: when `reduceMotion` matches, either skip the `scrollTrigger`/scrub entirely or jump straight to the animation's end state (`gsap.set` instead of `gsap.from`). All tweens created inside a matched branch are automatically reverted when the media query stops matching (e.g. the user toggles the OS setting live) — no manual listener bookkeeping needed.

**When to use:** Any section with motion beyond a simple opacity fade — parallax, scroll-scrubbed timelines, magnetic hover, section-transition masks. This directly satisfies the PROJECT.md requirement "`prefers-reduced-motion` respetado en toda la nueva capa de animación (GSAP + Lenis incluidos)" and also replaces the current fragile `setTimeout(..., 0)` reduced-motion workaround flagged in `CONCERNS.md`.

**Trade-offs:** One extra layer of nesting inside `useGSAP`, but it's the only approach that live-updates if the OS preference changes mid-session (a plain read-once `matchMedia().matches` check does not).

**Example:**
```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add(
    { reduceMotion: "(prefers-reduced-motion: reduce)" },
    (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (reduceMotion) {
          gsap.set(el, { opacity: 1, y: 0 });
        } else {
          gsap.from(el, { opacity: 0, y: 44, scrollTrigger: { trigger: el, start: "top 85%" } });
        }
      });
    }
  );
  return () => mm.revert();
}, { scope: root });
```

### Pattern 4: Colocated form component (the `FormConnector` fix)

**What:** Move the contact form's JSX out of `app/page.tsx` entirely and into its own client component, `components/contact-form.tsx`, that renders `<form onSubmit={handleSubmit}>` directly. The handler reads `FormData` from `event.currentTarget`, validates with the existing `contactSchema` (unchanged — it's already correctly shared client/server), and `fetch`es `/api/contact`. No `document.querySelector`, no shared DOM `id` contract between two unrelated components, no risk of the listener attaching before the form exists.

**When to use:** Always, for this specific fix — it's a structural change (which component owns the form), not an animation change, so it should land independently of the GSAP/Lenis work and can be done first or in parallel.

**Trade-offs:** None functionally — this is strictly safer than the current pattern. The only "cost" is that `app/page.tsx` loses direct visual control of exactly where the form markup sits in the file; it now composes `<ContactForm />` instead. If the form also needs a reveal-in animation, wrap it with its own `useGSAP` scoped to a ref *inside* `ContactForm` — still zero cross-component DOM querying.

**Example:**
```tsx
// components/contact-form.tsx
"use client";
import { useState, type FormEvent } from "react";
import { contactSchema } from "@/lib/contact-schema";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) return setStatus("error");

    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {/* fields — unchanged markup, just moved here */}
    </form>
  );
}
```
`app/page.tsx` (or `components/sections/contact-section.tsx`) simply renders `<ContactForm />` — no `id="contact-form"`, no separate `FormConnector`, no server/client handoff via the DOM.

### Pattern 5: Centralized `ScrollTrigger.refresh()` orchestration

**What:** A single hook, `use-scroll-refresh.ts`, consumed once (e.g. inside `SmoothScrollProvider` or a top-level layout client component), that calls `ScrollTrigger.refresh()` after every event that can silently shift layout and desync trigger positions:
- `document.fonts.ready` (custom editorial typefaces reflow text after load)
- the hero video's `loadedmetadata`/`loadeddata` event (currently `preload="metadata"` in this codebase)
- `next/image`'s `onLoad` for any above-the-fold image
- menu open/close (the overlay can lock/change body layout)
- window `resize`, debounced

For this project specifically — a single-route, `force-static` page — there is no client-side route navigation today, so App Router route-change refresh (`usePathname()` + `useEffect`) is **not required for this milestone**. Document it in the hook anyway (a no-op `usePathname()` subscription) so it's a two-line change if routes are ever added later, rather than a rearchitecture.

**When to use:** Once, centrally. Do not scatter `ScrollTrigger.refresh()` calls across every section component — that reintroduces the same kind of implicit cross-component coupling this milestone is trying to remove from the form.

**Trade-offs:** A single refresh call after multiple async events firing close together can cause a few redundant recalculations; debounce with `requestAnimationFrame` or a short `setTimeout` if profiling shows it matters. For a page this size (5–6 sections), it will not.

## Data Flow

### Scroll/Animation Flow

```
User wheel/touch/drag
    ↓
Lenis (native listeners, virtual scroll math)
    ↓ (per animation frame, driven by gsap.ticker — Pattern 1)
lenis.raf(time) → writes window.scrollY
    ↓
ScrollTrigger (reads native scroll position, no scrollerProxy needed)
    ↓
Per-section ScrollTrigger callbacks (created inside each section's useGSAP, Pattern 2)
    ↓
GSAP tweens → DOM style/transform updates
```

### Form Submission Flow

```
User submits <form> in ContactForm (Pattern 4)
    ↓
handleSubmit (same component, no DOM query)
    ↓
contactSchema.safeParse (client-side, informational — lib/contact-schema.ts, UNCHANGED)
    ↓
fetch POST /api/contact
    ↓
contactSchema.safeParse (server-side, authoritative — app/api/contact/route.ts, UNCHANGED)
    ↓
Supabase insert (lib/supabase-admin.ts, UNCHANGED)
    ↓
NextResponse (201/4xx/5xx)
    ↓
ContactForm sets local status state → renders inline status message
```
Note: the API layer, Zod schema, and Supabase integration are already correctly structured (server-authoritative validation, no coupling issues) — this milestone touches **only** the client side of the form (which component renders it and wires the handler), not `app/api/contact/route.ts` or `lib/contact-schema.ts`.

### Key Data Flows

1. **Scroll physics → visual motion:** Lenis owns *when* scroll happens (easing/momentum); GSAP/ScrollTrigger own *what* happens at each scroll position. They never fight over the frame loop because Lenis is ticked from inside `gsap.ticker` (Pattern 1) — this is the single most important wiring decision in the whole architecture.
2. **Menu state → scroll lock + refresh:** `MenuOverlay`'s local `open` state (React `useState`, unchanged from today) must call `useLenis()`'s instance `.stop()`/`.start()` when the overlay opens/closes, and trigger `ScrollTrigger.refresh()` on close if the overlay changed body layout. This is a legitimate cross-cutting concern — route it through the `use-scroll-refresh` hook (Pattern 5) or a small `useScrollLock()` hook that wraps `useLenis()`, not through DOM queries.
3. **Reduced motion preference → animation setup:** Resolved once per section via `gsap.matchMedia()` (Pattern 3) at animation-setup time, not read once into a boolean at mount — this keeps behavior correct if the user toggles the OS setting mid-session.

## Scaling Considerations

This is a single-route marketing page, not a multi-tenant app — "scale" here means *growth in animated surface area and content*, not concurrent users. Framed that way:

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (5–6 sections, 1 route, `force-static`) | Root provider (Pattern 1) + one `useGSAP` per section (Pattern 2) is sufficient. No code-splitting, no route-change refresh logic needed yet. |
| Growth (10+ sections, heavier timelines, more plugins like SplitText) | Import only the specific GSAP plugins used (`gsap/ScrollTrigger`, not a bundle that pulls in unused club plugins); consider `next/dynamic(..., { ssr: false })` for a section whose animation code is unusually heavy and below the fold. |
| Multi-page site added later (blog, case studies) | `SmoothScrollProvider` in `layout.tsx` survives client-side navigation (layout doesn't remount), so the Lenis instance persists correctly across routes automatically. At that point, wire `usePathname()` into `use-scroll-refresh.ts` (already stubbed per Pattern 5) to call `ScrollTrigger.refresh()` after route transitions. |

### Scaling Priorities

1. **First likely bottleneck:** GSAP bundle size if plugins are imported broadly instead of per-plugin (`import { ScrollTrigger } from "gsap/ScrollTrigger"` vs. importing the whole `gsap` club bundle). Mitigate at `lib/gsap.ts` by registering only `ScrollTrigger` (free) — this project explicitly excludes WebGL/shaders and hasn't approved paid GSAP plugins, so keep the plugin surface minimal.
2. **Second likely bottleneck:** Too many independent `ScrollTrigger` instances all recalculating on every resize/refresh. `useGSAP`'s automatic `context.revert()` on unmount already prevents leaks; if section count grows significantly, batch manual `ScrollTrigger.refresh()` calls (Pattern 5) rather than letting each section call it independently.

## Anti-Patterns

### Anti-Pattern 1: Cross-component DOM querying to wire event handlers (current `FormConnector`)

**What people do:** Render a `<form id="contact-form">` in one component (`app/page.tsx`) and, in a *different* component (`experience.tsx`), run `document.querySelector("#contact-form")` inside a `useEffect` to attach a submit listener after mount.

**Why it's wrong:** The two components are coupled by a string ID with no type safety. If the ID changes, is duplicated, or the form renders conditionally/later, the listener silently fails to attach. It's also untestable in isolation (`CONCERNS.md` confirms: "No unit tests found for form submission flow").

**Do this instead:** The component that renders the `<form>` also owns the `onSubmit` handler (Pattern 4). If a handler genuinely needs to live outside the form's own component tree, pass it down as a prop or via React Context — never reach for the DOM to bridge two React components.

### Anti-Pattern 2: One "God" client component owning every concern (current `experience.tsx`)

**What people do:** A single `"use client"` component manages menu state, scroll tracking, parallax math, reveal `IntersectionObserver`s, custom cursor tracking, reduced-motion handling, and form submission all in one file with several `useEffect`s each running multiple `document.querySelectorAll` calls.

**Why it's wrong:** Cleanup ordering becomes fragile (which effect tears down what, in what order, matters more as concerns grow), `ScrollTrigger` scope becomes impossible to reason about (everything is effectively scoped to `document`), and any change to one concern (e.g. the cursor) risks breaking an unrelated one (e.g. the form) because they share a file and a mount/unmount lifecycle.

**Do this instead:** One component (or hook) per concern, each with its own `useGSAP`/`useEffect` scoped to its own ref (Pattern 2). `experience.tsx` should be deleted or reduced to nothing once its five responsibilities are extracted into `sections/`, `contact-form.tsx`, `menu-overlay.tsx`, and `cursor.tsx`.

### Anti-Pattern 3: A hand-rolled `requestAnimationFrame` + `getBoundingClientRect()` parallax loop running alongside GSAP/Lenis

**What people do:** Keep the existing `[data-parallax]` rAF loop (flagged in `CONCERNS.md` — "Animation Frame Recalculation") that calls `getBoundingClientRect()` on every scroll-triggered frame, running as a *second*, independent frame loop next to the new Lenis/GSAP ticker.

**Why it's wrong:** Two competing RAF loops double the per-frame work and can drift out of sync with each other, reintroducing the exact jitter class of bug that switching to Lenis+ScrollTrigger is meant to solve. It also duplicates logic that `ScrollTrigger`'s `scrub` option already provides natively and more efficiently.

**Do this instead:** Express parallax as a `ScrollTrigger`-driven tween with `scrub: true` (Pattern 2's structure, different tween config), driven by the same single ticker as everything else. Delete the manual rAF parallax loop entirely — do not run it "alongside" GSAP as a transition step.

### Anti-Pattern 4: Registering GSAP plugins in more than one place

**What people do:** Call `gsap.registerPlugin(ScrollTrigger)` inside individual section components instead of once at module scope.

**Why it's wrong:** Produces duplicate-registration console warnings, and under React Strict Mode's dev-mode double-invoke, increases the chance of subtly re-initializing plugin state mid-session.

**Do this instead:** One `lib/gsap.ts` module that calls `gsap.registerPlugin(...)` at import time and re-exports the configured `gsap`/`ScrollTrigger`/`useGSAP`. Every component imports from `@/lib/gsap`, never from `gsap` directly.

### Anti-Pattern 5: Hand-building a Lenis Context provider instead of using the official `lenis/react` package

**What people do:** Write a custom `LenisContext`/`LenisProvider` from scratch (manual `new Lenis()`, manual RAF loop, manual resize handling, manual SSR guards).

**Why it's wrong:** Reinvents edge cases (resize observers, unmount cleanup, root-vs-nested scroll containers, SSR window guards) that the official `lenis/react` subpath (`lenis/react`, exporting `ReactLenis` and `useLenis`) already handles and tests. This project doesn't currently depend on any package that conflicts with adding it.

**Do this instead:** Use `<ReactLenis root>` from `lenis/react` as the provider (Pattern 1) and `useLenis()` wherever a component needs read access to the instance (e.g. `MenuOverlay` calling `.stop()`/`.start()`). Only wrap it in a thin local component to attach the `gsap.ticker` sync — don't reimplement Lenis's own lifecycle management.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Supabase | Unchanged — `app/api/contact/route.ts` → `lib/supabase-admin.ts`, server-only service role key | Out of scope for this animation milestone; do not touch |
| `gsap` (npm) | `lib/gsap.ts` registers `ScrollTrigger` + `@gsap/react`'s `useGSAP` once, module-level | Only free-tier plugins used (no WebGL/shaders per PROJECT.md scope) — import per-plugin (`gsap/ScrollTrigger`), not the full bundle |
| `lenis` (npm, `lenis/react` subpath) | `<ReactLenis root>` mounted once in `SmoothScrollProvider`, `autoRaf: false`, ticked from `gsap.ticker` | Official React integration ships `useLenis()` — no custom Context needed (Anti-Pattern 5) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `SmoothScrollProvider` ↔ Section components | Implicit (Lenis writes native `window.scrollY`; sections read it via `ScrollTrigger`, not via the provider directly) | Most sections never need `useLenis()` directly — only components that must pause/resume scroll (menu) or read live scroll progress outside `ScrollTrigger` need it |
| Section components ↔ `ScrollTrigger` | Global plugin registry keyed by trigger element; per-component teardown via `useGSAP`'s automatic `context.revert()` | No explicit "boundary" object — cleanup correctness comes entirely from consistent use of `scope` (Pattern 2) |
| `ContactForm` ↔ `/api/contact` | `fetch` + JSON, contract defined by `lib/contact-schema.ts` (shared, unchanged) | This is already the correct pattern today — only the *client-side wiring* (which component renders the form) is being fixed, not the request contract |
| `MenuOverlay` ↔ Lenis/ScrollTrigger | `useLenis()` for `.stop()`/`.start()`; `ScrollTrigger.refresh()` after close (Pattern 5) | The one legitimate cross-cutting concern in this architecture — keep it in one small hook, don't duplicate the stop/start/refresh calls in multiple places |

## Suggested Build Order

This maps directly onto phase structure for the roadmap. Each step depends on the previous one being in place:

1. **Foundation — install & wire the provider.** Add `gsap`, `@gsap/react`, `lenis` to `package.json`. Create `lib/gsap.ts` (plugin registration) and `components/providers/smooth-scroll-provider.tsx` (Pattern 1). Wrap `app/layout.tsx`'s `{children}` in it. Verify: no SSR/hydration console errors, no duplicate-plugin warnings under Strict Mode, scroll still works with zero visible animation changes yet. **This must land before any section-level animation work** — every subsequent phase assumes a single, correctly ticked Lenis+ScrollTrigger loop exists.

2. **Fix `FormConnector` (independent, can run in parallel with step 1).** Extract `components/contact-form.tsx` (Pattern 4) out of `app/page.tsx` and `experience.tsx`. This is a structural fix, not an animation fix, and has no dependency on GSAP/Lenis being installed — it can be done first, last, or alongside step 1 without conflict.

3. **Decompose `experience.tsx` into per-section components.** Split menu, cursor, and each visual section into their own client components under `components/sections/`, `menu-overlay.tsx`, `cursor.tsx`. At this stage, ports the *existing* reveal/parallax/cursor behavior 1:1 (still vanilla or minimally GSAP-ified) — the goal here is establishing correct component boundaries and `useGSAP` scoping (Pattern 2) before adding new animation complexity on top of a messy structure.

4. **Replace vanilla reveal/parallax/cursor with GSAP-native hooks.** Build `hooks/use-reveal.ts`, `hooks/use-parallax.ts`, `hooks/use-magnetic.ts` (Pattern 2 + Pattern 3 for reduced motion), replacing the IntersectionObserver reveal pattern and the flagged rAF parallax loop (Anti-Pattern 3) with `ScrollTrigger`-driven equivalents.

5. **New section-level timelines and transitions.** With the foundation, boundaries, and reusable hooks in place, build the actual new creative work: scroll-narrative manifesto timeline, section-transition mask effects, magnetic hover states, evolved hero layering. This is the phase most likely to need additional targeted research (specific ScrollTrigger `scrub`/`pin` techniques) since it's the most novel, design-driven work.

6. **Polish: refresh orchestration + reduced-motion audit + perf pass.** Build `hooks/use-scroll-refresh.ts` (Pattern 5), audit every new animation for a `gsap.matchMedia()` reduced-motion branch, and re-run Lighthouse/perf checks now that the video/image optimization work (also in this milestone's scope) is done — layout shifts from those asset changes are exactly what step 6's refresh orchestration needs to account for.

**Ordering rationale:** Steps 1 and 2 have no dependency on each other and can be parallelized. Step 3 depends on step 1 (needs the provider to exist so new section components can eventually use `useGSAP`) but not on step 2. Steps 4–6 strictly depend on 1 and 3 (need both the ticked provider and correct component boundaries before layering new animation complexity). Doing the decomposition (3) *before* the new creative timelines (5) avoids building elaborate new animations on top of the currently fragile, monolithic structure — which would mean redoing the animation code a second time during decomposition.

## Sources

- [React & GSAP — official docs](https://gsap.com/resources/React/) — HIGH confidence (official GSAP documentation)
- [greensock/gsap-skills — gsap-react SKILL.md](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-react/SKILL.md) — HIGH confidence (official GreenSock repository)
- [gsap.matchMedia() — official docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) — HIGH confidence (official GSAP documentation)
- [lenis/packages/react/README.md — darkroomengineering/lenis](https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md) — HIGH confidence (official Lenis maintainer repository)
- [Smooth Scrolling in Next.js with Lenis & GSAP — DevDreaming](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) — MEDIUM confidence (third-party tutorial, cross-checked against official Lenis/GSAP docs, pattern matches)
- [How to implement Lenis in Next.js — Bridger Tower](https://bridger.to/lenis-nextjs) — MEDIUM confidence (third-party tutorial, corroborates provider-at-root-layout pattern)
- [ScrollTrigger with Lenis smooth scroll — scrollerProxy setup — GSAP forums](https://gsap.com/community/forums/topic/34814-scrolltrigger-with-lenis-smooth-scroll-problem-with-the-scrollerproxy-setup/) — MEDIUM confidence (official GSAP community forum, GreenSock staff responses)
- [ScrollTrigger.refresh() not working upon changing route in NextJS — GSAP forums](https://gsap.com/community/forums/topic/34287-scrolltriggerrefresh-not-working-upon-changing-route-in-nextjs/) — MEDIUM confidence (community forum; informs the route-change caveat in Pattern 5)
- [Data Fetching: Forms and Mutations — Next.js official docs](https://nextjs.org/docs/pages/building-your-application/data-fetching/forms-and-mutations) — HIGH confidence (official Next.js documentation; confirms `onSubmit` + `FormData` + `fetch` as a valid, non-Server-Action pattern appropriate here since this project already has a working `/api/contact` route)
- Internal: `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/CONCERNS.md` (this repository's own codebase audit, 2026-07-18) — HIGH confidence (direct source, describes the exact code being replaced)

---
*Architecture research for: GSAP + Lenis integration into Next.js App Router (Sky Tech Perú local-2)*
*Researched: 2026-07-18*
