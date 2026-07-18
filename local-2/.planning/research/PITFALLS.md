# Pitfalls Research

**Domain:** Dark-to-light visual pivot (CSS custom-property re-theme + animation intensity reduction) plus new interaction patterns (side drawer, carousel, sticky header, PDF brochure download) layered on an existing Next.js 16 / React 19 App Router site with Lenis + GSAP already wired
**Researched:** 2026-07-18
**Confidence:** MEDIUM (cross-checked across official docs — MDN, W3C ARIA APG, Next.js docs, GSAP/Lenis official resources — plus maintainer GitHub discussions and multiple independent implementation write-ups. No project-specific curated source exists for the new UI patterns since they don't exist in the codebase yet; treat as directionally reliable, verify against installed package versions during implementation. Builds on top of `.planning/archive/v1.0-dogstudio-superseded/research/PITFALLS.md`, which remains valid for the Lenis+GSAP scroll engine itself and is not re-derived here.)

## Critical Pitfalls

### Pitfall 1: Dark-theme CSS custom properties silently survive the light re-theme in shared/low-level components

**What goes wrong:**
The existing token system (`--bg`, `--surface`, `--text`, `--accent`, etc., built for the Dogstudio-dark direction) gets reassigned new light values at the top-level `:root`, but components that read *derived* or *hard-coded* values — `rgba(255,255,255,0.08)` overlays meant to sit on a dark surface, `box-shadow` calibrated for a dark background (light shadows, glow effects), `backdrop-filter`/`mix-blend-mode: screen|lighten|difference` tricks that only produce the intended visual on dark pixels, or a `filter: invert()` hack somewhere — don't get touched by a token swap. The result: elements that render correctly in isolation but produce washed-out text, invisible borders, or a "muddy" halo effect once the surrounding background flips from near-black to near-white. This is worse than a full rewrite because it passes casual visual QA (nothing is *broken*, just subtly wrong) and only surfaces once every component is checked against every new background.

**Why it happens:**
CSS custom properties give a false sense of "change the token, done." Anything expressed as a literal `rgba()`/`hsla()` with hard-coded alpha, any blend-mode trick, and any component-local shadow/glow that isn't itself tokenized will not follow the root token change. This project's `experience.tsx`-derived section components were built under one visual assumption (dark, cinematic) and are exactly the kind of codebase where local one-off colors accumulate.

**How to avoid:**
- Before re-theming, grep the entire component tree for hard-coded color literals (`rgba(`, `hsla(`, `#fff`, `#000`, `white`, `black`) and blend-mode/filter properties (`mix-blend-mode`, `backdrop-filter`, `filter: invert`) — every hit is a candidate for a leftover dark-theme assumption that needs manual re-evaluation, not a mechanical find/replace.
- Establish the new light token set first (background, surface, text, border, accent, focus-ring) as the single source of truth, then require every section component's re-theme to derive from tokens only — no new one-off literals introduced during the migration (this is the token-discipline lesson from real dark→light migrations: "new components skipping tokens, one-off colors added" is the #1 named regression pattern).
- Treat `custom-cursor.tsx` and any decorative/atmospheric component (grain overlay, particle/noise background, glow effects around the hero) as high-risk: these were almost certainly designed for a dark backdrop and need a deliberate redesign decision (keep toned down, or remove per the brief's explicit "no dark backgrounds with excessive effects" instruction), not a token pass-through.

**Warning signs:**
- Visual QA passes at the section level but a full-page scroll-through reveals "gray fog" text, barely-visible borders, or halos with the wrong tint.
- A component looks correct in Storybook/isolation but wrong in context (because it was tuned assuming a dark ancestor background).
- Search for `mix-blend-mode`, `backdrop-filter`, or `filter:` in the codebase turns up unreviewed hits after the re-theme is marked "done."

**Phase to address:**
Foundational re-theme phase — audit and tokenize before any section's visual is reworked; must precede section-by-section content work, not be discovered during final polish.

---

### Pitfall 2: WCAG contrast regressions from naive "invert the palette" light re-theming

**What goes wrong:**
Teams commonly assume that if the dark theme "looked fine," a straightforward palette flip (dark bg → light bg, light text → dark text, same accent hue) will also look fine. It usually doesn't: accent/brand colors tuned to pop against near-black (e.g. a saturated cyan/blue used for the geospatial/tech accent) frequently fail WCAG AA (4.5:1 for body text, 3:1 for large text and for UI component/graphical-object boundaries per WCAG 1.4.11) once placed on a light or white surface, because the same hue needs a different lightness/saturation value depending on which side of the contrast pair it sits on. Focus-ring colors, placeholder text, disabled-state text, and "muted" secondary text (all commonly styled at reduced opacity for a subtle dark-theme look) are the most frequent AA failures after a light re-theme, because a `color: white; opacity: 0.6` pattern that read fine on black becomes borderline-illegible gray-on-white.
This project explicitly targets a light corporate palette (Fugro/Seequent-inspired) with brand blues/celeste — exactly the color family most likely to under-perform on white without deliberate contrast tuning.

**Why it happens:**
Opacity-based "muting" and hue-only palette definitions (no explicit lightness ramps per surface) don't have contrast built in as a constraint — they were chosen for aesthetic feel on the old background, not verified against the new one. Nobody re-runs a contrast checker unless it's an explicit step.

**How to avoid:**
- Define the new palette as explicit lightness/contrast-aware tokens (e.g. an accent-500 for large text/UI elements and a separately-tuned darker accent-700 for body-text-on-white use), not a single hue reused via opacity everywhere.
- Run every text/background and icon/background pairing through a contrast checker (e.g. WebAIM, or axe DevTools/Lighthouse accessibility audit) as an explicit phase gate — do not rely on "it looks fine" visual review, since near-miss failures (e.g. 4.1:1 vs. the 4.5:1 requirement) are not visually obvious.
- Pay specific attention to: focus-ring visibility against white/light-gray surfaces (focus indicators need 3:1 contrast against adjacent colors per WCAG 1.4.11, and a focus ring designed to glow against dark backgrounds often becomes nearly invisible on light ones), placeholder/muted text, disabled button states, and any accent-on-accent combination (e.g. white text on a mid-tone brand blue button — verify it still passes at the new blue's exact value).
- Since the brief explicitly vetoes "very bright colors," resist the temptation to compensate for contrast failures by cranking saturation/brightness up — instead adjust lightness within the sober, muted-corporate palette range the brief calls for.

**Warning signs:**
- Lighthouse/axe accessibility score drops after the re-theme is applied, specifically on color-contrast rules.
- Any text styled via `opacity` rather than a distinct token value on the new light background.
- Focus outlines that were tuned to be visible on black are hard to see when tabbing through the new light-background pages.

**Phase to address:**
Foundational re-theme phase, with an explicit contrast-audit checkpoint before the phase is marked complete — re-verify per section as content is filled in, since real copy (longer headlines, smaller secondary text) can reveal contrast issues that placeholder text didn't.

---

### Pitfall 3: Half-migrated animation intensity — "moderate" applied inconsistently, orphaned cinematic timeline code left in place

**What goes wrong:**
Dialing down from "intense/cinematic" to "moderate" is rarely a single global multiplier; it's usually done section-by-section, which creates a real risk of an inconsistent final feel — some sections still using the old aggressive `duration`/`ease`/`stagger`/parallax-depth values, others tuned down — plus **dead code**: old `ScrollTrigger` pin configs, mask-reveal timelines, or magnetic-cursor interactions built for the cinematic direction that are commented out or left registered-but-unused "just in case," which both bloats the bundle and risks accidentally re-firing (e.g. a leftover `ScrollTrigger` with `scrub: true` and an aggressive `start`/`end` range that nobody remembered to delete, still consuming a scroll-tick callback every frame).

**Why it happens:**
There's no single flag that flips "cinematic" to "moderate" — it's a judgment call applied per animation property (translate distance, stagger delay, scrub tightness, pin duration, parallax depth) across every section. Without an explicit shared spec for what "moderate" numerically means (e.g. max translate distance, target duration range, no pinning except X), each section ends up re-interpreting the brief slightly differently, and partially-reworked sections get left mid-migration when priorities shift.

**How to avoid:**
- Before touching any section, define one shared "moderate motion" spec as literal constants/tokens (e.g. reveal translate ≤ 16–24px, durations 400–700ms for section reveals vs. this project's likely-larger prior cinematic values, no scroll-pinning except at most one short hero moment if any, parallax depth capped low or removed entirely, stagger ≤ 60–80ms between siblings) — reuse the same constants across every section's `useGSAP()` call rather than each developer picking values per section.
- Treat the migration as delete-and-rebuild per section, not tune-in-place: remove the old cinematic `ScrollTrigger`/timeline definitions for a section as part of the same commit that adds its moderate replacement, rather than leaving old code disabled/commented for "reference."
- Grep for `ScrollTrigger.create`/`useGSAP` call sites at the end of the phase and confirm the count matches the expected set of active section animations — any orphaned trigger still in `ScrollTrigger.getAll()` that isn't accounted for is leftover cinematic debt.
- Explicitly revisit `custom-cursor.tsx`, `intro-sequence.tsx`, and `menu-overlay.tsx` — these were named/built for a cinematic direction and are the most likely to be forgotten in a "section content" migration since they're cross-cutting, not per-section.

**Warning signs:**
- Scrolling through the finished site, some sections feel noticeably snappier/calmer than others — an inconsistency a stakeholder will notice even without being able to name why.
- `ScrollTrigger.getAll().length` includes instances tied to elements/sections that were supposedly already migrated.
- Commented-out GSAP timeline blocks still present in the codebase at "done."

**Phase to address:**
Should span two phases: (1) a foundational phase that defines and documents the shared "moderate motion" constants before any section touches them, and (2) each section-migration phase must include removal of the prior cinematic implementation as an explicit acceptance criterion, not a follow-up cleanup task.

---

### Pitfall 4: Side-drawer built with `aria-hidden` + manual Tab-key trapping instead of `inert`, leaving background content focusable/swipeable

**What goes wrong:**
A common shortcut is to open the drawer, set `aria-hidden="true"` on the rest of the page (or just on `<main>`), and add a keydown listener that cycles Tab focus within the drawer. This half-solution has two failure modes: (1) `aria-hidden` only removes content from the accessibility tree — it does **not** block pointer clicks or keyboard focus, so background buttons/links stay in the tab order and clickable, producing a genuine focus trap violation (focus can land on a background element the screen reader has been told doesn't exist) and (2) manual Tab-key handling only covers keyboard users — mobile screen readers (VoiceOver, TalkBack) navigate via swipe gestures, not Tab, so a JS-only trap provides zero boundary for those users, who can swipe straight through the drawer into content that's supposedly hidden.

**Why it happens:**
`aria-hidden` + manual Tab cycling is the pattern most tutorials show for constrained timeframes, and it "works" in a quick keyboard-only manual test, hiding the swipe-gesture gap and the pointer-click gap unless specifically tested.

**How to avoid:**
- Use the `inert` attribute (broadly supported in current browsers) on every sibling of the drawer's root when it's open (e.g. `<main inert>` or wrap page content in a container that gets `inert` toggled) — `inert` removes the subtree from the tab order, blocks pointer/click events, and hides it from the accessibility tree in one declaration, covering keyboard, mouse, and gesture-based screen reader navigation simultaneously.
- If not using `inert` directly, use a maintained focus-trap library (e.g. `focus-trap-react`) rather than a hand-rolled Tab-key cycler — hand-rolled traps routinely miss edge cases (Shift+Tab wrap-around, dynamically added focusable elements inside the drawer, iframes).
- On drawer open: move focus to the drawer's first focusable element (or a heading with `tabindex="-1"` if the drawer opens with no obvious first control); on close: return focus to the element that opened the drawer (typically the "view service detail" trigger) — losing focus-return is a very common secondary miss even when the trap itself is implemented correctly.
- Close the drawer on `Escape` and on a backdrop click, and ensure the drawer has `role="dialog"` (or `aria-modal="true"` with an accessible name via `aria-label`/`aria-labelledby`) so assistive tech announces it as a discrete UI layer, not just more page content.

**Warning signs:**
- Tabbing through the page with the drawer open still reaches header nav links, section CTAs, or the contact form behind the drawer.
- Testing with a screen reader in swipe-navigation mode (not just Tab) reveals background content is still reachable even though `aria-hidden` is set.
- Closing the drawer leaves focus on `<body>` (visibly, the browser scrolls to top or focus is "lost") instead of returning to the trigger button.

**Phase to address:**
Drawer implementation phase — build the focus-management contract (inert/focus-trap + focus-return) as part of the first drawer instance, not as later polish, since every one of the 5 service-detail drawers reuses the same component.

---

### Pitfall 5: Side-drawer scroll-lock fights Lenis, or a naive `overflow-x: hidden` fix silently breaks the new sticky header

**What goes wrong:**
Because Lenis intercepts scroll and drives a virtual scroll position, the standard "lock body scroll" pattern (`document.body.style.overflow = 'hidden'` on drawer open) does not reliably stop scrolling — Lenis overrides native scroll behavior, so the classic `overflow: hidden` trick on `<body>` frequently does nothing, or the background page keeps scrolling underneath the open drawer via Lenis's own rAF-driven lerp, which native `overflow:hidden` was never designed to intercept. Teams then reach for the equally-common "just add `overflow-x: hidden` to `html, body`" band-aid to fix a horizontal scrollbar this often surfaces at the same time — but on a page where Lenis is active, adding `overflow-x: hidden` (or any `overflow` value) to `html`/`body` creates a **new scroll container**, and this silently and completely breaks `position: sticky` everywhere on the page (the sticky header included), with no console error — it just quietly stops sticking and scrolls away with the rest of the content.

**Why it happens:**
Both mistakes come from applying pre-Lenis intuitions (native `overflow:hidden` scroll-lock, `overflow-x:hidden` to kill horizontal scrollbars) to a page where Lenis has already redefined how scroll position and containing blocks behave. The interaction between "drawer needs scroll lock" and "header needs to stay sticky" is exactly the kind of cross-cutting bug that isn't visible when either feature is built and tested in isolation.

**How to avoid:**
- Use Lenis's own API to lock scroll: call `lenis.stop()` when the drawer opens and `lenis.start()` when it closes — this is the Lenis-aware equivalent of scroll-lock and is compatible with Lenis's rAF-driven model, unlike native `overflow:hidden` on body.
- If any part of the page needs to remain scrollable while the drawer is open (e.g. the drawer's own internal content, or a case where background scroll should be preserved instead of locked), mark that container with Lenis's `data-lenis-prevent` attribute (or the `prevent` option) rather than fighting Lenis with CSS.
- Never add `overflow-x: hidden` to `html`/`body` as a horizontal-scrollbar fix on a Lenis-driven page — use `overflow-x: clip` instead (solid support: Safari 16+, Chrome 90+, Firefox 81+), which prevents horizontal overflow without creating a new scroll container and therefore does not break `position: sticky`.
- Explicitly test the sticky header while the drawer is open and again immediately after closing it — this combination (two new features shipped together) is exactly where this bug hides, since neither feature alone would surface it.

**Warning signs:**
- Background page content is still scrollable (via trackpad/wheel) while the drawer is visually open.
- The sticky header stops sticking specifically after a `overflow-x: hidden` rule was added anywhere in the global stylesheet — check `html`/`body` rules first if this regresses.
- Bug appears intermittently depending on which page/section the drawer was opened from (because sticky-breaking depends on whether that section's layout happens to overflow horizontally, triggering the scroll-container creation).

**Phase to address:**
Drawer implementation phase for the scroll-lock half; cross-verified again in the sticky-header phase (see Pitfall 8) since the two features directly interact — the roadmap should sequence sticky header and drawer in the same phase or with an explicit integration-test step between them, not as fully independent, unrelated phases.

---

### Pitfall 6: Carousel built without keyboard/touch parity or pause control, failing WCAG 2.2.2 and the drone/equipment content's own usability

**What goes wrong:**
It's common to build a carousel that only responds to swipe/drag gestures (fine for a touchscreen demo) while quietly failing keyboard users entirely, or to wire arrow-key navigation but forget visible, correctly-sized touch targets for prev/next controls. A second common failure: if the carousel auto-advances (common for a "showcase our equipment" carousel), shipping it without a pause/stop control violates WCAG 2.2.2 (Pause, Stop, Hide) for any content that auto-updates — a real risk here since a drone/camera-equipment showcase carousel is exactly the kind of decorative-feeling component teams forget to gate behind manual advance.

**Why it happens:**
Carousels are consistently flagged as one of the most accessibility-problematic UI patterns precisely because the "happy path" (mouse drag or swipe) works and looks finished long before keyboard/screen-reader/reduced-motion paths are tested; teams optimize for the visual demo, not the full interaction surface.

**How to avoid:**
- Provide explicit, always-visible previous/next buttons (not swipe-only) that work identically via mouse click, keyboard (Enter/Space when focused, plus arrow-key navigation within the carousel per the ARIA APG carousel pattern), and touch.
- Wrap the carousel region with a landmark/`aria-roledescription="carousel"` and an accessible name (`aria-label`), mark the non-visible slides `aria-hidden="true"` (or `inert`) so screen readers don't announce off-screen equipment items, and announce slide changes via a polite live region only when the change was user-initiated (not on every auto-advance tick, which would be noisy).
- If auto-advance is used at all (verify against the brief — a corporate/technical site like Fugro/Seequent rarely needs it), provide a visible pause/stop control and default to paused on hover/focus; strongly consider skipping auto-advance entirely given the brief's "sober, technical" direction and the reduced-motion requirement already in place project-wide.
- Gate any carousel transition animation behind the same `prefers-reduced-motion` pattern already established for GSAP/Lenis elsewhere in the project (see prior research `PITFALLS.md` Pitfall 5) — a carousel is exactly the kind of component that gets built later and can easily be forgotten from that gate if it's not built using the same shared utility/hook.

**Warning signs:**
- Tabbing to the carousel and pressing arrow keys does nothing; only mouse drag/touch swipe works.
- No visible pause control exists despite the carousel auto-advancing.
- DevTools reduced-motion emulation still shows the carousel auto-transitioning.

**Phase to address:**
Carousel implementation phase — build keyboard/touch/ARIA parity and the reduced-motion gate into the first version, not retrofit after visual approval, since this is a new component with no existing debt to inherit but also no existing pattern to copy from.

---

### Pitfall 7: Carousel library adds its own rAF/transition loop that competes with the already-tuned Lenis+GSAP ticker

**What goes wrong:**
Off-the-shelf carousel libraries (Swiper, Embla, or a hand-rolled `translateX` + `requestAnimationFrame` slider) each bring their own animation/transition driver. If the chosen library runs its own independent rAF loop for drag-momentum or auto-play transitions while Lenis and GSAP are already carefully synced onto a single shared ticker (per the existing project pattern, `gsap.ticker.add((t) => lenis.raf(t * 1000))`), the carousel becomes a third, un-synced timing source — most visible as carousel drag-momentum feeling subtly "off" or janky specifically while the page is also mid-smooth-scroll, or as compounded main-thread cost on mobile (three animation systems computing per frame instead of one shared tick), directly re-creating the "competing per-frame systems" performance trap already flagged for the rAF parallax loop in the prior milestone's research.

**Why it happens:**
Carousel libraries are designed to be dropped into any page and are unaware of a host page's existing animation-ticker architecture; nobody audits a new dependency's internal scheduling model against the project's already-bespoke Lenis/GSAP sync when adding "just a carousel."

**How to avoid:**
- Prefer a lightweight, headless, dependency-free library (Embla Carousel is the strongest fit here: ~7KB gzipped, no dependencies, direct DOM manipulation without its own heavyweight animation engine) over a full-featured library with built-in autoplay/transition/particle-effect modules (Swiper) that bring more internal scheduling surface than needed for a straightforward equipment showcase.
- If GSAP-driven transitions are wanted for the carousel (e.g. a custom slide/fade), drive them through the existing GSAP ticker/`useGSAP()` pattern rather than the carousel library's built-in transition engine — treat the carousel library as providing drag/swipe/index-state logic only, and let GSAP own the visual transition, keeping a single animation authority.
- Test carousel interaction (drag flick) while Lenis smooth-scroll is also actively settling (e.g. flick-scroll the page, then immediately drag the carousel) — this is the specific interaction most likely to expose ticker desync, analogous to the fast-scroll-flick test already used to verify Lenis/GSAP sync elsewhere in this project.
- If lazy-loading carousel images (equipment/drone photos), verify `ScrollTrigger.refresh()` is called once those images resolve their dimensions, per the existing project pattern for the hero video — a lazy-loaded carousel is exactly the kind of async-content case already known to desync trigger positions if not refreshed.

**Warning signs:**
- Carousel drag/flick feels noticeably less smooth specifically during/after a fast page scroll, but smooth when tested in isolation with no page scroll happening.
- Chrome DevTools Performance panel shows more than one distinct rAF callback source active simultaneously during carousel interaction.
- Carousel images shift layout or the carousel's height jumps after initial paint (unaccounted-for lazy image load affecting other scroll-triggered elements' positions).

**Phase to address:**
Carousel implementation phase — the library choice and its integration with the existing ticker architecture should be decided once, explicitly, before building carousel content, given it directly touches the already-fragile foundational Lenis+GSAP sync documented in the prior research.

---

### Pitfall 8: Sticky header breaks (or silently un-sticks) once Lenis smooth-scroll is layered underneath it

**What goes wrong:**
This is a well-documented, specific Lenis gotcha: Lenis doesn't perform real browser scrolling — in certain configurations it intercepts scroll input and applies a lerped/eased position via a CSS transform on a wrapper element, meaning the actual browser scroll position (`window.scrollY`, and anything relying on native scroll like `position: sticky`) can be out of sync with what's visually on screen. `position: sticky` and `position: fixed` behave correctly only when their nearest ancestor doesn't introduce an unexpected new containing block or scroll container — and the most common accidental trigger for this on a Lenis page is adding `overflow-x: hidden` to `html`/`body` (see Pitfall 5) to silence a horizontal-scrollbar issue, which creates a new scroll container that breaks every `position: sticky` element on the page, including the header this milestone explicitly requires.

**Why it happens:**
This project's existing Lenis+GSAP research (prior milestone) already covers rAF-loop sync but was written before any sticky UI existed on the page — the sticky header is new in this milestone, so the specific sticky+Lenis interaction has not yet been encountered or tested in this codebase. It's an easy trap because sticky headers work perfectly in local dev with a short page (no reason yet to add `overflow-x:hidden`) and only break once real content length + the horizontal-overflow-prone carousel/drawer are both present and someone reaches for the natural-seeming CSS fix.

**How to avoid:**
- Configure Lenis with its `root`/native-scroll-friendly mode (not a transform-based wrapper mode) so `window.scrollY` and native scroll-dependent CSS (`position: sticky`) read the real, correct scroll position rather than a lerped offset — verify against the exact Lenis version installed (`lenis@1.3.25` per `PROJECT.md`), since API/mode names have shifted across Lenis major versions.
- Never fix horizontal-scrollbar issues with `overflow-x: hidden` on `html`/`body`; use `overflow-x: clip` instead, which does not create a new scroll container and therefore does not break sticky positioning (see Pitfall 5 — same root cause, two symptoms).
- Place the sticky header outside of any GSAP-animated/transformed ancestor — an element with an active `transform` (including one animated via GSAP, e.g. a parent wrapper subtly parallaxing) creates a new containing block, which silently breaks `position: fixed`/`sticky` children the same way `overflow` does; keep the header as a direct, untransformed child of the layout root.
- After implementing, explicitly test: (1) fast flick-scroll past the header's sticky threshold, (2) scroll with the drawer open and closed, (3) scroll on a page with the carousel's dynamic height/lazy-loaded images present — each of these is a scenario documented above as capable of independently breaking stickiness, and this project is adding all three in the same milestone.

**Warning signs:**
- Header sticks correctly during slow, careful manual scroll-testing but detaches/scrolls away during a fast flick or on longer pages once real content is in place.
- Header stickiness regresses specifically after an unrelated CSS change elsewhere (a strong signal it's the `overflow`/stacking-context class of bug, not a header-specific bug).
- `window.scrollY` logged to console doesn't match the visually apparent scroll position while Lenis is active.

**Phase to address:**
Sticky header implementation phase — should be built and stress-tested (fast scroll, with drawer/carousel present) as an explicit phase deliverable, ideally sequenced after or alongside the drawer/carousel work (not before), since those are exactly the features most likely to introduce the horizontal-overflow or transformed-ancestor conditions that break it.

---

### Pitfall 9: PDF brochure download breaks silently due to Next.js App Router file-serving assumptions (cross-origin download attribute, wrong Content-Disposition, or stale build cache)

**What goes wrong:**
The simplest approach — drop `brochure.pdf` in `/public` and link to it with `<a href="/brochure.pdf" download>` — is usually fine for this project's use case (a static, public marketing asset, not access-controlled), but two adjacent mistakes are common: (1) if the PDF is ever served from a different host/CDN/subdomain (e.g. moved to object storage or a different asset domain later), the `download` attribute is silently ignored by the browser for cross-origin resources — the browser just navigates to/previews the PDF in a new tab instead of downloading it, with no error; and (2) if a custom route handler is used instead of the static `/public` approach (e.g. to log downloads, or to generate the PDF dynamically), forgetting to set `Content-Disposition: attachment; filename="..."` on the response means the browser previews the PDF inline (opens the PDF viewer) rather than downloading it, even though the `download` attribute is present on the triggering link — some browsers respect an `inline` Content-Disposition over the anchor's `download` attribute.

**Why it happens:**
`<a download>` "just working" is the default assumption from simpler static sites; the cross-origin exception and the Content-Disposition precedence rule are non-obvious edge cases that only surface once the asset moves off same-origin `/public` or a route handler is introduced for any reason (analytics, gating, dynamic generation).

**How to avoid:**
- For this project's stated use case (public, unrestricted brochure — no access control mentioned in requirements), keep the PDF in `/public/brochure.pdf` and link with a plain `<a href="/brochure.pdf" download="SkyTech-Brochure.pdf">` — this is same-origin, so the `download` attribute works reliably without any server-side header work; do not over-engineer this into a route handler unless a real requirement emerges (download tracking/analytics, access gating, or per-request PDF generation).
- If a route handler is used for any reason, explicitly set `Content-Disposition: attachment; filename="SkyTech-Brochure.pdf"` and `Content-Type: application/pdf` on the response — omitting the `attachment` disposition is the single most common cause of "the download button just opens a PDF preview tab instead."
- If the brochure is ever moved to a different origin/CDN (verify this isn't planned, since it changes the correct approach), the cross-origin `Content-Disposition: attachment` header on that origin's response is mandatory — the client-side `download` attribute alone will not force a download for cross-origin resources.
- Confirm the PDF ships correctly in a production build (`npm run build && npm start`), not just `npm run dev` — Next.js dev-mode has had reported discrepancies with `application/pdf` content-type handling versus a production build; this project's own gate is a clean `npm run build`, so verify the brochure download specifically as part of that gate, not just that the build succeeds.

**Warning signs:**
- Brochure link opens a new tab and previews the PDF instead of triggering a download.
- Works locally in dev but the filename/download behavior differs after `npm run build`.
- Download works for the developer's own machine/browser but not for a teammate testing from a different network path (a sign the asset may have inadvertently moved off same-origin, e.g. behind a CDN rewrite).

**Phase to address:**
Should be a small, self-contained late-stage phase (brochure is a static asset feature with no dependency on the drawer/carousel/header work) — but explicitly verify against a production build (`npm run build && npm start`), not dev mode, before considering it complete.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Palette-swap the root tokens and call the re-theme "done" without auditing hard-coded `rgba()`/blend-mode literals in section components | Fast, looks mostly right in a quick pass | Subtle, hard-to-spot contrast/legibility regressions ship to production (Pitfall 1) since nothing throws an error | Never for the final milestone deliverable — acceptable only as an interim "rough pass" checkpoint explicitly followed by a literal-color audit step |
| Leave old cinematic `ScrollTrigger`/timeline code commented out "for reference" instead of deleting it during the moderate-motion migration | Feels safer, avoids re-deriving values later if leadership reverses direction | Dead code risks accidental re-registration, bloats bundle, and makes it hard to tell which motion values are actually "moderate" vs. leftover cinematic tuning (Pitfall 3) | Only acceptable if isolated in a clearly-named, excluded-from-build reference file/branch — never left inline in shipped components |
| Hand-roll a Tab-key focus trap for the drawer instead of using `inert` or a maintained library | No new dependency, quick to write | Misses swipe-based screen reader navigation and edge cases (dynamic content, Shift+Tab); a real accessibility violation, not a cosmetic gap (Pitfall 4) | Never — `inert` is a one-line native platform feature with broad support; there's no meaningful cost to using it correctly from the start |
| Use native `overflow: hidden` on `<body>` for drawer scroll-lock instead of `lenis.stop()`/`data-lenis-prevent` | Familiar, "standard" pattern from pre-Lenis experience | Doesn't reliably stop scroll under Lenis; background page keeps moving under the open drawer (Pitfall 5) | Never on a Lenis-driven page — use the Lenis-aware API from the first drawer implementation |
| Ship a full-featured carousel library (with its own autoplay/transition engine) instead of a headless one, to save initial build time | Faster to get a working carousel visually | Adds a second/third competing animation ticker alongside the already-fragile Lenis+GSAP sync, and pulls in features (autoplay, particle/coverflow effects) explicitly at odds with the brief's sober, technical direction (Pitfall 7) | Only acceptable if the extra library features are genuinely needed (e.g. thumbnail navigation, virtual slides for very large sets) — not for a straightforward equipment showcase carousel |

## Integration Gotchas

Common mistakes when connecting to external services/libraries.

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| Lenis + `position: sticky` header | Assuming sticky "just works" once Lenis is added, or fixing an unrelated horizontal-scrollbar issue with `overflow-x: hidden` on `html`/`body`, which silently creates a new scroll container and breaks sticky everywhere | Use Lenis's native-scroll-friendly (`root`) mode so `window.scrollY` stays accurate; fix horizontal overflow with `overflow-x: clip`, never `overflow-x: hidden`, on ancestors of sticky elements |
| Lenis + drawer/modal scroll-lock | Using `document.body.style.overflow = 'hidden'` to lock background scroll while the drawer is open | Call `lenis.stop()`/`lenis.start()` on open/close; use `data-lenis-prevent` for any container that should keep native scroll behavior |
| Carousel library + existing GSAP/Lenis ticker | Letting the carousel library run its own independent rAF/transition loop alongside the already-synced `gsap.ticker` → `lenis.raf()` pipeline | Choose a headless, minimal-dependency library (e.g. Embla) and drive any custom transition visuals through the existing GSAP ticker, treating the carousel lib as state/gesture logic only |
| `<a download>` + PDF brochure | Assuming the `download` attribute works unconditionally, without checking same-origin status or server `Content-Disposition` | Keep the asset same-origin in `/public`; if a route handler is ever introduced, explicitly set `Content-Disposition: attachment; filename=...` |
| `aria-hidden` for background-content hiding during drawer open | Treating `aria-hidden="true"` as equivalent to disabling interaction — it only affects the accessibility tree, not focus or clicks | Use `inert` on the background content container, which blocks focus, pointer events, and hides from the accessibility tree in one attribute |
| Carousel auto-advance | Shipping an auto-advancing carousel with no pause control, and no `prefers-reduced-motion` gate reusing the project's existing GSAP/Lenis reduced-motion pattern | Provide a visible pause/stop control (WCAG 2.2.2) and wire the carousel's transition/autoplay through the same `matchMedia("(prefers-reduced-motion: reduce)")` gate already established for the rest of the site's motion |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Carousel with a full-featured library's internal transition engine running alongside GSAP/Lenis's shared ticker | Carousel drag feels fine in isolation, subtly janky whenever page smooth-scroll is also active | Use a headless library and a single shared animation authority (GSAP ticker) for any custom transitions | Becomes visible once real equipment photos (larger images, more slides) are loaded and tested on a throttled/mobile device, compounding with the hero video's existing bandwidth competition |
| Carousel images not lazy-loaded/sized, loaded all at once on mount | Fine with 3-4 placeholder images in dev | Lazy-load off-screen slides, set explicit width/height (or `aspect-ratio`) to avoid layout shift, call `ScrollTrigger.refresh()` once images resolve | Breaks once the real equipment/drone/camera photo set (likely more images, higher resolution) replaces placeholders |
| Sticky header re-evaluated/re-styled on every Lenis scroll tick (e.g. inline style recalculation for a scroll-progress-based header treatment) | Not obviously wrong with a short page in dev | Throttle/derive header state changes from discrete thresholds via `ScrollTrigger`, not a per-frame Lenis scroll callback doing heavy DOM reads/writes | Becomes visible on longer pages or lower-end devices once combined with existing scroll-linked animation load already flagged as a mobile performance risk in the prior milestone's research |
| Contrast/token audit done once, early, and never re-checked as real brand copy/content is filled in | Passes an initial spot-check with placeholder text | Re-run the contrast audit per section as real content (longer headings, smaller secondary text, real photography backgrounds behind text) is filled in, not just once against mockup colors | Breaks once actual brand copy (from the client's brief, often longer than placeholder) or a real photo background is placed behind text that was only checked against a flat color swatch |

## Security Mistakes

Domain-specific security issues beyond general web security. Low relevance for this milestone (no new external service is introduced beyond static file serving), but worth flagging:

| Mistake | Risk | Prevention |
|---------|------|------------|
| Serving the brochure PDF via a route handler that accepts a filename/path parameter without validation (if download logging/dynamic serving is ever added) | Path traversal risk reading arbitrary files from the server filesystem via a crafted filename parameter | If a route handler is used at all (not required for the base case — see Pitfall 9), hard-code the file path server-side; never construct a filesystem path from unvalidated request input |
| Third-party carousel library pulled from an unpinned source or with a large, rarely-audited dependency tree | Supply-chain risk consistent with the existing project concern already flagged for GSAP/Lenis CDN usage | Install the chosen carousel library via npm with a pinned version in `package.json`, consistent with the project's existing pinned-dependency approach; prefer a small, dependency-free library (Embla) to minimize the audit surface |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Drawer opens by fully replacing/obscuring the page (feels like a full navigation) instead of a clearly partial side panel, on a brief that explicitly asked for a lateral/partial reveal pattern | Users lose context of which service they were browsing; feels like a page navigation rather than an inline detail expansion, working against the brief's intent | Keep the drawer visually partial (e.g. 40-60% viewport width on desktop, near-full on mobile only if necessary) with the underlying page dimmed-but-visible, reinforcing "detail of what you were just looking at" |
| Carousel with no visible affordance that more items exist off-screen (no partial-next-slide peek, no dots/counter) | Users don't realize there's more equipment/drone content to see, undercounting the real breadth of capability the section is meant to convey | Show a partial peek of the next slide and/or a slide counter/dots so the carousel's extent is discoverable without requiring a first accidental swipe |
| Sticky header that grows/shrinks or changes opacity aggressively on every scroll tick, reintroducing "cinematic" motion into a component the brief wants sober | Undercuts the explicit "moderate, not intense" direction — a header that visibly animates on every scroll pixel reads as busy/distracting on a technical corporate site | Keep the sticky header's scroll-reactive behavior minimal — a simple background/shadow toggle at a single threshold, not a continuously-interpolated scroll-driven transform |
| Applying the same aggressive Lenis touch-smoothing to the drawer's internal scrollable content as the main page | Drawer content (service detail text) feels laggy/rubbery on mobile, working against the read-a-detail use case which benefits from responsive, native-feeling scroll | Exclude drawer-internal scroll from Lenis (`data-lenis-prevent`) so it uses native, responsive touch scrolling, reserving Lenis's smoothing for the main marketing-page scroll experience |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Light re-theme:** Often missing an audit of hard-coded color literals/blend-modes in shared components (`custom-cursor.tsx`, overlays, shadows) — verify by grepping for `rgba(`, `mix-blend-mode`, `backdrop-filter`, `filter:` across the component tree and manually reviewing every hit against the new light backgrounds.
- [ ] **WCAG contrast:** Often passes a casual visual check but fails an actual contrast-ratio tool — verify every text/background and icon/background pair with Lighthouse/axe or WebAIM's contrast checker, paying specific attention to muted/secondary text, placeholders, disabled states, and focus-ring visibility on light surfaces.
- [ ] **"Moderate" animation consistency:** Often some sections are more toned-down than others because there's no shared numeric spec — verify by scrolling the full page start-to-finish in one pass and checking translate distances, durations, and stagger values are consistent across sections, and that no dead/orphaned `ScrollTrigger` instances remain from the cinematic version.
- [ ] **Drawer focus management:** Often missing focus-return-to-trigger on close, or using `aria-hidden` instead of `inert` for background content — verify by tabbing through the page with the drawer open (confirm background is unreachable) and confirming focus lands back on the trigger button after close.
- [ ] **Drawer + Lenis scroll-lock:** Often missing `lenis.stop()`/`lenis.start()` wiring, relying on ineffective native `overflow:hidden` — verify background page cannot be scrolled (via wheel/trackpad) while the drawer is open.
- [ ] **Sticky header under stress:** Often works in a short dev-mode page but breaks once real content length, the carousel, and the drawer are all present — verify with a fast scroll-flick test, and again with the drawer open/closed and the carousel present on the same page.
- [ ] **Carousel keyboard/touch parity:** Often swipe/drag-only — verify arrow-key navigation and visible prev/next button controls work identically to touch, and that any auto-advance has a visible pause control and respects `prefers-reduced-motion`.
- [ ] **Brochure download in production build:** Often works in `npm run dev` but not verified against `npm run build && npm start` — verify the download attribute triggers an actual file save (not an inline preview) after a production build.
- [ ] **`overflow-x` audit:** Often a horizontal-scrollbar fix is added late (once the carousel or drawer introduces overflow) using `overflow-x: hidden` on `html`/`body`, silently breaking the sticky header — verify no such rule exists on document-level elements; use `overflow-x: clip` if needed at all.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|------------------|
| Contrast failures discovered late across many already-built sections | MEDIUM | Since the fix is token-level (adjust the shared accent/text/muted tokens' lightness values), a centralized token correction propagates to all sections automatically if components were built token-first (Pitfall 1 prevention); cost rises sharply if literals were hard-coded per component instead |
| Sticky header discovered broken after the carousel/drawer are already built | LOW-MEDIUM | Root-cause is almost always a single `overflow-x: hidden` rule or a transformed ancestor — search globally for `overflow-x: hidden` and any GSAP-animated ancestor of the header first, before assuming the fix requires rearchitecting the header itself |
| Drawer accessibility gaps found late (missing `inert`, missing focus-return) via an audit/user report | LOW-MEDIUM | Centralized if the drawer is a single reusable component (as planned — one drawer component reused for all 5 services) — fixing the shared component fixes every instance at once; cost rises only if drawer markup/behavior was duplicated per service instead of componentized |
| Half-migrated "moderate" animation inconsistency discovered late (some sections still cinematic-feeling) | MEDIUM-HIGH | Requires revisiting each section's specific timeline values against the shared spec (Pitfall 3) — cost scales with how many sections were built before the spec was defined, reinforcing why the spec should be established first, not discovered retroactively |
| Carousel/Lenis/GSAP ticker desync discovered after ship | LOW-MEDIUM | Usually isolated to the carousel component's own transition code — replacing its internal transition driver with the existing GSAP-ticker-driven approach does not require touching unrelated sections, provided the carousel is scoped as a single component |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Leftover dark-theme literals in shared components (P1) | Foundational re-theme/tokenization phase, before section content rework | Codebase grep for `rgba(`/blend-mode/`filter:` literals shows zero unreviewed hits; full-page scroll-through visual QA finds no "muddy" or washed-out elements |
| WCAG contrast regressions from naive light re-theme (P2) | Foundational re-theme phase, with an explicit contrast-audit gate before phase completion; re-verified per section as real content lands | Lighthouse/axe color-contrast rule passes on every page/section with real (not placeholder) copy |
| Half-migrated "moderate" animation inconsistency + dead cinematic code (P3) | Foundational "moderate motion spec" phase (define constants) + each section-migration phase (delete-and-rebuild, not tune-in-place) | Full-page scroll-through feels consistent across sections; `ScrollTrigger.getAll()` count matches only the expected active set, no orphaned instances |
| Drawer focus trap gaps (`aria-hidden` vs `inert`, missing focus-return) (P4) | Drawer implementation phase (first instance, since component is reused 5x) | Tab through the page with drawer open — background unreachable; focus returns to trigger on close; screen-reader swipe navigation also blocked from background content |
| Drawer scroll-lock vs. Lenis, and `overflow-x` sticky-breaking (P5, shared root cause with P8) | Drawer implementation phase for scroll-lock; sticky-header phase for the `overflow-x`/containing-block half | Background page unscrollable while drawer open (verified via `lenis.stop()`); sticky header verified still sticky with drawer open and closed |
| Carousel keyboard/touch/ARIA/auto-advance gaps (P6) | Carousel implementation phase | Keyboard-only pass navigates the full carousel; DevTools reduced-motion emulation shows no auto-transition; visible pause control present if auto-advance exists |
| Carousel library ticker competing with Lenis/GSAP (P7) | Carousel implementation phase (library selection decision made explicitly, before content is built out) | Flick-scroll the page then immediately drag the carousel — no visible desync/jank versus isolated carousel testing |
| Sticky header breaking under Lenis (transform/`overflow-x` containing-block issues) (P8) | Sticky header phase, sequenced after or alongside drawer/carousel phases (not before), with explicit stress testing | Fast scroll-flick test, drawer-open/closed test, and carousel-present test all show header remains sticky |
| PDF brochure download failing (cross-origin `download` attribute, missing `Content-Disposition`, dev-vs-prod discrepancy) (P9) | Late, self-contained brochure phase | `npm run build && npm start` verified download actually saves the file (not inline preview) |

## Sources

- [darkroomengineering/lenis (GitHub) — Smooth scroll as it should be](https://github.com/darkroomengineering/lenis) — MEDIUM confidence
- [Lenis + Next.js: smooth scroll without breaking sticky — Krishna Adhikari](https://krishna-adhikari.com.np/blogs/lenis-nextjs-smooth-scroll) — MEDIUM confidence
- [Sticky Sections with lenis smoothscroll — GSAP forums](https://gsap.com/community/forums/topic/43000-sticky-sections-with-lenis-smoothscroll/) — MEDIUM confidence
- [How to stop scroll on modal pop-up & keep smooth scroll active? — darkroomengineering/lenis Discussion #292](https://github.com/darkroomengineering/lenis/discussions/292) — MEDIUM confidence
- [Add function to prevent scroll — darkroomengineering/lenis Issue #334](https://github.com/darkroomengineering/lenis/issues/334) — MEDIUM confidence
- [Fix FinSweet Disable Scroll Not Working with Lenis in Webflow — Blankboard Studio](https://www.blankboard.studio/originals/blog/fix-finsweet-disable-scroll-lenis) — MEDIUM confidence
- [Dark Mode and Theme Customization: Technical Implementation Guide — NGD Technolab](https://ngendevtech.com/blogs/dark-mode-and-theme-customization-technical-implementation-guide/) — MEDIUM confidence
- [Implementing Light/Dark Theme — My Struggles and Tips — DEV Community](https://dev.to/alexandru-ene-dev/implementing-lightdark-theme-my-struggles-and-tips-1aon) — MEDIUM confidence
- [Come to the light-dark() Side — CSS-Tricks](https://css-tricks.com/come-to-the-light-dark-side/) — MEDIUM confidence
- [color-scheme CSS property — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme) — HIGH confidence (official platform documentation)
- [WCAG 2.1/2.2 contrast requirements (1.4.3, 1.4.11) — W3C](https://www.w3.org/WAI/WCAG21/Understanding/) — HIGH confidence (official standards body)
- [Getting Started: Route Handlers — Next.js official docs](https://nextjs.org/docs/app/getting-started/route-handlers) — HIGH confidence (official framework documentation)
- [How to Implement File Download in NextJS using an API Route — GeeksforGeeks](https://www.geeksforgeeks.org/reactjs/how-to-implement-file-download-in-nextjs-using-an-api-route/) — MEDIUM confidence
- [Download a File From App Router API in Next.js — Code Concisely](https://www.codeconcisely.com/posts/nextjs-app-router-api-download-file/) — MEDIUM confidence
- [Anchor download does not start a download — vercel/next.js Issue #66567](https://github.com/vercel/next.js/issues/66567) — MEDIUM confidence
- [TIL: A Link's Download Attribute Won't "Just Work" for Cross-Origin Resources — Alex MacArthur](https://macarthur.me/posts/trigger-cross-origin-download/) — MEDIUM confidence
- [1658877 — `<a download>` does not download the file when a Content-Disposition inline header is returned — Bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1658877) — MEDIUM confidence (browser vendor issue tracker)
- [How to Test and Improve Carousel Accessibility: A Complete Guide — The A11Y Collective](https://www.a11y-collective.com/blog/accessible-carousel/) — MEDIUM confidence
- [A Step-By-Step Guide To Building Accessible Carousels — Smashing Magazine](https://www.smashingmagazine.com/2023/02/guide-building-accessible-carousels/) — MEDIUM confidence
- [Make accessible carousels — Chrome for Developers](https://developer.chrome.com/blog/accessible-carousel) — HIGH confidence (official browser vendor documentation)
- [Carousel Pattern — ARIA Authoring Practices Guide (APG), W3C](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) — HIGH confidence (official standards body pattern reference, referenced via search results context)
- [How to Build Accessible Modals with Focus Traps (2026 Guide) — UXPin](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/) — MEDIUM confidence
- [Managing Focus and Interactivity with the Inert Attribute — OpenReplay Blog](https://blog.openreplay.com/inert-attribute-focus-interactivity/) — MEDIUM confidence
- [aria-hidden elements do not contain focusable elements — Deque University](https://dequeuniversity.com/rules/axe/3.5/aria-hidden-focus) — HIGH confidence (accessibility testing vendor, axe-core rule documentation)
- [Transform and z-index stacking context — GSAP forums](https://gsap.com/community/forums/topic/17523-transform-and-z-index-stacking-context/) — MEDIUM confidence
- [Stacking context — CSS — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context) — HIGH confidence (official platform documentation)
- [Embla Carousel vs Swiper vs Splide 2026 — PkgPulse Guides](https://www.pkgpulse.com/guides/embla-carousel-vs-swiper-vs-splide-2026) — MEDIUM confidence
- [Swiper vs Embla Carousel — Full-Featured vs Headless Slider — SwiperJS official comparison](https://swiperjs.com/compare/swiper-vs-embla-carousel) — MEDIUM confidence (vendor-authored comparison, cross-checked against independent sources)
- [GSAP Animations: From "Cool Effects" to Intentional Motion — DEV Community](https://dev.to/suman_kshetri/gsap-animations-from-cool-effects-to-intentional-motion-4l2d) — MEDIUM confidence
- Project-internal: `.planning/archive/v1.0-dogstudio-superseded/research/PITFALLS.md` (foundational Lenis+GSAP scroll-engine pitfalls — still valid, built upon rather than re-derived) — HIGH confidence (first-party project research)
- Project-internal: `.planning/PROJECT.md` (brief requirements: light palette, moderate animation, drawer/carousel/sticky-header/brochure patterns, explicit visual vetoes) — HIGH confidence (first-party project source of truth)

---
*Pitfalls research for: Dark-to-light visual pivot + drawer/carousel/sticky-header/brochure features (Next.js 16 / React 19 App Router, existing Lenis + GSAP engine)*
*Researched: 2026-07-18*
