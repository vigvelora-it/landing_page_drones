# Phase 1: Motion Foundation & Architecture Cleanup - Context

**Gathered:** 2026-07-18
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers zero new visible UI. It builds the foundation everything else depends on: (1) a single unified Lenis+GSAP scroll/motion engine wired at the client boundary, (2) a working `prefers-reduced-motion` gate via `gsap.matchMedia()`, (3) decomposition of the monolithic `components/experience.tsx` into per-section components each with their own scoped `useGSAP`, (4) a structural fix to the fragile `FormConnector` DOM-query pattern, and (5) removal of unused legacy v4 files. This phase is explicitly refactor-safe — per `01-UI-SPEC.md`, nothing may look different when it's done.

</domain>

<decisions>
## Implementation Decisions

### Legacy file handling
- **D-01:** `landing-page-v4.html`, `lib/v4-template.ts`, and `components/v4-interactions.tsx` are moved to the repo-root `referencias/` folder (already the designated home for prior HTML designs and original resources, per the top-level `README.md`) before being removed from `local-2/`. Not a direct delete — preserve as a backup outside the active codebase.

### Verification cadence
- **D-02:** Verify once at the end of the complete Phase 1 (not after each sub-step). Run `npm run lint`, `npm run typecheck`, `npm run build`, and a full visual review only after all of Phase 1's work (Lenis/GSAP wiring, component decomposition, FormConnector fix, legacy file move) is done — consistent with the project's YOLO workflow mode.

### Contact form testing
- **D-03:** No `.env.local` exists in this environment, so a real Supabase submission cannot be tested. Verification for FOUND-01/ARCH-01 in this phase is code-level: confirm the build succeeds, the form's markup and `onSubmit` handler live in the same component (no `FormConnector`), and the request payload/schema match what `app/api/contact/route.ts` expects. A live submission test is out of scope for this phase.

### Claude's Discretion
- Exact component boundary names/file names for the decomposed sections (`HeroSection`, `ManifestoSection`, etc.) — follow the pattern already established in `research/ARCHITECTURE.md`.
- Internal structure of `lib/gsap.ts` / `SmoothScrollProvider` — implementation detail already well-specified by `research/STACK.md` and `research/ARCHITECTURE.md`.
- Order of sub-steps within Phase 1 (e.g., wiring the scroll engine before or after decomposing components) — technical sequencing call, not a user-facing decision.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & requirements
- `.planning/PROJECT.md` — project context, constraints, key decisions
- `.planning/REQUIREMENTS.md` — FOUND-01/02/03, ARCH-01/02/03 (this phase's requirement IDs)
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria (criterion #3 already corrected to match the "softened, not binary-off" reduced-motion contract)

### Domain research (project-level, covers this phase's exact scope)
- `.planning/research/SUMMARY.md` — synthesized findings and phase-by-phase implications
- `.planning/research/STACK.md` — GSAP/Lenis versions, ticker-sync integration pattern
- `.planning/research/ARCHITECTURE.md` — component boundaries, `useGSAP` patterns, FormConnector fix approach
- `.planning/research/PITFALLS.md` — critical pitfalls (rAF desync, StrictMode cleanup, SSR/hydration, reduced-motion)

### UI design contract
- `.planning/phases/01-motion-foundation-architecture-cleanup/01-UI-SPEC.md` — **locked motion contract**: Lenis `lerp: 0.07` (normal) / `0.15` (reduced-motion, softened not off), shadcn/component-library skipped, zero visual changes this phase

### Existing codebase map
- `.planning/codebase/ARCHITECTURE.md` — current architecture (monolithic `experience.tsx`)
- `.planning/codebase/CONCERNS.md` — documents the exact debt this phase fixes (FormConnector fragility, unthrottled parallax rAF loop, legacy v4 files)
- `.planning/codebase/CONVENTIONS.md` — current CSS/animation conventions to preserve

### Repo-level convention
- `../README.md` (repo root) — documents `referencias/` as the designated folder for prior HTML designs and original resources (informs D-01)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/contact-schema.ts` — Zod schema for the contact form, already correct; reuse as-is when extracting `ContactForm` out of `FormConnector`
- `lib/supabase-admin.ts` — server-only Supabase client factory, unaffected by this phase
- `app/api/contact/route.ts` — POST handler, unaffected by this phase; only the client-side wiring to it changes

### Established Patterns
- Current reveal system uses `[data-reveal]` + IntersectionObserver — this phase does NOT replace it yet (that's Phase 2, MOTION-01); Phase 1 only needs to not break it while decomposing `experience.tsx`
- Current parallax uses a manual `requestAnimationFrame` loop with `getBoundingClientRect()` per frame — also stays functionally intact in Phase 1, full ScrollTrigger migration is Phase 2 (MOTION-02)
- `"use client"` directive pattern already used correctly in `components/experience.tsx` — carry into the new per-section components

### Integration Points
- `app/layout.tsx` is where the new `SmoothScrollProvider` gets mounted (wraps `{children}`), per `research/ARCHITECTURE.md`
- `app/page.tsx` currently imports `Experience` from `components/experience.tsx` and renders `<form id="contact-form">` separately — this import/render boundary is what changes when `FormConnector` is replaced with a colocated `ContactForm` component

</code_context>

<specifics>
## Specific Ideas

No specific implementation examples given beyond what's already locked in research/UI-SPEC — user deferred technical sequencing and file naming to Claude's discretion.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (Phase 2's GSAP-native reveal/parallax/cursor/typography work and later phases remain untouched by this discussion.)

</deferred>

---

*Phase: 01-motion-foundation-architecture-cleanup*
*Context gathered: 2026-07-18*
