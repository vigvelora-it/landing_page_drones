# Roadmap: Sky Tech Perú — local-2 (rediseño visual cinematográfico)

## Overview

This roadmap takes `local-2` from its current vanilla-JS animation layer to a Dogstudio/Awwwards-tier cinematic motion experience built on GSAP + Lenis, without WebGL/shaders. The work is sequenced foundation-first: a unified Lenis+GSAP scroll engine and a decomposed component architecture must exist before any new creative timelines are built, or the same animation code would need to be rebuilt twice. From there, the site's baseline motion (reveal, parallax, cursor, menu, typography) is re-implemented natively on GSAP, followed by the project's single highest-impact signature moment (the hero→section mask transition), then the smaller differentiators (magnetic CTAs, image reveals, marquee, scrubbed timeline). The roadmap closes with a dedicated performance/accessibility/quality gate — asset optimization, throttled-mobile verification, a full reduced-motion audit, and clean lint/typecheck/build — since this codebase has zero existing automated tests or performance benchmarks to regress against.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Motion Foundation & Architecture Cleanup** - Unified Lenis+GSAP engine, reduced-motion gate, decomposed components, FormConnector/legacy v4 removed
- [ ] **Phase 2: GSAP-Native Reveal, Parallax, Cursor & Typography** - Baseline motion (reveal/parallax/cursor/menu/headlines) rebuilt natively on GSAP, old loops removed
- [ ] **Phase 3: Signature Moments — Mask Transition & Intro** - The hero→section mask transition and refined intro sequence, the site's visual high point
- [ ] **Phase 4: Differentiators & Polish** - Magnetic CTAs, wrapper-based image reveals, marquee strip, scrubbed process timeline
- [ ] **Phase 5: Performance & Quality Gate** - Asset optimization, mobile perf verification, reduced-motion audit, lint/typecheck/build/form regression checks

## Phase Details

