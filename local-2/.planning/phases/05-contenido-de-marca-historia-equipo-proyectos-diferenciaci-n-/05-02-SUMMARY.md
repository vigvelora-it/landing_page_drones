---
phase: 05-contenido-de-marca-historia-equipo-proyectos-diferenciaci-n-
plan: 02
subsystem: ui
tags: [projects, differentiation, navigation, responsive, accessibility, playwright]

# Dependency graph
requires:
  - phase: 05-contenido-de-marca-historia-equipo-proyectos-diferenciaci-n-
    provides: canonical brand, team and typed project data from Plan 05-01 and Phase 2
provides:
  - Canonical three-project section with GESAC featured and two equal supporting records
  - Evidence-based differentiation without competitor names or unsupported claims
  - Six-destination menu and coherent 01-06 section numbering
affects: [06-calidad-y-regresion-final]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Project facts render from typed canonical data through semantic definition lists"
    - "External asset blockers produce no deceptive controls or fabricated evidence"

key-files:
  created: [components/sections/projects-section.tsx]
  modified: [lib/site-content.ts, app/page.tsx, components/menu-overlay.tsx, components/sections/process-section.tsx, components/sections/contact-section.tsx, app/globals.css]

key-decisions:
  - "Used only the exact principal advantage and principal message supplied in BRAND-CONTENT.md"
  - "Kept BROCH-01 blocked and omitted every brochure control while the real PDF remains unavailable"
  - "Kept TEAM-01 partial because initials placeholders are not real founder portraits"

patterns-established:
  - "Featured/supporting project hierarchy is derived from the featured flag rather than array position"
  - "Six-row overlay navigation uses 60ms incremental delays and a compact short-viewport layout"

requirements-completed: [PROJ-01, DIFF-01]
requirements-partial: [TEAM-01]
requirements-blocked: [BROCH-01]

# Metrics
duration: 26min
completed: 2026-07-20
---

# Phase 5 Plan 2: Projects, Differentiation and Navigation Summary

**Three real aerophotogrammetry projects and exact evidence-led positioning now form a responsive Projects section, with a coherent six-destination menu and no fabricated brochure affordance.**

## Performance

- **Duration:** 26 min
- **Completed:** 2026-07-20T19:26:30-05:00
- **Tasks:** 3
- **Files modified:** 7 (1 created, 6 modified)

## Accomplishments

- Added the canonical differentiation advantage and message to the typed content source without importing any competitor names into application code.
- Built `ProjectsSection` with GESAC as the single featured record and Lezard/Las Dunas as equal supporting records; every project exposes Cliente, Ubicación and Servicio realizado through a semantic `<dl>`.
- Added four canonical evidence cells using only team/project counts, foundation year and the three supplied locations.
- Inserted Projects inside the existing drawer-aware `InertBoundary`, between Technology and Process, with the approved 7/5, stacked and 4/2/1 responsive contracts.
- Expanded navigation and kickers to 01 Nosotros, 02 Capacidades, 03 Tecnología, 04 Proyectos, 05 Proceso and 06 Contacto.
- Preserved an honest public state: zero project outcomes/images/logos, zero competitor names and zero brochure controls.

## Task Commits

Each application change was committed through gsd-tools:

1. **Task 1: Canonical projects and differentiation** - `8be1b3e` (feat)
2. **Task 2: Responsive Projects integration** - `2e37e2e` (feat)
3. **Task 3: Six-destination navigation** - `e8ac9c8` (feat)
4. **Task 3 browser fix: Six-row desktop menu fit** - `8a73283` (fix)

**Plan metadata:** this close-out commit.

## Files Created/Modified

- `lib/site-content.ts` - Exports the two exact differentiation statements.
- `components/sections/projects-section.tsx` - Renders the project hierarchy, semantic facts and evidence band.
- `app/page.tsx` - Renders Projects once inside the coordinated background boundary.
- `components/menu-overlay.tsx` - Provides six numbered destinations and the Projects anchor.
- `components/sections/process-section.tsx` - Renumbers the Process kicker to 05.
- `components/sections/contact-section.tsx` - Renumbers the Contact kicker to 06 without changing the form.
- `app/globals.css` - Implements project/evidence responsive layouts and six-row menu fit.

