---
phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado
plan: 02
subsystem: ui
tags: [css, theme-migration, wcag, motion, parallax]

# Dependency graph
requires: ["01-01"]
provides:
  - "Secciones Apertura (.intro), Navegación (.site-header/.menu-overlay), Hero y Perspectiva/Statement migradas al layer de tokens claros"
  - "Parallax de .hero-media clampeado a ±8px (THEME-04) vía clamp(-8px,var(--parallax,0),8px)"
  - "Cero mix-blend-mode:difference en todo app/globals.css (retirado de .site-header y .frame-coordinates)"
  - "Filtros de oscurecimiento de imagen retirados de .hero-media img/.hero-video y .statement-visual img (D-01); .hero-noise eliminado"
affects: ["01-03", "01-04"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "color-mix(in srgb, var(--token) X%, transparent) para derivar scrims/sombras de baja opacidad a partir de tokens claros, en vez de literales hex+alpha del tema oscuro"
    - "Animaciones decorativas infinite acotadas a un conteo finito de iteraciones (p.ej. `animation: name 2s 3`) cuando no aportan tras la migración a movimiento moderado"

key-files:
  created: []
  modified:
    - app/globals.css

key-decisions:
  - "Open Question #1 resuelta: .intro (splash) sí migra en este plan — usa var(--bg-surface)/var(--ink-primary) en vez del near-black #080a0d/#fff"
  - "Open Question #2 resuelta: .hero-shade se mantiene como scrim de legibilidad, no como oscurecimiento — rederivado con color-mix(in srgb,var(--ink-primary) X%,transparent) en vez del gradiente near-black original"
  - "Open Question #4 resuelta: .hero-orbit migra solo su color (border/accent), la animación orbit 24s/18s infinite se conserva sin cambios (diferida a Fase 3+ por CONTEXT.md)"
  - ".hero-gridlines rederivado a var(--border-subtle) en vez de eliminarse — mantiene la textura de grid sutil bajo el tema claro sin depender de blancos invisibles"
  - "Pitfall 4 (animaciones infinite decorativas): .pulse-dot y .scroll-cue i:after acotados a 3 iteraciones (`animation: name 2s 3`) en vez de infinite; .hero-orbit orbit e .intro-brand span spin quedan explícitamente flagged/diferidos (acotados por el auto-hide de 1450ms del intro o por decisión de Open Question #4)"
  - "Pitfall 1 (contraste en hover de acento) aplicado en .menu-overlay (color:#FFFFFF sobre background:var(--accent)) y .circle-link:hover (color:#FFFFFF sobre background:var(--accent)), en vez de var(--ink)/var(--hot) sin verificar"
  - ".media-frame background rederivado de #bbb a var(--bg-surface-deep) para consistencia de tokens (decisión discrecional del plan, no un literal de tema oscuro)"

patterns-established:
  - "Todo scrim/sombra de baja opacidad en secciones futuras (Capacidades, Tecnología, Proceso, Contacto — Planes 03-04) debe usar color-mix(in srgb,var(--token) X%,transparent) en vez de literales hex+alpha heredados del tema oscuro"

requirements-completed: [THEME-01, THEME-02, THEME-03, THEME-04]

# Metrics
duration: ~25min
completed: 2026-07-19
---

# Phase 01 Plan 02: Migración de Apertura, Navegación, Hero y Perspectiva al tema claro — Summary

**Las cuatro secciones superiores del sitio (.intro, .site-header/.menu-overlay, .hero, .statement) migradas de fondos near-black y `mix-blend-mode:difference` a los tokens claros del Plan 01, con parallax de hero clampeado a ±8px y filtros de imagen retirados por completo.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 3 completed
- **Files modified:** 1 (app/globals.css)

## Accomplishments

- **Apertura (`.intro`):** splash migrado de `#080a0d`/`#fff` a `var(--bg-surface)`/`var(--ink-primary)`; `:after`, `.intro-brand span` e `.intro-line i` migrados de `var(--orange)` a `var(--accent)`; divisor `.intro-line` migrado de `#ffffff26` a `var(--border-subtle)`.
- **Navegación:** `.site-header` sin `mix-blend-mode:difference` — ahora fondo/color sólido tokenizado (`color:var(--ink-primary)`); `.brand-symbol` migrado a `var(--accent)`; `.menu-overlay` usa `background:var(--accent)` con `color:#FFFFFF` (Pitfall 1); `.menu-overlay nav a` border migrado a `var(--border-subtle)`.
- **Hero:** fondos `.hero`/`.hero-media` migrados de `#0c0f12`/`#fff` a `var(--bg-surface-alt)`/`var(--ink-primary)`; parallax clampeado con `clamp(-8px,var(--parallax,0),8px)` (THEME-04); filtro `saturate/contrast/brightness` retirado de `.hero-media img`/`.hero-video` (D-01); `.hero-noise` (grano SVG) eliminado por completo; `.hero-shade` rederivado como scrim claro con `color-mix()` sobre `var(--ink-primary)`; `.hero-gridlines` rederivado a `var(--border-subtle)`; `.hero-orbit` color migrado a `var(--accent)`/`var(--border-subtle)` conservando la animación `orbit` infinite (diferida); `.pulse-dot`/`.scroll-cue i:after` migrados a `var(--accent)` con animaciones acotadas a 3 iteraciones; texto del hero (`eyebrow`, `hero-bottom>p`, `hero-index`, `scroll-cue`, `title-line-accent`) invertido a `var(--ink-secondary)`/`var(--accent)`; `.circle-link` border migrado a `var(--border-strong)`, hover con `color:#FFFFFF` sobre `background:var(--accent)` (Pitfall 1).
- **Perspectiva/Statement:** `.statement` migrado a `var(--bg-surface)`; `.section-kicker`/`.section-kicker.light` migrados a `var(--border-subtle)`/`var(--ink-secondary)`; `em` migrado a `var(--accent)`; `.media-frame` background migrado a `var(--bg-surface-deep)`, borde `:after` a `var(--border-subtle)`; filtro `saturate/contrast` retirado de `.statement-visual img` (regla vacía removida por completo, D-01); `.frame-coordinates` sin `mix-blend-mode:difference`, color sólido `var(--ink-primary)`; `.statement-aside>p:nth-child(2)` y `.metric` border migrados a `var(--ink-secondary)`/`var(--border-subtle)`.
- `npm run build` (Next.js 16.2.10 con Turbopack) compila sin errores tras cada una de las tres tareas.

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrar Apertura (.intro) y Navegación (header + menu-overlay)** - `cfd2a69` (feat)
2. **Task 2: Migrar Hero (fondos, filtros, scrim, orbit, animaciones infinite, contraste)** - `6819793` (feat)
3. **Task 3: Migrar Perspectiva/Statement (kicker, em, filtros, blend, bordes, literales)** - `c92899c` (feat)

## Files Created/Modified

- `app/globals.css` - Bloques `/* Apertura */`, `/* Navegación */`, `/* Hero */` y `/* Perspectiva */` migrados íntegramente a los tokens claros del Plan 01; `mix-blend-mode` retirado de todo el archivo; parallax de hero clampeado; filtros de imagen y `.hero-noise` eliminados.

## Decisions Made

- Open Question #1 (`.intro` in-scope): resuelta — el splash migra al tema claro en este plan, tokenizado con `var(--bg-surface)`/`var(--ink-primary)`.
- Open Question #2 (`.hero-shade`): resuelta — se mantiene como scrim de legibilidad, rederivado con `color-mix(in srgb,var(--ink-primary) X%,transparent)` (22%/10%/14% en los distintos stops), no como oscurecimiento tipo `filter`.
- Open Question #4 (`.hero-orbit`): resuelta — solo el color migra (`var(--border-subtle)`/`var(--accent)`); la animación `orbit 24s/18s linear infinite` se conserva sin cambios, diferida a Fase 3+.
- Pitfall 4 (animaciones `infinite` decorativas del hero): `.pulse-dot` y `.scroll-cue i:after` acotados a `animation: name 2s 3` (3 iteraciones) en vez de `infinite`; `grep -c "infinite"` bajó de un baseline mayor a 3 ocurrencias en el archivo completo, sin aumentar. `.hero-orbit` `orbit` e `.intro-brand span` `spin` quedan como infinite documentado/flagged (orbit diferido por Open Question #4; spin acotado en la práctica por el auto-hide de 1450ms de `intro-sequence.tsx`, según lo indicado por el plan).
- Pitfall 1 (contraste en hover de acento): `.menu-overlay` y `.circle-link:hover` usan `color:#FFFFFF` sobre `background:var(--accent)`, no `var(--ink)`/`var(--hot)` sin verificar.
- `.hero-gridlines` se rederivó a `var(--border-subtle)` (no se eliminó) para conservar la textura de grid del hero bajo el tema claro.
- `.media-frame` background rederivado de `#bbb` a `var(--bg-surface-deep)` por consistencia de tokens — decisión discrecional documentada en el plan, no era un literal heredado del tema oscuro.
- `.statement-visual img{filter:saturate(.75) contrast(1.08)}` quedó como regla vacía tras retirar `filter` (D-01); se eliminó la regla completa en vez de dejarla vacía.

## Deviations from Plan

None - plan executed exactly as written. Todas las decisiones discrecionales mencionadas (scrim de hero, gridlines, media-frame background) estaban explícitamente delegadas al ejecutor por el propio texto del plan ("documentar como llamada discrecional" / "documentar la decisión"), no constituyen desviaciones de las instrucciones.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Apertura, Navegación, Hero y Perspectiva renderizan íntegramente con los tokens claros del Plan 01; `grep -n "mix-blend-mode" app/globals.css` no produce hits en todo el archivo.
- Los bloques Capacidades, Tecnología, Proceso, Contacto, Footer y Cursor siguen referenciando tokens legacy retirados (`--ink`, `--paper`, `--soft`, `--orange`, `--hot`, `--dark-line`, `--light-line`) — comportamiento esperado y documentado, a resolver en los Planes 03 y 04 según el alcance definido en el roadmap de la fase.
- El patrón `color-mix(in srgb,var(--token) X%,transparent)` establecido en este plan para scrims/sombras de baja opacidad debe reutilizarse en los Planes 03-04 (p.ej. `.tech-vignette`, `.contact-section:before`) en vez de introducir nuevos literales hex+alpha.

---
*Phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado*
*Completed: 2026-07-19*

## Self-Check: PASSED

- FOUND: app/globals.css
- FOUND: .planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-02-SUMMARY.md
- FOUND commit: cfd2a69
- FOUND commit: 6819793
- FOUND commit: c92899c
