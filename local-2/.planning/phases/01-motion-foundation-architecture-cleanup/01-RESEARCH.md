# Phase 1: Motion Foundation & Architecture Cleanup - Research

**Researched:** 2026-07-18
**Domain:** Codebase-specific decomposition of `components/experience.tsx` + GSAP/Lenis foundational wiring, on top of already-established project-level research (`.planning/research/STACK.md`, `ARCHITECTURE.md`, `PITFALLS.md`)
**Confidence:** HIGH (stack/versions verified against npm registry today; architecture findings verified by direct read of `components/experience.tsx`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01 (Legacy file handling):** `landing-page-v4.html`, `lib/v4-template.ts`, and `components/v4-interactions.tsx` are moved to the repo-root `referencias/` folder (already the designated home for prior HTML designs and original resources, per the top-level `README.md`) before being removed from `local-2/`. Not a direct delete — preserve as a backup outside the active codebase.
- **D-02 (Verification cadence):** Verify once at the end of the complete Phase 1 (not after each sub-step). Run `npm run lint`, `npm run typecheck`, `npm run build`, and a full visual review only after all of Phase 1's work is done — consistent with the project's YOLO workflow mode.
- **D-03 (Contact form testing):** No `.env.local` exists in this environment, so a real Supabase submission cannot be tested. Verification for FOUND-01/ARCH-01 in this phase is code-level: confirm the build succeeds, the form's markup and `onSubmit` handler live in the same component (no `FormConnector`), and the request payload/schema match what `app/api/contact/route.ts` expects. A live submission test is out of scope for this phase.

### Claude's Discretion

- Exact component boundary names/file names for the decomposed sections (`HeroSection`, `ManifestoSection`, etc.) — follow the pattern already established in `research/ARCHITECTURE.md`.
- Internal structure of `lib/gsap.ts` / `SmoothScrollProvider` — implementation detail already well-specified by `research/STACK.md` and `research/ARCHITECTURE.md`.
- Order of sub-steps within Phase 1 (e.g., wiring the scroll engine before or after decomposing components) — technical sequencing call, not a user-facing decision. **This research provides a concrete recommended sequence — see "Recommended Build Order" below.**

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope. Phase 2's GSAP-native reveal/parallax/cursor/typography work (MOTION-01..05) and later phases remain untouched by this discussion and by this phase's implementation.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Physically smooth scroll (Lenis) synced to a single `requestAnimationFrame` loop with GSAP's ticker — no desync/jitter | See "SmoothScrollProvider — exact wiring" and "Recommended Build Order" step B. Concrete pitfall found: the app's *existing* `experience.tsx` rAF parallax loop must stop running before/at the same moment `SmoothScrollProvider` starts its loop, or two competing loops run simultaneously — see "Pitfall P1-local: transient dual-rAF window." |
| FOUND-02 | `prefers-reduced-motion` disables/softens the whole motion engine (Lenis + all GSAP animations), not just CSS, via `gsap.matchMedia()` | See "Reduced-Motion Gate — Phase 1 concrete scope" — clarifies that in Phase 1 this requirement's *only* concrete deliverable is the Lenis `lerp` softening (0.07 → 0.15), because no GSAP timelines exist yet to gate (reveal/parallax stay vanilla until Phase 2). Locked values from `01-UI-SPEC.md`. |
| FOUND-03 | `npm run build` passes clean, GSAP/Lenis initialized only at the client boundary (no SSR/hydration errors) | See "Import Hygiene Constraint" — `lib/gsap.ts` / `lib/motion-preferences.ts` must never be imported by `app/page.tsx` (a server component) or any other non-`"use client"` file. |
| ARCH-01 | Contact form markup + `onSubmit` handler live in the same component (no `FormConnector`, no `querySelector` coupling) | See "Sub-step A: ContactForm extraction" — includes a codebase-specific finding not in project-level research: a dead `<form className="form-event-bridge">` decoy element (CSS: `display:none`) must also be deleted, not just `FormConnector`. |
| ARCH-02 | `components/experience.tsx` decomposed into per-section components, each with its own `useGSAP` scope | See "Component Decomposition Map" — exact new file list mapped to exact current line ranges, plus resolution of an ambiguity between `01-UI-SPEC.md`'s "each section owns a `useGSAP({scope})` call" and `01-CONTEXT.md`'s "reveal/parallax stay vanilla this phase" (see "Reconciling ARCH-02 with vanilla reveal/parallax"). Also documents a mobile-perf-relevant finding: parallax and cursor must **not** be duplicated per-section (would multiply rAF loops / event listeners), and a DOM-positioning risk for the `video-toggle` button. |
| ARCH-03 | Delete `landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx` (unused legacy files) | See "Package Legitimacy Audit" is N/A here (no npm packages), but "ARCH-03 verification" confirms via `grep` (already run in this research session) that none of the three files are imported anywhere in `app/` or `components/` — safe to move to `referencias/` per D-01. |

</phase_requirements>

## Summary

This phase has two independent tracks that can be built in parallel and one track that depends on both finishing first. Track 1 (`FOUND-01/02/03`) installs `gsap` + `lenis` + `@gsap/react` and wires a single `SmoothScrollProvider` client component into `app/layout.tsx`. Track 2 (`ARCH-01`) extracts the contact form into its own component, killing both `FormConnector` *and* a previously-undocumented dead decoy `<form className="form-event-bridge">` element. Track 3 (`ARCH-02`, depends on Track 1 for `useGSAP`/`lib/gsap.ts` to exist) decomposes `components/experience.tsx` (216 lines, 5 concerns) into ~7 new files under `components/` and 1-2 new files under `hooks/`. `ARCH-03` (legacy file removal) is fully independent and was verified in this research session via `grep` — none of the three legacy files are imported anywhere in `app/` or `components/`, so deletion (after the D-01 move to `../referencias/`) is safe.

**Primary recommendation:** Do the `ContactForm` extraction (Track 2) first — it's the smallest, most isolated change. Then wire `SmoothScrollProvider` (Track 1) but do **not** mount it in `app/layout.tsx` until the same step that removes `experience.tsx`'s private parallax `requestAnimationFrame` loop — mounting the provider earlier creates two simultaneous frame loops (a real, verified pitfall specific to this codebase, not just a generic warning). Do the legacy-file move/delete (`ARCH-03`) any time, independently.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Lenis smooth-scroll instance + GSAP ticker sync | Browser / Client | — | Must run in a `"use client"` component; owns the single rAF loop for the whole page (FOUND-01) |
| `prefers-reduced-motion` gate (Lenis lerp switch) | Browser / Client | — | `gsap.matchMedia()` is a browser-only API; evaluated once at provider mount, live-updates on OS toggle |
| Contact form markup + submit handler | Browser / Client (form owner) | API / Backend (`/api/contact`) | Client owns UX (validation feedback, disabled state); server (`app/api/contact/route.ts`, unchanged) owns authoritative validation + persistence |
| Contact form validation | Browser / Client (informational) | API / Backend (authoritative) | `lib/contact-schema.ts` (Zod) already shared correctly client/server — unaffected by this phase |
| Section reveal-on-scroll (`[data-reveal]`) | Browser / Client | — | IntersectionObserver is browser-only; stays vanilla this phase (GSAP-native migration is Phase 2, MOTION-01) |
| Legacy parallax (`[data-parallax]`) | Browser / Client | — | Currently a single global rAF loop; must remain single/shared during decomposition, not duplicated per section (see Pitfall below) |
| Custom cursor | Browser / Client | — | Global pointermove listener + event-delegated targets across the whole document; stays one component, not per-section |
| Menu overlay + header | Browser / Client | — | `position: fixed` chrome, independent of scroll/section DOM nesting |
| Static page composition (sections, copy, images) | Frontend Server (SSR/SSG) | — | `app/page.tsx` stays a server component (`force-static`); only imports/composes client section components |
| Legacy v4 file removal | Build / Static (dev-time only) | — | Not a runtime concern — verified unreferenced by any runtime import path |

## Standard Stack

Already fully specified in `.planning/research/STACK.md` (HIGH confidence, cross-verified against official GSAP/Lenis docs). Re-verified in this session against the live npm registry — **no drift** since that research was written (same date):

| Library | Version (npm registry, verified 2026-07-18) | Notes |
|---------|---------|-------|
| `gsap` | `3.15.0` | Confirmed current via `npm view gsap version` |
| `lenis` | `1.3.25` | Confirmed current via `npm view lenis version` |
| `@gsap/react` | `2.1.2` | Confirmed current via `npm view @gsap/react version` |

**Installation** (this phase, exact command):
```bash
npm install gsap lenis @gsap/react
```
No `next.config.ts` changes needed speculatively — current `next.config.ts` is a single-line `poweredByHeader: false` config with no `transpilePackages`. Per STACK.md, only add `transpilePackages: ['gsap']` if a real build failure occurs (don't add it preemptively).

This phase does **not** need `lenis/react`'s `<ReactLenis>`/`useLenis()` exports for FOUND-01/02/03 strictly — `ARCHITECTURE.md`'s Pattern 1 uses `<ReactLenis root>`, which is the recommended approach and is adopted here. `useLenis()` becomes relevant for `MenuOverlay`'s scroll-lock (`.stop()`/`.start()`), which is in-scope for `ARCH-02`'s decomposition since `MenuOverlay` is one of the extracted components (see below).

## Package Legitimacy Audit

| Package | Registry | Age (last publish) | Weekly Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `gsap` | npm | 2026-04-13 | 3,696,603 | github.com/greensock/GSAP | OK | Approved |
| `@gsap/react` | npm | 2025-01-15 | 996,080 | github.com/greensock/react | OK | Approved |
| `lenis` | npm | 2026-06-26 | 1,017,336 | github.com/darkroomengineering/lenis | **SUS** | Flagged — see below |

**`lenis` verdict detail:** `gsd-tools query package-legitimacy check` flags `lenis` as `SUS` with reason `"too-new"` — this reflects the *publish timestamp of the latest version* (`1.3.25`, published 2026-06-26, ~3 weeks before this research date), not the package's actual age or legitimacy. Cross-checked signals: 1,017,336 weekly downloads, official `darkroomengineering/lenis` GitHub repo (the same maintainer org referenced as the canonical source throughout `.planning/research/STACK.md` and `ARCHITECTURE.md`), not deprecated, no suspicious `postinstall` script. This reads as a frequently-updated, high-adoption, legitimate package whose freshness signal alone triggered the heuristic — **not** evidence of a supply-chain risk. Per the Package Legitimacy Gate protocol, it must still be treated as `SUS` procedurally: **the plan must include a `checkpoint:human-verify` task before `npm install lenis`**, even though the underlying signals (downloads, repo, no postinstall) are reassuring.

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `lenis` — planner must add `checkpoint:human-verify` before install (recommend: user visually confirms `github.com/darkroomengineering/lenis` is the intended package before `npm install` runs, given the high download count makes this almost certainly a false positive, but the gate is procedural).

## Architecture Patterns

### System Architecture Diagram (Phase 1 end-state)

```
┌────────────────────────────────────────────────────────────────────┐
│ app/layout.tsx (Server Component)                                  │
│  - fonts, <html>/<body>, metadata (unchanged)                      │
│  - wraps {children} in <SmoothScrollProvider>                      │
├───────────────────────────┬──────────────────────────────────────┤
│ components/providers/smooth-scroll-provider.tsx  ("use client")    │
│  - <ReactLenis root> instance, autoRaf:false, lerp 0.07/0.15       │
│  - gsap.ticker drives lenis.raf(); lenis.on('scroll', ST.update)   │
│  - imports lib/gsap.ts (plugin registration) + lib/motion-         │
│    preferences.ts (matchMedia lerp gate)                           │
│  - hosts the ONE surviving legacy parallax rAF loop (temporary,    │
│    replaced by ScrollTrigger scrub in Phase 2 / MOTION-02)         │
├──────────────────────────────────────────────────────────────────┤
│ app/page.tsx (Server Component, force-static) — composition only   │
│                                                                      │
│  <IntroSequence/>  <MenuOverlay/>  <CustomCursor/>   (global chrome,│
│   each "use client", position:fixed, independent of section DOM)   │
│                                                                      │
│  <main>                                                             │
│   <HeroSection/> → <section class="hero">…</section> +             │
│                     sibling <button class="video-toggle">           │
│                     (NOT nested inside <section>, see Pitfall)      │
│   <ManifestoSection/>  <CapabilitiesSection/>  <TechnologySection/> │
│   <ProcessSection/>  <ContactSection/> → renders <ContactForm/>     │
│  </main>                                                            │
│  <Footer/> (static, no interactivity — no extraction required)      │
└──────────────────────────────────────────────────────────────────┘
               ▼ (ContactForm submit, unchanged contract)
  fetch POST /api/contact → Zod safeParse (server) → Supabase insert
```

### Component Decomposition Map

Exact mapping from current `components/experience.tsx` / `app/page.tsx` code to new files. This is the concrete artifact the project-level `ARCHITECTURE.md` deliberately left abstract ("Claude's Discretion" on exact names) — resolved here against the *actual* code.

| New file | Extracted from | Exact source lines | Owns |
|----------|-----------------|---------------------|------|
| `lib/gsap.ts` | new | — | `gsap.registerPlugin(ScrollTrigger, useGSAP)` at module scope; re-exports `gsap`, `ScrollTrigger`, `useGSAP` |
| `lib/motion-preferences.ts` | new | — | `gsap.matchMedia()` scaffold exposing a `reduceMotion` condition; exports the locked Lenis lerp pair `{ normal: 0.07, reduced: 0.15 }` from `01-UI-SPEC.md` |
| `components/providers/smooth-scroll-provider.tsx` | new | — | Single `<ReactLenis root>`, ticker sync, `ScrollTrigger.refresh()` on mount, hosts the surviving legacy parallax shim (see below) |
| `hooks/use-legacy-parallax.ts` | `experience.tsx` lines 34-52 (minus the `--scroll-y` line, minus the reveal/cursor code interleaved in the same effect) | 34-52 | The **exact unchanged** `[data-parallax]` rAF loop + `--scroll-y` CSS var update — called **once**, not per-section (see Pitfall) |
| `components/intro-sequence.tsx` | `experience.tsx` lines 10-12 (intro timer, `introDone` state) + JSX lines 150-154 | 10-12, 150-154 | `introDone` state, 1450ms/100ms (reduced-motion) timer |
| `components/menu-overlay.tsx` | `experience.tsx` lines 6, 89-94, 156-185 (header JSX + overlay JSX + `menuOpen` state + `navigate`) | 6, 89-94, 156-185 | `menuOpen` state, header brand + toggle button, overlay panel + nav links — kept as **one** component because header toggle and overlay nav links both read/write the same `menuOpen` state (avoids prop-drilling/context for a 2-file split) |
| `components/custom-cursor.tsx` | `experience.tsx` lines 54-73 + JSX line 187 | 54-73, 187 | `pointermove`/`pointerenter`/`pointerleave` global listener + `[data-cursor]` delegation — one component, not per-section (targets span multiple sections: hero circle-link, service-rows, statement visual) |
| `components/sections/hero-section.tsx` | `page.tsx` lines 55-110 (hero markup) + `experience.tsx` lines 13, 15-18, 96-110, 189-197 (video ref/toggle) | see above | Hero markup **and** `toggleVideo`/`videoPlaying` state **and** the `video-toggle` button, using a `useRef<HTMLVideoElement>` instead of `document.querySelector("#hero-video")` — see "Video-toggle DOM-positioning pitfall" below for why the button must render as a JSX **sibling** of `<section className="hero">`, not nested inside it |
| `components/sections/manifesto-section.tsx` | `page.tsx` lines 112-142 | 112-142 | "statement"/`#nosotros` markup, own reveal scope |
| `components/sections/capabilities-section.tsx` | `page.tsx` lines 144-172 (incl. moving-band) | 144-172 | "capabilities"/`#capacidades` markup + moving-band, own reveal scope |
| `components/sections/technology-section.tsx` | `page.tsx` lines 174-196 | 174-196 | "technology"/`#tecnologia` markup, own reveal scope, contains the *second* `[data-parallax]` element (`tech-media`) — still served by the single shared `use-legacy-parallax` hook, not a local one |
| `components/sections/process-section.tsx` | `page.tsx` lines 198-230 | 198-230 | "process-section"/`#proceso` markup, own reveal scope |
| `components/sections/contact-section.tsx` | `page.tsx` lines 232-247 (copy) | 232-247 | Contact copy + renders `<ContactForm />` (from Track 2) |
| `components/contact-form.tsx` | `experience.tsx` lines 112-146 (`submitForm`) + `page.tsx` lines 249-268 (form markup) | see ARCH-01 section below | Form markup + `onSubmit` in one component |
| `components/experience.tsx` | — | — | **Deleted** once all of the above are extracted (matches project `ARCHITECTURE.md` Anti-Pattern 2 guidance) |

Each `sections/*.tsx` file wraps its existing markup in `useGSAP(() => { /* vanilla [data-reveal] IntersectionObserver, scoped to root.current.querySelectorAll(...) instead of document.querySelectorAll(...) */ }, { scope: root })` — see "Reconciling ARCH-02 with vanilla reveal/parallax" below for why this satisfies both the UI-SPEC's literal "own `useGSAP({scope})` call" requirement and the CONTEXT.md constraint that reveal/parallax behavior stays functionally unchanged this phase.

### Reconciling ARCH-02 with vanilla reveal/parallax (resolved ambiguity)

`01-UI-SPEC.md`'s "Component Decomposition Contract" states each section "becomes its own `"use client"` component with its own `useGSAP({ scope })` call." Read literally alongside `.planning/research/ARCHITECTURE.md`'s Pattern 2 example (which shows `useGSAP` wrapping a **new** `gsap.from()` tween), this could be misread as requiring GSAP-native reveal animations in Phase 1. That directly contradicts `01-CONTEXT.md`'s explicit constraint: *"Current reveal system uses `[data-reveal]` + IntersectionObserver — this phase does NOT replace it yet (that's Phase 2, MOTION-01)."*

**Resolution (verified as technically sound):** `useGSAP()` from `@gsap/react` is a StrictMode-safe drop-in replacement for `useEffect`/`useLayoutEffect` — it does **not** require the code inside it to call any `gsap.*` API. Each section's `useGSAP(() => { ...exact current IntersectionObserver setup, scoped to root... return cleanup }, { scope: root })` call:
1. Satisfies UI-SPEC's literal requirement (every section has its own scoped `useGSAP` call).
2. Keeps the reveal behavior **byte-identical** to today (same `threshold: 0.12`, `rootMargin: "0px 0px -8% 0px"`, same `.is-visible` class toggle) — satisfying CONTEXT.md's "not replaced yet" constraint and the UI-SPEC's separate "Visual Regression Contract" (zero visual change).
3. Sets up the exact scaffold Phase 2 (MOTION-01) will reuse — Phase 2 can swap the vanilla `IntersectionObserver` body for `gsap.from(...)`/`ScrollTrigger` calls **inside the same `useGSAP` callback** without restructuring component boundaries or scope refs.

**Flag for the plan:** state this reconciliation explicitly in the plan's ARCH-02 task description so the executor doesn't accidentally "over-deliver" GSAP-native reveal animations in Phase 1 (which would violate the phase's explicit non-goal and the UI-SPEC's zero-visual-change gate simultaneously, since new easing/timing would look different even if subtly).

### Pitfall (codebase-specific): Parallax/cursor must not be duplicated per-section

Naively applying "each section owns its own scope" to `[data-parallax]` and `[data-cursor]` would be wrong, because — unlike `[data-reveal]` (which is genuinely per-section-scoped today, just via one shared observer) — the current parallax and cursor systems are **inherently cross-section, single-instance** systems:
- Parallax (`experience.tsx` lines 34-52) touches `document.documentElement` (`--scroll-y`) globally and loops over **all** `[data-parallax]` elements in one `requestAnimationFrame` call — these live in **two different sections** (`hero-media` in Hero, `tech-media` in Technology).
- Cursor (`experience.tsx` lines 54-73) attaches **one** `pointermove` listener to `window` and delegates via `[data-cursor]` targets that span the hero circle-link, every `service-row` (Capabilities section), and the statement visual (Manifesto section).

If each section component independently re-created its own IntersectionObserver-style "own copy" of the parallax rAF loop, the result would be **N competing `requestAnimationFrame` loops** (N = number of sections with a `[data-parallax]` descendant, or worse, all 6 if copy-pasted uncritically) — this is precisely the "two competing rAF loops" failure mode `.planning/research/PITFALLS.md` Pitfall 4 and Pitfall 7 warn about, self-inflicted by an over-literal reading of "decompose into per-section components." **Concrete guidance:** `use-legacy-parallax.ts` and `CustomCursor` must each be instantiated exactly **once** (parallax: inside `SmoothScrollProvider`; cursor: as its own top-level global-chrome component), never inside a per-section `useGSAP` call.

### Video-toggle DOM-positioning pitfall (codebase-specific, verified via CSS)

`components/experience.tsx` renders `<button className="video-toggle">` (lines 189-197) as a JSX sibling of the intro/header/cursor block — **not** nested inside `<section className="hero">`, which is rendered separately by `app/page.tsx`. Verified via `app/globals.css`:
- `.video-toggle { position: absolute; right: 2rem; top: calc(100svh - 7.4rem); z-index: 12; ... }` — **not** `position: fixed`.
- `.hero { position: relative; min-height: 100svh; ... }` — hero **is** a positioned ancestor.

Because `.video-toggle` currently renders *outside* `.hero`'s DOM subtree, its `position: absolute` resolves against the page's root positioned/containing-block context (effectively the same origin as `.hero`'s own top edge, since nothing above `.hero` in the current DOM tree is positioned and pushes it down). **If the extraction naively nests the button inside `<section className="hero">` in the new `HeroSection` component, the button's containing block changes to `.hero` itself** — in this specific case the visual result is very likely still identical (both resolve to the same origin coordinates, since `.hero` starts at the page's top edge with no offset), but this is exactly the kind of "probably fine" CSS reasoning that a manual visual QA pass (already required by D-02/UI-SPEC's Visual Regression Contract) should explicitly re-verify rather than assume. **Concrete recommendation:** have `HeroSection` return a `<>` fragment containing `<section className="hero">...</section>` **and** `<button className="video-toggle">` as **siblings** (matching today's DOM relationship exactly), both owned by the same component (so `toggleVideo`/`videoPlaying` state and the video `ref` can be shared without a `document.querySelector`), rather than nesting the button inside the `<section>`. This preserves the exact current DOM structure while still fixing the `document.querySelector("#hero-video")` coupling (replace with `useRef<HTMLVideoElement>`).

### Sub-step A: ContactForm extraction (ARCH-01) — includes a finding not in project-level research

`.planning/research/ARCHITECTURE.md` Pattern 4 documents the `FormConnector` fix but does not mention a second, dead artifact discovered in this session: `components/experience.tsx` lines 199-201 render a **second, hidden form**:
```tsx
<form className="form-event-bridge" onSubmit={submitForm} aria-hidden="true">
  <button type="submit" tabIndex={-1}>Enviar</button>
</form>
```
Verified via `app/globals.css`: `.form-event-bridge { display: none }`. This form has no input fields, is `display:none`, and its submit button is `tabIndex={-1}` and `aria-hidden` — it is unreachable by any user interaction and functionally dead code. It appears to be a vestigial artifact from an earlier iteration of the form-wiring pattern (properly wiring `onSubmit` directly on a form, before the codebase switched to the fragile `FormConnector` DOM-query approach for the *real* visible form). **Concrete instruction for the plan:** when extracting `ContactForm`, delete **both** the `FormConnector` function (lines 207-216) **and** the `.form-event-bridge` `<form>` block (lines 199-201) **and** its CSS rule (`app/globals.css`, `.form-event-bridge{display:none}`) — not just `FormConnector` alone. Leaving the dead form/CSS in place would not break anything functionally, but it directly contradicts the spirit of ARCH-01 (single source of truth for the form) and would be confusing debt left behind by an incomplete cleanup.

New `components/contact-form.tsx` re-implements `submitForm` (lines 112-146) as a local `handleSubmit`, reading `FormData` from `event.currentTarget` exactly as today (no behavior change — same fetch call, same status states, same error message fallback text, same `contactSchema` import — unchanged, matches Copywriting Contract in `01-UI-SPEC.md`). `app/page.tsx` lines 249-268 (the `<form className="contact-form" id="contact-form" data-reveal noValidate>...</form>` block) get replaced with `<ContactForm />`; the `id="contact-form"` attribute can be dropped entirely (no longer needed once there's no `querySelector` coupling) but `data-reveal` must be preserved on `ContactForm`'s root `<form>` element so it's still picked up by the reveal system, regardless of whether this sub-step lands before or after the full section decomposition (Track 3).

### Import Hygiene Constraint (FOUND-03 — SSR/hydration safety)

Per `.planning/research/PITFALLS.md` Pitfall 6, `lib/gsap.ts` and `lib/motion-preferences.ts` (both calling `gsap.registerPlugin(...)`/`gsap.matchMedia(...)` at module scope or component-mount time) must **never** be imported by a file that isn't itself `"use client"` or transitively only reachable from client components. Verified: `app/page.tsx` is currently a server component (`export const dynamic = "force-static"`, no `"use client"` directive) that directly imports `{ Experience }` from `components/experience.tsx` (which **is** `"use client"`) — this existing pattern (server component imports a client component, never the reverse) is exactly right and must be preserved for every new section component. **Concrete verification for the plan:** after decomposition, `app/page.tsx` should only import from `components/sections/*`, `components/menu-overlay`, `components/custom-cursor`, `components/intro-sequence`, and `components/contact-form` (all `"use client"`) — it must never import `lib/gsap.ts` or `lib/motion-preferences.ts` directly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lenis + GSAP frame-loop sync | A custom `requestAnimationFrame` bridge | `gsap.ticker.add((t) => lenis.raf(t * 1000))` + `autoRaf: false` (per `STACK.md`) | Exact wiring is non-obvious (ms/seconds conversion, `lagSmoothing(0)`) and already fully specified — reinventing it risks the desync bug this phase exists to prevent |
| StrictMode-safe GSAP cleanup | Manual `ScrollTrigger.getAll().forEach(t => t.kill())` in `useEffect` cleanup | `useGSAP()` from `@gsap/react` | Already installed as a direct dependency this phase; hand-rolling this is explicitly the anti-pattern `PITFALLS.md` Pitfall 1 warns against |
| Reduced-motion detection | A second, separate `window.matchMedia("(prefers-reduced-motion: reduce)")` check duplicated in `lib/motion-preferences.ts` and reused unchanged in the (still vanilla, unchanged) per-section reveal/parallax code | Two separate mechanisms are **correct** here, not duplication to eliminate: `gsap.matchMedia()` for the new Lenis lerp gate (FOUND-02), and the existing plain `window.matchMedia(...).matches` checks staying exactly as-is inside the relocated (but not rewritten) vanilla reveal/parallax code, since GSAP doesn't own that code yet | Keep both mechanisms because Phase 1 is explicitly not migrating reveal/parallax to GSAP; introducing `gsap.matchMedia()` into vanilla IntersectionObserver code would be scope creep beyond FOUND-02's Phase-1-concrete deliverable |
| Contact form validation | A second Zod schema or hand-rolled field validation inside `ContactForm` | `lib/contact-schema.ts` (unchanged, already correct, shared client/server) | Explicitly called out as a reusable asset in `01-CONTEXT.md`'s Code Context section |

**Key insight:** Every "don't hand-roll" item in this phase already has a project-approved answer (`.planning/research/STACK.md`/`ARCHITECTURE.md`) or an existing correct asset in the codebase (`lib/contact-schema.ts`, `app/api/contact/route.ts`). This phase's actual engineering risk is not *which library to use* — it's *not breaking existing behavior while relocating code across file boundaries*, which is why this research focuses on exact line-level extraction mapping rather than re-litigating stack choices.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no database/collection/user-id keyed by any file or component name being changed in this phase. Supabase table `contact_requests` (schema, column names) is completely unaffected — verified via `app/api/contact/route.ts`, unchanged this phase. | None |
| Live service config | None — no external service (Supabase project config, deployment config) references `experience.tsx`, `FormConnector`, or the v4 file names by string. `vercel.json` / `scripts/block-vercel-deploy.mjs` are unrelated to this phase's file renames and stay untouched (deploy remains blocked per project constraints). | None |
| OS-registered state | None — this is a local Next.js dev environment with no Task Scheduler/pm2/systemd/launchd registrations tied to any of the renamed/removed files. | None |
| Secrets/env vars | None — `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` are unrelated to the component/file renames in this phase. Verified: no `.env.local` exists locally (only `.env.example`), consistent with D-03. | None |
| Build artifacts | **Found:** `tsconfig.tsbuildinfo` (129,719 bytes, present at repo root, incremental TypeScript build cache) and `.next/` (build output directory) both currently exist and were generated against the *pre-decomposition* file layout (`components/experience.tsx` as a single file). | Recommend deleting `.next/` and `tsconfig.tsbuildinfo` (or running a clean `npm run build`/`npm run typecheck` that regenerates them) as part of this phase's final verification step (D-02), so stale incremental-build state doesn't mask a real error or produce misleading cache-based results after the file-structure change. Not a functional blocker — Next.js/tsc regenerate these automatically — but worth an explicit note in the plan's verification task. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| npm registry access | `npm install gsap lenis @gsap/react` | ✓ | — | — (verified reachable this session via `npm view`) |
| Node.js | Next.js build/dev | ✓ | v24.16.0 | — |
| npm | package management | ✓ | 11.13.0 | — |
| `.env.local` (Supabase credentials) | Live contact-form submission test | ✗ | — | Code-level verification only for this phase, per D-03 — no fallback needed since live submission testing is explicitly out of scope for Phase 1 |

**Missing dependencies with no fallback:** none blocking this phase's actual deliverables.
**Missing dependencies with fallback:** `.env.local` — covered by D-03 (code-level verification substitutes for live testing this phase).

## Common Pitfalls

(Full project-level pitfall catalogue already exists in `.planning/research/PITFALLS.md` — HIGH/MEDIUM confidence, 7 pitfalls fully documented with warning signs and recovery strategies. Do not duplicate here. This section lists only pitfalls discovered in *this* session that are specific to the actual current code, not present in the project-level document.)

### Pitfall (new): Transient dual-rAF window during mid-refactor

**What goes wrong:** If `<SmoothScrollProvider>` is mounted in `app/layout.tsx` (starting the new Lenis+`gsap.ticker` frame loop) *before* `components/experience.tsx`'s own private parallax `requestAnimationFrame` loop (lines 34-52) has been extracted/removed, the page briefly runs two independent frame loops simultaneously — the exact class of bug FOUND-01 exists to prevent, self-inflicted mid-refactor rather than by a missing integration step.

**Why it happens:** `01-CONTEXT.md`'s "Claude's Discretion" note explicitly allows either build order (scroll engine before or after decomposition) — but the two orders are not equally safe. Wiring the provider first, independently, is tempting because it's the "foundation" step per `ARCHITECTURE.md`'s general build-order guidance — but that guidance was written assuming a green-field addition, not an already-live rAF loop that needs simultaneous removal.

**How to avoid:** Sequence so that mounting `<SmoothScrollProvider>` in `app/layout.tsx` and replacing `experience.tsx`'s private parallax loop with the shared `hooks/use-legacy-parallax.ts` (called once, from inside `SmoothScrollProvider`) happen in the same wave/step — never commit a state where both loops are live. See "Recommended Build Order" below.

**Warning signs:** Visible parallax stutter/double-application on `--scroll-y`/`--parallax` CSS vars (two writers racing) during manual visual QA — a subtle bug that's easy to miss without knowing to look for it, since D-02 defers all verification to phase-end (so it can't be caught by an early smoke test even if a fast scroll-flick check would reveal it).

## Code Examples

Verified patterns already fully specified with working code in `.planning/research/STACK.md` (Integration Pattern section) and `.planning/research/ARCHITECTURE.md` (Patterns 1-5). Not repeated here to avoid drift between two copies of the same code. This phase's plan should reference those files directly for the `SmoothScrollProvider`, `useGSAP`, `gsap.matchMedia()`, and `ContactForm` code samples — combined with the exact line-range mapping and file list in "Component Decomposition Map" above for where that code lands in *this* codebase.

One additional snippet not present in project-level research — the exact shape of the reduced-motion Lenis lerp gate for **this phase's actual scope** (softening only, no GSAP timeline gating yet, per "Reduced-Motion Gate — Phase 1 concrete scope" below):

```tsx
// lib/motion-preferences.ts
import gsap from "./gsap";

export const LENIS_LERP = { normal: 0.07, reduced: 0.15 } as const; // locked, 01-UI-SPEC.md

export function getLenisLerp(): number {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? LENIS_LERP.reduced
    : LENIS_LERP.normal;
}
```
```tsx
// components/providers/smooth-scroll-provider.tsx (excerpt — full pattern in ARCHITECTURE.md Pattern 1)
import { getLenisLerp } from "@/lib/motion-preferences";
// ...
<ReactLenis root ref={lenisRef} options={{ autoRaf: false, syncTouch: true, lerp: getLenisLerp() }}>
```
Note: `gsap.matchMedia()` (the API named in FOUND-02's requirement text) is the *live-updating* mechanism — a one-time `getLenisLerp()` read at mount does not react if the user toggles the OS preference mid-session. Since Lenis's `lerp` option isn't reactively observable the way a GSAP tween is, the concrete Phase 1 implementation should wrap Lenis instance re-creation (or an `options` update, if the Lenis API version supports it) inside a `gsap.matchMedia().add(...)` callback so the live-update guarantee is real, not just present for future GSAP timelines. Flag this as a specific implementation detail for the plan to get right — a naive one-time read technically satisfies "gated by `gsap.matchMedia()`" in name only, not in the live-update behavior the pattern is meant to provide.

## Recommended Build Order

Concrete, codebase-specific sequencing (fulfills `01-CONTEXT.md`'s "Claude's Discretion" note on sub-step ordering). Numbered for reference; the plan may group these into waves/tasks as appropriate, but should preserve the dependency order and the "same-step" constraint on step 3.

1. **ARCH-03 (legacy files) — fully independent, do any time.** Move `landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx` to `../referencias/` (D-01), then delete from `local-2/`. Already verified in this session (via `grep`) that none of the three are imported anywhere in `app/` or `components/` — safe.

2. **ARCH-01 (ContactForm) — independent, do early.** Extract `components/contact-form.tsx`; delete `FormConnector` **and** the dead `.form-event-bridge` form + its CSS rule (see "Sub-step A" above); update `app/page.tsx` to render `<ContactForm />` in place of the raw `<form id="contact-form">` block. Safe to do before or after step 3 since the (still-monolithic-until-step-3) global `[data-reveal]` observer picks up the relocated form's `data-reveal` attribute via `document.querySelectorAll` regardless of which component renders it.

3. **FOUND-01/02/03 + ARCH-02, as one coordinated step (not two separate ones).** This is the step where the dual-rAF pitfall above applies — do these together:
   - Install `gsap`, `lenis`, `@gsap/react` (gate `lenis` install behind the `checkpoint:human-verify` from the Package Legitimacy Audit).
   - Create `lib/gsap.ts`, `lib/motion-preferences.ts`, `hooks/use-legacy-parallax.ts` (unchanged-behavior port of the existing rAF loop).
   - Create `components/providers/smooth-scroll-provider.tsx`, importing the above and calling `use-legacy-parallax` once internally.
   - Extract all remaining `components/experience.tsx` concerns per the "Component Decomposition Map": `intro-sequence.tsx`, `menu-overlay.tsx`, `custom-cursor.tsx`, and all `components/sections/*.tsx` (each with its own scoped, vanilla-behavior-preserving `useGSAP({ scope })` reveal setup, per "Reconciling ARCH-02" above).
   - Delete `components/experience.tsx` entirely.
   - Mount `<SmoothScrollProvider>` in `app/layout.tsx` wrapping `{children}` — **this must land in the same commit/step as removing `experience.tsx`'s private rAF loop**, not before.

4. **Verification (D-02) — once, at the end of all of the above.** `npm run lint`, `npm run typecheck`, `npm run build` (consider clearing `.next/`/`tsconfig.tsbuildinfo` first per "Runtime State Inventory" finding), then manual visual comparison at 1440×900 and 390×844 per `01-UI-SPEC.md`'s Visual Regression Contract — including the video-toggle button's exact on-screen position (flagged above as worth explicit re-verification, not assumption) and in-page anchor-link scrolling behavior now that Lenis is active (existing `html{scroll-behavior:smooth}` in `app/globals.css` line 7 combined with real `href="#section"` anchor links — verify no double-easing/jank; `.planning/research/PITFALLS.md`'s "Lenis + in-page anchor links" gotcha applies concretely here since this site has 7+ real anchor links: header brand, menu nav ×5, hero circle-link, "Volver arriba").

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Moving the `video-toggle` button from "sibling of a naked fragment" to "sibling of `<section className='hero')` inside `HeroSection`" produces an identical visual position, because neither the fragment nor `<main>`/`<body>` introduce a new positioning/containing-block context | Video-toggle DOM-positioning pitfall | Low-medium — if wrong, the button would shift position after decomposition; caught by D-02's mandatory manual visual QA before phase completion, not a silent regression |
| A2 | `gsap.registerPlugin(ScrollTrigger, useGSAP)` at module scope inside `lib/gsap.ts` is safe to execute without an explicit `typeof window !== "undefined"` guard, as long as `lib/gsap.ts` is only ever imported transitively from `"use client"` files | Import Hygiene Constraint | Medium — if a future edit accidentally imports `lib/gsap.ts` from a server component, `npm run build` would fail loudly (per FOUND-03's own gate), so this is self-detecting, not a silent risk |
| A3 | Lenis's `lerp` option needs to be re-applied via `gsap.matchMedia()`-driven instance recreation (or an options update) to satisfy FOUND-02's "live-updating" implication of `gsap.matchMedia()`, rather than a one-time `getLenisLerp()` read at mount | Code Examples section | Low — if a one-time read is used instead, the OS-level reduced-motion toggle would only take effect on next page load, not live-updating mid-session; a defensible interpretation but worth flagging explicitly to the planner since it affects task-level acceptance criteria for FOUND-02 |

## Open Questions (RESOLVED)

1. **Should `Footer` be extracted into its own component during this phase? — RESOLVED**
   - What we know: The footer (`app/page.tsx` lines 273-282) is fully static with no interactivity, no `[data-reveal]`, no client-side logic.
   - What's unclear: ARCH-02's requirement text says "decompose `experience.tsx`" specifically — Footer was never part of `experience.tsx`, so it's arguably out of scope either way.
   - Resolution: Leave `Footer` inline in `app/page.tsx`. Plan 06 explicitly preserves its markup while replacing only the interactive monolith and inline page sections.

2. **Exact Lenis API surface for live-reactive `lerp` changes (Assumption A3). — RESOLVED**
   - What we know: `lenis@1.3.25`'s `options` are normally set at construction (`new Lenis({...})`); STACK.md/ARCHITECTURE.md's code samples set `lerp` once at instantiation.
   - What's unclear: Whether Lenis 1.3.x exposes a supported way to update `lerp` on an already-running instance (vs. needing to destroy/recreate the instance inside the `gsap.matchMedia()` callback) — this wasn't verified against the Lenis package's actual TypeScript types/API surface in this research session (would require installing the package first, which hadn't happened yet at research time).
   - Resolution: Do not mutate `lenis.options` or rely on an undocumented update method. Plan 02 uses `gsap.matchMedia()` to update React state and changes a `normal`/`reduced` key on `<ReactLenis>`, allowing ReactLenis to destroy/recreate the instance through its supported lifecycle. A nested `LenisGsapBridge` cleans up and reconnects the GSAP ticker for the active instance.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test runner configured (`package.json` has no `test` script; `.planning/codebase/CONCERNS.md` confirms "No Unit Tests," "No E2E Tests") |
| Config file | none |
| Quick run command | `npm run lint` (30s), `npm run typecheck` (< 30s) |
| Full suite command | `npm run build` (full production build, includes type-check + static generation) |

### Phase Requirements → Test Map

Per `01-CONTEXT.md` D-02/D-03 and the project's explicit "Out of Scope: Tests automatizados" (`.planning/REQUIREMENTS.md`), this phase's verification is **build-level and manual-visual**, not unit/integration-test-based. This is a deliberate, already-decided project constraint, not a gap this phase should fill.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | No hydration/console errors from Lenis+GSAP wiring; single frame loop | build + manual | `npm run build` then manual fast-scroll-flick visual check | N/A — no test file, manual-only per D-02 |
| FOUND-02 | Reduced-motion toggles Lenis lerp 0.07→0.15 | manual | DevTools "Emulate CSS prefers-reduced-motion: reduce" toggle, visual/feel check | N/A — manual-only |
| FOUND-03 | Clean build, no SSR/hydration errors | automated | `npm run build` (exit code 0, no console warnings) | N/A — build command itself is the check |
| ARCH-01 | Form markup + handler co-located, no `FormConnector`/`querySelector` | code review + build | `npm run typecheck`, grep for `document.querySelector` in new `contact-form.tsx` (expect zero matches) | N/A — manual code review, per D-03 no live submission test |
| ARCH-02 | `experience.tsx` decomposed, each section has own `useGSAP` scope | code review + build | `npm run build`, grep for `experience.tsx` imports (expect zero after deletion) | N/A |
| ARCH-03 | Legacy v4 files removed, zero effect on live site | build + manual | `npm run build`, grep for `v4-template`/`v4-interactions`/`landing-page-v4` imports (expect zero — already pre-verified in this research session) | N/A |

### Sampling Rate

- **Per task commit:** none required mid-phase per D-02 (YOLO mode, verify once at end) — however `npm run typecheck` is cheap (<30s) and recommended informally between the major sub-steps in "Recommended Build Order" even if not a formal gate, to avoid a large multi-file diff producing a hard-to-localize error at the final check.
- **Per wave merge:** N/A (single-wave-style phase per D-02).
- **Phase gate:** `npm run lint` + `npm run typecheck` + `npm run build` all green, plus manual visual comparison at 1440×900 and 390×844, before `/gsd-verify-work`.

### Wave 0 Gaps

- No test framework install needed — explicitly out of scope for this phase and this project's v1 milestone (`.planning/REQUIREMENTS.md` Out of Scope table: "Tests automatizados (unit/E2E)").
- None — existing build-tooling (`eslint`, `tsc --noEmit`, `next build`) fully covers this phase's verification needs per the project's own decided workflow (D-02).

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in this app — contact form is public, unauthenticated (unchanged) |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | No protected resources |
| V5 Input Validation | Yes (unaffected by this phase, but relevant to ARCH-01) | `lib/contact-schema.ts` (Zod), server-authoritative in `app/api/contact/route.ts` — both unchanged this phase; `ContactForm` extraction must not weaken client-side validation (still `contactSchema.safeParse` before `fetch`, matching current `submitForm` behavior) |
| V6 Cryptography | No | No new cryptographic operations introduced |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Supply-chain risk from new npm dependencies (`gsap`, `lenis`, `@gsap/react`) | Tampering | Install via pinned npm registry versions (not CDN `<script>` tags) — already the project's approach; `lenis` flagged `SUS` in this session's legitimacy check requires a `checkpoint:human-verify` before install (see Package Legitimacy Audit) |
| Spam/bot form submissions | — (not STRIDE, but flagged in existing code) | Honeypot field (`website`, must remain empty) already implemented in `lib/contact-schema.ts` and carried over unchanged into `ContactForm` — do not remove during extraction |
| XSS via form input rendered elsewhere | Tampering | Not applicable — form data is inserted into Supabase, never reflected back into the DOM unsanitized; unchanged this phase |

## Sources

### Primary (HIGH confidence)
- Direct read of `components/experience.tsx`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `lib/contact-schema.ts`, `app/api/contact/route.ts`, `lib/v4-template.ts`, `components/v4-interactions.tsx`, `package.json`, `next.config.ts`, `tsconfig.json` (this session, 2026-07-18) — direct source, describes the exact code being decomposed
- `npm view gsap version`, `npm view lenis version`, `npm view @gsap/react version` (this session) — confirms `.planning/research/STACK.md`'s version claims have not drifted
- `gsd-tools query package-legitimacy check --ecosystem npm gsap lenis @gsap/react` (this session) — registry signals (downloads, repo, publish date, deprecated status, postinstall scripts)
- `grep` verification (this session) that `landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx` are unreferenced by any file under `app/` or `components/` — directly satisfies `01-UI-SPEC.md`'s stated pre-deletion verification requirement for ARCH-03
- `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` — project-level HIGH-confidence research, cited throughout rather than duplicated

### Secondary (MEDIUM confidence)
- `.planning/codebase/CONCERNS.md`, `.planning/codebase/CONVENTIONS.md`, `.planning/codebase/ARCHITECTURE.md` — first-party codebase audit (2026-07-18), used to cross-check line numbers and existing conventions

### Tertiary (LOW confidence)
- None used this session — no unverified web-search-only claims were introduced; all codebase-specific findings in this document are grounded in direct file reads or tool output from this session.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions re-verified against live npm registry this session, matching already-HIGH-confidence project research
- Architecture (decomposition map, DOM-positioning pitfall, dual-rAF pitfall): HIGH — derived from direct line-by-line reading of the actual files being changed, not inference from patterns alone
- Lenis live-reactive `lerp` API surface (Assumption A3 / Open Question 2): MEDIUM — not verified against the installed package's actual type definitions (package not yet installed at research time); flagged as a first-task check for the plan

**Research date:** 2026-07-18
**Valid until:** 30 days (stable domain; re-verify npm versions if planning is delayed significantly past this window, per `.planning/research/STACK.md`'s own validity note)

---
*Phase-specific research for: 01-motion-foundation-architecture-cleanup*
*Researched: 2026-07-18*
