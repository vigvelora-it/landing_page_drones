# Feature Research

**Domain:** Cinematic motion layer for a creative-studio-style Next.js landing page (Dogstudio/Awwwards-tier), WebGL/shaders explicitly excluded
**Researched:** 2026-07-18
**Confidence:** MEDIUM (cross-checked across GSAP official docs, GSAP community forums, Codrops, and multiple independent tutorials; a few trend-only claims are LOW and flagged)

## Feature Landscape

### Table Stakes (Users Expect These)

Features an Awwwards/Dogstudio-tier reviewer or visitor assumes exist. Missing these makes the site feel like a template, not a "studio" site — even with good visuals.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Physics-based smooth scroll (Lenis) site-wide | Genre-defining trait; native scroll feels "cheap" by comparison in this category | LOW–MEDIUM | Lenis (~3kB) drives momentum/easing; GSAP ScrollTrigger drives positional math. Must be synced onto one rAF loop (see Architecture note below) or scroll-linked animations desync/jitter. |
| Scroll-triggered reveal animations (fade + rise, not just opacity) | Baseline expectation for any "premium" scroll site in 2026; the project already has a CSS/IntersectionObserver version of this — GSAP version needs to feel more choreographed (staggered, eased, sequenced) not just faster | LOW | GSAP `ScrollTrigger` + timelines replacing the existing `[data-reveal]` IntersectionObserver pattern. Use `scrub` (no `pin`) for most reveals — avoids pin-spacer/layout bugs entirely. |
| Staggered typography reveal (headlines split into words/chars, animated in sequence) | The single most recognizable "creative studio" signature — Dogstudio, most Awwwards SOTD sites, and most GSAP-showcase sites lead with this on hero/section headlines | MEDIUM | GSAP `SplitText` (now bundled free in GSAP core 3.13+, no license needed). Word-level stagger (0.08–0.15s) reads as "deliberate/editorial"; character-level (0.02–0.05s) reads as "fast/energetic." For this brand (topography/engineering, editorial tone) word/line-level fits better than character confetti. |
| Custom/contextual cursor | Site already has a basic version; table stakes for this genre is a cursor that changes state (grows, shows a label/icon) over interactive elements, not just a dot follower | LOW–MEDIUM | Existing `[data-cursor]` pattern is the right foundation — port to GSAP `quickTo` for smoother interpolation instead of raw CSS transform on every pointermove. |
| Fixed/overlay navigation with animated open state | Full-viewport overlay menus with staggered link entrance are the default pattern in this category (confirmed on Dogstudio itself and via "fullscreen navigation menu" survey of the genre) | LOW–MEDIUM | Site already has an overlay menu — upgrade is timeline choreography (backdrop wipe → nav links stagger in → close affordance) via GSAP timeline instead of CSS class toggle. |
| Image reveal-on-scroll (clip/mask reveal, not just fade) | Distinguishes "designed" imagery from "stock fade-in"; used constantly across the genre for hero/portfolio imagery | MEDIUM | Do NOT animate `clip-path` directly (expensive, causes paint on every frame). Use the wrapper-pattern instead: outer `overflow:hidden` container translates one direction while inner `<img>`/video translates the opposite direction — visually identical to a clip reveal, GPU-cheap (transform-only). |
| Parallax depth on hero/section media | Site already has a parallax pattern (`[data-parallax]` + `getBoundingClientRect`); table stakes is keeping this but re-driving it through GSAP/ScrollTrigger so it stays in sync with Lenis's smoothed scroll position instead of raw `scrollY` | LOW | Must read scroll position from Lenis (via ScrollTrigger's scroller proxy), not `window.scrollY` directly, once Lenis is installed — otherwise parallax and smooth-scroll fight each other. |
| Brief branded intro/preload sequence | Site already has a 1450ms intro timer; genre expects this to feel like a designed beat (logo/wordmark reveal, brief hold, wipe away) rather than a blank pause — but must stay SHORT | LOW–MEDIUM | Keep current duration ballpark (~1–2s). Should be skippable-in-spirit: never block interaction longer than necessary, never re-run on every internal navigation (this is a single-page site, so it only fires once per session anyway). |
| Section/scene transitions that feel directed, not abrupt | Cuts between hero → manifesto → capabilities → process → contact should read as staged reveals (mask wipes, staggered entrances) rather than default document flow | MEDIUM | Achievable with ScrollTrigger-triggered timelines per section boundary; no client-side routing needed since this is a single static page — this is section-transition choreography, not Next.js route transitions. |
| `prefers-reduced-motion` support across the entire new motion layer | Already a validated requirement in PROJECT.md; also simply expected of any professionally built animated site in 2026, and it's an accessibility/legal-adjacent baseline, not a nice-to-have | LOW | Check `matchMedia('(prefers-reduced-motion: reduce)')` once at init; if true, skip ScrollTrigger pin/scrub setup for decorative motion, disable Lenis smoothing (`lerp:1` or don't instantiate it) and jump straight to end-states for reveals. Lenis has documented native support for this. |

