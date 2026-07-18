# Stack Research

**Domain:** Premium light-mode corporate/technical marketing site — new UI capabilities (drawer, carousel, sticky header, PDF brochure, light color system) added on top of an existing validated Next.js 16 + React 19 + GSAP/Lenis foundation.
**Researched:** 2026-07-18
**Confidence:** HIGH (all package versions verified directly against the npm registry and official docs; a small number of ecosystem-opinion claims are flagged MEDIUM/LOW individually)

## Scope Note

This research covers **only** the technology decisions needed for the five new capabilities in this milestone. Next.js 16.2.10, React 19.2.7, TypeScript 5.9.3, GSAP 3.15.0, Lenis 1.3.25, and `@gsap/react` 2.1.2 are already installed, validated, and explicitly out of scope for re-evaluation (confirmed against `local-2/package.json`, matching `.planning/codebase/STACK.md`). Supabase/contact-form stack is likewise untouched.

## Recommended Stack

### Core Technologies (net-new for this milestone)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Native `<dialog>` element (no package) | Baseline (HTML Living Standard) | Side-drawer/panel for service detail content | `showModal()` gives WAI-ARIA-correct modal semantics for free: automatic focus trap, focus return to trigger on close, `Esc`-to-close, top-layer rendering (renders above everything, including `custom-cursor.tsx`, without manual z-index/portal management). Baseline widely available since March 2022; ~97% global browser support as of 2026. Zero new dependencies, zero transitive dependency graph growth — directly aligned with the project's existing "evaluate every new dependency" constraint and its hand-rolled-a11y conventions (`aria-hidden`, `prefers-reduced-motion` gating) already documented in `CONVENTIONS.md`. |
| `gsap/ScrollTrigger` (already inside installed `gsap@3.15.0`) | 3.15.0 | Sticky/auto-hiding header on scroll direction | GSAP became 100% free (Webflow-sponsored) with **all** plugins, including ScrollTrigger, bundled into the single `gsap` npm package — no separate install. Import via `import { ScrollTrigger } from "gsap/ScrollTrigger"` and `gsap.registerPlugin(ScrollTrigger)`. Since the project already runs a single rAF loop synced with Lenis (per validated Phase 1 architecture), drive the header's show/hide purely off that existing loop or off `ScrollTrigger.create({ onUpdate })`, matching the codebase's established pattern (`--scroll-y` custom property, `prefers-reduced-motion` gate) rather than introducing a second scroll-observation mechanism. |
| `embla-carousel-react` | 8.6.0 (stable; do **not** use `9.0.0-rc02`, still a release candidate) | Equipment/drone/camera image carousel | De-facto standard React carousel in 2026 (this is what `shadcn/ui`'s Carousel component wraps, making it the ecosystem default for Next.js projects). ~7KB gzipped, hook-based, unstyled (you own 100% of the CSS — fits the vanilla-CSS/BEM convention), handles pointer/touch drag physics, keyboard nav, and loop/snap correctly — these are exactly the parts that are easy to get subtly wrong (and inaccessible) if hand-rolled with GSAP alone. Peer deps: `react`/`react-dom` `>=16.8`, confirmed compatible with React 19.2.7. |

### Design Tokens / Color System (pattern, not a package)

| Approach | Purpose | Why Recommended |
|----------|---------|-----------------|
| Extend the existing `app/globals.css` custom-property system with a **semantic light-mode token layer** (`--bg-surface`, `--bg-elevated`, `--ink-primary`, `--ink-muted`, `--accent`, `--accent-contrast`, `--border-subtle`, etc.), replacing the current dark tokens (`--ink`, `--soft`, `--paper`, `--orange`, `--hot`) | Light/accessible corporate palette (Fugro/Seequent-inspired: grey-to-white gradient, restrained accent) | The codebase already implements a token-based design system via CSS custom properties (`CONVENTIONS.md` documents `--ink`, `--soft`, `--paper` etc. as the established pattern). Swapping token *values* (dark → light) and adding a couple of new semantic names is a value-level change, not an architecture change — no new tooling required. WCAG 2.2 requires 4.5:1 contrast for body text and 3:1 for large text/UI components; verify every new token pairing with a contrast checker (e.g., WebAIM or an APCA-aware tool) at design time, and encode the checked pairs as the only sanctioned combinations (don't let ad-hoc `color` + `background` pairs bypass the tokens). |

### Supporting Libraries (optional, situational — install only if the need materializes)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@radix-ui/react-dialog` | 1.1.19 | Accessible drawer primitive (alternative to native `<dialog>`) | Only fall back to this if native `<dialog>` proves genuinely awkward during implementation — e.g., you need a **non-modal** panel that coexists with page interaction, or you hit a real (not hypothetical) conflict between the dialog's top-layer and `custom-cursor.tsx`/Lenis. Confirmed React 19 peer support (`^19.0.0 \|\| ^19.0.0-rc`) and the earlier React-19 ref-callback infinite-loop bug (`@radix-ui/react-compose-refs`) is fixed as of the current 1.1.x line. It still pulls in ~13 transitive `@radix-ui/*` micro-packages plus `react-remove-scroll` and `aria-hidden` — small individually, but real dependency-graph growth the native option avoids entirely. Style it with your own vanilla CSS (do not adopt Radix Themes or shadcn's Tailwind-based styling layer). |
| `embla-carousel-autoplay` | matches `embla-carousel-react` (8.x) | Auto-advancing carousel | Only if the equipment carousel should self-advance. Given the brief's explicit "animación moderada" (moderate motion) direction and that autoplaying carousels are a common accessibility complaint (WCAG 2.2.2 requires a pause/stop control if content auto-updates), default to **manual** (arrows/dots + drag) navigation and treat autoplay as a low-priority nice-to-have that needs a visible pause control if added. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Manual contrast checking (WebAIM Contrast Checker or an APCA tool) | Verify every new light-palette token pair meets WCAG 2.2 (4.5:1 text / 3:1 UI) | Not a runtime dependency — a design-time step. Run it once per token pair when the palette is defined, not per-component. |
| Browser DevTools "Rendering > Emulate prefers-reduced-motion" | Verify the sticky header, drawer open/close, and carousel transitions all respect the existing `prefers-reduced-motion` gate | Reuses the project's already-validated `gsap.matchMedia()` pattern — extend the same matchMedia context to the new animations rather than adding ad-hoc checks. |

## Installation

```bash
# Core (only two new runtime packages needed for the whole milestone)
npm install embla-carousel-react@8.6.0

# Native <dialog> requires zero packages.
# GSAP ScrollTrigger requires zero packages (already inside gsap@3.15.0, just import it).

# Optional fallback — only if native <dialog> is rejected during implementation
npm install @radix-ui/react-dialog@1.1.19

# Optional — only if the carousel needs to self-advance
npm install embla-carousel-autoplay@8.6.0
```

No new dev dependencies are required. No PostCSS/Tailwind config changes.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Native `<dialog>` for the drawer | `@radix-ui/react-dialog` | Team wants a battle-tested, actively-maintained a11y abstraction with a larger community/issue-tracker safety net, or needs non-modal panel behavior `<dialog>` doesn't cleanly support. |
| Native `<dialog>` for the drawer | `vaul` (1.1.2) | You need a **mobile bottom-sheet** with drag-to-dismiss gesture physics and snap points — vaul is purpose-built for that pattern (it's what shadcn's Drawer wraps). The brief asks for a *lateral* (side) panel, which is a different interaction model than vaul's core use case; don't adopt it just because it's popular in the shadcn ecosystem. |
| `embla-carousel-react` | `keen-slider` | You want a slightly smaller footprint and don't need the ecosystem-standard status; keen-slider is also hook-based and performance-focused, a reasonable substitute if Embla's API doesn't fit. |
| `embla-carousel-react` | `swiper` | You need advanced 3D/coverflow effects, thumbnails-as-navigation, or 60+ built-in transition types. Swiper is ~47KB gzipped (vs Embla's ~7KB) and imposes more of its own styling/DOM structure — overkill for a straightforward equipment showcase and harder to keep visually consistent with the sober, restrained Fugro/Seequent direction. |
| Vanilla CSS custom properties (extend existing system) | Tailwind CSS v4.3.3 | See dedicated section below — situational, not recommended for this milestone. |
| `public/` static file + `<a download>` for the brochure | A `/api/brochure/route.ts` proxy endpoint | You later need download analytics/gating (e.g., require the contact form before unlocking the PDF, or log download counts). Not a requirement today — building the proxy now would be speculative complexity. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| Tailwind CSS (adding it now) | Project has a validated, working vanilla-CSS/BEM/custom-property architecture (`app/globals.css`, documented in `CONVENTIONS.md`) that this milestone explicitly extends rather than rebuilds ("reemplazar solo el visual, reutilizar la arquitectura" per `PROJECT.md`). Introducing Tailwind mid-project means either an inconsistent mixed BEM+utility codebase or a full CSS rewrite of 6+ existing sections that is out of scope and adds real regression risk to the one thing (Lenis+GSAP wiring) the milestone must not break. Tailwind's utility-first velocity pays off on net-new, component-heavy builds — this milestone adds ~4 new UI patterns onto an already-built page, not a new app. | Extend the existing custom-property token system (see Design Tokens section above) |
| Full shadcn/ui adoption | shadcn/ui is a Tailwind-first, copy-in component system; adopting it would implicitly drag in the Tailwind decision above plus its own styling conventions that don't match the project's BEM classes and state-class patterns (`.is-open`, `.is-visible`). | Use the individual unstyled primitive you need (native `<dialog>` or, if necessary, bare `@radix-ui/react-dialog`) and style it yourself in vanilla CSS. |
| `framer-motion` / `motion` for drawer/carousel/header animation | Redundant animation engine — GSAP is already the validated, wired-in animation library for this codebase (single rAF loop, `@gsap/react`, `prefers-reduced-motion` gate). Adding a second animation library increases bundle size and creates two competing timing systems fighting for the same rAF tick. | GSAP timelines/`quickTo` + the existing `@gsap/react` `useGSAP()` hook |
| `vaul` for the service-detail panel | Vaul is purpose-built for mobile bottom-sheet drag gestures (physics, snap points); the brief asks for a lateral/side panel, a different interaction model. Using it here means fighting its opinionated gesture defaults for a use case it wasn't designed for. | Native `<dialog>` styled as a side panel (`position: fixed; inset: 0 0 0 auto`) |
| `focus-trap-react` or hand-rolled focus-trap code | Both native `<dialog>` (`showModal()`) and `@radix-ui/react-dialog` already implement correct, tested focus-trap + focus-return behavior. Hand-rolling this is a common source of real WCAG failures (focus escaping to background content, focus not returning to the trigger element). | Rely on `<dialog>`'s native focus trap (or Radix's, if you fall back to it) |
| Swiper.js for the equipment carousel | 47KB gzipped, imposes its own CSS/DOM conventions, and ships far more slide-transition machinery (3D/coverflow/cube effects) than a sober corporate equipment showcase needs — works against the "no llamativo/startup" visual directive in the brand brief. | `embla-carousel-react` (unstyled, ~7KB, you control 100% of the visual treatment) |
| A CDN-hosted PDF viewer / `react-pdf` for the brochure | The requirement is "downloadable brochure," not an in-page PDF reader. Embedding a PDF viewer (react-pdf, pdf.js wrapper) adds a heavy dependency (worker files, canvas rendering) to solve a problem a plain `<a download>` link already solves. | `<a href="/brochure/skytech-brochure.pdf" download rel="noopener">` serving the static file from `public/` |

## Tailwind vs. Vanilla CSS — Explicit Decision

**Recommendation: do NOT adopt Tailwind for this milestone. Extend the existing vanilla CSS custom-property system.**

Reasoning:

1. **The project already has a working design-token system.** `CONVENTIONS.md` documents an established, consistent pattern: CSS custom properties for color/font/layout (`--ink`, `--soft`, `--paper`, `--orange`, `--hot`, `--display`, `--body`, `--shell`), BEM-inspired class naming (`.block__element--modifier`), and state classes (`.is-open`, `.is-visible`, `.is-pending`). A light corporate palette is a **value swap** on that existing token layer (new light tokens replacing the dark ones), not a new architecture. Tailwind would duplicate a capability the project already has.
2. **Migration cost vs. milestone scope mismatch.** This milestone explicitly reuses the existing section-per-component architecture and "reemplaza solo el visual" (`PROJECT.md`). Introducing Tailwind mid-project means committing to either (a) a full rewrite of 6 already-built sections' CSS to utility classes — high regression risk to the validated Lenis+GSAP wiring and out of the stated scope — or (b) a permanently inconsistent codebase mixing BEM blocks and utility classes, which actively hurts maintainability rather than helping it.
3. **Small net-new surface area.** Only ~3-4 new UI patterns are being added (drawer, carousel wrapper, sticky header, plus new section markup for the light theme). Tailwind's core value proposition — utility-class velocity across many net-new components — doesn't outweigh the setup/migration cost at this scale.
4. **No current PostCSS/Tailwind toolchain.** `package.json` has no `postcss.config.js` and no Tailwind dependency; the one `overrides.postcss` entry pins a transitive version Next.js itself depends on (confirmed via `package-lock.json` — not a leftover from a prior Tailwind setup). Adding Tailwind v4.3.3 is a from-scratch toolchain addition, not a resumption of existing config.
5. **Tailwind v4 is a legitimate, current, high-quality tool** (v4.3.3 confirmed current on npm as of this research; ground-up Lightning CSS engine, ~3.5x faster full builds, `@theme`-based design tokens) — this is not a "Tailwind is bad" conclusion. It is a "wrong tool for extending an already-consistent, already-working vanilla system at this milestone's scope" conclusion. Revisit this decision only if a future milestone requires building substantially more net-new UI (e.g., a full multi-page site, a dashboard/app section) where utility-class velocity would clearly outweigh migration cost.

## Stack Patterns by Variant

**If native `<dialog>` hits a real implementation blocker (top-layer + custom cursor conflict, need for non-modal behavior):**
- Fall back to `@radix-ui/react-dialog@1.1.19`
- Because it gives the same accessibility guarantees with an actively maintained abstraction layer, at the cost of ~13 small transitive packages — acceptable if native `<dialog>` genuinely can't do the job, not as a default choice.

**If the equipment carousel needs richer visual effects than a simple drag/snap slider (3D, coverflow) in a later milestone:**
- Use `swiper` instead of `embla-carousel-react`
- Because Swiper's larger footprint is justified once you actually need its transition library — don't pay that cost preemptively.

**If a future milestone needs download gating or analytics on the brochure:**
- Add a minimal `/api/brochure/route.ts` that logs the request (reusing the existing Supabase client already wired for the contact form) and then serves/redirects to the static PDF.
- Because this reuses the already-validated Supabase integration rather than introducing a new backend dependency.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| `embla-carousel-react@8.6.0` | `react@19.2.7`, `react-dom@19.2.7` | Peer range `>=16.8`; confirmed no React 19 issues reported for the 8.x line (9.0.0-rc02 exists but is pre-release — do not use for production). |
| `@radix-ui/react-dialog@1.1.19` (if used as fallback) | `react@19.2.7`, `react-dom@19.2.7` | Peer range `^16.8 \|\| ^17.0 \|\| ^18.0 \|\| ^19.0 \|\| ^19.0.0-rc` — confirmed via npm registry. The earlier React-19 ref-callback infinite-render bug in `@radix-ui/react-compose-refs` is resolved in the current 1.1.x line; still worth a smoke test on mount/unmount cycles given React 19.2's stricter ref-cleanup semantics. |
| Native `<dialog>` `@starting-style`/`allow-discrete` closing-animation CSS | All evergreen browsers as of 2026 | Core `<dialog>` API (`showModal`, `close`, `::backdrop`) is Baseline since March 2022 (~97% support). The newer `closedby` attribute is still "Limited availability" (Chrome/Edge 134+, Firefox 137+, Safari 18.2+) — don't rely on it as the only close mechanism; keep an explicit close button/ESC handling regardless. |
| `gsap@3.15.0` `ScrollTrigger` | `gsap@3.15.0` (already installed) | No separate install — `ScrollTrigger` ships inside the single `gsap` package since GSAP's 2025 "100% free" relicensing (Webflow-sponsored). Import path: `gsap/ScrollTrigger`. |
| Tailwind CSS v4.3.3 (if reconsidered in a future milestone) | Requires a PostCSS/Vite/Next plugin setup (`@tailwindcss/postcss`) | Not applicable to this milestone per the decision above; noted for future reference only. |

## Sources

- npm registry (`npm view`, queried directly) — `@radix-ui/react-dialog@1.1.19` version + peer deps + transitive deps, `embla-carousel-react@8.6.0` version + dist-tags, `tailwindcss@4.3.3` version, `react@19.2.x`/`next@16.2.10` current versions, `vaul@1.1.2` version + peer deps. **Confidence: HIGH** (authoritative, first-party source).
- `F:\ClaudeCode\Pagina_Web_Mayra\local-2\package.json` and `package-lock.json` — confirmed exact installed versions and the `postcss` override's origin (Next.js transitive dependency, not a leftover Tailwind setup). **Confidence: HIGH** (direct inspection).
- `.planning/codebase/STACK.md`, `.planning/codebase/CONVENTIONS.md` (prior milestone's validated codebase research) — existing CSS architecture, naming conventions, animation patterns. **Confidence: HIGH** (already-validated project artifact).
- MDN `<dialog>` element docs (via search synthesis) — Baseline support status, `@starting-style`/`allow-discrete` animation pattern, `closedby` attribute status. **Confidence: HIGH** (MDN is the canonical reference for browser API support).
- `tailwindcss.com/blog/tailwindcss-v4` and `v4-1` release posts — v4 architecture (Lightning CSS engine), performance claims. **Confidence: HIGH** (official vendor docs).
- `radix-ui.com/primitives/docs/overview/releases`, `ui.shadcn.com/docs/changelog/2026-02-radix-ui`, GitHub `radix-ui/primitives` issues #2900/#2909 — unified `radix-ui` package restructure, React 19 compatibility fix history. **Confidence: MEDIUM-HIGH** (official project sources; the changelog date wasn't independently re-verified beyond the fetched page).
- Aggregated web search: carousel library comparisons (Embla vs Swiper vs Keen Slider), drawer/dialog pattern discussions, GSAP+Lenis sticky-header forum threads. **Confidence: MEDIUM** (community consensus/opinion pieces, not first-party docs — used only to corroborate the recommendation, not as the sole basis for it).
- `jacob.verhoeks.org` blog post on dropping Radix UI for React 19 — used only as a risk-awareness data point (illustrates the ref-callback bug class existed), not as grounds for avoiding Radix outright, since the specific bug is confirmed fixed in the current npm-published version. **Confidence: LOW** (single personal blog, forward-dated April 2026, not independently corroborated) — noted explicitly so this claim is not mistaken for authoritative.

---
*Stack research for: Sky Tech Perú (local-2) — v1.0 (redefinido) Identidad Corporativa Premium milestone*
*Researched: 2026-07-18*
