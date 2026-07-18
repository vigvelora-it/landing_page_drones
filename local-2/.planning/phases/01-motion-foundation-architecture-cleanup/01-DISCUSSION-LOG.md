# Phase 1: Motion Foundation & Architecture Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-18
**Phase:** 01-motion-foundation-architecture-cleanup
**Areas discussed:** Legacy file handling, Verification cadence

---

## Legacy file handling

| Option | Description | Selected |
|--------|-------------|----------|
| Eliminar directamente | Delete `landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx` outright — already in git history if ever needed | |
| Mover a referencias/ primero | Copy to the repo-root `referencias/` folder before removing from `local-2/` | ✓ |

**User's choice:** Move to `referencias/` first.
**Notes:** The repo root already has a `referencias/` folder designated for prior HTML designs and original resources per the top-level `README.md` — this keeps the convention consistent rather than relying solely on git history.

---

## Verification cadence

| Option | Description | Selected |
|--------|-------------|----------|
| Al final de la fase completa | Single lint/typecheck/build + visual review after all of Phase 1's work is done | ✓ |
| Checkpoints intermedios | Verify after each major sub-step (Lenis/GSAP wiring, then decomposition, then FormConnector fix) | |

**User's choice:** Verify once at the end of the complete phase.
**Notes:** Consistent with the YOLO workflow mode chosen for the whole project (auto-approve, minimize interruptions).

---

## Claude's Discretion

- Component boundary names/file names for the decomposed sections (follow `research/ARCHITECTURE.md` pattern)
- Internal structure of `lib/gsap.ts` / `SmoothScrollProvider`
- Sequencing of sub-steps within Phase 1

## Contact form testing (raised inline, not a formal AskUserQuestion round)

No `.env.local` exists in this environment, so a live Supabase submission cannot be tested during this phase. Verification is code-level only (build succeeds, form markup/handler colocated, payload matches API schema). Not selected as a discussion area by the user in the initial gray-area selection, but resolved inline and captured in CONTEXT.md as D-03.

## Deferred Ideas

None — discussion stayed within Phase 1 scope.
