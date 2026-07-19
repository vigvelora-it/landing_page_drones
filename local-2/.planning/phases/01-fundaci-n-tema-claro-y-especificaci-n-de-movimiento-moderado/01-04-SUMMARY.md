---
phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado
plan: 04
subsystem: ui
tags: [css, theme-migration, wcag, motion, audit, contrast]

# Dependency graph
requires: ["01-01", "01-02", "01-03"]
provides:
  - "Secciones Contacto, Footer, Cursor, environment-badge y video-toggle migradas al layer de tokens claros"
  - "Cierre completo de la migración de tema: cero literales oscuros/blend-mode/backdrop-filter en todo app/globals.css"
  - "Audit de fase completo (THEME-01/02/03/04) ejecutado y verificado sobre el archivo íntegro"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Confirmado en el cierre de fase: color-mix(in srgb, var(--token) X%, transparent) y tokens semánticos (--success/--destructive) como único vocabulario de color permitido en app/globals.css"

key-files:
  created: []
  modified:
    - app/globals.css

key-decisions:
  - "Glow ring decorativo .contact-section:before (border/box-shadow blanco-sobre-blanco #ffffff14/05/04) eliminado por completo en vez de re-derivado — sobre --bg-surface (blanco) el efecto es invisible por definición y no aporta función de legibilidad, a diferencia de los scrims/vignettes de Hero/Tecnología que sí se preservaron con color-mix en Planes 02-03"
  - ".contact-backdrop conserva opacity:.12 sin cambios (no es un literal de color del tema oscuro, es composición); el filtro grayscale(1) de su <img> se retiró (D-01) dejando la imagen de fondo en su color original a baja opacidad sobre --bg-surface"
  - "Footer confirma Discretion Call #3 (ya anunciado en 01-UI-SPEC.md desde el Plan 01): --bg-surface-deep, no una banda oscura de cierre — footer y hero comparten ahora la misma superficie gris-azul clara que --bg-surface-deep aporta en .media-frame/.deliverable-image"
  - ".environment-badge pierde backdrop-filter:blur(10px) por completo (Retirement Checklist) y pasa a fondo sólido --bg-surface-deep con borde --border-subtle — ya no es un elemento 'glass' sobre contenido, es una etiqueta sólida de entorno"
  - "Audit de fase: los 4 supervivientes de animación infinite documentados en Planes 02/03 (.intro-brand span spin, .orbit-one/.orbit-two orbit, .moving-band-track marquee) se reconfirman como los únicos infinite en todo el archivo — ninguno nuevo se introdujo en este plan"

patterns-established: []

requirements-completed: [THEME-01, THEME-02, THEME-03, THEME-04]

# Metrics
duration: ~20min
completed: 2026-07-19
---

# Phase 01 Plan 04: Migración de Contacto/Footer/Cursor/Badge + Audit de Fase Completo — Summary

**Cierre de la migración del tema oscuro al claro: Contacto (flip completo de superficie + form-status + Pitfall 1 en submit), Footer/Cursor/badge/video-toggle tokenizados, y audit de fase completo confirmando cero literales oscuros/blend-mode/backdrop-filter en todo `app/globals.css`.**

## Performance

- **Duration:** ~20 min
- **Tasks:** 3 completed (Task 3 es de solo-verificación, sin cambios de código — cero hits residuales encontrados)
- **Files modified:** 1 (app/globals.css)

## Accomplishments

