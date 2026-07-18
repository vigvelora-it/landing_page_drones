# Project Research Summary

**Project:** Sky Tech Perú landing page — cinematic scroll animation layer (local-2)
**Domain:** Creative-studio-tier motion design for a Next.js 16 / React 19 marketing site (GSAP + Lenis, no WebGL)
**Researched:** 2026-07-18
**Confidence:** HIGH

## Executive Summary

This is a migration project: an existing Next.js 16 / React 19 topography/engineering landing page needs a Dogstudio/Awwwards-tier cinematic motion layer (smooth scroll, choreographed reveals, editorial typography, magnetic CTAs, mask transitions) built on GSAP + ScrollTrigger + Lenis, explicitly without WebGL/shaders. Both GSAP (100% free since the April 2025 Webflow acquisition, including ScrollTrigger and SplitText) and Lenis are mature, well-documented, and the exact integration pattern — Lenis driven by `gsap.ticker` with `autoRaf: false`, `useGSAP()` for React lifecycle safety, `gsap.matchMedia()` for reduced-motion — is cross-verified across official docs, GitHub, and community sources. Confidence in the technical approach is HIGH.

The recommended approach is not purely additive: the existing codebase has real structural debt (a monolithic `experience.tsx` doing menu/scroll/parallax/cursor/reduced-motion/form-wiring all at once, a fragile DOM-query-coupled `FormConnector`, and a hand-rolled `requestAnimationFrame` parallax loop) that must be decomposed *before* new animation complexity is layered on, or the same code will need to be rebuilt twice. Architecture research is explicit that this decomposition (per-section components, colocated form handler, GSAP-native hooks replacing vanilla JS) is a prerequisite phase, not cleanup deferred to the end.

The primary risks are architectural/process risks, not technology-choice risks: (1) two rival frame loops (Lenis's own rAF vs. GSAP's ticker, or the old parallax loop vs. new ScrollTrigger-driven parallax) causing jitter if not unified from day one; (2) `prefers-reduced-motion` being satisfied for CSS but silently ignored by GSAP/Lenis, a direct regression against an explicit project requirement; (3) mobile performance collapse from stacking pinned sections, mask transitions, and a large hero video with no `matchMedia`-gated complexity reduction; and (4) SSR/hydration breakage from GSAP/Lenis code executing outside a proper client boundary, which would fail this project's `npm run build` gate. All four are addressable by sequencing: wire the shared scroll/motion foundation and reduced-motion gate first, decompose the monolith second, and only then build new creative timelines — verified with `npm run build`, DevTools reduced-motion emulation, and CPU-throttled mobile profiling at each stage rather than at the end.

## Key Findings

### Recommended Stack

Core stack is `gsap@^3.15.0` + `lenis@^1.3.25` + `@gsap/react@^2.1.2`, installed via plain npm (no license/registry needed — GSAP has been fully free, including all former Club GreenSock plugins like ScrollTrigger and SplitText, since April 2025). No additional dev dependencies required; both packages ship first-party TypeScript types. The governing architectural rule: only one `requestAnimationFrame` loop drives scroll — Lenis is instantiated with `autoRaf: false` and ticked from inside `gsap.ticker.add(...)`, with `lenis.on('scroll', ScrollTrigger.update)` keeping ScrollTrigger in sync.

**Core technologies:**
- `gsap` + `gsap/ScrollTrigger` (tree-shaken subpath import) — animation engine and scroll-linked triggers — industry standard for timeline-based, choreographed motion, now free for commercial use including all plugins needed here
- `lenis` — physics-based smooth scroll — de-facto standard for this genre, framework-agnostic with a first-party `lenis/react` adapter (`ReactLenis`, `useLenis`)
- `@gsap/react` (`useGSAP` hook) — StrictMode-safe React lifecycle binding — replaces error-prone manual `useEffect` + `ScrollTrigger.kill()` bookkeeping with automatic `gsap.context().revert()` cleanup
- `gsap/SplitText` (bundled, free since 2025) — word/line-level headline splitting for the project's required "editorial large-format typography"

### Expected Features