### Differentiators (Competitive Advantage)

Not required to "pass" as genre-appropriate, but these are where this specific site can feel more crafted than a generic GSAP template — and they map directly to what's already validated in PROJECT.md as in-scope (magnetic elements, elevated hero, mask-style transitions).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Magnetic buttons/links on key CTAs (contact button, nav items) | Signature Awwwards-genre micro-interaction; cheap to build, disproportionately raises perceived polish | LOW | `gsap.quickTo(el, "x", {duration:0.4, ease:"power2.out"})` pattern on mousemove within a bounded hit area, computing `(mouseX - centerX) * 0.3–0.4` as the offset; snap back to `x:0,y:0` on `mouseleave`. Apply sparingly — 2–4 elements max (CTA, maybe nav logo), not everywhere, or it reads as gimmicky rather than intentional. |
| SVG-mask or block-grid transition on hero → first section boundary | The single highest-impact "wow" moment for a landing page is the first transition after intro; this is the Codrops-documented "block reveal" or "SVG mask reveal" pattern used across many Awwwards SOTD sites, achievable with plain SVG/CSS + GSAP | MEDIUM–HIGH | Reserve this treatment for ONE or two transitions (e.g., intro→hero, hero→manifesto) rather than every section — it's expensive to build well and loses impact if overused. This is the closest non-WebGL equivalent to what Dogstudio does with shader wipes. |
| Editorial large-format typography as a layered hero element (not just video overlay) | PROJECT.md already calls for "tipografía editorial de gran escala + capas" — pairing oversized type with SplitText line-reveal timed against the existing drone video is a differentiator specific to this brand, distinct from a generic hero | MEDIUM | Combine SplitText line-masking (`overflow:hidden` wrapper per line) with a timeline that sequences: video ken-burns/scale-in → headline lines rise in → subhead/CTA fade in. This directly satisfies the "hero evolucionado" active requirement without WebGL. |
| Marquee/ticker strip for a value statement or capability list | Genre-standard flourish (logos/keywords looping horizontally); works well for a "6-capability list" section to reinforce breadth without a long static list | LOW | Pure CSS `@keyframes` + `transform: translateX()` with duplicated content for seamless loop; pause-on-hover as a nice touch. Cheapest differentiator to add — no GSAP required, though GSAP can drive speed changes tied to scroll velocity for extra polish. |
| Scroll-velocity-reactive effects (e.g., slight skew/blur-free stretch on fast scroll) | Subtle "cinematic" cue that top-tier sites use to make scroll feel physical/tactile | MEDIUM | Lenis exposes velocity data; map it to a small `scaleY`/`skewY` transform (NOT blur — blur filters are GPU-expensive and cause frame drops on lower-end mobile per research). Keep the effect subtle (±1–2 degrees) or it feels like a bug. |
| Process-section scroll-scrubbed timeline (numbered steps animate in sync with scroll position) | Elevates the existing "process section" from a static list to a scrollytelling moment — directly aligned with the 2026 trend toward scroll-driven narrative sections | MEDIUM | `scrub: true` (or `scrub: 1` for slight smoothing) timeline tied to the process section's scroll range; each step's number/label animates in as its scroll segment is reached. Avoid `pin` here unless steps genuinely need to stay fixed while sub-content changes — plain `scrub` is simpler and avoids mobile pin bugs. |

