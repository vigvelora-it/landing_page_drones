# Stack Research

**Domain:** Cinematic scroll animation layer (GSAP + Lenis) on top of an existing Next.js 16 / React 19 / TypeScript site
**Researched:** 2026-07-18
**Confidence:** HIGH (core integration pattern cross-verified across official GSAP docs, official Lenis/darkroomengineering docs, GSAP forum, and multiple 2026-dated tutorials — all converge on the same pattern)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `gsap` | `^3.15.0` | Animation engine (timelines, ScrollTrigger, easing) | Industry standard for scroll-driven, timeline-based "creative studio" motion (Dogstudio-style). As of April 2025, Webflow (which acquired GSAP in late 2024) made **the entire library 100% free for commercial use**, including plugins that used to require a paid "Club GreenSock" membership (ScrollTrigger, ScrollSmoother, SplitText, DrawSVG, MorphSVG, etc.). No license key, no private registry — plain `npm install gsap`. |
| `lenis` | `^1.3.25` | Physics-based smooth scroll (replaces native scroll with rAF-driven lerp) | The de-facto standard smooth-scroll library for this genre of site (used by most Awwwards/creative-studio sites in 2025-2026). Zero runtime dependencies, ~a few KB, framework-agnostic core with a first-party React adapter shipped in the same package (`lenis/react` — no separate `@studio-freight/react-lenis` needed anymore, that package is deprecated/renamed). |
| `@gsap/react` | `^2.1.2` | Official React binding for GSAP (`useGSAP` hook) | Solves the exact React-specific problems this project needs solved: StrictMode double-invoke safety and automatic cleanup via `gsap.context().revert()` on unmount. Peer dependency is `react: ">=17"` — confirmed compatible with React 19.2.7 already in this project. Without it you'd hand-roll `useEffect` + manual `ScrollTrigger.getAll().forEach(t => t.kill())` cleanup, which is exactly the kind of fragile pattern this migration should avoid. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `gsap/ScrollTrigger` | bundled with `gsap` | Scroll-linked animation triggers (replaces current `IntersectionObserver` reveal logic) | Import as a named subpath (`import { ScrollTrigger } from 'gsap/ScrollTrigger'`), never `gsap/all`, to keep it tree-shakeable. Register once at module scope, not inside a component/effect. |
| `gsap/ScrollSmoother` | bundled with `gsap`, free since 2025 | GSAP's own native smooth-scroller, alternative to Lenis | **Not needed here** — the project has already approved Lenis explicitly. Mentioned only because it's now free and some 2026 tutorials default to it; don't mix it with Lenis (two smooth-scroll engines fighting over the same scroll event is a common pitfall — see PITFALLS.md). |
| `gsap/SplitText` | bundled with `gsap`, free since 2025 | Character/word/line splitting for the large editorial typography reveals this project wants in the hero/manifiesto sections | Previously a paid Club GreenSock plugin; now included free with the base `gsap` install. Useful for the "tipografía editorial de gran escala" requirement — import as `gsap/SplitText`, tree-shaken like ScrollTrigger. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `next.config.ts` — no special GSAP config required | Confirms GSAP ships as native ESM and works with Next.js 16's bundler (Turbopack/Webpack) out of the box | Only add `transpilePackages: ['gsap']` if you hit a "Cannot find module 'gsap/ScrollTrigger'" build error (a known but now-rare issue tied to older `next-transpile-modules` setups, not current Next.js). Don't add it preemptively — it can *break* tree-shaking in some Next.js versions per a still-open Next.js tree-shaking issue with `transpilePackages`. |
| `prefers-reduced-motion` via `window.matchMedia` inside `useGSAP`/`gsap.matchMedia()` | Satisfies the project's explicit reduced-motion requirement for both GSAP and Lenis | GSAP's own `gsap.matchMedia()` API is the recommended way to branch animation setup (including disabling ScrollTrigger pinning) by media query, including `(prefers-reduced-motion: reduce)`. For Lenis, simplest approach is to skip instantiating Lenis entirely (or set `lerp: 1`/no smoothing) when the media query matches, and fall back to native scroll. |

## Installation

```bash
# Core
npm install gsap lenis @gsap/react

# No separate dev dependencies needed — @types are bundled in both gsap and lenis packages (both ship first-party TypeScript types)
```

## Integration Pattern (2026 standard)

The single most important architectural rule: **only one `requestAnimationFrame` loop should drive scroll**. Lenis must NOT run its own independent rAF loop when GSAP ScrollTrigger is present — instead, Lenis is driven by GSAP's ticker, and ScrollTrigger is told to recalculate on every Lenis scroll event. This is the pattern that both the official Lenis docs/GitHub and the GSAP forum converge on:

```tsx
// components/SmoothScroll.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger); // module scope in a real app; shown here for clarity

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,      // critical: GSAP's ticker drives the frame loop, not Lenis's own
      syncTouch: true,      // replaces the removed `smoothTouch` option
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000); // gsap.ticker time is in seconds; Lenis expects ms
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // avoid GSAP's lag-catchup fighting Lenis's own easing

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
```

Register this once near the root layout (client component wrapping `{children}`), not per-page, so there is exactly one Lenis instance for the whole site.

For individual animated components, use `useGSAP` instead of raw `useEffect` — it removes the need for manual `ScrollTrigger.kill()` bookkeeping and is StrictMode-safe:

```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP); // register once at module scope

export function RevealSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".reveal", {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          scrollTrigger: { trigger: container.current, start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope: container } // scopes selectors + auto-cleans on unmount, StrictMode-safe
  );

  return <div ref={container}>{/* ...reveal elements... */}</div>;
}
```

**Why this avoids the two most common bugs in 2026 GSAP+Lenis+Next.js setups:**
1. Registering plugins inside a `useEffect`/component body (instead of module scope) causes "Plugin already registered" duplicate-registration warnings under React 19 + StrictMode's intentional double-invoke of effects in development. Register once at module scope.
2. Letting Lenis run its own `autoRaf` loop *and* having ScrollTrigger listen to native scroll produces desynced scroll positions (ScrollTrigger measuring against native `scrollY` while Lenis is virtually scrolling the page via transform). Always set `autoRaf: false` and pipe frames through `gsap.ticker`.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Lenis (`autoRaf: false`, driven by `gsap.ticker`) | GSAP `ScrollSmoother` (free since 2025) | If you want to stay in a 100% GSAP-owned stack with zero third-party smooth-scroll dependency and don't mind `ScrollSmoother`'s more opinionated DOM wrapper requirement (`#smooth-wrapper`/`#smooth-content`). This project already explicitly approved Lenis, so stick with Lenis — don't run both. |
| `gsap` + `lenis` + `@gsap/react` | Framer Motion (`motion`) | If the team prioritizes declarative React-idiomatic animation over imperative timeline control, or needs shared-element/layout transitions between routes. GSAP wins for complex, sequenced, scroll-scrubbed timelines like Dogstudio-style reveals — Framer Motion's scroll APIs are comparatively limited for this level of choreography. |
| GSAP ScrollTrigger for scroll-linked reveals | Native CSS Scroll-Driven Animations (`animation-timeline: scroll()`) | Only for simple, non-critical progressive-enhancement effects, given inconsistent cross-browser support (notably Safari) as of 2026 — not viable as the primary animation engine for a client-facing production site that needs consistent behavior. |
| `lenis/react` (bundled) | `@studio-freight/react-lenis` | Never for new code — this package has been renamed/absorbed into `lenis/react` within the main `lenis` package. Only relevant if maintaining old code that still imports the old package name. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| `smoothTouch` Lenis option | Removed/deprecated in current Lenis 1.3.x API | `syncTouch: true` |
| Installing GSAP via a private "Club GreenSock" npm registry or license key | No longer necessary — GSAP has been 100% free (including all former Club plugins) since April 2025 following the Webflow acquisition | Plain `npm install gsap` from the public npm registry |
| `locomotive-scroll` | Older, heavier smooth-scroll library, less actively aligned with GSAP's ticker pattern; largely superseded by Lenis in the current creative-dev ecosystem | `lenis` |
| Manual `useEffect` + `ScrollTrigger.getAll().forEach(t => t.kill())` cleanup boilerplate for every animated component | Error-prone under React 19 + StrictMode's double-invoke; easy to leak ScrollTrigger instances or double-register on remount | `useGSAP()` from `@gsap/react`, which wraps `gsap.context()` and auto-reverts on unmount |
| Registering `gsap.registerPlugin(ScrollTrigger)` inside a component body or `useEffect` | Causes duplicate-registration warnings/side effects under StrictMode's dev-mode double-invocation | Register plugins once at module scope (top of a shared file imported once, e.g. `lib/gsap.ts`) |
| Running Lenis with its default `autoRaf: true` alongside ScrollTrigger | Creates two competing rAF loops, causing ScrollTrigger's scroll-position calculations to desync from Lenis's virtual scroll | `autoRaf: false` + `gsap.ticker.add((time) => lenis.raf(time * 1000))` |
| `gsap/all` import | Bundles every plugin regardless of use, defeating tree-shaking | Import only the specific plugin subpaths you use (`gsap/ScrollTrigger`, `gsap/SplitText`), each of which tree-shakes independently |

## Stack Patterns by Variant

