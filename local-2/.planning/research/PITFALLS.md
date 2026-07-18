# Pitfalls Research

**Domain:** GSAP + ScrollTrigger + Lenis smooth-scroll integration in a Next.js 16 / React 19 App Router site
**Researched:** 2026-07-18
**Confidence:** MEDIUM (cross-checked across GSAP official docs/forums, @gsap/react maintainer guidance, Lenis README/GitHub discussions, and multiple independent implementation write-ups; no HIGH-tier curated/versioned source available in this session, so treat as directionally reliable but verify against installed package versions during implementation)

## Critical Pitfalls

### Pitfall 1: Raw `useEffect` + GSAP instead of `useGSAP()` — StrictMode double-fire and leaked instances

**What goes wrong:**
React 19 (like React 18) double-invokes effects in development under Strict Mode. If GSAP tweens, timelines, or `ScrollTrigger` instances are created inside a plain `useEffect` without proper teardown, they get created twice — causing duplicate/conflicting animations, doubled scroll listeners, and (in dev) console noise that masks real bugs. Worse, any animation created inside an event handler (click, hover) that isn't wrapped correctly is never cleaned up and accumulates across remounts.

**Why it happens:**
Existing codebase (`components/experience.tsx`) already uses raw `useEffect` + `querySelectorAll` for reveal/parallax/cursor logic (see `CONCERNS.md` — "Direct DOM Manipulation at Scale"). The natural migration path is to drop GSAP calls into the same `useEffect` blocks without adopting GSAP's React-specific lifecycle tooling, since the team hasn't previously needed it (no animation library was in use before).

**How to avoid:**
- Install `@gsap/react` and use the `useGSAP()` hook (drop-in replacement for `useEffect`/`useLayoutEffect`) for every component that creates GSAP animations or `ScrollTrigger` instances. It wraps `gsap.context()` and auto-reverts all instances created in its scope on unmount/re-run, which is StrictMode-safe by design.
- Wrap any animation created inside a callback (click handler, cursor hover, magnetic button) in the `contextSafe()` function returned by `useGSAP()` so it's tracked and cleaned up too.
- Never mix raw `useEffect` GSAP calls with `useGSAP()` calls for the same DOM subtree — pick one pattern per component to avoid double-scoped contexts.

**Warning signs:**
- Animations "play twice" or snap/jump on first load in dev mode only (StrictMode artifact).
- Browser memory tab shows steadily climbing heap size when navigating between sections or toggling the mobile menu repeatedly.
- `ScrollTrigger.getAll().length` growing on every hot-reload during development.

**Phase to address:**
Foundational setup phase (GSAP/Lenis installation + provider/wrapper scaffolding) — this is an architectural decision that must be made before any section is migrated, not fixed retroactively per-section.

---

### Pitfall 2: ScrollTrigger instances not killed on unmount/route interaction → memory leak and animation drift

**What goes wrong:**
Even with `useGSAP()` used correctly in isolated components, `ScrollTrigger` instances tied to elements that get removed/re-rendered (e.g. conditional menu overlay, form success/error states) can persist if the killing scope doesn't match the component that owns the DOM node. Symptom: after several interactions (opening/closing menu, submitting the form, resizing), scroll-linked animations become janky, trigger at wrong scroll positions, or fire against elements no longer in the DOM.

**Why it happens:**
This project has multiple components that conditionally render UI (menu overlay, form states) sharing a single global scroll/animation surface. `ScrollTrigger` is a *global* registry by default — instances aren't automatically scoped to the component that created them unless `useGSAP()`'s context or an explicit `scope` ref is used. Manual `.kill()` calls are easy to forget across 6+ sections (hero, manifiesto, capacidades, proceso, contacto, footer).

**How to avoid:**
- Pass a `scope` ref to every `useGSAP(() => {...}, { scope: sectionRef })` call so cleanup is automatically bounded to that DOM subtree.
- For any manually created triggers outside `useGSAP()` (should be rare), explicitly call `ScrollTrigger.getAll().forEach(t => t.kill())` in the effect's cleanup return, not just `gsap.killTweensOf()` (tweens and triggers are separate registries).
- Call `ScrollTrigger.refresh()` after content-affecting mutations (menu open/close, hero video load, form submit revealing a success message) since those change layout height and stale positions cause exactly the drift symptoms described above.