- **Contacto:** `.contact-section` invertido de `background:var(--ink);color:#fff` a `background:var(--bg-surface);color:var(--ink-primary)` — la superficie blanca más brillante de la secuencia, reservada para el momento de conversión. `.contact-backdrop img` sin `filter:grayscale(1)` (D-01); `.contact-backdrop{opacity:.12}` conservado sin cambios (composición, no literal de color). Glow ring decorativo `.contact-section:before` (border/box-shadow `#ffffff14`/`#ffffff05`/`#ffffff04`) eliminado por completo — blanco-sobre-blanco es invisible tras el flip a `--bg-surface` y no cumplía función de legibilidad. Texto y formulario migrados: `.contact-copy>p` a `var(--ink-secondary)`, `.contact-copy>a` border a `var(--border-subtle)`, labels a `var(--ink-secondary)`, inputs/select/textarea con `border-bottom:var(--border-strong)` y `color:var(--ink-primary)`, placeholder a `var(--ink-secondary)`, foco a `var(--accent)` (antes `var(--orange)`), `select option` a `var(--ink-primary)`. **Pitfall 1** resuelto en `.submit-button` (`background:var(--accent);color:#FFFFFF`, hover `var(--accent-hover)`). `.form-status.is-success` usa `var(--success)` (Open Question #3 del Plan 01, consumido por primera vez aquí); `.is-error` usa `var(--destructive)`.
- **Footer:** `.footer` migrado de `#080a0d`/`#fff` a `var(--bg-surface-deep)`/`var(--ink-primary)` (Discretion Call #3 confirmada: footer claro, no banda oscura de cierre). `.footer-mark` border a `var(--border-subtle)`; `.footer-bottom` color a `var(--ink-secondary)`.
- **Environment badge:** `backdrop-filter:blur(10px)` eliminado por completo (Retirement Checklist); pasa de "glass" (`border:#ffffff66;background:#0c0e12d1`) a sólido (`background:var(--bg-surface-deep);border:1px solid var(--border-subtle);color:var(--ink-primary)`).
- **Cursor:** `.custom-cursor` migrado de `background:var(--hot);color:var(--ink)` a `background:var(--accent);color:#FFFFFF` (Pitfall 1, mismo patrón verificado que `.submit-button`/`.circle-link:hover`/`.service-row:hover`).
- **Video-toggle:** color migrado a `var(--ink-primary)` (ahora sobre el hero claro `--bg-surface-alt`); `.video-toggle i` border a `var(--border-strong)`; iconos dibujados (`.pause-icon:before/:after`, `.play-icon:before`) migrados de `#fff` a `var(--ink-primary)`.
- **Audit de fase completo (Task 3):** los cuatro grep gates de THEME-01/02/03/04 se ejecutaron sobre `app/globals.css` íntegro y `lib/motion-preferences.ts`, y todos devolvieron el resultado esperado sin necesidad de ningún fix adicional (ver tabla de resultados abajo). `npm run lint && npm run typecheck && npm run build` pasan limpios.

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrar Contacto (flip de sección oscura + form-status + Pitfall 1 en submit)** - `f4f1dca` (feat)
2. **Task 2: Migrar Footer, Cursor, environment-badge y video-toggle** - `26dc7ed` (feat)
3. **Task 3: Audit de fase completo — grep gates + build/lint/typecheck** - sin commit propio (tarea de solo-verificación; cero hits residuales encontrados, ningún archivo modificado)

## Files Created/Modified

- `app/globals.css` - Bloques `/* Contacto */`, `.footer`/`.environment-badge` (línea de Footer), `/* Cursor */` y `.video-toggle` migrados íntegramente a los tokens claros del Plan 01. Migración de tema completa en todo el archivo.

## Audit de Fase Completo — Resultados (Task 3)

| Gate | Comando | Esperado | Resultado |
|------|---------|----------|-----------|
| THEME-01/03 (literales oscuros) | `grep -nE "#0c0e12\|#0c0f12\|#0a0c0f\|#080a0d\|--ink:\|--soft:\|--paper:\|--orange:\|--hot:\|--dark-line\|--light-line" app/globals.css` | 0 hits | **0 hits — PASS** |
| THEME-01/03 (consumo de tokens legacy) | `grep -nE "var\(--ink\)\|var\(--soft\)\|var\(--paper\)\|var\(--orange\)\|var\(--hot\)\|var\(--dark-line\)\|var\(--light-line\)" app/globals.css` | 0 hits | **0 hits — PASS** |
| THEME-03 (blend/backdrop-filter) | `grep -nE "mix-blend-mode\|backdrop-filter" app/globals.css` | 0 hits | **0 hits — PASS** |
| THEME-03 (filter: de oscurecimiento) | `grep -n "filter:" app/globals.css` | 0 hits | **0 hits — PASS** (ningún `filter:` sobrevive en el archivo; los 5 selectores de imagen catalogados — hero-media, tech-media, statement-visual, deliverable-image, contact-backdrop — ya habían sido retirados en Planes 02-04) |
| THEME-04 (pin/scrub) | `grep -rnE "pin:\|scrub:" app/globals.css components lib` | 0 hits | **0 hits — PASS** |
| THEME-04 (infinite supervivientes) | `grep -n "infinite" app/globals.css` | solo survivors documentados | **4 hits — PASS**: `.intro-brand span` (`spin`, acotado por auto-hide 1450ms de `intro-sequence.tsx`), `.orbit-one`/`.orbit-two` (`orbit`, diferido por Open Question #4 del Plan 02), `.moving-band-track` (`marquee`, diferido por Open Question #4 del Plan 03) — ninguno nuevo |
| THEME-04 (lerp moderado) | `grep -n "normal: 0.1" lib/motion-preferences.ts` | 1 hit | **1 hit — PASS** |
| THEME-04 (parallax clamp ±8px) | `grep -c "clamp(-8px,var(--parallax,0),8px)" app/globals.css` | 2 hits | **2 hits — PASS** (`.hero-media` Plan 02 + `.tech-media` Plan 03) |
| D-02 (PALETA-DE-MARCA.md intacto) | `git status --short PALETA-DE-MARCA.md` | no listado como modificado | **PASS** — aparece como `??` (untracked) desde antes de esta fase, sin cambios de contenido; no fue tocado por ningún plan de esta fase |
| Build/lint/typecheck | `npm run lint && npm run typecheck && npm run build` | los tres limpios | **PASS** — lint exit 0, typecheck exit 0, build exit 0 (Next.js 16.2.10 Turbopack, 7/7 páginas estáticas generadas) |

Ningún gate requirió fix adicional — Task 3 fue puramente de verificación.

## Decisions Made

- Glow ring decorativo `.contact-section:before` eliminado por completo (no re-derivado con `color-mix`) — a diferencia de `.hero-shade`/`.tech-vignette` en Planes 02-03, este elemento era puramente decorativo (un anillo de resplandor sutil) sin función de legibilidad de texto sobre imagen; sobre `--bg-surface` (blanco) el efecto blanco-sobre-blanco es invisible por definición, así que preservarlo con `color-mix` no aportaría nada visible.
- `.contact-backdrop{opacity:.12}` se mantiene sin cambios — es composición (opacidad del contenedor), no un literal de color del tema oscuro; tras retirar el `filter:grayscale(1)` de su `<img>` interno (D-01), la imagen de fondo conserva su color original a baja opacidad, aportando textura sutil sobre la superficie blanca.
- Footer confirma Discretion Call #3 (ya documentado desde el Plan 01/02): usa `--bg-surface-deep`, la misma superficie gris-azul clara que `.media-frame` y `.deliverable-image`, en vez de una banda oscura de cierre.
- `.environment-badge` pasa de "glass" (backdrop-filter + fondo semitransparente oscuro) a sólido — decisión directa del Retirement Checklist de `01-RESEARCH.md`, sin alternativa discrecional.

## Deviations from Plan

None - plan executed exactly as written. La decisión de eliminar (vs. re-derivar) el glow ring de `.contact-section:before` estaba explícitamente delegada al ejecutor por el propio texto del plan ("ELIMINAR el ring, o re-derivarlo... documentar la decisión"), no constituye una desviación de las instrucciones.

## Issues Encountered

None. El audit de fase completo (Task 3) no encontró ningún hit residual que requiriera corrección — los tres planes anteriores (01-01/02/03) ya habían migrado sus bloques correctamente, y este plan cerró los últimos 5 bloques (Contacto/Footer/Cursor/Badge/video-toggle) sin dejar remanentes.

## User Setup Required

None - no external service configuration required.

## Manual Verification Pending (fuera del alcance de este agente)

Los siguientes ítems de `01-VALIDATION.md` ("Manual-Only Verifications") requieren un navegador real y quedan pendientes de verificación humana — no bloquean el cierre de fase porque están documentados como gates manuales desde la planificación, pero deben confirmarse antes de considerar la Fase 1 visualmente cerrada:

- Scroll-through completo del sitio a 1440px y 375px (cero fondos oscuros, incluido el splash `.intro`, sin overflow horizontal).
- Envío real del formulario de contacto para confirmar legibilidad de `.form-status.is-success` (verde `--success`) y `.is-error` (rojo `--destructive`) en pantalla.
- Chequeo de contraste con herramienta (WebAIM o axe/Lighthouse `color-contrast`) sobre el build de producción, incluyendo los pares `--ink`-sobre-acento recién verificados en código (`.circle-link:hover`, `.service-row:hover`, `.submit-button`, `.custom-cursor`, `::selection`).
- Confirmación visual de que la fotografía del hero sigue siendo legible tras el retiro de filtros de oscurecimiento (D-01).

## Next Phase Readiness

- **Fase 1 completa**: los 4 planes (01-01 a 01-04) migraron `app/globals.css` íntegramente del tema oscuro Dogstudio al tema claro Fugro/Seequent. Los cuatro requirements de fase (THEME-01/02/03/04) están implementados en código y verificados por audit de grep + build/lint/typecheck.
- `app/globals.css` es ahora la única fuente de verdad de color/movimiento para las Fases 2-6 — todo nuevo CSS debe consumir los tokens de `:root` (`--bg-surface*`, `--ink*`, `--accent*`, `--border*`, `--destructive`, `--success`, `--motion-*`, `--ease-moderate`), nunca literales hex ni los tokens legacy retirados.
- El patrón `color-mix(in srgb,var(--token) X%,transparent)` para scrims/vignettes de legibilidad (establecido en Plan 02, reutilizado en Plan 03) y el patrón `color:#FFFFFF` sobre `background:var(--accent)` para pares de contraste verificado (Pitfall 1, usado consistentemente en Menu/Circle-link/Service-row/Submit-button/Cursor) quedan disponibles para reutilizar en Fases 2+ si aparecen componentes nuevos con necesidades similares.
- Pendiente (no bloqueante para Fase 2): verificación manual/visual completa listada arriba — recomendable antes de `/gsd-transition` a Fase 2, pero no impide iniciar el trabajo de datos/hooks compartidos de la Fase 2 (que no depende de verificación visual).

---
*Phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado*
*Completed: 2026-07-19*

## Self-Check: PASSED

- FOUND: app/globals.css
- FOUND: .planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-04-SUMMARY.md
- FOUND commit: f4f1dca
- FOUND commit: 26dc7ed