### Phase 1: Motion Foundation & Architecture Cleanup
**Goal**: The codebase has a single unified Lenis+GSAP scroll/motion engine wired at the client boundary, a working reduced-motion kill-switch, and is decomposed into per-section components with the fragile FormConnector pattern and dead v4 legacy files removed — ready for new animation work to be built section-by-section instead of inside one monolith.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, ARCH-01, ARCH-02, ARCH-03
**Success Criteria** (what must be TRUE):
  1. `npm run build` completes with no errors and no SSR/hydration warnings; GSAP and Lenis are initialized only inside a client component boundary.
  2. Scrolling the site with mouse wheel or trackpad feels physically smooth (Lenis-driven, ticked from GSAP's ticker), with no visible desync or double-scroll jitter.
  3. Enabling `prefers-reduced-motion` measurably disables/softens Lenis smooth scroll and stops GSAP timelines from animating, verified via `gsap.matchMedia()` (not CSS alone).
  4. `components/experience.tsx` no longer exists as a monolith — each visual section (hero, manifesto, capabilities, process, contact, menu, cursor) is its own component with its own scoped `useGSAP` call.
  5. The contact form's markup and its `onSubmit` handler live in the same component (no `FormConnector`, no `querySelector` coupling), and `landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx` no longer exist in the repo.
**Plans**: TBD
**UI hint**: yes

### Phase 2: GSAP-Native Reveal, Parallax, Cursor & Typography
**Goal**: Every core vanilla-JS motion behavior — scroll reveal, parallax, cursor, menu, headline typography — is re-implemented natively on GSAP/ScrollTrigger with the old rAF/IntersectionObserver code fully removed, so the site's baseline movement layer reaches the "creative studio" quality bar before any signature moments are added.
**Depends on**: Phase 1
**Requirements**: MOTION-01, MOTION-02, MOTION-03, MOTION-04, MOTION-05
**Success Criteria** (what must be TRUE):
  1. Section content reveals on scroll using ScrollTrigger (not the old `[data-reveal]` + IntersectionObserver pattern), preserving the current visual language with smoother, more consistent timing.
  2. Parallax elements move via ScrollTrigger/Lenis-driven animation only — the old manual `requestAnimationFrame` parallax loop no longer exists in the codebase.
  3. On devices with a precise pointer, the custom cursor tracks the pointer via `gsap.quickTo` with no lag or jump artifacts; it remains absent on touch devices.
  4. The overlay menu opens and closes as a single GSAP timeline (backdrop first, then links cascade in stagger), replacing the CSS-only transition.
  5. Hero and section headlines reveal word-by-word or line-by-line via SplitText when scrolled into view.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Signature Moments — Mask Transition & Intro
**Goal**: The site's single highest-impact visual moment — a mask/block transition from the hero into the first section — and a refined intro sequence are built on top of the GSAP-native reveal system, giving the site its distinctive premium creative-studio signature.
**Depends on**: Phase 2
**Requirements**: SIGNATURE-01, SIGNATURE-02
**Success Criteria** (what must be TRUE):
  1. Scrolling from the hero into the first content section (or completing the intro) triggers a mask/block-reveal transition, not a plain scroll-into-view fade.
  2. The transition reads as the clear visual high point of the page compared to the rest of the site's motion — distinctly more elaborate than a standard section reveal.
  3. The intro sequence plays briefly on load, then calls `ScrollTrigger.refresh()` on completion so every subsequent scroll-triggered animation calculates correct trigger positions.
  4. Both the intro and the mask transition respect the reduced-motion gate established in Phase 1 (skip or simplify under `prefers-reduced-motion`).
**Plans**: TBD
**UI hint**: yes

### Phase 4: Differentiators & Polish
**Goal**: The site gains its final layer of creative-studio differentiation — magnetic CTAs, wrapper-based image reveals, a marquee capability strip, and a scroll-scrubbed process timeline — layered on top of the stable, signature-complete motion system.
**Depends on**: Phase 3
**Requirements**: POLISH-01, POLISH-02, POLISH-03, POLISH-04
**Success Criteria** (what must be TRUE):
  1. The 2-4 primary CTA buttons visibly attract toward the cursor within a hover radius (magnetic effect) and release cleanly on mouse-leave.
  2. Key images reveal on scroll using a wrapper+transform technique (translate/scale on an inner element) — no `clip-path` is animated directly in the implementation.
  3. The capabilities band scrolls continuously as a marquee/ticker using pure CSS, with no jank or stutter and no GSAP driving it.
  4. The process section's timeline progress is scrubbed directly by scroll position, not just triggered once on entry.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Performance & Quality Gate
**Goal**: The finished motion layer is asset-optimized, verified performant on throttled mobile hardware, confirmed fully reduced-motion-safe end-to-end, and passes every code-quality gate — the site is ready to hand off as done.
**Depends on**: Phase 4
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, QA-01, QA-02, QA-03
**Success Criteria** (what must be TRUE):
  1. The hero video is served as WebM/AV1 with an MP4 fallback and is measurably smaller than the original 9.37 MB; `dron.png`, `equipos1.png`, and `monumentacion_puntos_referencia.png` are served as WebP.
  2. With CPU throttling enabled in DevTools, scrolling through animated sections on a simulated mobile device shows no perceptible FPS drop or jank.
  3. With `prefers-reduced-motion` emulated in DevTools, a full-page walkthrough confirms zero animations fire anywhere on the site (Lenis, GSAP, intro, signature transition, all included).
  4. `npm run lint`, `npm run typecheck`, and `npm run build` all pass with zero errors, and manual review at 1440×900 and 390×844 shows no horizontal overflow anywhere on the page.
  5. Submitting the contact form still successfully posts to `/api/contact` (Supabase-backed) with no regression from the Phase 1 form refactor.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Motion Foundation & Architecture Cleanup | 0/TBD | Not started | - |
| 2. GSAP-Native Reveal, Parallax, Cursor & Typography | 0/TBD | Not started | - |
| 3. Signature Moments — Mask Transition & Intro | 0/TBD | Not started | - |
| 4. Differentiators & Polish | 0/TBD | Not started | - |
| 5. Performance & Quality Gate | 0/TBD | Not started | - |