**Warning signs:**
- Scroll-linked reveals fire early/late after interacting with the menu or submitting the contact form.
- `ScrollTrigger.getAll().length` logged to console keeps growing after repeated open/close of the menu overlay.
- Jank increases the longer a user stays on the page without a full reload.

**Phase to address:**
Section-by-section animation migration phase — each section's `useGSAP` scaffolding should include scope + refresh triggers as a required pattern, verified in a QA/testing phase before final polish.

---

### Pitfall 3: FOUC / Cumulative Layout Shift from GSAP-animated elements on initial paint

**What goes wrong:**
Elements meant to animate in (fade up, slide in, mask reveal) render at their final visible state in the server-rendered/first-paint HTML, then GSAP JS loads and immediately snaps them to their "from" state (opacity 0, translated) before animating back — producing a visible flash (FOUC) and, if the "from" state has a different size/position than the CSS layout box, a layout shift that hurts CLS. This is functionally the same failure mode the site already has today with CSS `[data-reveal]` (except GSAP makes it *more* visible because the "before" state is often more extreme — larger translateY, blur, scale).

**Why it happens:**
GSAP animations are typically declared as `.from()` or `.fromTo()` calls that only take effect once the JS bundle executes and the hook runs — there's an unavoidable gap between first paint and hydration/JS execution, especially on a content-heavy editorial site with a 9.37MB hero video competing for bandwidth and parse time.

**How to avoid:**
- Bake the animated "from" state into the CSS itself (e.g. `opacity: 0; transform: translateY(24px)` as the default state for `[data-reveal]`-style elements), so the very first paint already matches what GSAP will animate from — no snap, no shift.
- Reserve layout space for animated elements at their final box size via CSS (no `display: none` or dimension changes as part of the animation) — only animate `opacity`/`transform`, which don't trigger reflow and can't cause CLS.
- For pinned sections (hero, transitions), set `anticipatePin: 1` on the `ScrollTrigger` config to pre-apply pinning layout slightly before the pin point, avoiding a one-frame flash of unpinned content.
- Measure CLS with Lighthouse/DevTools Performance before and after each section migration — this project currently has **no performance benchmarks at all** (per `CONCERNS.md`), so this pitfall would go undetected without deliberately adding the check.

**Warning signs:**
- Visible "pop" or flash on page load before scroll animations settle, especially on slower connections (compounded by the unoptimized 9.37MB video competing for the main thread).
- Lighthouse CLS score regresses after introducing GSAP reveals compared to the current CSS-based reveals.

**Phase to address:**
Section migration phase, with explicit CLS verification folded into the phase's success criteria (not deferred to a later "polish" phase) — this is cheap to get right up front and expensive to retrofit across 6+ sections later.

---

### Pitfall 4: Lenis and GSAP running on separate rAF loops → scroll-linked animation lag/jitter

**What goes wrong:**
If Lenis is initialized with its default internal `requestAnimationFrame` loop (`autoRaf: true`) while GSAP's `ScrollTrigger` reads `window.scrollY` independently, the two loops desync by 1-2 frames. Scroll-scrubbed/pinned animations visibly lag behind the actual smooth-scroll position — the exact "buttery scroll but janky animation" complaint common in Lenis+GSAP integration reports.

**Why it happens:**
Lenis and GSAP are separate libraries each with their own animation ticker by default. Wiring them together requires explicit, non-obvious setup: disabling Lenis's internal raf, driving Lenis from GSAP's ticker, converting GSAP's ticker time (seconds) to the milliseconds Lenis's `raf()` expects, and telling `ScrollTrigger` to read scroll position through Lenis via `ScrollTrigger.scrollerProxy()`. Skipping any one of these steps produces the desync.

