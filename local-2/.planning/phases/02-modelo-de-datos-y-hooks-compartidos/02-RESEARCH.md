# Phase 2: Modelo de Datos y Hooks Compartidos - Research

**Researched:** 2026-07-19
**Domain:** Typed content data module (`lib/site-content.ts`) + two small shared client hooks/fixes (`useScrollLock` over Lenis, event-delegated `CustomCursor`) in an existing Next.js 16 / React 19 + Lenis/GSAP marketing site. No new visible UI.
**Confidence:** HIGH for all code-level findings (verified directly against the actual files in this repo and the installed `lenis@1.3.25` type definitions) / LOW for the actual brand copy this phase is supposed to encode (see Content Gap below — this is the dominant risk of the phase, not the code).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ARCH-01 | `lib/site-content.ts` extendido con datos reales tipados: 5 ejes de servicio (detalle largo), 4 geólogos, 3 proyectos reales, datos de brochure | See "Content Gap" in Summary + "Data Model" pattern below. Real data exists in this repo **only** for the 5 eje titles and the 3 projects (client/location/service) — team bios and per-eje long-form text do not exist anywhere in the codebase and must be sourced or explicitly drafted-and-approved before this requirement can be honestly marked "datos reales" |
| ARCH-02 | Hook compartido `useScrollLock` basado en `lenis.stop()/start()` (no `overflow:hidden`), usado por `menu-overlay.tsx` (y, en Fase 3, por el drawer) | Verified `useLenis()` API directly from `node_modules/lenis/dist/lenis-react.d.ts` (installed `lenis@1.3.25`) and current `menu-overlay.tsx` scroll-lock mechanism to replace. See Pattern B + Pitfall 2 |
| ARCH-03 | `custom-cursor.tsx` con delegación de eventos en vez de `querySelectorAll` en el montaje | Verified exact current implementation (`pointerenter`/`pointerleave` on a static `querySelectorAll` snapshot). Confirmed via MDN that `pointerenter`/`pointerleave` do **not** bubble, so the fix must switch to `pointerover`/`pointerout` (which do bubble) — not just move the same events to `document`. See Pattern C |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

`./CLAUDE.md` exists but its "Project" section is stale (still describes the superseded dark/cinematic Dogstudio direction — `PROJECT.md` and `REQUIREMENTS.md` are the current source of truth per `STATE.md`). Its Stack/Conventions/Architecture sections remain technically accurate and apply directly to this phase:

- **Isolation:** work only inside `local-2/` — never touch `../local/` or `../produccion/`.
- **No deploys:** `npm run deploy` stays blocked; no Vercel/external deploy without explicit in-conversation approval this session.
- **Contact form:** `/api/contact` + Supabase integration must keep working — not touched by this phase, but nothing in this phase may import/execute in a way that breaks it.
- **Assets:** only local assets under `public/` — no remote image URLs. Relevant to this phase because `TeamMember.photo`/service imagery fields (if added) must point to local paths, not external URLs, even as placeholders.
- **New dependencies:** evaluate case by case; this phase adds **zero** new npm packages (confirmed — see Package Legitimacy Audit).
- **Naming conventions** (from `.planning/codebase/CONVENTIONS.md`, verified still accurate against current files):
  - Utility/lib files: kebab-case (`lib/site-content.ts`, `hooks/use-scroll-lock.ts`)
  - Component files: PascalCase-named exports, kebab-case filenames
  - Type interfaces: PascalCase (`Service`, `TeamMember`, `Project`, `Brochure`)
  - camelCase for object constants (`services`, `team`, `projects`, `brochure`)
  - Named exports only, no default exports for non-page files, **no barrel files** (`index.ts`) — import each module directly
  - `@/*` path alias required for all local imports, never relative paths
  - No semicolons, 2-space indent, no Prettier config (match existing style by eye)
  - Comments: sparse — only for non-obvious DOM/event-timing logic (exactly the kind of thing the cursor delegation fix and the scroll-lock hook both are) and accessibility notes

## Summary

This phase has two very different risk profiles hiding under one "no visible UI" label. The **hook work (ARCH-02, ARCH-03) is low-risk and fully specified** by this research: both target files were read directly, the exact current implementation is quoted below, and the installed `lenis@1.3.25` type definitions confirm the `useLenis()` API the fix depends on. The **data work (ARCH-01) is where the real risk lives**: `lib/site-content.ts` today holds exactly two exports (`services`: 6 generic drone-service rows left over from the old dark-theme direction, and `process`: 4 methodology steps) — neither the 5 real service ejes' long-form text, the 4 geologists' names/roles/bios, nor an actual brochure PDF exist anywhere in this repository. `PROJECT.md` names the 5 eje *titles* and gives real client/location/service data for the 3 projects (both are usable as-is), but the source document that reportedly contained the rest (`BROCHURE SKYTECH.pdf`, referenced by `PALETA-DE-MARCA.md` as already consumed once for color extraction) is not present on disk in any of `local/`, `local-2/`, or `produccion/`. Treating this phase as "just add fields to an object literal" without surfacing this gap to the user first risks the planner either fabricating placeholder brand copy that reads as real (a factual-integrity problem, especially for team bios naming real people) or silently shipping an incomplete `lib/site-content.ts` that doesn't actually satisfy "datos reales" as ARCH-01 requires.