**If replacing the existing `FormConnector` `querySelector`-coupled logic during this same milestone:**
- Keep GSAP entirely out of the form-submission logic itself; only use it for the form's *entrance/reveal* animation (via `useGSAP` scoped to the form container).
- Because mixing animation-library refs with fragile DOM-query coupling compounds the exact fragility this migration is meant to remove — animation code should read/write refs, not global selectors.

**If the hero section keeps its existing `<video>` element (no WebGL, per Out of Scope):**
- Animate the video's *container* (scale, mask, opacity) with GSAP/ScrollTrigger rather than the `<video>` element's intrinsic properties.
- Because animating transforms on a wrapper avoids forcing video decode/repaint on every scroll tick, keeping scroll performance smooth on lower-end devices — important since Lenis already adds a rAF-driven transform to the whole page.

**If reduced-motion is detected:**
- Skip Lenis instantiation entirely (render children directly, native scroll) and gate GSAP animations behind `gsap.matchMedia()` with the `(prefers-reduced-motion: no-preference)` query, rather than trying to instantiate everything and disable it after the fact.
- Because starting Lenis and ScrollTrigger and *then* trying to neuter them is more error-prone than never starting them for reduced-motion users, and this project explicitly requires `prefers-reduced-motion` to be respected across the whole new animation layer.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-------------------|-------|
| `@gsap/react@2.1.2` | `gsap@^3.12.5` (peer dep), `react@>=17` (peer dep) | Confirmed compatible with the project's existing `gsap@3.15.0` recommendation and `react@19.2.7`. |
| `lenis@1.3.25` | `react@>=17.0.0` (peer dep, for the `lenis/react` subpath only) | Core `lenis` package has zero required peer deps if you don't import `lenis/react`; the React peer dep only applies when using the `ReactLenis`/`useLenis` exports. This project's manual-instantiation pattern (see Integration Pattern above) avoids `lenis/react` entirely and drives Lenis directly, sidestepping any React-wrapper-specific quirks reported for mobile/iOS with `<ReactLenis>`. |
| `gsap@3.15.0` | `next@16.2.10` | Ships as native ESM; works with both Next.js Webpack and Turbopack builds without special config in the general case. Add `transpilePackages: ['gsap']` in `next.config.ts` only if a build actually fails to resolve `gsap/ScrollTrigger` — don't add it speculatively. |
| `gsap@3.15.0` | TypeScript 5.9.3 (strict mode, project's existing config) | GSAP and `@gsap/react` both ship first-party `.d.ts` types; no `@types/gsap` package needed (and none exists — it would conflict). |

## Sources

- https://gsap.com/resources/React/ — official GSAP React integration guide (`useGSAP`, StrictMode rationale, `contextSafe`) — HIGH confidence (official vendor docs)
- https://github.com/darkroomengineering/lenis (main README + `packages/react/README.md`) — official Lenis API options (`autoRaf`, `syncTouch`, `lerp`, `duration`), official GSAP ScrollTrigger sync sample (`lenis.raf(time * 1000)`) — HIGH confidence (official vendor repo)
- https://gsap.com/community/forums/topic/40426-patterns-for-synchronizing-scrolltrigger-and-lenis-in-reactnext/ — community-vetted GSAP-ticker-drives-Lenis pattern, cross-checked against official docs above (same pattern, confirms `autoRaf: false` + `gsap.ticker.lagSmoothing(0)`) — MEDIUM-HIGH confidence (official forum, community-authored but vendor-moderated)
- https://webflow.com/blog/gsap-becomes-free and https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/ — confirms GSAP/Webflow acquisition and 100%-free licensing since April 2025 (all plugins incl. ScrollTrigger, ScrollSmoother, SplitText) — HIGH confidence (vendor announcement + independent tech press corroboration)
- npm registry (`registry.npmjs.org`) direct queries for `gsap`, `lenis`, `@gsap/react` — confirmed current published versions (`gsap@3.15.0`, `lenis@1.3.25`, `@gsap/react@2.1.2`) and peer dependency ranges — HIGH confidence (primary source, registry metadata)
- https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap (dated April 2026) — Next.js App Router-specific wiring pattern, `"use client"` boundary placement, module-scope plugin registration rationale for StrictMode — MEDIUM confidence (third-party tutorial, but pattern matches official sources above)
- https://bundlephobia.com/package/gsap — bundle size figures (~22-23 KB gzipped core, ScrollTrigger adds a few KB, independently tree-shakeable) — MEDIUM confidence (automated bundle-analysis tool, not hand-verified against this project's actual build)

---
*Stack research for: Cinematic scroll animation (GSAP + Lenis) on Next.js 16 / React 19*
*Researched: 2026-07-18*
