---
phase: 05-contenido-de-marca-historia-equipo-proyectos-diferenciaci-n-
plan: 01
subsystem: ui
tags: [brand-content, team, accessibility, responsive, no-js, playwright]

# Dependency graph
requires:
  - phase: 01-fundacion-visual-corporativa
    provides: light-theme tokens, moderate motion and reveal conventions
  - phase: 02-arquitectura-de-datos-y-scroll
    provides: typed canonical team data and section architecture
provides:
  - Canonical brand story, mission, vision and six corporate values from the client brief
  - Responsive Nosotros section with four complete founder profiles and honest initials fallbacks
  - Global no-JavaScript fallback for the intro and reveal content
affects: [05-02-proyectos-diferenciacion, 06-calidad-y-regresion-final]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Long-form brand copy lives only in lib/site-content.ts and React renders it as escaped text"
    - "Identity imagery renders only when a confirmed member.photo exists; initials are decorative fallback"

key-files:
  created: [components/sections/brand-section.tsx]
  modified: [lib/site-content.ts, app/page.tsx, app/layout.tsx, app/globals.css]
  removed: [components/sections/manifesto-section.tsx]

key-decisions:
  - "Kept TEAM-01 partial because four neutral initials placeholders are not real founder portraits"
  - "Extended the noscript fallback to hide the fixed intro overlay after browser QA proved it otherwise covered accessible content"

patterns-established:
  - "Canonical editorial sections map typed data rather than duplicating client-authored paragraphs in JSX"
  - "No-JS mode explicitly removes the animated intro and resolves all reveal elements to their visible state"

requirements-completed: [BRAND-01]
requirements-partial: [TEAM-01]

# Metrics
duration: 10min
completed: 2026-07-20
---

# Phase 5 Plan 1: Canonical Brand and Team Content Summary

**Verbatim corporate narrative with six values and four complete founder profiles in a responsive editorial section, backed by honest initials fallbacks and a working no-JavaScript presentation.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-20T23:53:02Z
- **Completed:** 2026-07-21T00:02:04Z
- **Tasks:** 3
- **Files modified:** 6 (1 created, 4 modified, 1 removed)

## Accomplishments

- Added history, short company description, mission, vision and all six values character-for-character from `BRAND-CONTENT.md` to the typed single source of truth.
- Replaced the fictional manifesto with a complete `BrandSection` and four founder cards whose names, roles and biographies are always visible.
- Rendered four neutral 4:5 initials placeholders and zero team images while real portraits remain unavailable.
- Added a no-JavaScript fallback that both exposes reveal content and removes the fixed animated intro overlay.

## Task Commits

Each task was committed through gsd-tools:

1. **Task 1: Extend canonical brand data** - `aebe44a` (feat)
2. **Task 2: Build BrandSection and team layout** - `5ab10b4` (feat)
3. **Task 3: Replace ManifestoSection and add no-JS fallback** - `c394b5a` (feat)
4. **Task 3 cleanup: Remove obsolete ManifestoSection file** - `27d5e14` (refactor)

**Plan metadata:** this close-out commit.

## Files Created/Modified

- `lib/site-content.ts` - Exports `CorporateValue`, `brandStory` and six canonical `corporateValues`.
- `components/sections/brand-section.tsx` - Renders the brand narrative, values and four-person team from typed data.
- `components/sections/manifesto-section.tsx` - Removed with its three fabricated claims.
- `app/page.tsx` - Renders `BrandSection` once in the previous Nosotros position.
- `app/layout.tsx` - Makes reveal content accessible and hides the intro overlay without JavaScript.
- `app/globals.css` - Provides the approved 12-column editorial, 3/2/1-column values and 2/2/1-column team layouts.

## Decisions Made

- `TEAM-01` remains partial: cards and biographies are complete, but initials do not satisfy the requirement for four real portraits.
- Existing generic field/equipment images were not assigned to people and no generated faces were introduced.
- No brochure control was rendered because the real PDF remains unavailable; `brochure.href` stays future data only.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed the fixed intro overlay in no-JavaScript mode**

- **Found during:** Task 3 browser verification.
- **Issue:** The planned reveal-only noscript rule made text opaque, but the existing fixed `.intro` stayed permanently over the page when JavaScript was disabled.
- **Fix:** Added `.intro{display:none!important}` to the same static noscript style.
- **Files modified:** `app/layout.tsx`.
- **Verification:** A Playwright context with `javaScriptEnabled:false` reported intro `display:none`, zero hidden brand reveals and no overflow at 390x844.
- **Committed in:** `c394b5a`.

---

**Total deviations:** 1 auto-fixed bug.
**Impact on plan:** The fix was necessary to meet the plan's no-JavaScript accessibility truth and introduced no new feature or motion authority.

## Issues Encountered

- `gsd-tools commit --files` did not stage the removed manifesto path because it no longer existed. The exact deletion was staged separately and committed through gsd-tools as `27d5e14`; no unrelated files were staged.
- The production server from Phase 4 was confirmed as PID 12432 under `local-2` and stopped before rebuilding `.next`; no unrelated process was touched.

## Verification Evidence

- `npm.cmd run lint`, `npm.cmd run typecheck` and two clean production builds pass; `/` remains statically prerendered.
- Automated source comparison reports exact matches for history (906 chars), about (441), mission (510), vision (374), and all six value names/descriptions.
- Browser matrix 1440x900, 1000x800, 390x844 and 320x568: `scrollWidth === clientWidth`, zero clipped cards, six values and four team cards.
- After traversing the section, all reveal nodes reached their visible state at every viewport.
- Reduced motion at 390x844: zero hidden nodes, no overflow, six values and four team cards.
- No JavaScript at 390x844: intro hidden, zero hidden nodes, no overflow and four initials placeholders.
- Final browser console: zero errors and zero warnings; zero old manifesto claims, zero team images and zero download controls in the DOM.
- Visual artifacts remain local under `.playwright-cli/phase05-01-final-390.png` and `.playwright-cli/phase05-01-final-nojs-390.png`.

## User Setup Required

Four confirmed founder portraits are still required to complete `TEAM-01`. No image may be assigned until the client confirms the person-to-file mapping.

## Next Phase Readiness

- Plan 05-02 may add real projects and differentiation using the same typed-data/editorial pattern.
- `BROCH-01` remains blocked by the missing final PDF; no CTA should render until that file is supplied and verified.
- Do not advance to 05-02 as part of this plan execution.

---
*Phase: 05-contenido-de-marca-historia-equipo-proyectos-diferenciaci-n-*
*Completed: 2026-07-20*

## Self-Check: PASSED

- FOUND: `components/sections/brand-section.tsx`
- FOUND: exact canonical `brandStory` and six `corporateValues`
- FOUND: one `BrandSection` render and noscript fallback
- ABSENT: `components/sections/manifesto-section.tsx` and all three prior fabricated claims
- FOUND: task commits `aebe44a`, `5ab10b4`, `c394b5a`, `27d5e14`
- PASS: lint, typecheck, production build, copy-integrity checks and browser matrix
- PARTIAL: `TEAM-01` awaits four real founder portraits
