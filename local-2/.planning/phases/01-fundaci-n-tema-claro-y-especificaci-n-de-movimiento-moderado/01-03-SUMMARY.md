---
phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado
plan: 03
subsystem: ui
tags: [css, theme-migration, wcag, motion, parallax, contrast]

# Dependency graph
requires: ["01-01", "01-02"]
provides:
  - "Secciones Capacidades, Tecnología y Proceso migradas al layer de tokens claros"
  - "Flip completo de .capabilities de superficie oscura (--ink) a superficie clara (--bg-surface-alt), con inversión de todo su texto light-on-dark a dark-on-light"
  - "Parallax de .tech-media clampeado a ±8px (THEME-04), segundo consumidor del patrón junto a .hero-media del Plan 02"
  - "Cero literales #0a0c0f en todo app/globals.css (base + duplicado del media query 720px de .tech-vignette migrados en lockstep)"
  - "Filtros de imagen retirados de .tech-media img y .deliverable-image img (D-01)"
affects: ["01-04"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "color-mix(in srgb, var(--bg-surface) X%, transparent) para re-derivar vignettes/scrims de legibilidad sobre foto, invirtiendo la polaridad del scrim (antes oscurecía hacia negro, ahora aclara hacia blanco) manteniendo los mismos stops de opacidad que el original"

key-files:
  created: []
  modified:
    - app/globals.css

key-decisions:
  - "Pitfall 1 en Capacidades: .service-row:hover y .moving-band usan color:#FFFFFF sobre background:var(--accent) (no var(--ink), que ya no existe) — mismo patrón verificado del Plan 02"
  - ".tech-vignette (base y duplicado del media query 720px) re-derivado con color-mix(in srgb,var(--bg-surface) X%,transparent) en vez de eliminarse — se preservan los mismos stops/porcentajes de opacidad del original (10%/90%/94% en base; 95%/15%/72% en 720px), solo se invierte el color base de near-black a var(--bg-surface), continuando el patrón color-mix establecido en el Plan 02 para .hero-shade"
  - "Open Question #4 (moving-band): resuelta — solo el color migra (var(--accent)/#FFFFFF); la animación marquee 24s linear infinite se conserva sin cambios, diferida a Fase 3+ por CONTEXT.md, igual que .hero-orbit en el Plan 02"
  - "--soft (Assumptions Log A1) migrado a var(--bg-surface-deep) en .deliverable-image, consistente con el uso de --bg-surface-deep en .media-frame del Plan 02"

patterns-established:
  - "Vignettes/scrims de legibilidad sobre imagen en secciones futuras deben re-derivarse con color-mix(in srgb,var(--token) X%,transparent) preservando los stops de opacidad originales, no eliminarse sin más — el objetivo es adaptar la polaridad del scrim al tema claro, no perder la función de legibilidad"

requirements-completed: [THEME-01, THEME-02, THEME-03, THEME-04]

# Metrics
duration: ~20min
completed: 2026-07-19
---

# Phase 01 Plan 03: Migración de Capacidades, Tecnología y Proceso al tema claro — Summary

**Las tres secciones centrales del sitio (.capabilities, .technology, .process-section) migradas de fondos oscuros/near-black y literales hex a los tokens claros del Plan 01, con el flip completo de Capacidades de superficie oscura a clara, el vignette de Tecnología re-derivado con color-mix en vez de eliminado, y el parallax de tech-media clampeado a ±8px.**

## Performance

- **Duration:** ~20 min
- **Tasks:** 3 completed
- **Files modified:** 1 (app/globals.css)

## Accomplishments

- **Capacidades:** `.capabilities` migrado de `background:var(--ink);color:#fff` a `background:var(--bg-surface-alt);color:var(--ink-primary)` (banda gris en la secuencia gris-arriba/blanco-abajo). Todo el texto light-on-dark de la sección invertido a `var(--ink-secondary)` (`.capabilities-heading p`, `.service-number`, `.service-detail`). Bordes (`.service-list`, `.service-row`, `.service-row>span:last-child`) migrados a `var(--border-subtle)`/`var(--border-strong)`. Pitfall 1 resuelto: `.service-row:before` usa `var(--accent)` como relleno de hover, y tanto `.service-row:hover` como `.service-row:hover .service-number/.service-detail` usan `color:#FFFFFF` (antes `var(--ink)`/`#0c0e12a6` sin verificar). `.moving-band` migrado a `background:var(--accent);color:#FFFFFF` (Open Question #4) conservando `animation:marquee 24s linear infinite` sin cambios (diferida).
- **Tecnología:** `.technology` migrado de `#0a0c0f`/`#fff` a `var(--bg-surface)`/`var(--ink-primary)` (banda blanca). `.tech-media` parallax clampeado con `clamp(-8px,var(--parallax,0),8px)` (THEME-04, segundo consumidor del patrón). Filtro `grayscale(.25) contrast(1.15) brightness(.6)` retirado por completo de `.tech-media img` (D-01). `.tech-vignette` (Pitfall 2) re-derivado en AMBAS declaraciones — base y duplicado dentro del media query `max-width:720px` — con `color-mix(in srgb,var(--bg-surface) X%,transparent)` preservando los mismos stops de opacidad del original pero invirtiendo la polaridad de oscurecer-hacia-negro a aclarar-hacia-blanco. `.tech-specs span` y `.tech-caption` migrados a `var(--ink-secondary)`.
- **Proceso:** `.process-section` migrado de `var(--paper)` a `var(--bg-surface-alt)` (banda gris). Bordes (`.process-list`, `.process-step`, `.file-types span`) migrados a `var(--border-subtle)`. Literales `#0c0e12XX` (`.process-intro>p`, `.process-step>span`, `.process-step p`, `.deliverable-copy>p`) migrados a `var(--ink-secondary)`. `.process-step i` (barra de hover) migrado a `var(--accent)`. `.deliverable-image` migrado de `var(--soft)` a `var(--bg-surface-deep)` (Assumptions Log A1). Filtro `saturate(.65) contrast(1.1)` retirado de `.deliverable-image img` (D-01).
- `npm run build` (Next.js 16.2.10 con Turbopack) compila sin errores tras cada una de las tres tareas.

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrar Capacidades (flip de sección oscura + contraste hover + moving-band)** - `397058a` (feat)
2. **Task 2: Migrar Tecnología (fondo, filtro tech-media, vignette + duplicado media query, parallax clamp)** - `96d2b63` (feat)
3. **Task 3: Migrar Proceso (paper, bordes, literales, --soft, filtro deliverable)** - `9b807fa` (feat)

## Files Created/Modified

- `app/globals.css` - Bloques `/* Capacidades */`, `/* Tecnología */` (base + duplicado en `@media(max-width:720px)`) y `/* Proceso */` migrados íntegramente a los tokens claros del Plan 01; cero literales `#0a0c0f` en todo el archivo; filtros de imagen retirados de `.tech-media img` y `.deliverable-image img`; parallax de `.tech-media` clampeado.

## Decisions Made

- Pitfall 1 (Capacidades): `.service-row:hover` y `.moving-band` usan `color:#FFFFFF` sobre `background:var(--accent)`, siguiendo el mismo patrón verificado ya establecido en el Plan 02 para `.menu-overlay` y `.circle-link:hover`.
- `.tech-vignette` (Pitfall 2): en vez de eliminarse, se re-derivó con `color-mix(in srgb,var(--bg-surface) X%,transparent)` en ambas declaraciones (base y duplicado 720px), preservando los mismos stops de opacidad del gradiente original (10%/90%/94% en base; 95%/15%/72% en 720px) pero invirtiendo la polaridad de un scrim que oscurecía hacia negro a uno que aclara hacia blanco — mantiene la función de legibilidad de texto sobre foto bajo el tema claro, continuando el patrón `color-mix` que el Plan 02 estableció para `.hero-shade`.
- Open Question #4 (`.moving-band`): resuelta — solo el color migra (`var(--accent)`/`#FFFFFF`); la animación `marquee 24s linear infinite` se conserva sin cambios, diferida a Fase 3+ por CONTEXT.md, análogo a `.hero-orbit` en el Plan 02.
- `--soft` (Assumptions Log A1): migrado a `var(--bg-surface-deep)` en `.deliverable-image`, consistente con el uso de `--bg-surface-deep` que el Plan 02 ya estableció para `.media-frame`.

## Deviations from Plan

None - plan executed exactly as written. La decisión de re-derivar `.tech-vignette` con `color-mix` en vez de eliminarlo estaba explícitamente delegada al ejecutor por el propio texto del plan ("eliminarlo o re-derivarlo... documentar la decisión"), no constituye una desviación de las instrucciones.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Capacidades, Tecnología y Proceso renderizan íntegramente con los tokens claros del Plan 01; `grep -n "#0a0c0f" app/globals.css` no produce hits en todo el archivo.
- `grep -c "clamp(-8px,var(--parallax,0),8px)" app/globals.css` produce 2 hits (`.hero-media` del Plan 02 + `.tech-media` de este plan), confirmando THEME-04 aplicado consistentemente.
- Solo la sección Contacto y el Footer siguen referenciando tokens legacy retirados (`--ink`, `--orange`, `--hot`, `--light-line`) — comportamiento esperado, a resolver en el Plan 04 según el alcance definido en el roadmap de la fase.
- El patrón `color-mix(in srgb,var(--token) X%,transparent)` reutilizado en este plan para `.tech-vignette` debe aplicarse también en el Plan 04 para scrims equivalentes en Contacto (p.ej. `.contact-section:before`, `.contact-backdrop`).

---
*Phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado*
*Completed: 2026-07-19*

## Self-Check: PASSED

- FOUND: app/globals.css
- FOUND: .planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-03-SUMMARY.md
- FOUND commit: 397058a
- FOUND commit: 96d2b63
- FOUND commit: 9b807fa
