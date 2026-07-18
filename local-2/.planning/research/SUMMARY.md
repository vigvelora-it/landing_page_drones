# Project Research Summary

**Project:** Sky Tech Perú (local-2) — v1.0 (redefinido) Identidad Corporativa Premium
**Domain:** Premium light-mode corporate/technical marketing site for a geospatial-engineering consulting firm (topography/drones, geotechnical, mining, civil works) — layering new UI capabilities onto an existing, validated Next.js 16 + React 19 + GSAP/Lenis foundation
**Researched:** 2026-07-18
**Confidence:** MEDIUM-HIGH (stack and architecture are HIGH — verified directly against the npm registry and the actual codebase; features and pitfalls are MEDIUM — cross-verified across multiple reference sites and official docs, but with no premium research providers configured)

## Executive Summary

This milestone is a **dark-to-light visual pivot plus four new interaction patterns** (service side-drawer, equipment carousel, scroll-reactive sticky header, downloadable PDF brochure) layered onto an already-built, already-validated Next.js 16 / React 19 marketing site whose Lenis + GSAP scroll/animation engine is explicitly out of scope for re-architecture. Experts building this class of site (Fugro, Seequent, Trimble Geospatial as aspirational references) present services as scannable card grids, prove credibility with named experts and real case studies, use a light/restrained palette with a single muted accent, and keep motion "moderate" rather than cinematic — all of which the client's brief and PROJECT.md already codify as explicit requirements.

The recommended approach is **maximally conservative on dependencies and maximally disciplined on integration order**: use native `<dialog>` for the drawer (zero new packages, full accessibility for free), `gsap/ScrollTrigger` (already bundled, zero install) for the sticky header, and `embla-carousel-react` (the one genuinely justified new dependency, ~7KB, ecosystem-standard) for the equipment carousel — explicitly rejecting Tailwind, shadcn/ui, framer-motion, and heavier carousel/drawer libraries as redundant with the project's already-working vanilla-CSS/BEM + GSAP architecture. Content-wise, the MVP is tightly scoped: light theme foundation, 5 service "ejes" as cards, a reusable service drawer, a 4-geologist team section, a 3-project case-study showcase, an evidence-based (non-competitor-naming) differentiation section, an equipment carousel, an ungated brochure download, and a sticky header — all P1, all explicitly requested by the client brief.

The dominant risk category is **integration friction between new UI patterns and the existing Lenis-driven scroll engine**, not net-new feature complexity: naive body-`overflow:hidden` scroll-locking doesn't work under Lenis, `overflow-x:hidden` fixes silently break `position:sticky` everywhere (including the new header), carousel libraries can introduce a second competing rAF loop, and a naive dark→light token swap leaves hard-coded color literals and contrast regressions behind. A secondary risk is accessibility shortcuts (aria-hidden instead of `inert` for the drawer, carousel without keyboard/pause-control parity) that look done but fail real assistive-tech testing. Both risk categories are well-documented with concrete prevention patterns and should be built into acceptance criteria for the relevant phases, not treated as later polish.

## Key Findings

### Recommended Stack

The only genuinely new runtime dependency needed for this entire milestone is `embla-carousel-react@8.6.0` (~7KB gzipped, unstyled, hook-based, React 19-compatible). Everything else reuses what's already installed or requires zero packages: native `<dialog>` (`showModal()`) for the service drawer gives WAI-ARIA-correct modal semantics (focus trap, focus return, Esc-to-close, top-layer rendering) with zero new dependencies; `gsap/ScrollTrigger` ships inside the already-installed `gsap@3.15.0` package (GSAP's 2025 "100% free" relicensing bundled all plugins) and drives the sticky header via `ScrollTrigger.create({ toggleClass })` off the existing single ticker; the light color system is a value-level swap of the existing CSS custom-property token layer, not a new architecture. The brochure is a static `public/` PDF linked with a plain `<a download>` — no route handler, no PDF-viewer library.

**Core technologies:**
- Native `<dialog>` element: service-detail drawer — free accessibility (focus trap/return, Esc, top-layer), zero dependencies, Baseline since March 2022 (~97% support)
- `gsap/ScrollTrigger` (already in `gsap@3.15.0`): sticky/auto-hiding header — no separate install, drives off the existing single rAF/Lenis-synced ticker rather than a second scroll listener
- `embla-carousel-react@8.6.0`: equipment/drone carousel — ecosystem-standard, unstyled, ~7KB, confirmed React 19 compatible; do not use the `9.0.0-rc02` prerelease
- Extended CSS custom-property token layer (existing `app/globals.css` system): light/accessible corporate palette — value swap on an already-working token architecture, not new tooling