**How to avoid:**
- Set `autoRaf: false` on the Lenis instance.
- Drive Lenis from GSAP's ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))` — note the `* 1000` conversion (GSAP ticker passes seconds; Lenis expects ms). This is the single most common bug in every integration writeup found.
- Call `gsap.ticker.lagSmoothing(0)` to prevent GSAP dropping frames during Lenis-driven scroll.
- Register `lenis.on('scroll', ScrollTrigger.update)` so ScrollTrigger recalculates on every Lenis scroll tick, not just its own internal cadence.
- Use `ScrollTrigger.scrollerProxy()` (or the newer `ScrollTrigger.normalizeScroll` guidance from GSAP docs, verify against installed version) so ScrollTrigger reads position through Lenis rather than the native scrollbar.
- Call `ScrollTrigger.refresh()` once Lenis is initialized and again after any async content resize (hero video metadata load, fonts loading, images loading) — trigger positions computed before those events will be wrong.

**Warning signs:**
- Pinned/scrubbed animations visibly "catch up" or stutter relative to the smooth scroll motion, especially noticeable during fast scroll flicks.
- Animations feel fine on slow, deliberate scroll testing but break under fast scroll/fling gestures (a symptom specifically caused by rAF desync, not just general jank).

**Phase to address:**
Foundational Lenis+GSAP wiring phase — this must be solved once, correctly, in a shared scroll-provider/layout component before any section-level `ScrollTrigger` work begins. Retrofitting this after multiple sections use scroll-linked animation is costly.

---

### Pitfall 5: `prefers-reduced-motion` silently not applied to GSAP/ScrollTrigger despite CSS already handling it

**What goes wrong:**
The project already has a documented incomplete pattern for reduced-motion (`CONCERNS.md` — `experience.tsx:15-18`, a `setTimeout(..., 0)` code smell pausing the hero video). Left unaddressed, adding GSAP compounds this: CSS-level `prefers-reduced-motion` media queries do **not** automatically stop GSAP-driven JS animations or `ScrollTrigger` scroll-linked motion — GSAP has zero built-in awareness of the OS-level preference. Teams frequently gate only CSS keyframe animations and believe the "prefers-reduced-motion requirement" is satisfied, while GSAP timelines, parallax, and scroll-scrubbed transforms keep running at full intensity for users who explicitly opted out of motion (a regression risk explicitly called out as a project requirement).

**Why it happens:**
`prefers-reduced-motion: reduce` is a CSS media feature; GSAP is imperative JS that has no automatic hook into it. Developers coming from CSS-only motion (as this codebase currently is) don't realize the browser-level protection doesn't extend to a new JS animation engine.

