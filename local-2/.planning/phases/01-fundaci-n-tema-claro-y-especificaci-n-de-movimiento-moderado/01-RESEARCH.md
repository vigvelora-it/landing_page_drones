# Phase 1: Fundación — Tema Claro y Especificación de Movimiento Moderado - Research

**Researched:** 2026-07-18
**Domain:** CSS custom-property re-theme (dark→light) + motion-constant migration on an existing Next.js 16/React 19 + Lenis 1.3.25 + GSAP 3.15.0 site. No new components, no markup changes — a single-file (`app/globals.css`) token rewrite plus a two-value retune in `lib/motion-preferences.ts`.
**Confidence:** HIGH (primary source is the actual current codebase, read line-by-line, cross-referenced against the already-approved `01-UI-SPEC.md` design contract)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**D-01 — Imágenes/video existentes bajo el tema claro:** Se acepta un estado visual transitorio para las fotos/video existentes (hero, tecnología) una vez eliminados los filtros de oscurecimiento (`saturate`/`contrast`/`brightness`) — sin filtro puente. Esto es literalmente lo que exige THEME-03 y lo que el UI-SPEC ya especificó explícitamente ("use none unless a later phase's UI-SPEC specifies otherwise"). La Fase 5 reemplaza el contenido/fotografía real; hasta entonces las imágenes actuales se ven "crudas" sin tratamiento, lo cual es aceptable como estado intermedio.

**D-02 — PALETA-DE-MARCA.md:** No se actualiza `PALETA-DE-MARCA.md` como parte de esta fase — ningún requisito THEME-01–04 lo menciona, y es un documento de referencia de marca, no código. Queda como tarea de documentación separada, fuera del alcance de ejecución de esta fase.

### Claude's Discretion
- Orden exacto de migración dentro de `app/globals.css` (por bloque de variables, por selector, etc.)
- Tratamiento de `.hero-orbit`/`.moving-band` (anillos giratorios, marquee) — el UI-SPEC ya los marcó como "flagged, not removed" en esta fase; pertenecen a la fase que reescriba el contenido de esa sección (Phase 3+)
- Nombres exactos de las nuevas variables CSS de movimiento (ya especificados en el UI-SPEC: `--motion-distance-max`, `--motion-duration-base`, etc.) — se implementan tal cual el contrato

### Deferred Ideas (OUT OF SCOPE)
- Actualizar `PALETA-DE-MARCA.md` → tarea de documentación separada
- Reconsiderar la escala tipográfica de tamaños del hero/headings (hasta 9.2rem) → Fase 3-5
- Tratamiento final de `.hero-orbit`/`.moving-band` → Fase 3+ (contenido de sección)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| THEME-01 | Paleta clara/celeste de bajo contraste (fondo blanco/gris claro, un solo acento restringido) reemplazando la paleta oscura | Full token replacement table below (`## Migration Map — Color Tokens`); every `--ink`/`--soft`/`--paper`/`--orange`/`--hot` background/text usage in `app/globals.css` catalogued with its exact new-token destination |
| THEME-02 | Todos los pares texto/fondo y anillos de foco cumplen WCAG AA | UI-SPEC's contrast table already verifies all *token-on-token* pairs; this research adds the **uncovered pairs** the token table doesn't verify (text-on-photograph, ink-on-accent hover states) as flagged pitfalls/open questions requiring an explicit executor decision |
| THEME-03 | No quedan literales de color/blend-mode/filtros ajustados al tema oscuro | Full line-by-line audit of `app/globals.css` below — includes items **not** in the UI-SPEC's 14-hit Retirement Checklist (near-duplicate dark hex literals, `.intro` splash screen, `.contact-backdrop img` filter, decorative glow rings) |
| THEME-04 | Especificación literal de "animación moderada" aplicada consistentemente | Exact current-value → new-token mapping for `[data-reveal]`, `.title-line[data-reveal]>span`, Lenis `lerp` (`lib/motion-preferences.ts`), and the `--parallax` custom property (`hooks/use-legacy-parallax.ts` + `.hero-media`/`.tech-media` CSS) — plus three infinite-loop animations THEME-04's "no infinite/uncontrolled looping" rule flags that the UI-SPEC's "motion-adjacent, flagged" list didn't enumerate |
</phase_requirements>

## Summary

This phase is a pure CSS-token + two-constant rewrite, not new feature work. `app/globals.css` is a single 44-line minified stylesheet (one giant line per section) — every rule was read directly for this research, not sampled. The UI-SPEC's Retirement Checklist ("14 literal/blend/filter hits") is accurate for its stated scope, but a fresh line-by-line pass surfaces **real additional migration items** the checklist's targeted grep didn't catch: a full-screen dark `.intro` splash overlay with its own hardcoded `#080a0d` background (never expressed via `--ink`), at least three more distinct hardcoded near-black hex literals (`#0c0f12` on `.hero`, `#0a0c0f` on `.technology`/`.tech-vignette`, duplicated again inside the 720px media query), a fifth filtered image selector (`.contact-backdrop img{filter:grayscale(1)}`) the checklist's four-selector filter list omitted, decorative glow rings on `.contact-section:before` styled for a dark backdrop with no light-theme equivalent, and three `animation: ... infinite` declarations (`.pulse-dot`, `.scroll-cue i:after`, `.intro-brand span`) beyond the two (`hero-orbit`, `moving-band`) the UI-SPEC's "motion-adjacent, flagged" list names.

The most consequential finding is a **systemic contrast gap**: six current rules pair `color:var(--ink)` (soon-retired, was near-black) with `background:var(--orange)`/`var(--hot)` (soon `--accent`/`--accent-hover`) — `.circle-link:hover`, `.service-row:hover`, `.submit-button`, `.custom-cursor`, `::selection`, and implicitly the hover state of `.service-row`'s child text. The UI-SPEC's contrast table only verifies **white text on `--accent`** (5.77:1, PASS) — it never verifies dark `--ink-primary` text on `--accent`. A naive token-name swap (`--ink`→`--ink-primary`, `--orange`→`--accent`) on these six rules would silently ship an unverified, likely-failing contrast pair. The safe, already-verified fix is to repoint all six to **white/`#FFFFFF` text on `--accent`/`--accent-hover`**, matching the UI-SPEC's one verified accent-background pairing.

Two architecturally important non-CSS-file locations exist and must be touched: `lib/motion-preferences.ts` (the sole owner of the Lenis `lerp` constants — `normal: 0.07` → `0.1`, `reduced: 0.15` unchanged) and, only as a *design decision point* (not a required code change), `hooks/use-legacy-parallax.ts`'s `[data-parallax]` mechanism, which currently emits an **unclamped** `--parallax` custom property consumed by `.hero-media`/`.tech-media` — the UI-SPEC's ±8px parallax cap can and should be enforced purely in CSS (`transform:translateY(clamp(-8px,var(--parallax,0),8px))`) without touching the `.ts` hook, preserving this phase's CSS-only scope.