### Anti-Features (Commonly Requested, Often Problematic)

Explicitly out of scope per PROJECT.md, or genre-adjacent patterns that create risk without matching the project's actual constraints (no WebGL, keep copy, single environment, no test suite).

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| WebGL/shader-based image distortion (true Dogstudio-style liquid/ripple hero, 3D scenes) | It's literally what the reference site (dogstudio.co/mx) uses — Dogstudio's own site is built on WebGL/Three.js with a 3D model reacting to cursor position | Explicitly out of scope per PROJECT.md ("usuario prefiere menor riesgo técnico"); adds a new rendering stack, GPU-dependent performance risk, accessibility complications, and no fallback story for low-end devices — high effort/risk for a topography B2B site where the drone video already carries the "wow" | Achieve equivalent visual drama with the mask/block-reveal transition pattern + large-format SplitText typography + transform-based image reveals — all confirmed achievable without WebGL |
| `clip-path` animated directly on scroll/hover for image reveals | Visually identical result to the wrapper-translate technique, and it's the "obvious" way to implement a mask reveal if you don't know the perf tradeoff | `clip-path` animation forces paint on every frame and is measurably less performant than `transform`-only animation, especially compounding with Lenis + many ScrollTriggers active at once — risks jank on the exact devices where topography/engineering B2B clients are likely browsing (older business laptops, not gaming rigs) | Use the overflow:hidden wrapper + inverse-translate technique (outer container clips, inner element translates opposite direction) — same visual outcome, GPU-cheap |
| Full custom page-transition router (Next.js route-level transition manager, e.g. Highway.js-style) | Dogstudio's site uses a custom transition manager between routes, and it's tempting to build the "correct" multi-page transition system | This is a single-page static landing (`app/page.tsx`, `force-static`, no client routing) — there are no routes to transition between; building a route transition system is solving a problem that doesn't exist here and adds unnecessary complexity/regression risk to the static export | Apply the same visual language (masks, staggered reveals) at the *section* boundary level via ScrollTrigger, which is the correct primitive for a single-page scroll narrative |
| Sound design / audio-reactive interactions | Also part of Dogstudio's actual site experience (transitions play with sound) | Not requested in PROJECT.md, adds autoplay-policy complexity (browsers block unmuted autoplay), and is a poor fit for a B2B topography site where visitors may be in an office/client meeting context | Skip entirely; rely on visual/motion language only |
| Applying magnetic-hover to every interactive element (nav links, list items, cards, etc.) | Once implemented, magnetic hover is cheap to copy-paste everywhere, and it looks cool in isolation | Overuse dilutes the effect into noise, adds unnecessary mousemove listeners across the page (perf cost), and reads as templated rather than intentional — the genre convention is selective use on 2–4 primary CTAs | Reserve magnetic behavior for the highest-intent elements only (primary CTA, maybe the logo); everything else gets a simpler hover state (underline reveal, color shift, scale) |
| Re-running the full intro/loader sequence on every scroll-to-top or internal anchor navigation | Could seem "consistent" to always show the branded intro | This is a single-page site with anchor navigation (menu → scroll to section) — replaying a multi-second intro on every internal nav is exactly the "loading screen frustrates users" failure mode research warns against | Intro plays exactly once per page load/session; internal anchor navigation uses Lenis's smooth-scroll-to, not the intro sequence |
| Heavy character-by-character SplitText stagger applied to body copy / long paragraphs (manifesto, process descriptions) | Once SplitText is wired up for headlines, it's tempting to apply the same treatment everywhere for "consistency" | Character-level stagger on long text blocks (a) takes visibly long to finish animating, frustrating users trying to read, (b) creates a large number of DOM nodes GSAP has to manage (perf cost, explicitly flagged in research), and (c) reads as showing off rather than communicating | Reserve char/word-level SplitText for short headline/label text (hero title, section headers, ~1–2 lines max); use simple line/paragraph fade+rise (existing reveal pattern) for body copy |
| Building bespoke ScrollTrigger pins for every section "because Dogstudio-tier sites use pinning" | Pinning is visually striking and associated with premium scroll sites | Pin: true creates a pin-spacer wrapper that doubles element height in the DOM and is documented as fragile on mobile (dynamic viewport height, font-load shifts, content-height changes cause scroll-position miscalculation) — high regression risk on a project with no automated test suite (per PROJECT.md's out-of-scope note) | Default to `scrub` without `pin` for section reveals (element stays in normal flow, animation progress tied to scroll position); reserve actual pinning for at most one deliberate moment (e.g., process-section steps) where the effect clearly earns its complexity, and test manually across breakpoints |

## Feature Dependencies

```
Lenis (smooth scroll) + GSAP ticker sync
    └──requires──> Single rAF loop (autoRaf:false on Lenis, gsap.ticker.add(lenis.raf))
                       └──requires──> ScrollTrigger.scrollerProxy pointing at Lenis (so ScrollTrigger reads Lenis's smoothed position, not raw window.scrollY)

Scroll-triggered reveals (GSAP/ScrollTrigger)
    └──requires──> Lenis + GSAP ticker sync (above) — otherwise reveals fire against stale scroll position and desync from what user visually sees

Parallax on hero/section media (ScrollTrigger-driven)
    └──requires──> Lenis + GSAP ticker sync (above) — same root cause as reveals

Image reveal (wrapper-translate technique)
    └──requires──> Scroll-triggered reveals infrastructure (shares ScrollTrigger setup)

Staggered typography reveal (SplitText)
    └──requires──> GSAP core (SplitText bundled free in 3.13+, no extra install)
    └──enhances──> Hero evolution (large-format editorial typography), Section transitions (headline-in-timeline)

Magnetic buttons
    └──requires──> GSAP quickTo (core GSAP, no plugin needed)
    └──independent of──> Lenis/ScrollTrigger (pointer-driven, not scroll-driven — can ship even if smooth scroll has issues)

Custom cursor (existing pattern, ported to GSAP)
    └──enhances──> Magnetic buttons (cursor can react to magnetic hit-zones as an additional cue)
    └──independent of──> Lenis/ScrollTrigger

Marquee/ticker strip
    └──independent of──> GSAP entirely (pure CSS keyframes viable)
    └──enhances (optional)──> Scroll-velocity reactivity (GSAP/Lenis can modulate speed, but not required)

Section/scene mask-transition (SVG mask or block-reveal)
    └──requires──> Scroll-triggered reveals infrastructure (ScrollTrigger)
    └──conflicts (soft)──> Heavy pinning — combining a pinned section with a mask transition compounds mobile-fragility risk; keep these two techniques on separate sections

prefers-reduced-motion handling
    └──must wrap──> ALL of the above (Lenis, ScrollTrigger reveals/parallax, SplitText, magnetic buttons, mask transitions, marquee)
    └──implemented once──> at the top-level motion-init (matchMedia check gates whether Lenis instantiates smooth, whether ScrollTrigger timelines animate or jump to end-state, whether magnetic listeners attach)

Intro/preload sequence
    └──independent of──> Lenis/ScrollTrigger (runs before/during hydration, can use plain GSAP timeline or even CSS)
    └──precedes──> All ScrollTrigger.refresh() calls (must call ScrollTrigger.refresh() after intro completes and layout settles, or trigger positions calculated during intro will be wrong)
```

### Dependency Notes

- **Lenis + GSAP ticker sync is the foundational dependency for almost everything.** Every scroll-linked feature (reveals, parallax, mask transitions, scroll-scrubbed process timeline) reads scroll position through ScrollTrigger, and ScrollTrigger must be told to read Lenis's smoothed value via a scroller proxy — get this wrong and every downstream feature inherits jitter/desync. This should be the first thing built and manually verified before layering other features on top.
- **SplitText enhances but doesn't require the scroll-sync layer** — headline staggers can be built and tested against simple `ScrollTrigger.create({trigger, start})` triggers without full Lenis integration, making it a good candidate for early, independently-verifiable work.
- **Magnetic buttons and custom cursor are pointer-driven, not scroll-driven** — they can be implemented and shipped independently of the Lenis/ScrollTrigger work, reducing risk if smooth-scroll integration takes longer than expected.
- **Mask/block-reveal transitions conflict softly with pinning** — both are "expensive" scroll techniques; stacking them on the same section multiplies mobile layout risk (pin-spacer height issues + mask timing issues compound). Use at most one heavy technique per section boundary.
- **`ScrollTrigger.refresh()` must run after the intro sequence finishes**, not just on mount — if section positions are measured while the intro is still animating/hiding content, trigger start/end points will be wrong until the next resize or manual refresh.
- **prefers-reduced-motion must be checked once, at the top of the motion-init code path, before any of these features instantiate** — retrofitting the check per-feature risks missing one and shipping an animation that ignores the OS setting, which is both an accessibility regression and (per PROJECT.md) an explicit requirement.

## MVP Definition

### Launch With (v1)

Minimum viable set to credibly deliver "Dogstudio-tier motion without WebGL" per PROJECT.md's Active requirements.

- [ ] Lenis smooth scroll wired to GSAP ticker (single rAF loop, scroller proxy) — everything else depends on this being correct
- [ ] ScrollTrigger-driven reveal system replacing the current IntersectionObserver `[data-reveal]` pattern, with staggered timelines (not just fade)
- [ ] SplitText-based headline reveal for hero and section titles (word/line-level, matches editorial tone)
- [ ] Parallax re-driven through ScrollTrigger/Lenis (keep existing `[data-parallax]` visual language, fix the sync)
- [ ] Custom cursor ported to GSAP `quickTo` for smoother interpolation
- [ ] Overlay menu opening/closing choreographed as a GSAP timeline (backdrop → staggered links)
- [ ] One hero-to-first-section mask/block-reveal transition (the single highest-impact "wow" moment)
- [ ] `prefers-reduced-motion` gate wrapping the entire motion layer
- [ ] Intro sequence kept, refined into a short GSAP timeline, with `ScrollTrigger.refresh()` called on completion

### Add After Validation (v1.x)

Add once the above is confirmed stable across breakpoints and doesn't regress the form/build/lint requirements.

- [ ] Magnetic behavior on primary CTA(s) (contact button, maybe nav logo) — trigger: v1 motion layer is stable and performant on mobile
- [ ] Image reveal-on-scroll (wrapper-translate technique) applied to capability/process imagery — trigger: reveal infrastructure proven reliable
- [ ] Marquee/ticker strip for capability list or a value-statement line — trigger: available "polish budget" after core motion ships
- [ ] Scroll-scrubbed process-section timeline (numbered steps sync to scroll) — trigger: team comfortable with `scrub`-based timelines from v1 reveals

### Future Consideration (v2+)

Defer — genuinely nice but not needed to hit the project's stated goal, and each carries meaningfully higher implementation/regression risk for a project with no automated test suite.

- [ ] Scroll-velocity-reactive skew/stretch effects — why defer: subtle effect, easy to get wrong (feels buggy vs. cinematic), best added once base motion is proven solid
- [ ] Additional mask/block-reveal transitions beyond the single hero moment — why defer: each one is MEDIUM–HIGH complexity; spreading them thin dilutes impact and multiplies manual-QA surface area on a project without automated tests

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Lenis + GSAP ticker sync | HIGH | MEDIUM | P1 |
| ScrollTrigger reveal system (replaces IntersectionObserver) | HIGH | LOW–MEDIUM | P1 |
| SplitText headline stagger | HIGH | MEDIUM | P1 |
| Parallax re-sync via ScrollTrigger/Lenis | MEDIUM | LOW | P1 |
| Custom cursor via GSAP quickTo | MEDIUM | LOW | P1 |
| Overlay menu timeline choreography | MEDIUM | LOW–MEDIUM | P1 |
| Hero→section mask/block-reveal transition | HIGH | MEDIUM–HIGH | P1 |
| `prefers-reduced-motion` gate | HIGH (non-negotiable) | LOW | P1 |
| Intro sequence refinement | MEDIUM | LOW–MEDIUM | P1 |
| Magnetic CTA buttons | MEDIUM | LOW | P2 |
| Image reveal-on-scroll (wrapper technique) | MEDIUM | MEDIUM | P2 |
| Marquee/ticker strip | LOW–MEDIUM | LOW | P2 |
| Scroll-scrubbed process timeline | MEDIUM | MEDIUM | P2 |
| Scroll-velocity reactive effects | LOW | MEDIUM | P3 |
| Additional mask transitions beyond hero | LOW–MEDIUM | HIGH | P3 |
| WebGL/shader effects | — | — | Excluded (out of scope) |

**Priority key:**
- P1: Must have for this milestone — directly maps to PROJECT.md's Active requirements
- P2: Should have, add when P1 is stable — maps to PROJECT.md's "micro-interacciones pulidas" requirement
- P3: Nice to have, future consideration — not blocking the milestone's core value

## Competitor Feature Analysis

| Feature | Dogstudio (dogstudio.co) | Generic Awwwards SOTD (aggregate pattern) | Our Approach (local-2) |
|---------|--------------------------|--------------------------------------------|--------------------------|
| Hero centerpiece | 3D WebGL wolf reacting to cursor, sound-linked transitions | Mix of WebGL 3D and 2D editorial typography + video | Keep existing drone video, add large-format SplitText typography + parallax layers — no 3D/WebGL |
| Page/section transitions | Custom WebGL/Highway.js route transition manager with sound | SVG mask reveals, block-reveal grids (2D, no WebGL) | One SVG-mask/block-reveal transition at hero→first-section boundary; ScrollTrigger timelines for other section boundaries |
| Cursor | Custom cursor integrated with 3D scene | Custom cursor with state changes (grow, label) | Port existing `[data-cursor]` pattern to GSAP `quickTo` — no 3D coupling |
| CTA interaction | Not documented in research as a distinct pattern | Magnetic buttons on primary CTAs | Magnetic behavior on contact CTA only (v1.x) |
| Typography | Bold but secondary to the 3D scene | Oversized expressive typography as a primary design element (2026 trend) | Primary differentiator here — editorial large-scale type with SplitText line/word reveals, since WebGL scene isn't available to carry visual weight |
| Menu | Fullscreen overlay, 3D wolf persists in background | Fullscreen overlay with staggered link entrance | Existing overlay menu, upgraded to GSAP timeline choreography — no persistent 3D background |

## Sources

- [ScrollTrigger | GSAP Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — MEDIUM confidence (official docs, cross-checked against community forum threads)
- [GSAP ScrollTrigger Pinning discussions — GSAP Community Forums](https://gsap.com/community/forums/topic/45083-understanding-scrolltrigger-and-pinning-a-bit-better/)
- [GSAP ScrollTrigger pin: true Nearly Broke My Portfolio — DEV Community](https://dev.to/xuanhai0913/gsap-scrolltrigger-pin-true-nearly-broke-my-portfolio-heres-what-i-learned-28i7)
- [GitHub — darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) — MEDIUM confidence
- [Smooth Scrolling in Next.js with Lenis & GSAP — DevDreaming](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)
- [ScrollTrigger with Lenis — GSAP Community Forums](https://gsap.com/community/forums/topic/34696-scrolltrigger-with-lenis/)
- [Dogstudio | Communication Arts](https://www.commarts.com/webpicks/dogstudio) — MEDIUM confidence
- [Dogstudio — Awwwards SOTD](https://www.awwwards.com/sites/dogstudio-1)
- [34 Impressive Examples of Fullscreen Navigation Menus — Qode Interactive](https://qodeinteractive.com/magazine/examples-of-fullscreen-navigation-menus/)
- [Hovers, Cursors and Cute Interactions — Awwwards](https://www.awwwards.com/awwwards/collections/hovers-cursors-and-cute-interactions/) — MEDIUM confidence
- [Motion patterns — magnetic buttons, scroll reveals, marquees | Annnimate](https://annnimate.com/patterns)
- [GSAP Text Animation: A Practical SplitText Guide — Good Fella Lab](https://lab.good-fella.com/blog/gsap-text-animation-splittext-guide) — MEDIUM confidence
- [SplitText | GSAP Docs](https://gsap.com/docs/v3/Plugins/SplitText/)
- [SVG Mask Transitions on Scroll with GSAP and ScrollTrigger | Codrops](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/) — MEDIUM confidence
- [Next JS Page Transitions Taken Over by GSAP (Block Reveal Effect) — YouTube](https://www.youtube.com/watch?v=ngD_e4m45S0)
- [Create Image Reveal Animation using Clip-Path, GSAP and CSS | Lechclick Webdesign](https://lechclick.de/en/create-image-reveal-animation-using-clip-path-gsap-and-css/) — MEDIUM confidence
- [Change image on hover with scaling — GSAP Community Forums](https://gsap.com/community/forums/topic/40927-change-image-on-hover-with-scaling-up-and-vice-versa/)
- [2 Ways to Make Magnetic Buttons using React, GSAP, Framer Motion — Olivier Larose](https://blog.olivierlarose.com/tutorials/magnetic-button) — MEDIUM confidence
- [Magnetic Hover Interaction with Cursor — GSAP Community Forums](https://gsap.com/community/forums/topic/25319-magnetic-hover-interaction-with-cursor/)
- [Creating a Modern Infinite Marquee in Pure CSS | Effect.Labs](https://effect-labs.com/en/pages/blog/marquee-infinite-scroll.html) — MEDIUM confidence
- [Marquee magic: fresh scrolling effects with Finsweet Components](https://finsweet.com/blog/marquee-magic-fresh-scrolling-effects-with-finsweet-components)
- [75 preloader examples for a seamless user experience | SVGator](https://www.svgator.com/blog/best-preloader-examples/) — LOW confidence (aggregated blog, not cross-verified against a primary/technical source)
- [UX Design Patterns for Loading — Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-loading-feedback)
- [Top 10 Web Design Trends 2026 — Really Good Designs](https://reallygooddesigns.com/web-design-trends-2026/) — LOW confidence (trend-aggregation blog, treated as directional signal only)
- [Web Design Trends 2026: What Actually Held Up After Six Months — DEV Community](https://dev.to/studiomeyer_io/web-design-trends-2026-what-actually-held-up-after-six-months-23p8)

Project context sources (read directly, not web research):
- `F:\ClaudeCode\Pagina_Web_Mayra\local-2\.planning\PROJECT.md`
- `F:\ClaudeCode\Pagina_Web_Mayra\local-2\.planning\codebase\ARCHITECTURE.md`

---
*Feature research for: Cinematic motion layer, creative-studio-tier landing page (non-WebGL)*
*Researched: 2026-07-18*