**Explicitly rejected:** Tailwind CSS (would fragment the existing BEM/token architecture mid-project), shadcn/ui (drags in Tailwind), `framer-motion`/`motion` (redundant second animation engine competing with GSAP's rAF tick), `vaul` (built for bottom-sheets, not lateral drawers), Swiper.js (47KB, over-featured for a sober equipment showcase), `react-pdf`/PDF viewers (requirement is download, not in-page viewing).

### Expected Features

Research across Fugro, Seequent, Trimble Geospatial, WSP, Tetra Tech, and SRK Consulting confirms the client brief's requirements are already aligned with reference-tier B2B geospatial-engineering site patterns. Missing table-stakes features would make SkyTech look like a small operator rather than a Fugro/Seequent-tier peer; the real differentiator opportunity is the 4 named geologist-founders and 3 real case studies, which no drone-only local competitor (ARQUIDRON, JE&WJ, GeoXPert, Norte Urbano) can credibly match.

**Must have (table stakes) — all P1 for this milestone:**
- Services as a browsable card grid (5 ejes), not prose — maps to existing `capabilities-section.tsx`
- Service detail accessible via drawer/panel without full navigation (explicit client request)
- Team/expert profiles (4 geologists, photo + name + title + credentials — content already written)
- Real project case studies (GESAC/Huarmey, Lezard/Huaral, Las Dunas/Piura — client-supplied)
- Sticky/fixed header (already exists structurally; needs new scroll-reactive visual state)
- Light, low-saturation color scheme (white/light-gray base, one restrained accent)
- Preserve existing contact form + Supabase integration unchanged

**Should have (competitive differentiators) — also P1, per brief:**
- Evidence-based competitive-differentiation section (data/case-study-backed, never naming competitors on-page)
- Equipment/drone/camera carousel with premium, restrained treatment (needs real, non-generic-stock photography)
- Downloadable brand/services brochure — recommend **ungated** (client stated SEO/presentation over quote capture)
- Flagship/featured project treatment given only 3 available case studies (reads more intentional than a sparse grid)

**Defer (v1.x / v2+):**
- Gated lead-capture brochure variant (only if client later reverses stated priority)
- Deeper per-eje sub-pages beyond the drawer (only if content outgrows drawer capacity)
- Multi-language support, interactive project map, per-project case-study detail pages (all explicitly deferred until post-launch validation)

**Explicitly vetoed (anti-features):** dark cinematic backgrounds, loud/saturated accent colors, cartoonish/startup iconography, drone-only imagery throughout, heavy scroll-jacking/parallax/WebGL, gated brochure, naming competitors on-page, dense mega-menu beyond the 5 ejes.

### Architecture Approach

The existing architecture (root `SmoothScrollProvider`, single Lenis+GSAP ticker, component-per-section, no global state library) is reused entirely unchanged; this milestone adds four self-contained new pieces that plug into it without introducing a second timing system or new state-management pattern. `ServicesSection` owns `activeService` state and passes the whole `Service` object (not an id) as props to a purely presentational `ServiceDrawer` — deliberately avoiding the string-key lookup pattern that caused the prior `FormConnector` bug. A new shared `useScrollLock` hook (wrapping `useLenis().stop()/.start()`) is the single point where "is anything full-viewport open" translates into Lenis pause/resume, used by both the new drawer and (retrofitted) the existing `MenuOverlay`. `EquipmentCarousel` is fully self-contained (local state, `data-lenis-prevent`, no dependency on anything else). The sticky header gains a `useHeaderScrollState` hook using `ScrollTrigger.create({ toggleClass })` — explicitly not a second `window.addEventListener("scroll")`, which would recreate the already-flagged "competing frame loop" anti-pattern (`use-legacy-parallax.ts`). `CustomCursor`'s mount-time-only `querySelectorAll` must be converted to event delegation before the drawer/carousel introduce new `[data-cursor]` elements, or those elements will silently lack cursor behavior.

**Major components:**
1. `ServiceDrawer` (new) — presentational-only side panel, receives `service`/`isOpen`/`onClose` as props, uses native `<dialog>`, calls shared `useScrollLock`
2. `EquipmentCarousel` (new) — self-contained horizontal carousel (Embla), local `activeIndex` state, `data-lenis-prevent` on its track
3. `hooks/use-header-scroll-state.ts` + `hooks/use-scroll-lock.ts` (new, shared) — centralize scroll-reactive header styling and cross-overlay scroll-lock respectively, both driven through the existing single ticker/Lenis API rather than new listeners
4. `MenuOverlay` (extended) + `CustomCursor` (fixed) — existing components gain new hook calls / are fixed to support new dynamically-mounted elements, without restructuring their existing responsibilities

### Critical Pitfalls

1. **Dark-theme literals silently surviving the light re-theme** — hard-coded `rgba()`/blend-mode/`filter` values tuned for dark backgrounds don't follow a root-token swap; grep and audit every hit before marking the re-theme done, and require all new work to be token-only.
2. **WCAG contrast regressions from a naive palette flip** — accent colors tuned to pop on near-black frequently fail 4.5:1/3:1 on white; run every text/background and focus-ring pairing through a contrast checker as an explicit phase gate, not a visual spot-check.
3. **Drawer scroll-lock fighting Lenis, and `overflow-x:hidden` silently breaking the new sticky header** — native `body{overflow:hidden}` doesn't stop Lenis's rAF-driven scroll, and the common horizontal-scrollbar fix `overflow-x:hidden` on `html`/`body` creates a new scroll container that kills `position:sticky` everywhere with no console error; use `lenis.stop()`/`lenis.start()` and `overflow-x:clip` instead.
4. **Drawer built with `aria-hidden` + manual Tab-trapping instead of `inert`** — `aria-hidden` doesn't block pointer/focus, and manual Tab-cycling misses swipe-based screen-reader navigation entirely; use the native `inert` attribute on background siblings, plus focus-return-to-trigger on close.
5. **Carousel library introducing a second competing rAF/transition loop** — full-featured libraries (Swiper) bring their own animation engine that fights the already-synced Lenis/GSAP ticker; prefer a headless library (Embla) and drive any custom transitions through the existing GSAP ticker.

## Implications for Roadmap

Based on combined research (architecture's explicit "Suggested Build Order" plus feature dependencies and pitfall phase-mapping), the roadmap should sequence around one hard constraint: **the light-theme/token foundation and the "moderate motion" spec must land before any section-level visual rework**, and **the drawer + sticky header must be built/tested together** (they share the Lenis scroll-lock / `overflow-x` failure mode).

### Phase 1: Foundation — Light Theme Tokens + Moderate Motion Spec
**Rationale:** Every other visual feature depends on this; research (Pitfalls 1–3) confirms re-theming and motion-intensity changes done piecemeal, section-by-section, produce inconsistent and hard-to-detect regressions. Must be a hard gate before section content work begins.
**Delivers:** New semantic light-mode CSS custom-property layer (`--bg-surface`, `--ink-primary`, `--accent`, etc.) replacing dark tokens; a documented, literal "moderate motion" spec (max translate distance, duration ranges, stagger caps, no pinning) shared across all section `useGSAP()` calls; a codebase-wide audit of hard-coded color literals/blend-modes for removal.
**Addresses:** Light, low-saturation color scheme (FEATURES.md table stakes)
**Avoids:** Pitfall 1 (leftover dark-theme literals), Pitfall 2 (contrast regressions), Pitfall 3 (half-migrated animation intensity)

### Phase 2: Data Model + Shared Hooks (Foundation, cross-cutting)
**Rationale:** Architecture's "Suggested Build Order" steps 1–3 — pure foundation with zero visual risk, unblocks the drawer, carousel, and header phases that follow. Includes the `CustomCursor` event-delegation fix, which must land before any new `[data-cursor]` elements are introduced.
**Delivers:** Extended `lib/site-content.ts` (richer `services` objects with `longDetail`/`image`/`specs`, new `equipment` array, `brochure` constant); `hooks/use-scroll-lock.ts` (shared Lenis stop/start); `CustomCursor` converted to event delegation.
**Uses:** Existing Lenis/GSAP APIs only, no new dependencies
**Implements:** Shared scroll-lock hook (Architecture Pattern B), data-single-source-of-truth pattern

### Phase 3: Services Restructure + Service Detail Drawer
**Rationale:** Feature dependency chain requires the 5-eje card restructure before the drawer has a trigger surface; this is architecturally the most involved of the four new capabilities (component boundaries, focus trap, mutual-exclusivity with the menu overlay) and should be built and stress-tested as its own phase.
**Delivers:** `ServicesSection` restyled as 5 browsable eje cards; new `ServiceDrawer` component using native `<dialog>`, `inert` on background, focus trap/return, `useScrollLock` wiring.
**Addresses:** Services grid, service detail drawer (FEATURES.md table stakes)
**Avoids:** Pitfall 4 (aria-hidden vs. inert), Pitfall 5 (scroll-lock fighting Lenis), Anti-Pattern 5 (uncoordinated overlays vs. MenuOverlay)

### Phase 4: Sticky Header (sequenced alongside/after Phase 3)
**Rationale:** Architecture and Pitfalls research both flag that the sticky header's failure mode (breaking under `overflow-x:hidden` or a transformed ancestor) is most likely to surface *because of* the drawer/carousel's own overflow — must be stress-tested with drawer open/closed and carousel present, not built and verified in isolation.
**Delivers:** `hooks/use-header-scroll-state.ts` using `ScrollTrigger.create({ toggleClass })`; header background/shadow toggle at a single scroll threshold (no continuous scroll-driven interpolation, per the moderate-motion spec).
**Addresses:** Sticky/fixed header (FEATURES.md table stakes, already partially exists)
**Avoids:** Pitfall 8 (sticky header breaking under Lenis/`overflow-x`), Anti-Pattern 3 (second scroll listener)

### Phase 5: Equipment Carousel
**Rationale:** Lowest-risk, fully self-contained new capability (no shared dependency beyond Phase 2's data) — can run in parallel with Phase 3/4 if team capacity allows, but sequenced here for a single-threaded roadmap.
**Delivers:** `EquipmentCarousel` using `embla-carousel-react`, keyboard/touch parity, visible pause control if any auto-advance is used (default: manual navigation only), `data-lenis-prevent` on the track.
**Addresses:** Equipment/drone/camera carousel (FEATURES.md differentiator)
**Avoids:** Pitfall 6 (keyboard/touch/pause-control gaps), Pitfall 7 (carousel library competing with the Lenis/GSAP ticker)

### Phase 6: Content Sections — Team, Projects, Differentiation, Brochure
**Rationale:** Per feature-dependency mapping, the differentiation section requires both the team and projects sections to exist first (evidence-based claims, not generic "why choose us" copy); the brochure requires team/mission content to repackage. These are largely content-placement tasks, not novel engineering, and can follow the interactive-pattern phases.
**Delivers:** Team section (4 geologist profiles), projects showcase (3 case studies, featured + list layout), evidence-based differentiation section (no competitor names), ungated PDF brochure download (`<a download>` from `public/`).
**Addresses:** Team/expert profiles, case studies, differentiation section, downloadable brochure (all FEATURES.md P1)
**Avoids:** Pitfall 9 (brochure download failing in production build — verify via `npm run build && npm start`, not dev mode)

### Phase Ordering Rationale

- Light theme + motion spec must come first: every other phase produces visual output that depends on the token/motion foundation; building sections before tokens exist means restyling twice (per Pitfalls 1–3).
- Data model + shared hooks (Phase 2) is pure foundation with no visual output — it unblocks Phases 3–5 and has no dependency on Phase 1's visual work, but is sequenced after it here to keep the roadmap linear; teams with parallel capacity could run Phase 1 and Phase 2 concurrently.
- Drawer (Phase 3) and sticky header (Phase 4) are sequenced adjacently and must be integration-tested together — both research files independently flag the same root-cause bug class (Lenis scroll-lock / `overflow-x` breaking `position:sticky`), so testing them in isolation from each other is explicitly called out as insufficient.
- Carousel (Phase 5) is architecturally independent of the drawer/header and could parallelize, but its own pitfall (competing rAF loop) is best caught once, deliberately, rather than discovered incidentally alongside two other new interactive patterns.
- Content sections (Phase 6) are sequenced last because the differentiation section has a hard content dependency on team + projects existing first, and because content-placement work has the lowest engineering risk of the six phases — it's appropriate to save for after the interaction-pattern risk is retired.

### Research Flags

Phases likely needing deeper research during planning (`--research-phase`):
- **Phase 3 (Service Drawer):** Most structurally involved new component — focus-trap contract, mutual-exclusivity with `MenuOverlay`, and native `<dialog>` vs. `@radix-ui/react-dialog` fallback decision may need implementation-time verification against the exact custom-cursor/z-index interaction.
- **Phase 4 (Sticky Header):** The Lenis `root`/native-scroll-friendly mode configuration needs verification against the exact installed `lenis@1.3.25` API surface before implementation, since API/mode names have shifted across Lenis major versions.

Phases with standard, well-documented patterns (skip research-phase):
- **Phase 1 (Foundation tokens/motion spec):** Direct CSS custom-property value swap on an existing, already-documented token system — no novel technical decision.
- **Phase 2 (Data model + shared hooks):** Standard React state/hooks patterns, already fully specified in ARCHITECTURE.md with code examples.
- **Phase 5 (Carousel):** `embla-carousel-react` integration is a well-documented, ecosystem-standard pattern with a code example already provided in ARCHITECTURE.md.
- **Phase 6 (Content sections):** Primarily content-placement into existing/near-existing component patterns (team, projects, contact already structurally similar to existing sections).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified directly against npm registry and `package.json`/`package-lock.json`; only ecosystem-opinion claims (carousel comparisons) flagged MEDIUM individually |
| Features | MEDIUM | Cross-verified across Fugro, Seequent, Trimble, Tetra Tech, SRK via built-in WebSearch/WebFetch; no premium research providers configured, so treat competitor-specific claims as directional, not definitive, without a live visual audit |
| Architecture | HIGH | Derived directly from the current codebase (`components/`, `lib/`, `app/`) plus official Lenis documentation for the one external claim (`data-lenis-prevent`) |
| Pitfalls | MEDIUM | Cross-checked across official docs (MDN, W3C ARIA APG, Next.js, GSAP/Lenis) plus maintainer GitHub discussions and independent write-ups; no project-specific precedent exists for the four new UI patterns since they don't exist in the codebase yet — directionally reliable, verify against installed versions during implementation |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Photography assets:** Equipment carousel and mission/vision imagery both require client-supplied, non-generic-stock, non-drone-only photography — this is a content-sourcing blocker, not an engineering one; flag with the client early, ideally before Phase 5/6 planning.
- **Brochure gating decision:** Recommendation is an ungated PDF download, but this should be explicitly confirmed with the client before Phase 6, since it's a product decision research can recommend but not finalize.
- **Native `<dialog>` vs. Radix fallback:** Confirmed viable in research, but the actual interaction with `custom-cursor.tsx`'s top-layer rendering hasn't been tested in this codebase yet — treat as a Phase 3 implementation-time verification, not a settled fact.
- **Lenis `root`/native-scroll-friendly mode exact API:** Needs verification against the installed `lenis@1.3.25` version specifically, since Lenis mode/option names have changed across major versions — flagged as a Phase 4 research item.
- **Competitor site claims (local drone-only competitors):** ARQUIDRON, JE&WJ Contratistas, GeoXPert, Norte Urbano were not directly audited (inferred only); if precise differentiation messaging matters, a direct visual audit of these sites would upgrade this from LOW/MEDIUM to HIGH confidence.

## Sources

### Primary (HIGH confidence)
- npm registry (`npm view`) — exact package versions and peer-dependency confirmation for `embla-carousel-react`, `@radix-ui/react-dialog`, `tailwindcss`, `react`, `next`, `vaul`
- Direct codebase inspection — `local-2/app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/menu-overlay.tsx`, `components/custom-cursor.tsx`, `components/sections/capabilities-section.tsx`, `hooks/use-legacy-parallax.ts`, `lib/site-content.ts`, `lib/gsap.ts`, `package.json`, `next.config.ts`
- `.planning/codebase/CONCERNS.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONVENTIONS.md`, `.planning/codebase/STACK.md` — prior validated project research
- MDN Web Docs — `<dialog>` Baseline support, stacking context, `color-scheme` property
- W3C WCAG 2.1/2.2 (1.4.3, 1.4.11) and W3C ARIA Authoring Practices Guide — Carousel Pattern
- Chrome for Developers — Make accessible carousels
- Next.js official docs — Route Handlers
- Client brand brief, as recorded in `.planning/PROJECT.md` Context section (2026-07-18)

### Secondary (MEDIUM confidence)
- Fugro, Seequent, Trimble Geospatial, Tetra Tech, SRK Consulting reference sites (WebFetch) — service presentation, team/case-study patterns
- darkroomengineering/lenis GitHub README + Discussion #292 + Issue #334 — `data-lenis-prevent`, `lenis.stop()/start()` scroll-lock guidance
- Radix UI official release docs, shadcn changelog — React 19 compatibility confirmation for `@radix-ui/react-dialog`
- Smashing Magazine, A11Y Collective, UXPin, OpenReplay — accessible carousel/modal/inert implementation guides
- Aggregated WebSearch on B2B differentiation, team-page best practices, drawer UX patterns, gated-content conventions

### Tertiary (LOW confidence)
- Single personal blog post on Radix UI + React 19 ref-callback bug (used only as risk-awareness context, not as the basis for the recommendation)
- SRK Consulting careers page (limited visual-design signal)
- General carousel/imagery UX sources with no industrial-sector-specific case directly audited
- Inferred (not directly audited) local competitor site characteristics (ARQUIDRON, JE&WJ Contratistas, GeoXPert, Norte Urbano)

---
*Research completed: 2026-07-18*
*Ready for roadmap: yes*