**Primary recommendation:** Migrate `app/globals.css` token-block-first (new `:root` tokens including motion constants), then walk every consuming selector top-to-bottom exactly as it appears in the file (order documented below), swapping literal-and-var references per the migration map — do not mechanically find/replace `--orange`→`--accent`; six specific rules need a text-color correction (white, not `--ink-primary`) that a blind rename would miss. Retune `lib/motion-preferences.ts`'s one line. Add the two `clamp()` wraps to `.hero-media`/`.tech-media`. Treat `.intro`, `.pulse-dot`, `.scroll-cue`, and `.contact-backdrop img` as in-scope for THEME-03/04 even though the UI-SPEC's checklist didn't name them explicitly — they are dark-theme-tuned literals/infinite animations within this same file.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Color token definitions (`--bg-surface*`, `--ink*`, `--accent*`, `--border*`) | Browser / Client (CSS) | — | Static custom properties in `app/globals.css`, consumed at paint time; no server involvement |
| Section background/text token application | Browser / Client (CSS) | — | Every section rule (`.capabilities`, `.contact-section`, etc.) reads tokens; purely presentational |
| WCAG contrast verification | Browser / Client (CSS values) | Build tooling (manual/axe audit, no CI gate exists) | Contrast is a rendered-pixel property; verification happens via manual tool run (Lighthouse/axe/WebAIM), not server logic — no automated test harness exists in this repo |
| Lenis `lerp` / scroll-smoothing constants | Browser / Client (`lib/motion-preferences.ts`, runs client-side via `"use client"` provider) | — | `SmoothScrollProvider` is a client component; Lenis instantiates in-browser only |
| GSAP reveal/motion constants (`--motion-*` custom properties + `useGSAP()` call sites) | Browser / Client | — | All animation timelines register and run client-side; no SSR animation |
| `[data-parallax]` → `--parallax` custom property pipeline | Browser / Client (`hooks/use-legacy-parallax.ts` + consuming CSS) | — | `requestAnimationFrame`-driven, DOM-read/write, entirely client-side |

## Standard Stack

No new libraries are introduced this phase. The existing stack is reused unchanged (per CONTEXT.md's Established Patterns and PROJECT.md's constraint against new heavy dependencies).

### Core (existing, unchanged versions)
| Library | Version (installed) | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `lenis` | `1.3.25` [VERIFIED: package.json] | Smooth-scroll engine, already wired via `ReactLenis` in `components/providers/smooth-scroll-provider.tsx` | Reused unchanged architecture per CONTEXT.md — only the `lerp` numeric value changes |
| `gsap` | `3.15.0` [VERIFIED: package.json] | Animation/ScrollTrigger engine, ticker-synced to Lenis | Reused unchanged; this phase only adds `:root` motion-constant tokens for later `useGSAP()` calls to consume, and optionally registers a `CustomEase` |

### Package Legitimacy Audit

**Not applicable — no new packages are installed in this phase.** This is a CSS-value and TypeScript-constant retune of already-installed, already-vetted dependencies (`lenis`, `gsap`). No `npm install` is required. Skip the Package Legitimacy Gate.

## Architecture Patterns

### Migration Data Flow (how a token change reaches the rendered page)

```
:root custom properties (app/globals.css, top of file)
        │
        ├─► Section-level selectors read tokens via var(--token-name)
        │   e.g. .capabilities{background:var(--bg-surface-alt)}
        │
        ├─► Component-local literals that do NOT reference a token
        │   (hardcoded hex/rgba — the actual migration risk surface)
        │   e.g. .hero{background:#0c0f12}  ← must become var(--bg-surface-alt)
        │
        └─► lib/motion-preferences.ts (TypeScript, outside globals.css)
                │
                └─► components/providers/smooth-scroll-provider.tsx
                        (reads LENIS_LERP.normal/.reduced — no changes needed here,
                         it already imports the constant correctly)
```

A reader tracing THEME-03 compliance should: (1) confirm every `:root` legacy token is deleted, (2) grep the file for the retired token *names* (should be zero hits), (3) separately grep for the raw hex literals identified below that were never behind a token name in the first place (grepping for `--ink` alone will miss these).

### Recommended Migration Order (Claude's Discretion — CONTEXT.md explicitly delegates this)

Migrate in this order to minimize risk of missing a consuming selector:

1. **`:root` block** (line 1) — replace legacy tokens wholesale with the full UI-SPEC token table (surfaces, ink, accent, border, focus, destructive) **plus** the new `--motion-*` custom properties (THEME-04 tokens) in the same block.
2. **Base element rules** (line 7) — `html`, `body`, `::selection`, `button`, `::selection` — these set the page-wide defaults every section inherits from.
3. **`[data-reveal]` / `.title-line[data-reveal]`** (line 9) — swap hardcoded `44px`/`.9s`/`cubic-bezier(.16,1,.3,1)`/`1.15s` for the new `--motion-*` tokens. This is the highest-value THEME-04 change since it's the one reveal pattern every section already uses.
4. **Section-by-section, in file order** (Apertura → Navegación → Hero → Perspectiva → Capacidades → Tecnología → Proceso → Contacto → Cursor) — each section's block is self-contained in the current file structure, so migrating top-to-bottom matches the existing organization and avoids missing a block.
5. **Media queries last** (lines 42-44) — the 720px breakpoint re-declares `.tech-vignette`'s background with the same dark literal family; this duplicate must be updated in lockstep with the base rule or it will silently survive on mobile.
6. **`lib/motion-preferences.ts`** — one-line `lerp` retune, independent of the CSS work, can be done in the same commit or separately.

### Anti-Patterns to Avoid
- **Mechanical `--orange`→`--accent`, `--hot`→`--accent-hover` find/replace without checking the paired text color.** Six rules pair the retiring background token with `color:var(--ink)`; the UI-SPEC only verified white-on-accent contrast. See Pitfall 1 below.
- **Treating the Retirement Checklist's "14 hits" as exhaustive.** It was generated via a targeted grep for known dark-theme patterns; a full line read finds at least 8 additional items (below) that a literal find/replace on the checklist alone would miss.
- **Touching `hooks/use-legacy-parallax.ts` or `components/providers/smooth-scroll-provider.tsx` logic.** CONTEXT.md explicitly scopes this phase to "solo se retunan valores... ningún componente .tsx cambia su lógica." The `±8px` parallax cap and the `lerp` retune are both achievable without touching component logic (CSS `clamp()` for the former, a single constant edit in a `.ts` data file — not a component — for the latter).