**How to avoid:**
- Use `gsap.matchMedia()` with an explicit `"(prefers-reduced-motion: reduce)"` breakpoint for every animation definition — GSAP's own recommended pattern — so reduced-motion users get a distinctly toned-down or fully skipped animation set, not just a CSS override fighting against active JS transforms.
- Alternatively/additionally, gate `ScrollTrigger` registration entirely: check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` before initializing scroll-linked pinning/scrubbing at all, falling back to simple opacity-only reveals (or no animation) for those users.
- Also gate **Lenis** itself — smooth scroll inertia is itself a motion effect that should be disabled (fall back to native scroll) for `prefers-reduced-motion: reduce` users, not just the GSAP timelines layered on top.
- Fix the existing `setTimeout(..., 0)` code smell in `experience.tsx` as part of this work rather than porting the anti-pattern into the new animation layer — it's the same root problem (reduced-motion handling) already present in the codebase.
- Since this is a hard project requirement, add a manual QA step: toggle OS-level reduced-motion (or `prefers-reduced-motion` in DevTools) and verify **no** ScrollTrigger-pinned sections, parallax, or Lenis inertia remain active.

**Warning signs:**
- DevTools "Rendering > Emulate CSS media feature prefers-reduced-motion" toggle shows scroll-linked pin/scrub animations still running.
- No automated or manual QA step exists that specifically re-tests reduced-motion after each new GSAP feature is added (this project has no test suite, so this must be a manual checklist item, not assumed coverage).

**Phase to address:**
Should be established as a cross-cutting pattern in the foundational GSAP/Lenis setup phase (one `matchMedia` gate reused everywhere), then explicitly re-verified in a final QA/polish phase across every section.

---

### Pitfall 6: SSR/hydration mismatch from initializing GSAP/Lenis outside a client-only boundary

**What goes wrong:**
Next.js App Router server-renders components with no `window`/`document`. If GSAP registration (`gsap.registerPlugin(ScrollTrigger)`), Lenis instantiation, or any `getBoundingClientRect()`-style layout read happens at module scope, during the render body, or in a component not explicitly client-bounded, it throws `ReferenceError: window is not defined` during SSR/build, or produces a hydration mismatch warning if it affects rendered markup (e.g. conditionally rendering different classes/inline styles based on client-only motion state).

**Why it happens:**
The existing `experience.tsx` already gates browser API access inside `useEffect` (a working pattern for the current vanilla approach), but GSAP/Lenis setup code is easy to place incorrectly — e.g. `gsap.registerPlugin()` at the top of a shared file that's imported by both server and client components, or a Lenis instance created in a context provider that isn't marked `"use client"`.

**How to avoid:**
- Confirm every file that imports `gsap`, `ScrollTrigger`, or `lenis` is either marked `"use client"` at the top, or only imported from within a component that already is.
- Call `gsap.registerPlugin(ScrollTrigger)` inside a `useEffect`/`useGSAP()` call (or a module guarded by `typeof window !== "undefined"`), never unconditionally at module top-level in a file that could be pulled into a server bundle.
- Prefer `useGSAP()` over manual `useLayoutEffect`/isomorphic-hook workarounds — it already only executes client-side post-mount, sidestepping the SSR-safety problem entirely rather than requiring a custom isomorphic hook.
- Do not let GSAP/Lenis state (e.g. "is reduced motion active", "is Lenis ready") drive server-rendered markup differences — compute and apply those only after mount so server and client HTML match on first paint.

**Warning signs:**
- Build (`npm run build`) fails with `window is not defined` or similar during static generation.
- Console shows "Text content does not match server-rendered HTML" or "Hydration failed" warnings on page load — this is an explicit project gate (`npm run build` must pass), so this pitfall directly blocks the milestone's completion criteria.

**Phase to address:**
Foundational setup phase — verify with a clean `npm run build` immediately after Lenis/GSAP are wired into the root layout, before any section-specific animation work begins, so the SSR boundary is proven correct before it's built upon.

---

### Pitfall 7: Mobile performance cliff from too many simultaneous ScrollTrigger/pin instances, compounded by existing rAF parallax debt

**What goes wrong:**
A cinematic, Dogstudio-style site with per-section pinning, scrubbed timelines, and layered parallax across 6+ sections can overwhelm low-end mobile devices — frame drops, address-bar show/hide triggering spurious `ScrollTrigger` recalculation, and jank that's worse than the current (already-flagged) unthrottled rAF parallax loop. If the new GSAP-driven parallax is added *alongside* rather than *replacing* the existing `getBoundingClientRect()`-per-frame loop in `experience.tsx`, the site ends up running two competing per-frame layout-read systems simultaneously — compounding the existing performance debt instead of fixing it.

**Why it happens:**
Ambitious cinematic effects (multiple pinned sections, mask transitions, magnetic elements) each add compute cost; combined with the already-large hero video download+decode competing for the main thread and battery on mobile, and the fact that `ScrollTrigger.refresh()` recalculates all trigger positions on every viewport resize (including mobile browser chrome show/hide, which fires resize events frequently), the aggregate cost can exceed what a mid/low-tier phone can sustain at 60fps.

**How to avoid:**
- Explicitly remove/replace the existing manual rAF parallax loop in `components/experience.tsx` as part of this migration — do not layer GSAP parallax on top of it. The project's own requirement to eliminate this tech debt should be sequenced as a prerequisite/co-requisite of the GSAP migration, not a separate cleanup.
- Use `gsap.matchMedia()` breakpoints to run a reduced/simplified animation set on mobile (fewer pinned sections, lower parallax intensity, `scrub: true` instead of tight numeric scrub values) rather than shipping the same desktop-tier complexity to phones.
- Prefer transform/opacity-only animations (`force3D: true` where applicable) and avoid animating expensive properties (`filter`, `box-shadow`, layout-affecting properties) in scroll-scrubbed timelines.
- Use `ScrollTrigger.batch()` for any repeated reveal-style triggers (e.g. capacidades/proceso list items) instead of one `ScrollTrigger` per element, reducing per-frame overhead.
- Combine with the already-planned video optimization (WebM/AV1, smaller resolution tiers) since video decode competing with animation compute is a compounding factor specific to this project's hero section.
- Profile on an actual mid-tier Android device or Chrome DevTools CPU throttling (4x-6x slowdown) — not just desktop — before considering a section "done."

**Warning signs:**
- Visible stutter/frame drops during scroll on mobile emulation or real devices, especially near the hero (video decode + pin) and any section stacking multiple parallax layers.
- Chrome DevTools Performance panel shows long tasks (>50ms) during scroll on a throttled CPU profile.
- Battery/thermal throttling during extended scroll sessions on physical test devices.

**Phase to address:**
Should span two phases: (1) the section migration phase must build mobile-appropriate complexity in from the start via `matchMedia`, not retrofit it, and (2) a dedicated mobile performance verification phase (or explicit success-criteria checkpoint) before the milestone is considered complete, given this project currently has zero performance benchmarking in place.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip `useGSAP()`, use raw `useEffect` + manual `.kill()` calls | Slightly less new-dependency surface (`@gsap/react` not installed) | Easy to forget cleanup on one of 6+ sections; StrictMode double-fire bugs resurface each time a new section is added | Never — `@gsap/react` is officially maintained by GreenSock specifically to solve this; the cost of not using it compounds with every section |
| Layer GSAP parallax on top of the existing rAF parallax loop instead of removing it first | Faster to ship one section without touching existing code | Two competing per-frame layout-read systems; doubles the exact performance problem already flagged in `CONCERNS.md` | Never for this project — removal is already an explicit requirement, so there's no valid reason to defer it |
| Hard-code `ScrollTrigger` pin/scrub values tuned only on desktop, ship the same config to mobile | Simpler single code path, matches Dogstudio reference closely | Mobile jank, potential dropped frames during core UX moments (hero, form) hurting conversion on a marketing/contact site | Only for an internal prototype/demo never shown to real mobile users — not acceptable for production-facing milestone |
| Defer `prefers-reduced-motion` gating on GSAP until "final polish" | Faster initial section builds, animation-first iteration | Retrofitting `matchMedia` gates across every already-built timeline is more error-prone than building it in from the start; project explicitly lists reduced-motion as a requirement, not a nice-to-have | Never — bake the gate into the first shared animation utility/hook so every subsequent section inherits it for free |

## Integration Gotchas

Common mistakes when connecting to external services/libraries.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|-------------------|
| Lenis + GSAP `ScrollTrigger` | Leaving Lenis on its default internal rAF loop while ScrollTrigger reads `window.scrollY` independently | `autoRaf: false` on Lenis; drive it via `gsap.ticker.add((t) => lenis.raf(t * 1000))`; wire `lenis.on('scroll', ScrollTrigger.update)`; use `ScrollTrigger.scrollerProxy()` |
| Lenis + browser back/forward navigation | Letting Lenis's rAF-driven scroll updates fight native scroll restoration, producing wrong scroll position on back-navigation | Set `history.scrollRestoration = 'manual'`; manually restore via `lenis.scrollTo()` on `popstate`/route change; enable `stopInertiaOnNavigate` |
| Lenis + in-page anchor links (nav menu jump links) | Assuming `<a href="#section">` works unmodified once Lenis is active — Lenis intercepts and can silently break default anchor scrolling | Configure Lenis's `anchors` option explicitly, or handle anchor clicks manually via `lenis.scrollTo(target)` |
| GSAP `ScrollTrigger` + hero video (async-loading content) | Calculating trigger positions before the 9.37MB video's dimensions/metadata are available, resulting in wrong trigger start/end points | Call `ScrollTrigger.refresh()` in the video's `loadedmetadata`/`onCanPlay` callback, and again after any lazy-loaded image finishes loading |
| GSAP `ScrollTrigger` + existing `FormConnector` DOM-query pattern | Animating the contact form section (fade/reveal) without accounting for the fragile `querySelector("#contact-form")` coupling — if GSAP animation wraps/re-parents the form or delays its mount, `FormConnector`'s `useEffect` may attach its listener before the form exists in the DOM | Refactor `FormConnector` to pass `onSubmit` directly to the `<form>` (already an explicit project requirement) *before* wrapping the contact section in scroll-triggered reveal animations, so the two changes don't compound |

## Performance Traps

Patterns that work at small scale but fail as usage grows (here: as more sections/animations are added).

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| One `ScrollTrigger` per reveal element instead of batching | Fine with a handful of elements; degrades as capacidades/proceso lists grow | Use `ScrollTrigger.batch()` for repeated list-item reveals | Noticeable once a section has ~10+ individually-triggered elements, especially on mobile |
| Animating `filter`, `box-shadow`, or layout properties in scroub-linked timelines | Looks fine on desktop with a fast GPU | Restrict scroll-scrubbed animation to `transform`/`opacity`; use `force3D: true` | Breaks first on mid-tier mobile GPUs, especially combined with the hero video decode load |
| Not gating animation complexity by viewport via `gsap.matchMedia()` | Works during desktop-only development iteration | Define desktop vs. mobile animation variants from the first section built, reused as the shared pattern | Breaks once QA actually tests on a real/throttled mobile device — often caught late if not built in from the start |
| Calling `ScrollTrigger.refresh()` too aggressively (e.g. on every scroll tick) instead of at true layout-change points | Not obviously wrong in small test cases | Only refresh on window resize (debounced), content-load events, and Lenis init — never inside the scroll callback itself | GSAP's own docs/forums flag this as a known cause of "resize causes major performance lag" |

## Security Mistakes

Domain-specific security issues beyond general web security. Low relevance for a client-side animation library integration, but one item is worth flagging given the project's existing Supabase form:

| Mistake | Risk | Prevention |
|---------|------|------------|
| Loading GSAP plugins (e.g. premium/club plugins, or third-party CDN scripts for GSAP/Lenis) from an unpinned CDN URL instead of npm-installed, version-locked packages | Supply-chain risk — a compromised or mutated CDN script executes with full page access, including near the Supabase-connected contact form | Install `gsap`, `@gsap/react`, and `lenis` via npm with pinned versions in `package.json` (already the project's stated approach); avoid `<script src="https://cdn...">` tags for these libraries |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Over-long scroll-scrubbed sections that "trap" the user's scroll input for an extended pin duration | Users feel scroll is unresponsive or broken, especially on trackpad/mobile flick gestures, increasing bounce on a marketing/contact-conversion site | Keep pinned/scrubbed sections short and purposeful (hero, 1-2 key transitions); prefer straightforward reveal-on-scroll for content-heavy sections (capacidades, proceso) so users don't feel "stuck" |
| Applying smooth-scroll inertia (Lenis) uniformly to mobile touch scrolling | Fights users' native, well-understood touch scroll physics; feels laggy/rubbery compared to native momentum scroll they expect | Leave Lenis's default behavior of not smoothing touch input, or explicitly disable smoothing on touch devices |
| Disabling all animation/inertia for reduced-motion users without any fallback affordance | Section transitions/reveals that were the primary way content became visible might feel "broken" (content just there or missing) if the reduced-motion fallback wasn't designed as a real alternative, not just "the animation off" | Design a reduced-motion variant deliberately — instant crossfade or no motion, but with the same information architecture and no missing content — treat it as a first-class experience, not an afterthought |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **GSAP + Lenis wiring:** Often missing the rAF-loop sync (`autoRaf: false` + `gsap.ticker`) — verify by fast-flicking scroll and watching for lag between visual scroll position and pinned/scrubbed animation state.
- [ ] **Reduced-motion support:** Often missing coverage for Lenis inertia and `ScrollTrigger` pin/scrub, even when CSS-level reduced-motion already works — verify with DevTools "Emulate CSS prefers-reduced-motion: reduce" across every section, not just the hero.
- [ ] **`npm run build` passing:** Often missing SSR-safety verification for newly added GSAP/Lenis client code — verify with a clean `npm run build` (not just `npm run dev`) after each phase, since dev mode can mask SSR-only failures.
- [ ] **Mobile performance:** Often missing real-device or CPU-throttled testing — verify with Chrome DevTools 4x-6x CPU throttling plus network throttling (given the still-present 9.37MB video) before calling a section complete.
- [ ] **Cleanup on unmount:** Often missing scope-bound `useGSAP({ scope })` usage per section — verify by opening/closing the menu overlay and submitting the form repeatedly while watching `ScrollTrigger.getAll().length` in console for unbounded growth.
- [ ] **Anchor links / in-page navigation:** Often missing Lenis `anchors` configuration — verify every nav menu jump-link and any `href="#section"` still scrolls correctly with Lenis active.
- [ ] **CLS regression check:** Often missing a before/after comparison — verify Lighthouse CLS score after each section's GSAP migration is not worse than the current CSS-based baseline.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|-----------------|
| ScrollTrigger memory leak already shipped across multiple sections | MEDIUM | Audit every `useEffect`/`useGSAP` call site; migrate each to scoped `useGSAP({ scope })`; add a temporary dev-only console log of `ScrollTrigger.getAll().length` to confirm the fix before removing the log |
| Lenis/GSAP rAF desync discovered late (animations already built assuming synced scroll) | LOW | The fix is centralized (root layout/provider), not per-section — correcting the ticker wiring in one place resolves it for all already-built sections without touching their individual timelines |
| Reduced-motion gap discovered late (many sections already have ungated GSAP timelines) | MEDIUM-HIGH | Requires touching every section's animation definition to wrap in `gsap.matchMedia()` — cost scales with number of sections already built without the gate, reinforcing why this should be foundational, not retrofitted |
| Mobile jank discovered late in a fully-built cinematic experience | HIGH | May require simplifying/removing pinned sections rather than just tuning parameters — costly rework late in the project; strongly prefer building mobile variants in from the start via `matchMedia` |
| SSR/build failure from GSAP import in a server-rendered path | LOW | Usually a quick fix — move the import/init behind `"use client"` boundary or into `useGSAP()`; the error is typically explicit (`window is not defined`) and easy to trace to the offending file |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| StrictMode double-fire / uncleaned instances (P1, P2) | Foundational GSAP+Lenis setup phase (establish `useGSAP()` + scoped pattern as the mandatory convention) | Console-log `ScrollTrigger.getAll().length` stays bounded after repeated menu/form interactions; no duplicate animation playback observed in dev mode |
| FOUC / CLS from animated elements (P3) | Section migration phase, per-section acceptance criteria | Lighthouse CLS score comparison before/after each section; visual QA for flash-of-content on slow-network throttling |
| Lenis/GSAP rAF desync (P4) | Foundational Lenis+GSAP wiring phase (must precede any section-level `ScrollTrigger` work) | Fast-scroll flick test shows no visible lag between scroll position and pinned/scrubbed animation |
| Reduced-motion not respected by GSAP/Lenis (P5) | Foundational setup phase (shared `matchMedia` gate/hook), re-verified in final QA/polish phase | DevTools reduced-motion emulation toggle shows zero scroll-linked motion (pin, scrub, parallax, Lenis inertia) across every section |
| SSR/hydration mismatch (P6) | Foundational setup phase, immediately after Lenis/GSAP wired into root layout | Clean `npm run build` passes with zero hydration warnings in browser console on first load |
| Mobile performance cliff (P7) | Section migration phase (build mobile variants in via `matchMedia` from the start) + dedicated mobile performance verification checkpoint before milestone completion | CPU-throttled (4x-6x) DevTools Performance profile shows no long tasks >50ms during scroll on hero and heaviest sections |
| Existing rAF parallax loop not removed, compounding with new GSAP parallax | Should be sequenced as a prerequisite/first step of the section migration phase, not a separate later cleanup | Code review confirms `components/experience.tsx`'s manual `getBoundingClientRect()`-per-frame parallax loop is deleted, not left alongside new GSAP parallax |
| `FormConnector` fragile DOM-coupling interacting with new scroll/reveal animation on the contact section | Should be refactored (already an explicit project requirement) before or alongside wrapping the contact section in scroll-triggered reveal animation | Form submits correctly with animation active; no console errors about missing `#contact-form` element on mount |