**Must have (table stakes):**
- Site-wide Lenis smooth scroll, correctly ticker-synced with GSAP
- ScrollTrigger-driven staggered reveal system (replacing current `[data-reveal]` IntersectionObserver pattern)
- SplitText word/line-level headline reveals (hero + section titles)
- Parallax re-driven through ScrollTrigger/Lenis (fixing sync, keeping existing visual language)
- Custom cursor ported to GSAP `quickTo`
- Overlay menu opening/closing as a GSAP timeline (backdrop → staggered links)
- One high-impact hero→first-section mask/block-reveal transition
- `prefers-reduced-motion` gate wrapping the entire motion layer (non-negotiable requirement)
- Refined, short intro/preload sequence with `ScrollTrigger.refresh()` on completion

**Should have (differentiators, v1.x):**
- Magnetic hover on primary CTA(s) only (2–4 elements max — overuse reads as gimmicky)
- Image reveal-on-scroll via wrapper-translate technique (never animate `clip-path` directly)
- Marquee/ticker strip for the capability list (pure CSS, no GSAP required)
- Scroll-scrubbed process-section timeline

**Defer (v2+):**
- Scroll-velocity-reactive skew/stretch effects
- Additional mask/block-reveal transitions beyond the single hero moment
- WebGL/shader-based effects — explicitly out of scope

### Architecture Approach

A root `SmoothScrollProvider` client component (wrapping `{children}` in `app/layout.tsx`) owns the single Lenis instance and GSAP plugin registration. Every visual section becomes its own client component with its own `useGSAP(() => {...}, { scope: sectionRef })` call, directly replacing the current monolithic `experience.tsx`. The contact form's `FormConnector` DOM-query coupling is fixed independently (same component owns both markup and `onSubmit` handler) and can land in parallel with the GSAP/Lenis foundation.

**Major components:**
1. `SmoothScrollProvider` + `lib/gsap.ts` — owns the Lenis instance, ticks it from `gsap.ticker`, registers plugins once
2. Per-section client components (`HeroSection`, `ManifestoSection`, `CapabilitiesSection`, `ProcessSection`) — each with scoped `useGSAP`
3. `ContactForm` — colocated markup + submit handler, fixing `FormConnector`
4. Reusable hooks (`use-reveal`, `use-parallax`, `use-magnetic`, `use-scroll-refresh`) — GSAP-native replacements for vanilla behaviors, plus centralized `ScrollTrigger.refresh()` orchestration
5. `gsap.matchMedia()` reduced-motion gate — implemented once, wraps every animated feature

### Critical Pitfalls