## Migration Map — Color Tokens (THEME-01/02/03)

Every `:root` token replacement, with exact old value, new value, and every known consuming selector as of this line-by-line read of `app/globals.css`.

| Legacy token | Old value | New token(s) | New value | Consuming selectors (verified by direct read) |
|---|---|---|---|---|
| `--ink` | `#0c0e12` | `--ink-primary` (text role) **+** `--bg-surface-deep` or `--bg-surface-alt` (surface role, decided per section) | `#1C2530` / `#E3E8ED` / `#EEF1F4` | `html{background}`, `body{background... color}`, `::selection{color}`, `.statement-copy em`(shares `--orange` not `--ink`), `.section-kicker{color}`, `.statement-aside>p:nth-child(2){color:#0c0e12ad}` (literal, not var — see catch-all row), `.metric` border(shares `--dark-line`), `.capabilities{background}` **(full dark section → must become `--bg-surface-alt` per "gris arriba" sequence)**, `.service-row:hover{color}`, `.contact-section{background}` **(full dark section → must become `--bg-surface`, "brightest, for the conversion moment")**, `.submit-button{color}`, `.custom-cursor{color}` |
| `--soft` | `#14171d` | Retire — no direct replacement named in UI-SPEC; nearest surface role is `--bg-surface-deep` or `--bg-surface-alt` | `#E3E8ED` / `#EEF1F4` | `.deliverable-image{background:var(--soft)}` — this is the **only** consumer; needs an explicit surface-token choice (see Open Questions) |
| `--paper` | `#eeeae3` (warm cream) | `--bg-surface-alt` | `#EEF1F4` (cool celeste-gray) | `body{background}`, `.statement{background}`, `.process-section{background}` |
| `--orange` | `#e46d4b` | `--accent` | `#0B6E8F` | `.intro:after`, `.intro-brand span`, `.intro-line i`, `.menu-overlay{background}`, `em{color}`, `.hero-orbit:after{background, box-shadow}`, `.service-row:before{background}`, `.moving-band{background}`, `.process-step i{background}`, `.contact-form input:focus{border-color}`, `.submit-button{background}` |
| `--hot` | `#ff7852` | `--accent-hover` (for hover/active states) — note some current `--hot` usages are *not* hover states (e.g. `.brand-symbol`, `.title-line-accent`, `.pulse-dot`) and should map to `--accent` instead, not `--accent-hover` | `#0A5A78` / `#0B6E8F` | `::selection{background}`, `.brand-symbol{color}`, `.pulse-dot{background}` (plus literal `#ff7852cc`/`#ff785200` box-shadow — see catch-all), `.title-line-accent{color}`, `.circle-link:hover{background, border-color}`, `.submit-button:hover{background}`, `.custom-cursor{background}` |
| `--dark-line` | `rgba(12,14,18,.18)` | `--border-subtle` (decorative) or `--border-strong` (functional, e.g. `.contact-form` inputs — N/A, those use separate literals) | `#DCE2E8` / `#7C899A` | `.section-kicker{border-top}`, `.statement-aside`(via `.metric`), `.metric{border-top}`, `.process-list{border-top}`, `.process-step{border-bottom}`, `.file-types span{border}` |
| `--light-line` | `rgba(255,255,255,.18)` | Same target tokens as `--dark-line` — since there is no more "light section on dark page," the dark/light split collapses into one border system | `#DCE2E8` / `#7C899A` | `.section-kicker.light{border-color}`, `.service-list{border-top}`, `.service-row{border-bottom}`, `.footer-mark{border-bottom}` |

### Catch-all literal alpha hits (not behind a token name — THEME-03's hardest category)

The UI-SPEC's checklist row "Various `#ffffffXX`/`#0c0e12XX` alpha literals" is a correct generic catch-all, but a full read shows the *actual* literal families involved are broader than the two hex roots it names:

| Literal family | Example selectors | Disposition |
|---|---|---|
| `#0c0e12` + alpha suffix (matches checklist) | `.section-kicker{color:#0c0e129e}`, `.statement-aside>p:nth-child(2){color:#0c0e12ad}`, `.process-intro>p{color:#0c0e1299}`, `.process-step>span{color:#0c0e1280}`, `.process-step p{color:#0c0e129e}`, `.deliverable-copy>p{color:#0c0e129e}`, `.service-row:hover .service-number,.service-row:hover .service-detail{color:#0c0e12a6}` | Re-derive from `--ink-secondary` (`#4A5568`) — these are all "muted/secondary text on light-ish surface" roles, which is exactly `--ink-secondary`'s stated purpose |
| `#ffffff` + alpha suffix (matches checklist) | `.section-kicker.light{color:#ffffff99}`, `.hero-eyebrow{color:#ffffffb3}`, `.hero-bottom>p{color:#ffffffad}`, `.hero-index{color:#ffffff8c}`, `.scroll-cue{color:#ffffff8c}`, `.scroll-cue i{background:#ffffff40}`, `.circle-link{border:1px solid #ffffff73}`, `.capabilities-heading p,.process-intro>p{color:#ffffff99}`, `.service-number{color:#ffffff73}`, `.service-detail{color:#ffffff85}`, `.service-row>span:last-child{border:1px solid #ffffff59}`, `.tech-specs span{color:#ffffff80}`, `.tech-caption{color:#ffffff80}`, `.contact-copy>p{color:#ffffff94}`, `.contact-copy>a{border-bottom:1px solid #ffffff59}`, `.contact-form input,select,textarea{border-bottom:1px solid #ffffff47}`, `.contact-form input::placeholder{color:#ffffff4d}`, `.footer-bottom{color:#ffffff80}`, `.environment-badge{border:1px solid #ffffff66}`, `.video-toggle i{border:1px solid #ffffff73}` | **These are "light text/border on dark section" — every single one needs re-evaluation, not reuse, per Pitfall 1.** Most are inside sections that are flipping from dark to light background (`.capabilities`, `.contact-section`, `.footer`), so the *entire pairing* inverts: these become `--ink-primary`/`--ink-secondary`/`--border-subtle` text/borders on a light surface, not a lighter shade of the same white |
| `#0c0e12` (non-alpha, direct fill) | `.menu-overlay nav a{border-bottom:1px solid #0c0e1247}` (this one already has alpha, listed for completeness) | Same treatment — `--border-subtle` |
| **Near-duplicate dark literals NOT tied to `--ink` at all (fresh-read finding, not on UI-SPEC checklist)** | `.hero{background:#0c0f12}`, `.hero-media{background:#0c0f12}`, `.hero-shade{background:linear-gradient(...#06080af2...#06080a94...#06080a29...#06080ad1...)}`, `.technology{background:#0a0c0f}`, `.tech-vignette{background:radial-gradient(...#0a0c0f1a...#0a0c0fe6...),linear-gradient(...#0a0c0ff0...)}`, `.intro{background:#080a0d}`, `.footer{background:#080a0d}`, `.environment-badge{background:#0c0e12d1}` | **Four distinct near-black hex families exist in this file (`#0c0e12`, `#0c0f12`, `#0a0c0f`, `#080a0d`) — none are unified under `--ink`.** A grep for `--ink` alone will miss three of the four. Each must be individually re-derived: `.hero`/`.hero-media` fallback bg → `--bg-surface-alt` (hero is the top "gris" band per the section-surface sequence); `.technology` → `--bg-surface` (white, per sequence); `.footer` → `--bg-surface-deep` (CONFIRMED by user, Discretion Call #3); `.intro` → see Open Questions (not covered by CONTEXT/UI-SPEC at all); `.environment-badge` → covered separately below (backdrop-filter retirement) |
| **`.contact-backdrop img{filter:grayscale(1)}`** (fresh-read finding) | — | A **fifth** filtered-image selector, not in the UI-SPEC's four-selector filter list (`hero-media`, `tech-media`, `statement-visual`, `deliverable-image`). `grayscale(1)` is milder than the others (no darkening) but is still a dark-direction-era treatment on a decorative background image behind the contact form; apply the same "remove, render natural" rule per THEME-03/D-01 unless the planner decides it should stay for a specific compositing reason |
| **Decorative glow rings tuned for dark backdrop (fresh-read finding)** | `.contact-section:before{border:1px solid #ffffff14;box-shadow:0 0 0 9vw #ffffff05,0 0 0 18vw #ffffff04}` | White-on-white is invisible once `.contact-section` flips to `--bg-surface` (white). Not named in the checklist (it's not `mix-blend-mode`/`backdrop-filter`/a `filter:` stack — it's a plain decorative box-shadow ring). Must be removed or re-derived from `--border-subtle`/`--ink-primary` at very low opacity if the ring effect is worth keeping under the light theme |

## Migration Map — Motion Constants (THEME-04)

| Location | Current (hardcoded) | New (token-driven) | File |
|---|---|---|---|
| `[data-reveal]` translate distance | `translateY(44px)` | `translateY(var(--motion-distance-max))` = `24px` | `app/globals.css` line 9 |
| `[data-reveal]` transition duration | `.9s` (both `opacity` and `transform`) | `var(--motion-duration-base)` = `450ms` | `app/globals.css` line 9 |
| `[data-reveal]` easing | `cubic-bezier(.16,1,.3,1)` | `var(--ease-moderate)` = `cubic-bezier(0.33,1,0.68,1)` | `app/globals.css` line 9 |
| `.title-line[data-reveal]>span` translate | `translateY(115%)` | Unchanged — this is a percentage-based mask-reveal distance (line-height relative), not a `px` distance covered by `--motion-distance-*`; only its **duration/easing** are in scope | `app/globals.css` line 9 |
| `.title-line[data-reveal]>span` duration | `1.15s` | `var(--motion-duration-slow)` = `650ms` (hard cap `700ms`) | `app/globals.css` line 9 |
| `.title-line[data-reveal]>span` easing | `cubic-bezier(.16,1,.3,1)` | `var(--ease-moderate)` | `app/globals.css` line 9 |
| Title-line stagger delays | `.08s` / `.16s` / `.23s` (children 2/3/4) | Align to `var(--motion-stagger-max)` = `70–80ms` increments — current values (~80/80/70ms) are already close; retune to a consistent `.07s`/`.14s`/`.21s` or `.08s`/`.16s`/`.24s` cadence for exactness | `app/globals.css` line 9 |
| Lenis `lerp` (normal) | `0.07` | `0.1` [VERIFIED: `01-UI-SPEC.md` Motion Contract — cites this as "Lenis's own documented moderate default"; independently confirmed via web search — Lenis's published default lerp is `0.1`] | `lib/motion-preferences.ts` line 2 — `LENIS_LERP.normal` |
| Lenis `lerp` (reduced motion) | `0.15` | `0.15` (unchanged) | `lib/motion-preferences.ts` line 3 — `LENIS_LERP.reduced` |
| `--parallax` range | Unclamped — `item.style.setProperty("--parallax", rect.top * speed + "px")`, speed defaults to `0.1`, can produce large values on tall viewports | Cap at CSS consumption points via `clamp(-8px, var(--parallax,0), 8px)` — **do not edit `hooks/use-legacy-parallax.ts`**, the cap belongs in the two CSS rules that read the property | `app/globals.css` line 19 (`.hero-media`) and line 29 (`.tech-media`) — both currently `transform:translateY(var(--parallax,0))` |
| `.hero-orbit`/`.orbit-one`/`.orbit-two` | `animation:orbit 24s/18s linear infinite` | **Flagged, not removed this phase** (CONTEXT.md discretion) — but the `--orange` color reference inside `.hero-orbit:after` still needs its token swapped this phase regardless of the animation's fate (see Open Questions) | `app/globals.css` line 19 |
| `.moving-band-track` | `animation:marquee 24s linear infinite` | Same as above — flagged, not removed; color tokens (`background:var(--orange);color:var(--ink)`) still migrate this phase | `app/globals.css` line 26 |
| **`.pulse-dot`** (fresh-read finding, not on UI-SPEC's motion-adjacent list) | `animation:pulse 2s infinite` | Not named as "flagged, not removed" anywhere — THEME-04 bans "infinite/uncontrolled looping decorative animation" with no carve-out for this one. Recommend either removing the infinite loop (make it a single pulse on load, or static) or explicitly adding it to the same "flagged, deferred to Phase 3+" list the orbit/marquee got | `app/globals.css` line 20 |
| **`.scroll-cue i:after`** (fresh-read finding) | `animation:scroll-line 2s ease-in-out infinite` | Same issue as `.pulse-dot` — an uncounted infinite loop | `app/globals.css` line 20 |
| **`.intro-brand span`** (fresh-read finding) | `animation:spin 1.4s linear infinite` | Lower risk — bounded by the intro sequence's own lifecycle (`introDone` fires at 1450ms via `setTimeout` in `components/intro-sequence.tsx`, after which `.intro{visibility:hidden}`), so it is not truly infinite in practice even though the CSS declares `infinite`. Still worth a defensive fix (e.g. `animation-iteration-count` bounded, or rely on `visibility:hidden` to stop rendering) since THEME-04's letter is "no infinite/uncontrolled looping" | `app/globals.css` line 12 |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Registering the new `--ease-moderate` curve for GSAP timelines | A custom bezier-interpolation function | `CustomEase.create("moderate", "0.33,1,0.68,1")` [CITED: gsap.com/docs/v3/Eases/CustomEase/ — CustomEase accepts the four raw cubic-bezier numbers directly, "CustomEase also recognizes standard cubic-bezier() strings containing four numbers"], then reference `ease: "moderate"` in tweens; or use the already-suggested `power2.out` approximation per UI-SPEC for cases where registering a plugin ease isn't warranted | GSAP ships this exact conversion path; hand-rolling risks a subtly different curve than the CSS `--ease-moderate` token, breaking the "single standard ease-out-cubic curve for all new reveals" requirement |
| Clamping the `--parallax` custom property to ±8px | Rewriting `hooks/use-legacy-parallax.ts`'s speed-calculation logic | CSS `clamp(-8px, var(--parallax,0), 8px)` at the two consuming selectors | Native CSS `clamp()` [CITED: MDN — clamp() accepts a MIN/VAL/MAX triple and clamps VAL between them, works correctly with negative bounds and `px` values sourced from a custom property] achieves the identical visual result without touching component/hook logic, keeping this phase's diff scoped to `app/globals.css` + one line in `lib/motion-preferences.ts`, consistent with CONTEXT.md's stated boundary |

## Common Pitfalls

### Pitfall 1: Naive `--orange`→`--accent` rename ships an unverified, likely-failing text/background pairing
**What goes wrong:** Six current rules pair `color:var(--ink)` with `background:var(--orange)` or `var(--hot)`: `.circle-link:hover`, `.service-row:hover` (via its `:before` fill + child selectors), `.submit-button`, `.custom-cursor`, and `::selection`. A mechanical token-name substitution (`--orange`→`--accent`, `--ink`→`--ink-primary`) preserves the *pairing* (dark text on the accent color) but the UI-SPEC's contrast table never verified dark-ink-on-`--accent` — it only verified **white text on `--accent`** (5.77:1, PASS).
**Why it happens:** The retirement checklist operates at the token-name level ("retire `--orange`, replaced by `--accent`") without cross-referencing which *other* token each retiring token was paired with in context.
**How to avoid:** For each of the six pairings above, set the foreground to white/`#FFFFFF` (or a to-be-defined `--on-accent` token) rather than `--ink-primary`, matching the UI-SPEC's one explicitly verified accent-background text pairing. Do this as a deliberate per-selector decision during migration, not a blanket rename.
**Warning signs:** Any selector where `background` resolves to `--accent`/`--accent-hover` and `color` resolves to `--ink-primary` — grep for this combination specifically after migration and manually contrast-check any hit.

### Pitfall 2: Grepping for `--ink` misses three of the four dark-literal families in this file
**What goes wrong:** THEME-03's gate is "grep for old token names returns zero hits." But `#0c0f12` (`.hero`, `.hero-media`), `#0a0c0f` (`.technology`, `.tech-vignette`, duplicated in the 720px media query), and `#080a0d` (`.intro`, `.footer`) are none of them expressed as `var(--ink)` — they're independent hardcoded near-black literals that happen to look similar. A token-name grep passes clean while three dark backgrounds remain unmigrated.
**Why it happens:** The original dark theme was built with ad hoc per-section hex values rather than one consistent `--ink` reference everywhere — visually indistinguishable dark backgrounds, four different literal sources.
**How to avoid:** After migration, grep for the specific hex prefixes `#0c0f12`, `#0a0c0f`, `#080a0d`, `#0c0e12` individually (not just the retired var name) and confirm zero unreviewed hits. Also check the 720px media query block separately — `.tech-vignette`'s background is redeclared there with the same literal family and is easy to miss since it's not adjacent to the base rule in the file.
**Warning signs:** Full-page scroll-through after migration still shows a dark band on `.technology` or `.footer` despite `--ink` being fully retired in `:root`.

### Pitfall 3: Hero text legibility depends entirely on `.hero-shade` + image filters, both of which THEME-03/D-01 remove
**What goes wrong:** Hero text (`.hero-title`, `.hero-eyebrow`, `.hero-bottom>p`, `.hero-index`, `.scroll-cue`, `.video-toggle`) is currently white/light-alpha, legible only because (a) `.hero-media img/video` has `filter:saturate(.62) contrast(1.18) brightness(.58)` darkening the photo, and (b) `.hero-shade` is a separate `linear-gradient` overlay (`#06080af2`→transparent) adding further darkening on top. D-01 explicitly removes the image filter with no bridge filter, and the filter's removal is mandatory (THEME-03). `.hero-shade` is a *different* CSS mechanism (a gradient overlay div, not an image `filter:`) that the UI-SPEC's checklist does not explicitly name for removal — leaving genuine ambiguity about whether it should stay.
**Why it happens:** The checklist's filter-removal row only lists the `filter:` property chain, not the separately-implemented gradient-overlay legibility aid.
**How to avoid:** This is a real open question for the planner/executor, not something this research can resolve alone (see Open Questions below) — but the safe default is to **keep a much lighter, neutral (non-saturating) gradient scrim** derived from the new tokens purely for text-legibility purposes, since removing all darkening treatment while keeping white hero text risks an outright THEME-02 (WCAG AA) failure against an unpredictable raw photo. This is distinct from "re-adding a darkening filter" — it's a legibility aid, not an aesthetic treatment, and D-01's own language ("sin filtro puente") is about the `filter:` property specifically.
**Warning signs:** Hero section fails a contrast check once real (or even placeholder) hero photography loads without any overlay.

### Pitfall 4: `.pulse-dot`/`.scroll-cue`/`.intro-brand` infinite animations aren't on anyone's "flagged, deferred" list
**What goes wrong:** THEME-04 explicitly bans "infinite/uncontrolled looping decorative animation... unless converted to a bounded, triggered, or user-controlled interaction," and the UI-SPEC carves out exactly two exceptions (`.hero-orbit`, `.moving-band`) as "flagged, not removed." Three more `animation: ... infinite` declarations exist in the same file and were not evaluated by the UI-SPEC at all.
**Why it happens:** The UI-SPEC's motion audit focused on the two most visually prominent looping elements (large spinning rings, marquee band); smaller looping affordances (pulse dot, scroll-cue line sweep, intro spinner glyph) are easy to miss in a design-level review.
**How to avoid:** Treat these three the same way as orbit/marquee — either bound them (finite iteration count, triggered once) or explicitly add them to a documented "flagged, deferred" list with the same rationale (touches markup/interaction owned by a later phase). `.intro-brand span`'s spin is the lowest risk since the whole `.intro` overlay self-hides after 1450ms via React state (`components/intro-sequence.tsx`), effectively bounding it in practice even though the CSS itself says `infinite`.
**Warning signs:** A THEME-04 compliance grep for `infinite` in `app/globals.css` returns more than the two UI-SPEC-sanctioned hits.

### Pitfall 5: `--parallax` custom property has no existing clamp — the UI-SPEC's ±8px cap requires a net-new CSS rule, not a value swap
**What goes wrong:** `hooks/use-legacy-parallax.ts` computes `rect.top * speed` (default `speed = 0.1`) with no min/max bound and writes it straight to `--parallax`. `.hero-media`/`.tech-media` consume it as `translateY(var(--parallax,0))` with no clamp. On a tall viewport or fast scroll, this can exceed ±8px today. THEME-04's cap is a **new constraint**, not a retune of an existing value — there is no single "old value" to find/replace here.
**Why it happens:** The parallax effect was designed under the "cinematic" direction where unclamped depth was the intended aesthetic; the moderate-motion spec inverts that intent.
**How to avoid:** Add `clamp(-8px, var(--parallax,0), 8px)` at both consuming selectors. Do not attempt to clamp inside the `.ts` hook (out of this phase's scope per CONTEXT.md).
**Warning signs:** Parallax still visibly exceeds a small, subtle drift on a quick scroll test after migration — check that the `clamp()` wrap was actually added to both `.hero-media` and `.tech-media`, not just one.

## Runtime State Inventory

**Not applicable.** This phase renames/retunes CSS custom-property values and two TypeScript motion constants entirely within this repository's source files (`app/globals.css`, `lib/motion-preferences.ts`). It is not a rename/rebrand/entity-migration phase:

- **Stored data:** None — no database, no persisted records reference CSS token names or motion-constant values.
- **Live service config:** None — no external service (Supabase, n8n, etc.) stores or reads these CSS/motion values.
- **OS-registered state:** None — no task scheduler, process manager, or OS-level registration references these values.
- **Secrets/env vars:** None — no env var name or secret key is tied to a CSS token or motion constant.
- **Build artifacts:** None — `app/globals.css` and `lib/motion-preferences.ts` are source-compiled fresh on every `next build`; no stale artifact caches the old token names.

## Code Examples

### `:root` token block — before/after

```css
/* BEFORE (app/globals.css line 1) */
:root {
  --ink:#0c0e12;--soft:#14171d;--paper:#eeeae3;--orange:#e46d4b;--hot:#ff7852;
  --dark-line:rgba(12,14,18,.18);--light-line:rgba(255,255,255,.18);
  --display:"Space Grotesk","Arial Narrow",Arial,sans-serif;--body:"Inter",Arial,sans-serif;
  --shell:min(calc(100% - 64px),1440px)
}

/* AFTER — values sourced verbatim from 01-UI-SPEC.md's Color and Motion Contract sections */
:root {
  --bg-surface:#FFFFFF;--bg-surface-alt:#EEF1F4;--bg-surface-deep:#E3E8ED;
  --ink-primary:#1C2530;--ink-secondary:#4A5568;
  --accent:#0B6E8F;--accent-hover:#0A5A78;--accent-soft:#E4F0F4;
  --destructive:#B3261E;
  --border-subtle:#DCE2E8;--border-strong:#7C899A;
  --focus-ring:var(--accent);
  --motion-distance-max:24px;--motion-distance-min:12px;
  --motion-duration-fast:200ms;--motion-duration-base:450ms;--motion-duration-slow:650ms;
  --motion-stagger-max:80ms;
  --ease-moderate:cubic-bezier(0.33,1,0.68,1);
  --display:"Space Grotesk","Arial Narrow",Arial,sans-serif;--body:"Inter",Arial,sans-serif;
  --shell:min(calc(100% - 64px),1440px)
}
```

### `[data-reveal]` — before/after

```css
/* BEFORE */
[data-reveal]{opacity:0;transform:translateY(44px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}

/* AFTER */
[data-reveal]{opacity:0;transform:translateY(var(--motion-distance-max));transition:opacity var(--motion-duration-base) var(--ease-moderate),transform var(--motion-duration-base) var(--ease-moderate)}
```

### Lenis lerp retune — before/after

```ts
// BEFORE (lib/motion-preferences.ts)
export const LENIS_LERP = {
  normal: 0.07,
  reduced: 0.15,
} as const

// AFTER
export const LENIS_LERP = {
  normal: 0.1,
  reduced: 0.15,
} as const
```
No other change is needed in this file or in `components/providers/smooth-scroll-provider.tsx` — the provider already imports and consumes `LENIS_LERP`/`getLenisLerp()` correctly [VERIFIED: `components/providers/smooth-scroll-provider.tsx` read directly].

### Parallax clamp — before/after

```css
/* BEFORE */
.hero-media{position:absolute;inset:-8%;transform:translateY(var(--parallax,0));background:#0c0f12}
.tech-media{position:absolute;inset:-10% -5%;transform:translateY(var(--parallax,0))}

/* AFTER */
.hero-media{position:absolute;inset:-8%;transform:translateY(clamp(-8px,var(--parallax,0),8px));background:var(--bg-surface-alt)}
.tech-media{position:absolute;inset:-10% -5%;transform:translateY(clamp(-8px,var(--parallax,0),8px))}
```

## State of the Art

| Old Approach (retired) | New Approach (this phase) | When Changed | Impact |
|---|---|---|---|
| `--ink`/`--paper`/`--orange`/`--hot` — dual-purpose tokens (some serve as both surface and text color depending on context) | Role-segregated tokens (`--bg-surface*` for surfaces, `--ink*` for text only, `--accent*` for the single restricted accent) | This phase | Eliminates the exact ambiguity that caused Pitfall 1 (a token meant `--ink` context-dependently could be a dark bg *or* dark text; the new system never overloads a token's role) |
| Hardcoded motion literals per rule (`44px`, `.9s`, `1.15s`, `cubic-bezier(.16,1,.3,1)`) | Centralized `--motion-*` custom properties in `:root`, consumed by every later phase's `useGSAP()`/CSS reveal rules | This phase | Prevents Pitfall 3 from the milestone-level `PITFALLS.md` (half-migrated "moderate" applied inconsistently) by giving every future section one shared source of truth instead of re-deriving values |
| Lenis `lerp: 0.07` (below Lenis's own documented default) | `lerp: 0.1` (Lenis's documented default) [CITED: lenis.dev / darkroomengineering/lenis docs — default lerp is 0.1] | This phase | Snappier, less "floaty" — directly implements THEME-04's "moderate, not cinematic" requirement at the scroll-engine level |
| Unclamped `--parallax` custom property | `clamp(-8px, var(--parallax,0), 8px)` at CSS consumption points | This phase | Caps the one remaining continuous-motion effect (parallax) without needing to touch the JS/TS calculation logic |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `--soft`'s sole consumer (`.deliverable-image{background}`) should map to `--bg-surface-deep` or `--bg-surface-alt` rather than a net-new token | Migration Map — Color Tokens | Low — this is a single, isolated surface with no verified contrast requirement stated against it in the UI-SPEC (no text sits directly on `.deliverable-image`'s own background, only inside the padded `img`); wrong choice only affects visual tone, not a contrast failure |
| A2 | `.hero`/`.hero-media`'s fallback background (visible only before/if the image fails to load) should be `--bg-surface-alt`, matching the Hero row of the UI-SPEC's recommended section-surface sequence | Migration Map — Color Tokens (catch-all row) | Low — this is a loading-state/fallback color, not a persistently visible surface once the hero image/video loads |
| A3 | The six `--ink`-on-`--orange`/`--hot` pairings (Pitfall 1) should repoint to white text rather than a newly-defined `--on-accent` token | Common Pitfalls, Pitfall 1 | Medium — if the planner instead defines a distinct `--on-accent` token with a non-white value, that value needs its own fresh WCAG verification against `--accent`/`--accent-hover`; using white reuses the UI-SPEC's one already-verified pairing (5.77:1) |
| A4 | `.hero-shade`'s gradient overlay should be kept (in a lighter, re-derived form) for text legibility, distinct from the banned `filter:` darkening chain | Common Pitfalls, Pitfall 3 | High — this is a genuine open design question the UI-SPEC did not resolve; if the planner instead removes `.hero-shade` entirely and D-01's "raw image" transitional state proves illegible with white hero text, THEME-02 (WCAG AA) could fail on the hero section specifically |
| A5 | `.pulse-dot`, `.scroll-cue i:after`, and `.intro-brand span`'s infinite animations should be treated the same as `.hero-orbit`/`.moving-band` (flagged/deferred) rather than fixed in this phase | Common Pitfalls, Pitfall 4 | Medium — if THEME-04's "no infinite/uncontrolled looping" is interpreted strictly and these three are in scope, the phase's acceptance gate (grep for `infinite`) would need to also address them now rather than deferring |

**If this table is empty:** N/A — see rows above.

## Open Questions

1. **Should `.intro` (the full-screen splash/loading overlay) be re-themed in this phase?**
   - What we know: `.intro{background:#080a0d;color:#fff}` is a hardcoded dark literal, structurally identical in nature to every other dark section this phase retires. It is not named in the UI-SPEC's Retirement Checklist, CONTEXT.md's discussion, or the Deferred Ideas list.
   - What's unclear: Whether the omission was intentional (the UI-SPEC's phase-nature statement says it covers "every dark-theme literal/blend-mode/filter in `app/globals.css`" — which would include `.intro`) or an oversight of the design-contract's targeted audit.
   - Recommendation: Treat `.intro` as in-scope for THEME-03 (it is, after all, a literal dark background with `--orange` color references, all within the same file this phase is migrating) unless the planner has reason to defer it. Bring to plan-checker/discuss-phase if the executor wants explicit user sign-off before changing the splash screen's look, since it's the very first thing a visitor sees.

2. **What should `.hero-shade` become — kept as a lighter legibility scrim, or removed entirely?**
   - What we know: D-01 removes the `filter:` darkening chain on hero images with no bridge filter. `.hero-shade` is a separate gradient-overlay div, not covered by that decision's literal wording.
   - What's unclear: Whether keeping *any* darkening overlay (even a much lighter one) conflicts with the spirit of D-01's "raw/unfiltered" transitional acceptance, or whether D-01 only concerns the `img`/`video` element's own `filter:` property.
   - Recommendation: Keep a substantially lightened, token-derived scrim (e.g. a low-opacity `--ink-primary` gradient, not the current near-black `#06080a` family) specifically to protect text legibility, and flag this as a discretionary call the executor should document — removing it entirely risks a THEME-02 (WCAG AA) violation on the hero section once real or even placeholder photography is in place.

3. **Is there a `--success` token for `.form-status.is-success`?**
   - What we know: `.form-status.is-error{color:#ff9c85}` clearly migrates to `--destructive` (`#B3261E`, already verified 6.53:1/5.76:1 in the UI-SPEC). `.form-status.is-success{color:#9ce2a9}` has no corresponding token anywhere in the UI-SPEC's Color section.
   - What's unclear: Whether a new `--success` token should be defined (requiring a fresh WCAG verification against `--bg-surface`) or whether the existing pastel green should simply be darkened/adjusted in place without a named token.
   - Recommendation: Define a `--success` token analogous to `--destructive` (a clearly readable green, e.g. in the `#1E7A3E`–`#2E7D32` range, verified ≥4.5:1 on `--bg-surface`) as part of this phase's token block, since form status is a THEME-02-relevant text/background pair and shouldn't ship unverified.

4. **Should `.moving-band`/`.hero-orbit`'s color tokens (not their animation) be migrated this phase, given CONTEXT.md defers their "treatment"?**
   - What we know: CONTEXT.md's Claude's Discretion note says "Tratamiento de `.hero-orbit`/`.moving-band`... pertenecen a la fase que reescriba el contenido de esa sección." The UI-SPEC's "motion-adjacent, flagged" section is explicit that the *animation* (infinite-loop) treatment is deferred, but does not say the *color tokens* are deferred.
   - What's unclear: Whether "treatment" in CONTEXT.md's discretion note is scoped narrowly to the animation/interaction decision, or broadly enough to include the color values too.
   - Recommendation: Migrate the color tokens now (`.hero-orbit:after{background:var(--accent);box-shadow:0 0 18px var(--accent)}`, `.moving-band{background:var(--accent);color:#fff}` — using white text per Pitfall 1's reasoning since orange/hot retire) since leaving `--orange`/`--hot` literals anywhere would fail THEME-03's "zero old-token literals" gate regardless of whether the animation itself changes. This reading is consistent with the phase boundary in CONTEXT.md ("reemplaza por completo el sistema de tokens de color... aplicados a todo el sitio existente").

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/dev server | ✓ | v24.16.0 [VERIFIED: `node --version`] | — |
| npm | Package management | ✓ | 11.13.0 [VERIFIED: `npm --version`] | — |
| `lenis` (already installed) | Scroll-lerp retune | ✓ | 1.3.25 [VERIFIED: package.json] | — |
| `gsap` (already installed) | `CustomEase`/motion tokens | ✓ | 3.15.0 [VERIFIED: package.json] | — |
| No new external tools/services required this phase | — | — | — | — |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None — this phase requires no new tooling.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None installed.** `package.json` devDependencies contain only `@types/*`, `eslint`, `eslint-config-next`, `typescript` — no `jest`/`vitest`/`playwright` [VERIFIED: package.json read directly]. `REQUIREMENTS.md`'s Out of Scope table explicitly excludes "Tests automatizados (unit/E2E)" for this milestone. |
| Config file | none |
| Quick run command | `npm run lint && npm run typecheck` (both exist; fast, no test runner needed) |
| Full suite command | `npm run build` (production build — the closest thing to an integration check this project has; per `PITFALLS.md` Pitfall 9's lesson, several regressions in this codebase's domain only surface in a production build, not `next dev`) |

### Phase Requirements → Verification Map
| Req ID | Behavior | Verification Type | Command / Method | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| THEME-01 | Light/celeste palette, single restricted accent, no dark backgrounds remain | manual visual QA + grep audit | `npm run build` (compiles) then full-page scroll-through; grep `app/globals.css` for `#0c0e12`, `#0c0f12`, `#0a0c0f`, `#080a0d`, `--ink:`, `--soft:`, `--paper:`, `--orange:`, `--hot:` → expect zero hits outside comments | N/A — no test file, manual gate |
| THEME-02 | WCAG AA contrast on all text/background and focus-ring pairs | manual — browser DevTools/axe/WebAIM contrast checker | Run Lighthouse or axe DevTools accessibility audit against the built site (`npm run build && npm start`), specifically the `color-contrast` rule; manually re-check the six Pitfall-1 pairings and the hero-text-over-photo pairing (Open Question 2) since automated tools can't evaluate text-over-photograph contrast reliably | N/A — no automated contrast test in this repo |
| THEME-03 | Zero surviving dark-theme literals/blend-modes/filters | grep audit (see THEME-01 command) + `grep -n "mix-blend-mode\|backdrop-filter\|filter:" app/globals.css` reviewed line-by-line against this research's catalogue | `npm run lint` (catches nothing CSS-specific, but confirms no `.tsx` regressions from any incidental touch) | N/A |
| THEME-04 | Literal moderate-motion spec, consistently applied, no pinning/scrub, no infinite loops beyond flagged exceptions | grep audit: `grep -n "infinite" app/globals.css` → expect only `.hero-orbit`/`orbit-one`/`orbit-two` and `.moving-band-track` (2 justified survivors) unless Open Question 4/Pitfall 4 items are also fixed this phase; `grep -n "ScrollTrigger.create" .` → expect no `pin:` or `scrub:` anywhere in the codebase (none exist yet, confirm this stays true) | `npm run build` | N/A |

### Sampling Rate
- **Per task commit:** `npm run lint && npm run typecheck`
- **Per wave/phase merge:** `npm run build` + manual visual/contrast pass described above
- **Phase gate:** All four grep audits above return the expected (documented) hit count, and a full-page scroll-through at both 1440px and 375px viewport widths shows no dark backgrounds, no washed-out/illegible text, and consistent (not per-section-varying) reveal timing

### Wave 0 Gaps
- No test framework exists and none is being added (out of scope per REQUIREMENTS.md). The verification for this phase is entirely grep-audit + manual visual/contrast-tool based, as detailed above — this is a deliberate, already-documented project decision, not a gap to fill.
- Recommend the planner define the exact grep commands above as literal verification steps in the plan's acceptance criteria, since "no test framework" otherwise leaves THEME-01–04 with no objective completion signal beyond subjective visual review.

## Security Domain

`security_enforcement: true`, `security_asvs_level: 1` per `.planning/config.json`. This phase has **no security-relevant surface** — it changes CSS custom-property values and two numeric motion constants; it does not touch authentication, session handling, access control, input validation/handling, or cryptography.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | This site has no authentication; not touched by this phase |
| V3 Session Management | No | No sessions exist or are touched |
| V4 Access Control | No | No access-control logic exists or is touched |
| V5 Input Validation | No | No new input handling is introduced; the contact form's existing Zod validation (`lib/contact-schema.ts`) is untouched by this phase — only its visual token (border/focus color) changes |
| V6 Cryptography | No | No cryptographic code exists or is touched |

### Known Threat Patterns for this stack
None applicable to this phase's change surface (pure presentational CSS + client-side motion constants). No new attack surface is introduced.

## Sources

### Primary (HIGH confidence)
- `app/globals.css` — read directly, in full, line by line (this research's primary source for the entire Migration Map)
- `lib/motion-preferences.ts` — read directly (exact Lenis lerp constant location)
- `hooks/use-legacy-parallax.ts` — read directly (exact `--parallax` calculation/no-clamp confirmation)
- `components/providers/smooth-scroll-provider.tsx` — read directly (confirms no provider-level changes needed)
- `components/intro-sequence.tsx` — read directly (confirms `.intro`'s 1450ms self-hiding lifecycle)
- `.planning/phases/01-.../01-UI-SPEC.md` — approved design contract, source of all new token values and Motion Contract table
- `.planning/phases/01-.../01-CONTEXT.md` — locked user decisions and phase boundary
- `.planning/REQUIREMENTS.md` — THEME-01–04 requirement text
- `package.json` — verified installed versions of `lenis` (1.3.25) and `gsap` (3.15.0)
- [CustomEase | GSAP Docs](https://gsap.com/docs/v3/Eases/CustomEase/) — confirms `CustomEase.create()` accepts raw cubic-bezier numeric strings

### Secondary (MEDIUM confidence)
- Lenis default `lerp` value (`0.1`) — cross-checked via web search against [darkroomengineering/lenis (GitHub)](https://github.com/darkroomengineering/lenis) and [lenis.dev](https://www.lenis.dev/) documentation summaries; independently consistent with the UI-SPEC's own claim
- `.planning/research/PITFALLS.md` (milestone-level) — Pitfalls 1, 2, 3 directly informed this phase's dark-literal audit and contrast-gap analysis

### Tertiary (LOW confidence)
- None — all claims in this research trace to either direct codebase reads or the already-approved UI-SPEC/CONTEXT documents.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, versions verified directly from `package.json`
- Architecture / migration map: HIGH — derived from a full direct read of the only file in scope (`app/globals.css`), cross-referenced line-by-line against the UI-SPEC
- Pitfalls: HIGH for the codebase-derived findings (near-duplicate literals, uncovered infinite animations, unverified contrast pairings — all directly observed in the file); MEDIUM for the design-judgment recommendations (hero-shade treatment, `.intro` scope) since these require a human/planner decision this research can inform but not make

**Research date:** 2026-07-18
**Valid until:** Valid for the lifetime of this phase (single-shot CSS/constant migration, not an evolving dependency) — re-verify only if `app/globals.css` or `lib/motion-preferences.ts` change before this phase executes