**Primary recommendation:** Build the hooks/fix (ARCH-02, ARCH-03) exactly as specified below — they are safe to plan and execute immediately. For the data (ARCH-01), populate `services` (titles are real, from `PROJECT.md`; `detail`/`longDetail` need either the original brochure content or explicitly-flagged drafted copy pending client sign-off) and `projects` (fully real already, from `PROJECT.md`) now, but insert a `checkpoint:human-verify`-style task before finalizing `team` — do not invent names, roles, or bios for four real named individuals. Recommend the plan surface a direct question to the user: "Do you have the 4 geologists' bios and the brochure text, or should I draft plausible placeholder copy clearly marked for later replacement in Phase 5?"

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Brand content data (`lib/site-content.ts`: services/team/projects/brochure) | Frontend Server (SSR) | Browser / Client | The module has no `"use client"` directive; it's plain data imported by the `force-static` page tree at build time (baked into static HTML), then read again by the `"use client"` section components during hydration for interactivity (e.g. drawer state in Phase 3). No runtime fetch, no API tier involved. |
| Scroll lock (`useScrollLock`) | Browser / Client | — | Pure client hook wrapping `lenis/react`'s `useLenis()`; operates entirely on the DOM-level Lenis scroll engine already running in the browser. No server counterpart, no data flow beyond a boolean prop. |
| Cursor event delegation (`CustomCursor`) | Browser / Client | — | Pure client DOM pointer-event handling (`document.addEventListener`), no server tier involvement. |

## Standard Stack

No new libraries. Everything this phase needs is already installed and verified in `package.json`:

| Package | Installed Version | Purpose in this phase | Verified |
|---------|-------------------|------------------------|----------|
| `lenis` | `1.3.25` | `useLenis()` hook + `Lenis.stop()/start()` API that `useScrollLock` wraps | [VERIFIED: local node_modules — `node_modules/lenis/dist/lenis-react.d.ts`, `node_modules/lenis/dist/lenis.d.ts`] |
| `typescript` | `^5.9.3` | Typed `Service`/`TeamMember`/`Project`/`Brochure` interfaces for `lib/site-content.ts` | [VERIFIED: package.json] |
| `react` | `^19.2.7` | `useEffect`/`useRef` in the cursor/hook fixes (unchanged from current usage) | [VERIFIED: package.json] |

No `npm install` step is needed for this phase.

## Package Legitimacy Audit