1. **Lenis and GSAP running on separate rAF loops** — fix once, foundationally: `autoRaf: false`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.lagSmoothing(0)`.
2. **`prefers-reduced-motion` satisfied for CSS but ignored by GSAP/Lenis** — gate via `gsap.matchMedia()`, skip/soften Lenis for reduced-motion users.
3. **Raw `useEffect` + GSAP instead of `useGSAP()`** — causes StrictMode double-fire, leaked ScrollTrigger instances; use `useGSAP({ scope })` from the start.
4. **SSR/hydration mismatch from GSAP/Lenis outside a client boundary** — threatens the `npm run build` gate; verify with a clean build immediately after wiring the provider.
5. **Mobile performance cliff** from stacking pinned/scrubbed sections atop hero-video decode load, compounded if the old rAF parallax loop isn't removed — build mobile-simplified variants via `matchMedia` from the first section.

## Implications for Roadmap

### Phase 1: Motion Foundation & Structural Fixes
**Rationale:** Everything scroll-linked depends on a ticker-synced Lenis+GSAP loop existing first; the `FormConnector` fix is independent and can run in parallel.
**Delivers:** Packages installed; `lib/gsap.ts` + `SmoothScrollProvider` wired into root layout (no visible animation change yet); reduced-motion gate scaffolded; `ContactForm` extracted, `FormConnector` deleted.
**Avoids:** Pitfalls 1, 4, 5, 6 (all foundational per PITFALLS.md mapping).

### Phase 2: Decompose the Monolith into Section Components
**Rationale:** New animation work shouldn't be built on the current monolithic `experience.tsx`.
**Delivers:** `experience.tsx` split into per-section components, `menu-overlay.tsx`, `cursor.tsx`, each scoped with `useGSAP`; existing behavior ported 1:1 first to establish boundaries.

### Phase 3: GSAP-Native Reveal, Parallax, Cursor, and Typography
**Rationale:** With boundaries and foundation in place, replace vanilla behaviors and add SplitText.
**Delivers:** `use-reveal`, `use-parallax` (old rAF loop deleted, not layered), `use-magnetic`; SplitText hero/section-title reveals; cursor on `quickTo`.
**Avoids:** Pitfall 7 — old parallax loop explicitly removed as a prerequisite.

### Phase 4: Signature Moments — Menu Choreography, Mask Transition, Intro
**Rationale:** Most novel/design-driven work, built on proven reveal infrastructure.
**Delivers:** Menu GSAP timeline; single hero→first-section mask/block-reveal transition; refined intro with `ScrollTrigger.refresh()` on completion.
**Avoids:** Pitfall 3 (FOUC/CLS) — bake "from" states into CSS, animate transform/opacity only.

### Phase 5: Differentiators (v1.x) — Magnetic CTAs, Image Reveals, Marquee, Process Timeline
**Rationale:** Gated behind "v1 motion layer stable and performant" per FEATURES.md; additive polish.
**Delivers:** Magnetic CTA, wrapper-translate image reveals, marquee, scroll-scrubbed process timeline.

### Phase 6: Reduced-Motion Audit, Mobile Performance Verification, Build Gate
**Rationale:** Zero existing automated tests/benchmarks means these need dedicated verification, not assumed coverage.
**Delivers:** DevTools reduced-motion emulation pass; CPU-throttled mobile profiling; clean `npm run build`; centralized refresh orchestration finalized.

### Phase Ordering Rationale

- Phase 1's two workstreams (provider setup, FormConnector fix) have no dependency on each other.
- Decomposition (Phase 2) must precede new creative timelines (Phases 3–5) to avoid rebuilding animation code.
- Old rAF parallax loop removal is a prerequisite of Phase 3, not deferred cleanup.
- Reduced-motion gating established once (Phase 1), re-verified in Phase 6 — retrofitting is rated "Never acceptable" by PITFALLS.md.
- Mobile performance verification is a dedicated late-stage phase given zero existing benchmarks — a mobile cliff discovered after full build-out is a "HIGH" recovery-cost scenario.

### Research Flags

**Needs research:**
- Phase 4 (mask/block-reveal transition) — MEDIUM–HIGH complexity, only one Codrops reference found.
- Phase 5 (scroll-scrubbed timeline, scroll-velocity effects) — velocity-reactive effects flagged LOW confidence/trend-only.

**Standard patterns (skip research-phase):**
- Phase 1 (Lenis+GSAP foundation, FormConnector fix) — HIGH confidence, fully specified.
- Phase 2 (decomposition) — standard React/Next.js refactoring.
- Phase 3 (reveal/parallax/cursor/SplitText) — well-documented GSAP core patterns.
- Phase 6 (verification) — standard QA checklist from PITFALLS.md.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core integration pattern cross-verified across official GSAP/Lenis docs, GSAP forum, multiple 2026 tutorials |
| Features | MEDIUM | Cross-checked across GSAP docs, Codrops, tutorials; a few trend-only claims flagged LOW confidence |
| Architecture | HIGH (core) / MEDIUM (refresh orchestration) | Provider/useGSAP patterns HIGH (official docs); refresh orchestration is community-derived |
| Pitfalls | MEDIUM | Cross-checked across forums/docs/write-ups; no single HIGH-tier curated source this session |

**Overall confidence:** HIGH

### Gaps to Address

- Exact SVG-mask/block-reveal technique under-specified beyond one Codrops article — validate during Phase 4 planning.
- No existing performance benchmarks on this codebase — establish a baseline early (end of Phase 1) so Phase 6 has something to regress against.
- `ScrollTrigger.refresh()` route-change orchestration not required now but should be stubbed as a no-op per ARCHITECTURE.md — confirm inclusion during roadmap detailing.

## Sources

### Primary (HIGH confidence)
- https://gsap.com/resources/React/, https://github.com/darkroomengineering/lenis, https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/, https://github.com/greensock/gsap-skills, npm registry version queries, internal `.planning/codebase/ARCHITECTURE.md` / `CONCERNS.md`

### Secondary (MEDIUM confidence)
- GSAP community forum threads (ScrollTrigger+Lenis sync), devdreaming.com Next.js tutorial, Codrops SVG mask article, gsap.com/resources/st-mistakes

### Tertiary (LOW confidence)
- reallygooddesigns.com trend blog, svgator.com preloader blog

---
*Research completed: 2026-07-18*
*Ready for roadmap: yes*