## Sources

- [React & GSAP — official docs](https://gsap.com/resources/React/) — MEDIUM confidence (official GSAP resource, cross-checked)
- [gsap/react (GitHub) — useGSAP() hook](https://github.com/greensock/react) — MEDIUM confidence
- [The useGSAP() hook — shanit's blog](https://shanit.hashnode.dev/the-usegsap-hook) — MEDIUM confidence
- [Optimizing GSAP Animations in Next.js 15 — Medium](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232) — MEDIUM confidence
- [ScrollTrigger tips & mistakes — official GSAP docs](https://gsap.com/resources/st-mistakes/) — MEDIUM confidence
- [GSAP In Practice: Avoid The Pitfalls — Marmelab](https://marmelab.com/blog/2024/05/30/gsap-in-practice-avoid-the-pitfalls.html) — MEDIUM confidence
- [FOUC prevention for Interactions with GSAP — Webflow Help Center](https://help.webflow.com/hc/en-us/articles/46490560780051-FOUC-prevention-for-Interactions-with-GSAP) — MEDIUM confidence
- [Lenis — official site](https://lenis.darkroom.engineering/) and [darkroomengineering/lenis (GitHub)](https://github.com/darkroomengineering/lenis) — MEDIUM confidence
- [Building Smooth Scroll in 2025 with Lenis — Edoardo Lunardi](https://www.edoardolunardi.dev/blog/building-smooth-scroll-in-2025-with-lenis) — MEDIUM confidence
- [Smooth Scrolling in Next.js with Lenis & GSAP — DevDreaming](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) — MEDIUM confidence
- [Is there a way to disable Lenis on mobile/touch devices? — GitHub Discussion #322](https://github.com/darkroomengineering/lenis/discussions/322) — MEDIUM confidence
- [gsap.matchMedia() — official docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) — MEDIUM confidence
- [ScrollTrigger.matchMedia and prefers-reduced-motion — GSAP forums](https://gsap.com/community/forums/topic/27141-scrolltriggermatchmedia-and-prefers-reduced-motion/) — MEDIUM confidence
- [GSAP animations and accessibility: yes, you can have both! — Anne Bovelett](https://annebovelett.eu/gsap-and-accessibility-yes-you-can-have-both/) — MEDIUM confidence
- [Respecting Users' Motion Preferences — Smashing Magazine](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/) — MEDIUM confidence
- [hydration error in Next.js 15 — GSAP forums](https://gsap.com/community/forums/topic/43281-hydration-error-in-nextjs-15/) — MEDIUM confidence
- [The Definitive Guide to Using GSAP in Next.js — Thinknovus](https://www.thinknovus.com/blog/the-definitive-guide-to-using-gsap-in-next-js-for-speed-and-impact) — MEDIUM confidence
- [ScrollTrigger with Lenis smooth scroll — Problem with the scrollerProxy setup — GSAP forums](https://gsap.com/community/forums/topic/34814-scrolltrigger-with-lenis-smooth-scroll-problem-with-the-scrollerproxy-setup/) — MEDIUM confidence
- [Performances issue with Lenis, GSAP & R3F on mobile — GitHub Discussion #431](https://github.com/darkroomengineering/lenis/discussions/431) — MEDIUM confidence
- [The Never Ending Story: Building a Seamless Infinite Scroll Experience with GSAP & Lenis — Codrops](https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/) — MEDIUM confidence
- [ScrollTrigger animation performance on 'low-end' devices — GSAP forums](https://gsap.com/community/forums/topic/27845-scrolltrigger-animation-performance-on-low-end-devices/) — MEDIUM confidence
- [ScrollTrigger doesn't work properly on page with lazy load images — GSAP forums](https://gsap.com/community/forums/topic/24653-scrolltrigger-doesnt-work-properly-on-page-with-lazy-load-images/) — MEDIUM confidence
- Project-internal: `.planning/codebase/CONCERNS.md` (existing tech debt: rAF parallax loop, FormConnector coupling, incomplete reduced-motion handling, no performance benchmarks, no test coverage) — HIGH confidence (first-party codebase analysis)

---
*Pitfalls research for: GSAP + Lenis cinematic animation integration (Next.js 16 / React 19 App Router)*
*Researched: 2026-07-18*