**Not applicable — this phase installs zero new packages.** All APIs used (`lenis/react`'s `useLenis`, native DOM `addEventListener`/`closest`) come from dependencies already present in `package.json` and verified installed in `node_modules`. No `npm view`/registry check was required.

## Architecture Patterns

### Recommended file changes (scoped exactly to ARCH-01/02/03 — no other files touched)

```
lib/
└── site-content.ts        # EXTENDED: services gets id/longDetail/highlights fields (title/detail preserved for capabilities-section.tsx),
                            # new `team`, `projects`, `brochure` exports + matching interfaces. `process` unchanged.
hooks/
└── use-scroll-lock.ts     # NEW — wraps useLenis(), exposes useScrollLock(isLocked: boolean)
components/
├── menu-overlay.tsx        # EDITED — replace body.classList.toggle("menu-open", ...) with useScrollLock(menuOpen)
└── custom-cursor.tsx       # EDITED — pointerenter/pointerleave + querySelectorAll-at-mount → document-level pointerover/pointerout delegation
app/globals.css             # EDITED (1 line) — body.menu-open{overflow:hidden} rule becomes dead code once menu-overlay.tsx
                            # stops toggling that class; either delete it or keep as a defensive backstop (see Pitfall 2)
```

No component in `components/sections/` needs to change in this phase. `capabilities-section.tsx` keeps compiling and rendering unmodified because the field names it already destructures (`service.number`, `service.title`, `service.detail`) are preserved — see Pitfall 1.

### Pattern A: Typed content data, existing field names preserved, new fields additive

**What:** `lib/site-content.ts` currently exports `services` as an *untyped* array literal (`{ number, title, detail }`) and `process` as an array of arrays. ARCH-01 requires "datos reales tipados" — add explicit `interface`s and extend `services` with an `id` (stable key, replacing the current `key={service.number}` pattern used by `capabilities-section.tsx` — keep `number` too, don't remove it) and `longDetail` (the field Phase 3's drawer will read). Add two new exports, `team` and `projects`, plus a `brochure` constant — none of these exist today.

**When to use:** This is the only data-shape decision this phase needs to make. Do not introduce Zod schemas here (the project's Zod usage is scoped to `lib/contact-schema.ts` for form input validation — this is static developer-authored content, not user input; a runtime schema adds no safety here per `CONVENTIONS.md`'s existing pattern of typing static content as plain `interface` + array).

**Example — the exact shape to add** (values below marked `TODO` are the actual content gap; do not treat drafted placeholder copy as final without user confirmation, see Open Questions):

```typescript
// lib/site-content.ts
// Source: current file read directly (local-2/lib/site-content.ts) — pattern matches
// CONVENTIONS.md ("camelCase for object constants", "Array of objects with consistent structure")

export interface Service {
  id: string
  number: string
  title: string
  detail: string       // short summary — already rendered by capabilities-section.tsx today
  longDetail: string    // NEW — full text for Phase 3's drawer, not rendered anywhere yet
  highlights?: string[] // NEW, optional — sub-item bullets (needed for eje 5, "Servicios Complementarios",
                         // which bundles geofísica/SIG/auditorías/catastro/capacitación SSOMA per PROJECT.md)
}

export const services: Service[] = [
  {
    id: "topografia-drones",
    number: "01",
    title: "Topografía y Tecnología con Drones", // real — from PROJECT.md, "eje transversal"
    detail: "TODO: short summary — pending client brochure text or drafted+approved copy",
    longDetail: "TODO: long-form paragraph — pending client brochure text or drafted+approved copy",
  },
  // ... 4 more ejes: Geotecnia y Riesgos Geológicos, Minería: Consultoría y Formalización,
  // Obras Civiles e Infraestructura Vial, Servicios Complementarios — titles are real (PROJECT.md),
  // detail/longDetail are the content gap for every one of the 5
]

export interface TeamMember {
  id: string
  name: string   // BLOCKED — real names not present anywhere in this repo, do not fabricate
  role: string
  bio: string
  photo: string  // local path under public/, e.g. "/equipo/apellido-nombre.jpg" — asset also not yet present
}

export const team: TeamMember[] = [
  // BLOCKED — see "Content Gap" in Summary and Open Questions. Do not populate with invented
  // names/bios for four real people. Recommend a checkpoint before this array is finalized.
]

export interface Project {
  id: string
  name: string      // e.g. "GESAC"
  client: string     // e.g. "German Engineering & Cie."
  location: string    // e.g. "Huarmey"
  service: string      // e.g. "Levantamiento Aerofotogramétrico"
  featured?: boolean    // for the "proyecto destacado + lista" layout Phase 5/PROJ-01 needs
}

export const projects: Project[] = [
  { id: "gesac-huarmey", name: "GESAC", client: "German Engineering & Cie.", location: "Huarmey", service: "Levantamiento Aerofotogramétrico", featured: true },
  { id: "lezard-huaral", name: "Lezard", client: "Black Swan Minerals", location: "Huaral", service: "Levantamiento Aerofotogramétrico" },
  { id: "las-dunas-piura", name: "Las Dunas", client: "Asociación Las Dunas Ecological", location: "Piura", service: "Levantamiento Aerofotogramétrico" },
] // real — sourced directly from PROJECT.md's client brief section, [CITED: .planning/PROJECT.md]

export interface Brochure {
  title: string
  href: string          // public/ path — the PDF file itself does not exist yet, added in Phase 5 (BROCH-01)
  fileSizeLabel?: string
}

export const brochure: Brochure = {
  title: "Brochure SkyTech Solutions",
  href: "/brochures/skytech-solutions-brochure.pdf", // placeholder path — will 404 until Phase 5 adds the asset;
                                                        // harmless in Phase 2 since nothing renders this link yet
}
```

**Trade-offs:** Keeping `services[].detail` and `.title`/`.number` field names identical to today means zero risk of breaking `capabilities-section.tsx`'s compile or render in this phase (it isn't touched), at the cost of `longDetail` being unused dead-ish data until Phase 3 wires the drawer to read it — acceptable, since ROADMAP.md's own Phase 2 success criteria only requires the data to *exist and be exported*, not be consumed yet.

### Pattern B: `useScrollLock` — shared hook wrapping `lenis.stop()/start()`

