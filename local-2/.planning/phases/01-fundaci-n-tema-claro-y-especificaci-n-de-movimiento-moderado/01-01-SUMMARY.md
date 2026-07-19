---
phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado
plan: 01
subsystem: ui
tags: [css, custom-properties, design-tokens, motion, lenis, wcag]

# Dependency graph
requires: []
provides:
  - "Layer completo de 13 tokens de color claros WCAG AA en :root (app/globals.css)"
  - "7 tokens numéricos de movimiento moderado en :root (motion-distance-*, motion-duration-*, motion-stagger-max, ease-moderate)"
  - "Reglas base globales (html/body/::selection) migradas a los nuevos tokens de color"
  - "Sistema de reveal ([data-reveal], .title-line) migrado a los tokens de movimiento"
  - "LENIS_LERP.normal retuneado a 0.1 (moderado, antes 0.07 cinematográfico)"
affects: [01-02, 01-03, 01-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS custom properties como fuente única de verdad para color y movimiento (:root en app/globals.css)"
    - "Tokens de movimiento numéricos consumidos vía var(--motion-*) en vez de literales embebidos en cada regla de transición"

key-files:
  created: []
  modified:
    - app/globals.css
    - lib/motion-preferences.ts

key-decisions:
  - "--motion-stagger-max fijado en 60ms (no 80ms) por instrucción explícita del plan, que corrige un error del bloque de ejemplo en 01-RESEARCH.md"
  - "--success:#1E7A3E definido para .form-status.is-success (consumo futuro en Plan 04), contraste ≈4.77:1 sobre --bg-surface, cumple AA"
  - "::selection corregido según Pitfall 1: texto blanco sobre --accent (par verificado 5.77:1), no el par oscuro-sobre-acento anterior sin verificar"
  - "PALETA-DE-MARCA.md NO se actualiza en esta fase (documentación de referencia, fuera de alcance de ejecución, nota D-02 del plan)"

patterns-established:
  - "Todo nuevo consumo de color/movimiento en secciones futuras debe referenciar var(--bg-surface*|--ink*|--accent*|--border*|--motion-*|--ease-moderate) en vez de literales hex/ms"

requirements-completed: [THEME-01, THEME-02, THEME-03, THEME-04]

# Metrics
duration: ~15min
completed: 2026-07-18
---

# Phase 01 Plan 01: Fundación de tema claro y movimiento moderado — Summary

**Bloque `:root` de app/globals.css reescrito con 20 tokens claros WCAG AA + movimiento moderado; reglas base y sistema de reveal migrados; Lenis lerp retuneado de 0.07 a 0.1.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2 completed
- **Files modified:** 2 (app/globals.css, lib/motion-preferences.ts)

## Accomplishments
- Bloque `:root` de `app/globals.css` reescrito íntegramente: los 7 tokens legacy oscuros (`--ink`, `--soft`, `--paper`, `--orange`, `--hot`, `--dark-line`, `--light-line`) fueron reemplazados por 20 tokens nuevos — 13 de color (`--bg-surface`, `--bg-surface-alt`, `--bg-surface-deep`, `--ink-primary`, `--ink-secondary`, `--accent`, `--accent-hover`, `--accent-soft`, `--destructive`, `--success`, `--border-subtle`, `--border-strong`, `--focus-ring`) y 7 de movimiento (`--motion-distance-max`, `--motion-distance-min`, `--motion-duration-fast`, `--motion-duration-base`, `--motion-duration-slow`, `--motion-stagger-max`, `--ease-moderate`), con `--display`/`--body`/`--shell` conservados sin cambios.
- Consolidación tipográfica: `.mono-label,.section-kicker,.hero-index,.scroll-cue,.frame-coordinates,.tech-caption` pasó de `font-weight:600` a `font-weight:500` (sistema de exactamente 2 pesos: 500/400).
- Reglas base globales migradas a tokens: `html{background:var(--bg-surface)}`, `body{background:var(--bg-surface);color:var(--ink-primary)}`, `::selection{background:var(--accent);color:#FFFFFF}` (fix del Pitfall 1 — antes emparejaba texto oscuro sobre acento sin verificar contraste).
- Sistema de reveal (`[data-reveal]`, `.title-line[data-reveal]>span`) migrado a `var(--motion-distance-max)`, `var(--motion-duration-base)`, `var(--motion-duration-slow)`, `var(--ease-moderate)`; stagger retuneado a cadencia consistente de 60ms (`.06s/.12s/.18s`, antes `.08s/.16s/.23s`).
- `lib/motion-preferences.ts`: `LENIS_LERP.normal` retuneado de `0.07` a `0.1` (lerp moderado documentado de Lenis); `reduced: 0.15` sin cambios.
- `npm run typecheck` pasa sin errores tras ambos cambios.

## Task Commits

Each task was committed atomically:

1. **Task 1: Reescribir el bloque :root con el layer de tokens claros + tokens de movimiento** - `1411cba` (feat)
2. **Task 2: Migrar reglas base globales + sistema de reveal a tokens + retunear Lenis lerp** - `b85720a` (feat)

## Files Created/Modified
- `app/globals.css` - Bloque `:root` reescrito (20 tokens nuevos, legacy retirado); `.mono-label` group a font-weight:500; `html`/`body`/`::selection` migrados; `[data-reveal]`/`.title-line` migrados a tokens de movimiento y stagger de 60ms
- `lib/motion-preferences.ts` - `LENIS_LERP.normal` de 0.07 a 0.1

## Decisions Made
- `--motion-stagger-max:60ms` (no 80ms) — el plan advirtió explícitamente que el bloque de ejemplo de 01-RESEARCH.md mostraba 80ms por error; se usó 60ms conforme al UI-SPEC y al quality gate de la fase.
- `--success:#1E7A3E` definido en este plan aunque su primer consumidor (`.form-status.is-success`) se implementará en el Plan 04 — se adelantó su definición porque forma parte del layer de tokens fundacional que este plan entrega.
- Se dejaron intencionalmente sin migrar los usos de tokens legacy (`--ink`, `--paper`, `--orange`, `--hot`, `--dark-line`, `--light-line`) fuera del bloque `:root` y de las reglas base/reveal — esos usos (hero, capabilities, tecnología, proceso, contacto, footer, cursor) pertenecen a los Planes 02–04 según el alcance definido en el plan. Estos selectores ahora referencian custom properties no definidas hasta que esos planes migren sus consumidores; es el comportamiento esperado y documentado como "cimiento" en el objetivo del plan.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Todos los tokens de color y movimiento del UI-SPEC existen en `:root` y son consumibles por los Planes 02, 03 y 04.
- `LENIS_LERP.normal = 0.1` ya activo; ningún consumidor adicional requiere cambios (`getLenisLerp()` y `components/providers/smooth-scroll-provider.tsx` sin tocar, como especificaba el plan).
- Pendiente para planes siguientes: migrar los selectores de sección (hero, capabilities, tecnología, proceso, contacto, footer, cursor, intro, navegación) que aún referencian los tokens legacy retirados — hasta entonces esas reglas usan variables CSS no definidas (fallback del navegador a `initial`/`unset`, comportamiento visual roto intencional y documentado hasta que los Planes 02-04 ejecuten).

---
*Phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado*
*Completed: 2026-07-18*

## Self-Check: PASSED

- FOUND: app/globals.css
- FOUND: lib/motion-preferences.ts
- FOUND: .planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-01-SUMMARY.md
- FOUND commit: 1411cba
- FOUND commit: b85720a