## Decisions Made

- Project prominence is data-driven: development throws when the content has anything other than one featured record, while supporting records come from the inverse filter.
- The differentiation band uses `team.length`, `projects.length`, `2024` and canonical locations; no combined years, outcomes, national coverage or superiority claim was introduced.
- `BROCH-01` remains blocked because `public/` contains no real PDF. No link, button, disabled affordance, download attribute or client-facing blocker text was rendered.
- `TEAM-01` remains partial because the four neutral initials placeholders do not satisfy the real-photo criterion.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Reduced six-row desktop menu display size after browser QA found vertical collisions**

- **Found during:** Task 3 browser matrix at 1440x900.
- **Issue:** All six links were visible and inside the viewport, but the first and last rows overlapped the fixed menu index and metadata.
- **Fix:** Changed only the overlay link display clamp from the previous five-row scale to `clamp(2.8rem,5vw,4.6rem)`; retained all links, labels and 60ms stagger increments.
- **Verification:** At 1440x900, first row top 214px clears the 123px index bottom and final row bottom 756px clears the 839px metadata top.
- **Committed in:** `8a73283`.

---

**Total deviations:** 1 auto-fixed responsive bug.
**Impact on plan:** The fix was required by the six-row fit contract and introduced no new content or interaction.

## Verification Evidence

- Sequential `npm.cmd run lint`, `npm.cmd run typecheck` and `npm.cmd run build` pass; `/` remains statically prerendered.
- Source gates: one Projects import/render, six exact menu destinations, one global `overflow-x`, and zero competitor names under `app/`, `components/` or `lib/`.
- Browser matrix 1440x900, 1000x800, 390x844 and 320x568: no horizontal overflow; one h1; six values; four team cards/placeholders and zero team images; three project cards, one featured, two supporting, three fact lists/nine labels and four evidence cells.
- Every menu destination is visible, tabbable, uniquely anchored and reaches its matching hash; short-screen 320x568 and desktop 1440x900 both clear the overlay metadata.
- Header top/scrolled states, service drawer open/background inert/close, Technology sticky (`top: 0` inside its range), carousel keyboard/buttons/dots and scroll width pass regression smoke tests.
- Reduced motion at 390x844: zero hidden reveals, no overflow and carousel controls remain usable.
- No JavaScript at 390x844: intro hidden, zero hidden reveals, three project cards and all fact lists visible.
- Browser console audit reports zero errors. Synthetic mouse/CDP touch-drag did not select a different snap in this automation environment; the pre-existing Embla drag configuration and `touch-action:pan-y` were unchanged by this plan, and keyboard/buttons/dots were exercised successfully.
- DOM/source contains zero `[download]`, brochure copy/control and competitor names; `BROCH-01` remains blocked.

## User Setup Required

- Four confirmed founder portraits are required to complete `TEAM-01`.
- The final real PDF is required to complete `BROCH-01`; only after receipt may a download control be added and verified by status, content type and `%PDF-` magic bytes.

## Next Phase Readiness

- All executable scope in Plan 05-02 is complete and verified.
- Phase 5 remains partially blocked only by the two external asset dependencies above; neither is marked complete.
- Phase 6 may run final quality/regression checks while preserving these explicit blocked/partial statuses.

---
*Phase: 05-contenido-de-marca-historia-equipo-proyectos-diferenciaci-n-*
*Completed: 2026-07-20*

## Self-Check: PASSED

- FOUND: `components/sections/projects-section.tsx`
- FOUND: one featured and two supporting project cards with nine visible fact labels
- FOUND: six coherent navigation destinations and 04/05/06 kickers
- ABSENT: fabricated outcomes, project imagery, competitors and brochure controls
- PASS: lint, typecheck, production build, four-viewport browser matrix, reduced-motion and no-JavaScript checks
- COMPLETE: PROJ-01, DIFF-01