**What:** A hook that takes a boolean and calls `lenis.stop()`/`lenis.start()` on the shared Lenis instance whenever it flips, cleaning up on unmount. Confirmed against the actual installed types (`node_modules/lenis/dist/lenis-react.d.ts`): `useLenis(callback?, deps?, priority?): Lenis | undefined` — called with no arguments it just returns the current instance (exactly the "Instance access" example in Lenis's own JSDoc). `node_modules/lenis/dist/lenis.d.ts` confirms the `Lenis` class has public `start(): void`, `stop(): void`, and a `get isStopped(): boolean`.

**When to use:** Any component that needs to fully block page scroll while open. In this phase, only `MenuOverlay` consumes it (replacing its current `document.body.classList.toggle("menu-open", menuOpen)` + the CSS rule `body.menu-open{overflow:hidden}` — confirmed via `Grep` to be the *only* use of `.menu-open` anywhere in `app/globals.css`, so nothing else depends on that class existing). `ServiceDrawer` will call the same hook in Phase 3 — no changes needed here to support that, this hook has no drawer-specific logic.

**Example:**

```typescript
// hooks/use-scroll-lock.ts
"use client"
import { useEffect } from "react"
import { useLenis } from "lenis/react"

export function useScrollLock(isLocked: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (isLocked) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [lenis, isLocked])
}
```

```typescript
// components/menu-overlay.tsx — the only required edit in this file for ARCH-02
"use client"

import { useState } from "react"
import { useScrollLock } from "@/hooks/use-scroll-lock"

export function MenuOverlay() {
  const [menuOpen, setMenuOpen] = useState(false)
  useScrollLock(menuOpen) // replaces the current useEffect(() => { document.body.classList.toggle(...) }, [menuOpen])
  // ...rest of component unchanged
}
```

**Trade-offs / correctness nuance (see Pitfall 2 for detail):** `ARCH-02` reads as "based on `lenis.stop()/start()`, not `overflow:hidden`" — this means `overflow:hidden` must not be the *primary* mechanism, not that it can never coexist. There is a documented, maintainer-repo-confirmed gap where `lenis.stop()` alone does not reliably block 100% of native scroll vectors (scrollbar drag, some keyboard scroll paths) on every browser/OS combination. Recommend keeping `body{overflow:hidden}` (scoped via a small dedicated class, not necessarily `.menu-open` which is being retired) as a cheap defensive backstop *alongside* `lenis.stop()`, not as a replacement for it — this satisfies the literal requirement (`lenis.stop()/start()` is the actual mechanism) while closing the known gap.

### Pattern C: `CustomCursor` — event delegation via `pointerover`/`pointerout`, not `pointerenter`/`pointerleave`

**What:** The current implementation (quoted in full below) queries `[data-cursor]` once inside a `useEffect(..., [])` and attaches `pointerenter`/`pointerleave` directly to each element found at that moment. Any `[data-cursor]` element added to the DOM later (a drawer close button, carousel controls — both arrive in Phase 3/4) never gets wired up. The milestone-level `ARCHITECTURE.md` already flags this as the fix, but its own code example uses `pointerover` — this matters for a non-obvious reason confirmed via MDN: **`pointerenter`/`pointerleave` do not bubble; `pointerover`/`pointerout` do.** Event delegation on `document` only works with bubbling events, so this is not a drop-in rename — it's a switch to different event types, and switching event types changes the firing semantics: `pointerover`/`pointerout` additionally fire when the pointer crosses boundaries of *child* elements inside a `[data-cursor]` target (e.g. moving from `.service-row` onto its nested `.service-title` span or the `Arrow` icon), which `pointerenter`/`pointerleave` never did. Without a guard, this causes the cursor's `cursor-active` class to flicker off/on as the pointer moves across a target's internal child elements — a regression from the current (single-element, `pointerenter`-based) visual behavior. [CITED: MDN — `PointerEvent`, `Element: pointerover event`, `Element: pointerenter event`]

**Current exact code (`components/custom-cursor.tsx`, to be replaced):**

```tsx
const cursorTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"))
const enterCursor = (event: Event) => {
  const target = event.currentTarget as HTMLElement
  if (cursorLabel) cursorLabel.textContent = target.dataset.cursor ?? "Abrir"
  cursor?.classList.add("cursor-active")
}
const leaveCursor = () => cursor?.classList.remove("cursor-active")

cursorTargets.forEach((target) => {
  target.addEventListener("pointerenter", enterCursor)
  target.addEventListener("pointerleave", leaveCursor)
})
```

**Fixed implementation — event delegation with a same-target guard:**

```tsx
// components/custom-cursor.tsx
"use client"

import { useEffect, useRef } from "react"

function closestCursorTarget(node: EventTarget | null): HTMLElement | null {
  return node instanceof Element ? node.closest<HTMLElement>("[data-cursor]") : null
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorLabel = cursor?.querySelector<HTMLElement>("span") // unchanged — internal to this component's own render
    const supportsPointer = window.matchMedia("(pointer: fine)").matches

    const onPointerMove = (event: PointerEvent) => {
      if (!cursor || !supportsPointer) return
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      cursor.classList.add("cursor-ready")
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = closestCursorTarget(event.target)
      if (!target) return
      const related = closestCursorTarget(event.relatedTarget)
      if (related === target) return // still inside the same [data-cursor] target, ignore child-boundary crossings
      if (cursorLabel) cursorLabel.textContent = target.dataset.cursor ?? "Abrir"
      cursor?.classList.add("cursor-active")
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = closestCursorTarget(event.target)
      if (!target) return
      const related = closestCursorTarget(event.relatedTarget)
      if (related === target) return // moving to a child element within the same target, ignore
      cursor?.classList.remove("cursor-active")
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerover", onPointerOver)
    document.addEventListener("pointerout", onPointerOut)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerover", onPointerOver)
      document.removeEventListener("pointerout", onPointerOut)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span>Explorar</span></div>
}
```

**When to use:** Always for this fix — this is the one correct place `[data-cursor]` wiring belongs; no per-section component should attach its own cursor listeners.

**Trade-offs:** `document`-level listeners fire on every pointer move across the whole page, not just over the 2-3 current `[data-cursor]` targets — negligible cost (`closest()` on a shallow DOM is cheap, and this replaces N individual per-target listeners with 2 document-level ones, which is fewer total event subscriptions, not more).

**Manual verification for ROADMAP.md's Phase 2 success criterion #3** ("reacciona correctamente sobre un elemento `[data-cursor]` insertado dinámicamente después del montaje inicial"): add a temporary test element via DevTools console after page load — `const el = document.createElement("button"); el.dataset.cursor = "Probar"; el.textContent = "test"; document.body.appendChild(el)` — then hover it and confirm the cursor label updates and `cursor-active` toggles correctly without a page reload. This is a legitimate manual proof for a requirement that only asks for "verificable con una prueba manual" — no drawer/carousel exists yet in this phase to prove it against real elements.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Blocking scroll while an overlay is open on a Lenis-driven page | A bespoke `overflow:hidden` + manual scrollY save/restore scroll-lock | `lenis.stop()`/`lenis.start()` via the shared `useScrollLock` hook (Pattern B) | Lenis already owns the scroll loop (`SmoothScrollProvider`); fighting it with CSS-only tricks is the exact failure mode documented in the milestone `PITFALLS.md` (Pitfall 5) — background content can keep moving under a "locked" overlay |
| Wiring cursor behavior to elements that mount after initial render | A `MutationObserver` that re-runs `querySelectorAll` on every DOM change | `document`-level `pointerover`/`pointerout` delegation (Pattern C) | Delegation solves the "elements added later" problem with zero extra machinery — a `MutationObserver` would be strictly more code for the same outcome and adds its own perf/cleanup surface |
| Typed content constants | A schema-validation library (Zod/Yup) for static, developer-authored data | Plain TypeScript `interface` + typed array literal | This is compile-time-checked developer content, not runtime user input — `zod` is already used in this codebase specifically for *user-submitted* form data (`lib/contact-schema.ts`); reusing it here would blur that distinction without adding safety |

**Key insight:** Both hook problems in this phase (scroll lock, cursor delegation) already have a documented "don't do this" answer directly in this repository's own current code — this phase is fixing two instances of the *same* underlying anti-pattern class (implicit DOM-timing assumptions with no re-sync mechanism) that this project's own `CONCERNS.md`/prior `ARCHITECTURE.md` already named after the `FormConnector` bug. Neither fix requires new tooling, just applying the pattern the codebase has already learned once.

## Common Pitfalls

### Pitfall 1: Renaming or restructuring `services[]` fields breaks `capabilities-section.tsx` silently

**What goes wrong:** `capabilities-section.tsx` (not touched by this phase) destructures `service.number`, `service.title`, `service.detail` directly in JSX (`components/sections/capabilities-section.tsx:42-45`). If the data restructure renames `detail` to e.g. `summary`, or drops `number`, `npm run typecheck`/`npm run build` (QA-01) fails immediately — a fast, loud failure, but still avoidable.
**Why it happens:** ARCH-01 talks about "extending" the data with new fields (`longDetail`, team, projects, brochure), which is easy to conflate with "restructuring" the existing `services` shape.
**How to avoid:** Add fields only (`id`, `longDetail`, optional `highlights`); never rename or remove `number`/`title`/`detail`. Also note the current array has **6** entries (leftover from the old dark-theme direction: "Topografía con drones", "Fotogrametría aérea", "Nubes de puntos LiDAR", "Teledetección multiespectral", "Inspección de infraestructura", "Consultoría geotécnica") but the real brief has exactly **5** ejes — going from 6 to 5 items *will* change what's visibly rendered on the current page today (still row-list styled until Phase 3 restyles it into cards), even though this phase's own component changes are limited to hooks. That's expected and fine, just don't be surprised the homepage's services section visibly changes content mid-Phase-2.
**Warning signs:** `npm run typecheck` fails on `components/sections/capabilities-section.tsx` after editing `lib/site-content.ts`.

### Pitfall 2: `lenis.stop()` alone doesn't guarantee 100% of native scroll is blocked

**What goes wrong:** Multiple open issues in Lenis's own GitHub repo (`darkroomengineering/lenis` — the official maintainer repo) report cases where `.stop()` does not fully prevent scrollbar-drag or certain keyboard-driven scroll paths, even though the documented `lenis-stopped` class/state is correctly applied. Treating `lenis.stop()` as a 100%-complete scroll lock in every browser could leave a narrow edge case where a keyboard/scrollbar user can still move the background page while the menu/drawer is visually "locked."
**Why it happens:** `lenis.stop()` intercepts the wheel/touch/rAF-driven interpolation Lenis itself owns — it was never designed as a universal native-scroll blocker for every input vector (scrollbar thumb drag, some keyboard shortcuts).
**How to avoid:** Use `lenis.stop()/start()` as the primary mechanism (satisfies ARCH-02 literally and is the correct Lenis-aware approach per the milestone `PITFALLS.md` Pitfall 5), but keep a lightweight, purpose-named `overflow:hidden` CSS rule on `<body>` as a defensive backstop applied by the same hook (e.g. toggle a small dedicated class from within `useScrollLock`, not tied to the retired `.menu-open` class) — belt-and-suspenders, not "instead of."
**Warning signs:** Tab/keyboard-only or scrollbar-drag testing (not just wheel/touch) with the menu open reveals the background page still moves.
**Phase to address:** This phase, when writing `useScrollLock` — cheap to add now, awkward to retrofit once both `MenuOverlay` and the Phase 3 drawer depend on the hook.

### Pitfall 3: Switching `pointerenter`/`pointerleave` to `pointerover`/`pointerout` without a same-target guard causes cursor flicker

**What goes wrong:** Delegation requires bubbling events (`pointerover`/`pointerout`), but those events also fire on every child-element boundary crossing inside a `[data-cursor]` target — `.service-row` currently wraps a `<span className="service-number">`, `<span className="service-title">`, `<span className="service-detail">`, and an `<Arrow />` icon. Without checking `event.relatedTarget` against the same `closest("[data-cursor]")` target, `cursor-active` toggles off and back on every time the pointer crosses one of those internal child boundaries while moving across the row — a visible flicker regression from the current, non-flickering `pointerenter`-based behavior.
**Why it happens:** This is the single most common mistake when converting `pointerenter`/`pointerleave` handlers to delegated `pointerover`/`pointerout` handlers — the two event pairs are not drop-in equivalents despite superficially similar names.
**How to avoid:** Use the `closestCursorTarget(event.relatedTarget) === target` guard shown in Pattern C's fixed implementation before adding/removing `cursor-active`.
**Warning signs:** Hovering slowly across a `[data-cursor]` element with multiple child nodes (any current service row, or the hero's `.circle-link`) shows the cursor dot/label flashing rather than staying steady.

### Pitfall 4: Content Gap — fabricating the 4 geologists' bios or the brochure long-form text

**What goes wrong:** ARCH-01 requires "datos reales" (real data). Direct filesystem search of `local-2/`, `local/`, and `produccion/` (including a search for the specific `BROCHURE SKYTECH.pdf` file named in `PALETA-DE-MARCA.md` as the original source) found **no file anywhere in this workspace** containing the 4 geologists' names, roles, or bios, nor the 5 ejes' long-form descriptions, nor an actual brochure PDF. `PROJECT.md` only records that this content "was already redacted by the client" — it does not contain the text itself. If a plan or an executing agent invents plausible-sounding names/bios for these four real, named individuals to satisfy the requirement mechanically, that is a factual-integrity problem (fabricated identity claims about real people), not a acceptable placeholder.
**Why it happens:** The requirement's wording ("datos reales de marca") combined with time pressure to "just fill in the array" makes it tempting to draft something plausible and move on, especially since the 5 eje *titles* and the 3 *projects* genuinely are real and available, making the whole requirement look more "done" than the team/brochure portions actually are.
**How to avoid:** Split ARCH-01 into what's actually satisfiable now vs. blocked:
- `services[].title` (5 ejes) — real, from `PROJECT.md`, populate now.
- `projects[]` (3 projects, full client/location/service) — real, from `PROJECT.md`, populate now.
- `services[].detail`/`.longDetail` — no source text exists; either request it from the user, or draft clearly-flagged placeholder copy explicitly pending approval (acceptable for prose describing the *company's own service offering*, not for personal biographical claims).
- `team[]` (names, roles, bios, photos) — **do not draft**. This needs either the original client-provided text or an explicit user instruction to proceed with placeholders. Recommend a `checkpoint:human-verify`-equivalent step in the plan before this array is considered final.
- `brochure` — safe to define as structural metadata now (title/href) since the actual PDF file is a Phase 5 (BROCH-01) deliverable, not this phase's.
**Warning signs:** A plan or diff introduces named individuals with biographical detail that cannot be traced to `PROJECT.md`, this research file, or a message from the user in the current conversation.
**Phase to address:** This phase, at planning time — surfacing the question to the user costs one question; discovering fabricated bios in review costs a full re-plan of Phase 5 (TEAM-01) too, since Phase 5 will present this same data visually.

## Code Examples

Already inlined under Architecture Patterns above (Pattern A: data shape; Pattern B: `useScrollLock`; Pattern C: `CustomCursor` fix) — these are the load-bearing examples for this phase, verified against the actual current files rather than generic library docs.

## State of the Art

| Old Approach (current code) | New Approach (this phase) | Why Changed | Impact |
|--------------------------|---------------------------|--------------|--------|
| `document.body.classList.toggle("menu-open", menuOpen)` + `body.menu-open{overflow:hidden}` CSS rule | `useScrollLock(menuOpen)` → `lenis.stop()/start()` | ARCH-02 requirement; CSS-only lock doesn't reliably stop Lenis-driven scroll (milestone `PITFALLS.md` Pitfall 5) | `menu-overlay.tsx` loses its own `useEffect` for scroll lock; the CSS rule becomes dead code (delete or repurpose as a defensive backstop, see Pitfall 2) |
| `querySelectorAll("[data-cursor]")` once at mount + `pointerenter`/`pointerleave` per element | `document.addEventListener("pointerover"/"pointerout", ...)` + `closest("[data-cursor]")` | ARCH-03 requirement; static snapshot misses elements mounted later (drawer/carousel, both arrive Phase 3/4) | `custom-cursor.tsx`'s internal logic changes event types, not just where listeners attach — requires the same-target guard (Pitfall 3) |
| Untyped `services` array literal | Typed `Service`/`TeamMember`/`Project`/`Brochure` interfaces | ARCH-01 ("datos reales tipados") | Enables compile-time safety for Phase 3's drawer consuming `service.longDetail`, Phase 5's team/projects sections |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The 5 ejes' `detail`/`longDetail` prose and the brochure's exact title/copy can be safely drafted by Claude (clearly flagged as pending approval) without a factual-integrity issue, since it describes the company's own service offering rather than named individuals | Pitfall 4, Pattern A | LOW — worst case, the user asks for it to be rewritten once real brochure text is supplied in Phase 5; no factual harm since it's not attributed to a real named person |
| A2 | `hooks/use-scroll-lock.ts` and the `custom-cursor.tsx` fix are the only two files besides `lib/site-content.ts` that need to change for ARCH-01/02/03 (i.e. `capabilities-section.tsx` does not need touching if field names are preserved) | Architecture Patterns, Pitfall 1 | MEDIUM — if the planner also decides to rename `services` fields for "cleanliness," this assumption breaks and `capabilities-section.tsx` needs an accompanying edit not currently scoped to this phase |
| A3 | Keeping a defensive `overflow:hidden` CSS backstop alongside `lenis.stop()` satisfies the spirit of ARCH-02 ("basado en lenis.stop()/start(), no en overflow:hidden") rather than violating it | Pattern B, Pitfall 2 | LOW-MEDIUM — a strict reading of ARCH-02 could interpret this as reintroducing the exact thing the requirement bans; if so, drop the backstop and accept the known Lenis edge-case gap (cite the GitHub issues) as a documented residual risk instead |

**If this table is empty:** N/A — see rows above.

## Open Questions

1. **Do the 4 geologists' bios, photos, and per-eje long-form service text exist anywhere accessible to the user (the original `BROCHURE SKYTECH.pdf`, an email, a shared doc), or should Claude draft placeholder copy for `services[].detail/.longDetail` now and leave `team[]` empty/blocked until the source is provided?**
   - What we know: `PALETA-DE-MARCA.md` confirms a `BROCHURE SKYTECH.pdf` was shared by the client and consumed once (for color extraction) in an earlier session; the file itself is not present in `local/`, `local-2/`, or `produccion/` today. `PROJECT.md` records that this content "was already redacted by the client" but does not contain the actual text.
   - What's unclear: whether the original PDF/text still exists somewhere the user can re-share it, or whether the plan should proceed with clearly-flagged placeholder content for now.
   - Recommendation: the planner should surface this as an explicit question/checkpoint before finalizing `team[]` specifically — service prose can reasonably proceed with flagged draft copy, but four real people's names and biographical claims should not be invented.

2. **Should the defensive `overflow:hidden` backstop (Pitfall 2) be included in `useScrollLock`, or does the user want a strict reading of ARCH-02 that excludes any `overflow:hidden` usage entirely?**
   - What we know: `lenis.stop()` has documented (GitHub-issue-level) edge cases where it doesn't block 100% of native scroll vectors; the current codebase's only `overflow:hidden` usage is the one being retired.
   - What's unclear: whether ARCH-02's "no `overflow:hidden`" phrasing is a hard constraint or descriptive of the current bug being fixed.
   - Recommendation: default to including the backstop (documented, well-reasoned, low-risk) unless the plan-check/user explicitly objects.

3. **Does an `icon`/`image` field belong on `Service` in this phase, or is it out of scope until Phase 3/5?**
   - What we know: no icon library or icon-per-service pattern exists anywhere in this codebase today (`components/arrow.tsx` is the only decorative SVG-ish element, used for all rows identically). The brief explicitly vetoes "cartoonish iconography." SERV-01/02/03 (Phase 3 requirements) don't explicitly require per-service imagery either.
   - What's unclear: whether Phase 3's drawer design will want a representative photo per eje (in service of QA-03's "not drone-only imagery" requirement).
   - Recommendation: do not add an `icon`/`image` field to `Service` in this phase — no consumer needs it yet, and adding it now would mean guessing at a shape Phase 3's actual UI-SPEC hasn't determined. Revisit in Phase 3.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — automated unit/E2E tests are explicitly out of scope for this project (`REQUIREMENTS.md` Out of Scope table, `CONCERNS.md`) |
| Config file | none |
| Quick run command | `npm run typecheck` (fast, catches the Pitfall 1 field-rename class of error immediately) |
| Full suite command | `npm run lint && npm run typecheck && npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ARCH-01 | `lib/site-content.ts` exports typed `services`/`team`/`projects`/`brochure` and still compiles against existing consumers | typecheck | `npm run typecheck` | ✅ existing tsconfig, no new file needed |
| ARCH-02 | `useScrollLock` calls `lenis.stop()/start()`; `menu-overlay.tsx` uses it; background scroll is blocked while menu is open | manual | Open menu, attempt wheel/touch/keyboard/scrollbar-drag scroll on background — confirm none move the page; close menu, confirm scroll resumes | ❌ no automated test exists — manual-only per project's no-tests policy |
| ARCH-03 | `custom-cursor.tsx` reacts to a `[data-cursor]` element inserted after mount | manual | DevTools console snippet from Pattern C's "Manual verification" note | ❌ no automated test exists — manual-only per project's no-tests policy |

### Sampling Rate
- **Per task commit:** `npm run typecheck`
- **Per wave merge:** `npm run lint && npm run typecheck && npm run build`
- **Phase gate:** Full suite green + the two manual checks above (ARCH-02, ARCH-03) before `/gsd-verify-work`

### Wave 0 Gaps
None — no test framework exists project-wide and none is being introduced (out of scope per `REQUIREMENTS.md`). This phase's verification is typecheck/build (automated) plus two short manual DOM checks (documented above), consistent with how Phase 1 was verified per `STATE.md`'s decision log.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | This phase touches no auth surface |
| V3 Session Management | No | No session/state beyond local React `useState`/hook internals |
| V4 Access Control | No | No access-controlled resource introduced |
| V5 Input Validation | No | All new data is static, developer-authored content (no user input processed by this phase) — if any `longDetail`/bio text is ever rendered via `dangerouslySetInnerHTML` in a later phase, standard JSX text interpolation (which auto-escapes) should be used instead; this phase itself renders nothing new |
| V6 Cryptography | No | No cryptographic operation in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| N/A for this phase | — | This phase is pure client-side data/DOM-event code with no user input, no network calls, and no new attack surface. The only file that will eventually render this data as raw HTML is out of scope here (Phase 3/5); when it does, plain JSX text nodes (not `dangerouslySetInnerHTML`) are the standard mitigation against stored-content XSS, consistent with how the rest of this codebase already renders content (`services.map(...)` in `capabilities-section.tsx` today uses plain JSX interpolation, not raw HTML injection) |

## Sources

### Primary (HIGH confidence — direct codebase/type verification)
- `local-2/lib/site-content.ts` — current exact `services`/`process` shape
- `local-2/components/custom-cursor.tsx` — current exact cursor implementation (querySelectorAll-at-mount, pointerenter/pointerleave)
- `local-2/components/menu-overlay.tsx` — current exact scroll-lock mechanism (`body.classList.toggle("menu-open", ...)`)
- `local-2/components/providers/smooth-scroll-provider.tsx` — confirms `useLenis(ScrollTrigger.update)` bridge pattern already in use
- `local-2/node_modules/lenis/dist/lenis-react.d.ts`, `local-2/node_modules/lenis/dist/lenis.d.ts` — installed `lenis@1.3.25` API surface: `useLenis(callback?, deps?, priority?): Lenis | undefined`; `Lenis.start()`, `Lenis.stop()`, `get isStopped(): boolean`
- `local-2/app/globals.css` (grep for `menu-open`) — confirms `body.menu-open{overflow:hidden}` is the only consumer of that class
- `local-2/package.json` — confirms zero new dependencies needed (`lenis@1.3.25`, `@gsap/react@2.1.2`, `gsap@3.15.0`, `embla-carousel-react@8.6.0` already present)
- `local-2/CLAUDE.md`, `.planning/codebase/CONVENTIONS.md` (embedded in CLAUDE.md) — naming/typing/import conventions
- `local-2/.planning/PROJECT.md` — real 5 eje titles, real 3-project client/location/service data, confirmation that team bios/mission/vision text "was already redacted by client" but not embedded in this doc
- `local-2/PALETA-DE-MARCA.md` — names the original source document (`BROCHURE SKYTECH.pdf`), confirmed absent from the filesystem via direct search across `local/`, `local-2/`, `produccion/`
- `local-2/.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md` — exact ARCH-01/02/03 wording and Phase 2 success criteria

### Secondary (MEDIUM confidence — WebSearch, cross-checked against official sources)
- [MDN — PointerEvent](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent), [Element: pointerover event](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerover_event), [Element: pointerenter event](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event) — confirms `pointerenter`/`pointerleave` do not bubble, `pointerover`/`pointerout` do, and that the latter additionally fire on child-element boundary crossings
- [darkroomengineering/lenis Issue #310 — "Don't stop scroll with .stop()"](https://github.com/darkroomengineering/lenis/issues/310), [Issue #107](https://github.com/darkroomengineering/lenis/issues/107) — official Lenis maintainer repo, documents cases where `lenis.stop()` does not fully block native scroll (scrollbar/keyboard) in every scenario

### Tertiary (LOW confidence — inherited from milestone-level research, not independently re-verified in this phase)
- `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` (milestone-level, 2026-07-18) — broader Pattern B/Anti-Pattern 2 context; this phase's research supersedes their code examples where the two differ (notably: their `CustomCursor` example uses `pointerover` without noting the bubbling/guard nuance this file adds)

## Metadata

**Confidence breakdown:**
- Hook implementations (ARCH-02, ARCH-03): HIGH — verified against actual installed package types and actual current file contents, not documentation alone
- Data shape (ARCH-01 types/structure): HIGH — straightforward TypeScript, matches existing codebase conventions
- Data content (ARCH-01 actual brand copy): LOW — genuine, unresolved content gap; flagged prominently rather than papered over

**Research date:** 2026-07-19
**Valid until:** Should remain valid for the lifetime of this phase (no fast-moving dependencies involved) — re-verify the `lenis` API surface only if `package.json`'s pinned version changes before this phase executes.
