# Phase 1: Motion Foundation & Architecture Cleanup - Pattern Map

**Mapped:** 2026-07-18
**Files analyzed:** 15 (new + modified)
**Analogs found:** 15 / 15 (all analogs are internal — see note below)

**Note on analog source:** This codebase has no prior GSAP/Lenis usage, no `providers/`, `sections/`, or `hooks/` directories, and no other component-decomposition precedent. Every new file's closest analog is a specific line range **within the two files being decomposed** (`components/experience.tsx`, `app/page.tsx`) — this phase is a pure extraction/refactor, not new-pattern invention. Where research (`STACK.md`/`ARCHITECTURE.md`) supplies the only source for a genuinely new pattern (Lenis/GSAP wiring), that is noted explicitly instead of a fabricated codebase analog.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `lib/gsap.ts` | config/utility | transform | none in codebase — `.planning/research/STACK.md` Integration Pattern | no-analog (research-sourced) |
| `lib/motion-preferences.ts` | utility | transform | `experience.tsx` lines 11 (`window.matchMedia("(prefers-reduced-motion: reduce)")`) | role-match (partial: reused matchMedia check, new gsap.matchMedia wrapper is research-sourced) |
| `components/providers/smooth-scroll-provider.tsx` | provider | event-driven | `experience.tsx` lines 34-52 (rAF loop, hosted here) + `.planning/research/ARCHITECTURE.md` Pattern 1 | role-match (partial) |
| `hooks/use-legacy-parallax.ts` | hook | event-driven | `experience.tsx` lines 34-52 (exact rAF loop to port unchanged) | exact |
| `components/intro-sequence.tsx` | component | event-driven | `experience.tsx` lines 10-12, 150-154 | exact |
| `components/menu-overlay.tsx` | component | event-driven | `experience.tsx` lines 6, 89-94, 156-185 | exact |
| `components/custom-cursor.tsx` | component | event-driven | `experience.tsx` lines 54-73, 187 | exact |
| `components/sections/hero-section.tsx` | component | CRUD (state) + request-response (video) | `app/page.tsx` lines 55-110 + `experience.tsx` lines 13, 15-18, 96-110, 189-197 | exact |
| `components/sections/manifesto-section.tsx` | component | transform (static markup) | `app/page.tsx` lines 112-142 | exact |
| `components/sections/capabilities-section.tsx` | component | transform (static markup) | `app/page.tsx` lines 144-172 | exact |
| `components/sections/technology-section.tsx` | component | transform (static markup) | `app/page.tsx` lines 174-196 | exact |
| `components/sections/process-section.tsx` | component | transform (static markup) | `app/page.tsx` lines 198-230 | exact |
| `components/sections/contact-section.tsx` | component | transform (static markup) | `app/page.tsx` lines 232-247 | exact |
| `components/contact-form.tsx` | component | request-response | `experience.tsx` lines 112-146 (`submitForm`) + `app/page.tsx` lines 249-268 (form markup) | exact |
| `app/layout.tsx` (modified) | provider mount point | event-driven | itself, lines 26-32 (current `<body>{children}</body>`) | exact (modify in place) |
| `app/page.tsx` (modified) | composition/route | request-response | itself, lines 50-287 (current composition) | exact (modify in place) |
| `components/experience.tsx` (deleted) | — | — | — | N/A — deleted after full extraction |
| `landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx` (moved) | legacy | — | — | N/A — moved to `../referencias/`, verified unreferenced |

## Pattern Assignments

### `lib/gsap.ts` (config, transform)

**Analog:** None in codebase (first GSAP usage). Use `.planning/research/STACK.md` Integration Pattern verbatim — do not re-derive.

**Required shape** (from research, not codebase):
```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

**Import hygiene constraint (critical, from RESEARCH.md):** This file must only ever be imported transitively from `"use client"` files. Verify with the existing precedent — `app/page.tsx` (server component, no `"use client"`, `export const dynamic = "force-static"` at line 4) currently imports only `{ Experience }` from `components/experience.tsx`, itself `"use client"` (line 1). Preserve this exact shape: after decomposition, `app/page.tsx` must only import `components/sections/*`, `components/menu-overlay`, `components/custom-cursor`, `components/intro-sequence`, `components/contact-form` — never `lib/gsap.ts` or `lib/motion-preferences.ts` directly.

---

### `lib/motion-preferences.ts` (utility, transform)

**Analog:** `components/experience.tsx` line 11 (existing reduced-motion check pattern to mirror for consistency):
```typescript
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```
This exact `window.matchMedia("(prefers-reduced-motion: reduce)")` string/query must be reused verbatim (don't introduce a different media query string). New file wraps this in the locked lerp pair per `01-UI-SPEC.md`:
```typescript
export const LENIS_LERP = { normal: 0.07, reduced: 0.15 } as const;
export function getLenisLerp(): number {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? LENIS_LERP.reduced
    : LENIS_LERP.normal;
}
```
**Note:** research flags (Assumption A3) that a one-time read may not satisfy the "live-updating via `gsap.matchMedia()`" intent of FOUND-02 — wrap Lenis instance re-creation inside `gsap.matchMedia().add(...)` in the provider, not just a one-time call here.

---

### `components/providers/smooth-scroll-provider.tsx` (provider, event-driven)

**Analog:** No direct codebase analog (first Lenis usage) — but it **inherits** two things from `experience.tsx`:

**"use client" + hook-based effect structure** (analog: `experience.tsx` lines 1-10):
```typescript
"use client";
import { FormEvent, useEffect, useState } from "react";
```
Follow this same top-of-file `"use client"` + React import convention.

**Hosts the ported parallax loop** — see `hooks/use-legacy-parallax.ts` below; call it once from inside this provider (never per-section — see Shared Patterns).

**Wiring pattern** (research-sourced, `.planning/research/ARCHITECTURE.md` Pattern 1 / `STACK.md`):
```tsx
import { ReactLenis, useLenis } from "lenis/react";
import { getLenisLerp } from "@/lib/motion-preferences";
import { gsap, ScrollTrigger } from "@/lib/gsap";
// A child bridge calls useLenis(ScrollTrigger.update), adds one GSAP ticker callback,
// and removes that exact callback in cleanup.
<ReactLenis root options={{ autoRaf: false, syncTouch: true, anchors: true, lerp: getLenisLerp() }}>
```

For live reduced-motion changes, keep the preference in React state via `gsap.matchMedia()` and key `ReactLenis` by `normal`/`reduced`. This recreates the React-owned instance through supported lifecycle instead of mutating `lenis.options`. `anchors: true` preserves the site's real in-page navigation links. Import `lenis/dist/lenis.css` once from `app/layout.tsx` as recommended by the official package.

**Critical sequencing constraint (from RESEARCH.md dual-rAF pitfall):** Mounting this provider in `app/layout.tsx` and removing `experience.tsx`'s private parallax rAF loop (lines 34-52) must land in the same step — never commit a state with both loops live simultaneously.

---

### `hooks/use-legacy-parallax.ts` (hook, event-driven)

**Analog:** `components/experience.tsx` lines 34-52 — port **unchanged**:
```typescript
const root = document.documentElement;
const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
let frame = 0;
const updateScroll = () => {
  frame = 0;
  root.style.setProperty("--scroll-y", `${window.scrollY}px`);
  if (reducedMotion) return;
  parallaxItems.forEach((item) => {
    const rect = item.parentElement?.getBoundingClientRect();
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
    const speed = Number(item.dataset.parallax ?? 0.1);
    item.style.setProperty("--parallax", `${rect.top * speed}px`);
  });
};
const onScroll = () => {
  if (!frame) frame = window.requestAnimationFrame(updateScroll);
};
window.addEventListener("scroll", onScroll, { passive: true });
updateScroll();
```
Cleanup pattern (lines 79, 81 of original):
```typescript
window.removeEventListener("scroll", onScroll);
if (frame) window.cancelAnimationFrame(frame);
```
**Do not** wrap in `gsap.matchMedia()` or convert to ScrollTrigger — this phase keeps parallax fully vanilla (Phase 2/MOTION-02 migrates it). Called exactly once (from `SmoothScrollProvider`), never per-section — see Shared Patterns.

---

### `components/intro-sequence.tsx` (component, event-driven)

**Analog:** `components/experience.tsx` lines 10, 12 (state/timer) + 150-154 (JSX):
```typescript
const [introDone, setIntroDone] = useState(false);
// ...
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const introTimer = window.setTimeout(() => setIntroDone(true), reducedMotion ? 100 : 1450);
// cleanup: window.clearTimeout(introTimer);
```
JSX to extract verbatim:
```tsx
<div className={`intro ${introDone ? "intro-done" : ""}`} aria-hidden="true">
  <div className="intro-brand"><span>✳</span><strong>SKY TECH</strong></div>
  <div className="intro-line"><i /></div>
  <span className="intro-coordinate">PERÚ / 14°04&apos;S</span>
</div>
```

---

### `components/menu-overlay.tsx` (component, event-driven)

**Analog:** `components/experience.tsx` line 6 (`menuOpen` state), lines 89-94 (body class effect + `navigate`), lines 156-185 (header + overlay JSX):
```typescript
const [menuOpen, setMenuOpen] = useState(false);
// ...
useEffect(() => {
  document.body.classList.toggle("menu-open", menuOpen);
  return () => document.body.classList.remove("menu-open");
}, [menuOpen]);
const navigate = () => setMenuOpen(false);
```
Header + overlay JSX (lines 156-185) — copy verbatim into this single component (kept as one file per RESEARCH.md rationale: header toggle and overlay nav share `menuOpen` state, avoiding prop-drilling/context for a 2-file split).

---

### `components/custom-cursor.tsx` (component, event-driven)

**Analog:** `components/experience.tsx` lines 54-73 (listener setup) + line 187 (JSX):
```typescript
const cursor = document.querySelector<HTMLElement>(".custom-cursor");
const cursorLabel = cursor?.querySelector<HTMLElement>("span");
const supportsPointer = window.matchMedia("(pointer: fine)").matches;
const onPointerMove = (event: PointerEvent) => {
  if (!cursor || !supportsPointer) return;
  cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  cursor.classList.add("cursor-ready");
};
const cursorTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"));
const enterCursor = (event: Event) => {
  const target = event.currentTarget as HTMLElement;
  if (cursorLabel) cursorLabel.textContent = target.dataset.cursor ?? "Abrir";
  cursor?.classList.add("cursor-active");
};
const leaveCursor = () => cursor?.classList.remove("cursor-active");
window.addEventListener("pointermove", onPointerMove, { passive: true });
cursorTargets.forEach((target) => {
  target.addEventListener("pointerenter", enterCursor);
  target.addEventListener("pointerleave", leaveCursor);
});
// cleanup mirrors add calls, see lines 80-85
```
JSX: `<div className="custom-cursor" aria-hidden="true"><span>Explorar</span></div>` (line 187).
**Instantiate exactly once as a global-chrome component** — do not duplicate per-section (targets span Hero, Capabilities, Manifesto — see Shared Patterns).

---

### `components/sections/hero-section.tsx` (component, mixed CRUD/request-response)

**Analog:** `app/page.tsx` lines 55-110 (hero markup, copy verbatim) + `components/experience.tsx` lines 13, 15-18 (video pause-on-reduced-motion), 96-110 (`toggleVideo`), 189-197 (video-toggle JSX):
```typescript
const [videoPlaying, setVideoPlaying] = useState(true);
// replace document.querySelector<HTMLVideoElement>("#hero-video") with useRef<HTMLVideoElement>(null)
const toggleVideo = async () => {
  const video = videoRef.current;
  if (!video) return;
  if (video.paused) {
    try { await video.play(); setVideoPlaying(true); }
    catch { setVideoPlaying(false); }
  } else { video.pause(); setVideoPlaying(false); }
};
```
Video-toggle button JSX (lines 189-197) must render as a **JSX sibling** of `<section className="hero">`, not nested inside it — see `.planning/research/PITFALLS.md`/RESEARCH.md "Video-toggle DOM-positioning pitfall" for why (preserves exact current `.video-toggle { position: absolute }` containing-block behavior).

---

### `components/sections/{manifesto,capabilities,technology,process,contact}-section.tsx` (components, transform)

**Analog:** `app/page.tsx` respective line ranges (112-142, 144-172, 174-196, 198-230, 232-247) — copy markup verbatim, no logic changes. Each wraps in:
```tsx
useGSAP(() => {
  // exact current IntersectionObserver body from experience.tsx lines 20-32,
  // scoped via root.current.querySelectorAll("[data-reveal]") instead of document.querySelectorAll
  return () => revealObserver.disconnect();
}, { scope: root });
```
Reveal observer core logic to reuse (from `experience.tsx` lines 20-32):
```typescript
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
);
```
**Do not** replace this with `gsap.from()`/ScrollTrigger — RESEARCH.md's "Reconciling ARCH-02" section confirms `useGSAP` is a StrictMode-safe `useEffect` replacement that doesn't require calling `gsap.*` APIs; keep behavior byte-identical.

`capabilities-section.tsx` also owns the "moving-band" block (`app/page.tsx` lines 167-172), part of its extracted range.
`technology-section.tsx` contains the second `[data-parallax]` element (`tech-media`, line 176) — still served by the single shared `use-legacy-parallax` hook, not a local one.
`contact-section.tsx` renders `<ContactForm />` in place of the raw `<form>` (see below) instead of copying form markup directly.

---

### `components/contact-form.tsx` (component, request-response)

**Analog:** `components/experience.tsx` lines 112-146 (`submitForm`, rename to local `handleSubmit`) + `app/page.tsx` lines 249-268 (form markup):
```typescript
const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector<HTMLButtonElement>("#submit-button");
  const status = form.querySelector<HTMLElement>("#form-status");
  const data = new FormData(form);
  if (button) button.disabled = true;
  if (status) { status.className = "form-status is-pending"; status.textContent = "Enviando solicitud…"; }
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    });
    const result = (await response.json()) as { message?: string };
    if (!response.ok) throw new Error(result.message ?? "No pudimos enviar tu solicitud.");
    form.reset();
    if (status) { status.className = "form-status is-success"; status.textContent = "Solicitud recibida. Nos pondremos en contacto contigo."; }
  } catch (error) {
    if (status) { status.className = "form-status is-error"; status.textContent = error instanceof Error ? error.message : "Ocurrió un error. Inténtalo nuevamente."; }
  } finally {
    if (button) button.disabled = false;
  }
};
```
No behavior change — same fetch call, same status states, same fallback text. Form markup (`app/page.tsx` lines 249-268) moves in with `onSubmit={handleSubmit}` directly on the `<form>` element (replacing `id="contact-form"` + `FormConnector` coupling). `data-reveal` attribute must be preserved on the root `<form>`.

**Delete alongside this extraction (do not leave behind):**
- `FormConnector` function (`experience.tsx` lines 207-216)
- Dead decoy form (`experience.tsx` lines 199-201):
```tsx
<form className="form-event-bridge" onSubmit={submitForm} aria-hidden="true">
  <button type="submit" tabIndex={-1}>Enviar</button>
</form>
```
- Its CSS rule in `app/globals.css`: `.form-event-bridge { display: none }`

**Validation reuse (do not hand-roll):** `import { contactSchema } from "@/lib/contact-schema"` — already correct, shared client/server (see `lib/contact-schema.ts` lines 1-12), includes honeypot field (`website`, must stay empty) — do not remove during extraction.

---

### `app/layout.tsx` (modified — provider mount point)

**Analog:** itself, current lines 26-32:
```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
```
Modify to wrap `{children}` in `<SmoothScrollProvider>`:
```tsx
<body className={`${inter.variable} ${spaceGrotesk.variable}`}>
  <SmoothScrollProvider>{children}</SmoothScrollProvider>
</body>
```
Server component structure (no `"use client"` here) must be preserved — `layout.tsx` itself stays a server component; only imports the client `SmoothScrollProvider`.

---

### `app/page.tsx` (modified — composition only)

**Analog:** itself, current lines 50-287. Replace `import { Experience } from "@/components/experience"` (line 2) and `<Experience />` (line 53) with imports of the new global-chrome components (`IntroSequence`, `MenuOverlay`, `CustomCursor`) and section components. Preserve `export const dynamic = "force-static"` (line 4) — `page.tsx` stays a server component, composing only `"use client"` children, per Import Hygiene Constraint above.

---

## Shared Patterns

### Reduced-motion detection (two separate mechanisms — not duplication)
**Source:** `components/experience.tsx` line 11
```typescript
window.matchMedia("(prefers-reduced-motion: reduce)").matches
```
**Apply to:** `lib/motion-preferences.ts` (new `gsap.matchMedia()` Lenis-lerp gate) AND unchanged verbatim inside the relocated (but not rewritten) vanilla reveal/parallax code in `intro-sequence.tsx` and `hooks/use-legacy-parallax.ts`. Per RESEARCH.md "Don't Hand-Roll" table: these are correctly two separate mechanisms, not something to consolidate this phase.

### Single-instance systems (must not be duplicated per-section)
**Source:** `components/experience.tsx` lines 34-52 (parallax), 54-73 (cursor)
**Apply to:** `hooks/use-legacy-parallax.ts` (call once, from `SmoothScrollProvider` only) and `components/custom-cursor.tsx` (mount once, as global chrome in `app/page.tsx`, not per-section). Naively re-creating either per-section produces N competing rAF loops / duplicate `pointermove` listeners — explicitly flagged as a pitfall in RESEARCH.md.

### `useEffect` cleanup pattern (StrictMode-safe pairing)
**Source:** `components/experience.tsx` lines 75-86
```typescript
return () => {
  window.clearTimeout(introTimer);
  revealObserver.disconnect();
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("pointermove", onPointerMove);
  if (frame) window.cancelAnimationFrame(frame);
  cursorTargets.forEach((target) => {
    target.removeEventListener("pointerenter", enterCursor);
    target.removeEventListener("pointerleave", leaveCursor);
  });
};
```
**Apply to:** Every extracted hook/component that sets up listeners/timers/observers — every `addEventListener`/`setTimeout`/`new IntersectionObserver` call must have a matching cleanup line, mirroring this file's existing discipline. When migrating to `useGSAP()`, this same cleanup logic goes in the callback's `return () => {}`.

### Form validation and API contract (do not modify)
**Source:** `lib/contact-schema.ts` (Zod schema) + `app/api/contact/route.ts` (POST handler, lines 1-51)
**Apply to:** `components/contact-form.tsx` — request payload shape (`Object.fromEntries(data.entries())`, JSON POST to `/api/contact`) and response shape (`{ message?: string }`) must match exactly; these two files are unaffected by this phase and are the authoritative contract.

### "use client" + composition boundary
**Source:** `components/experience.tsx` line 1 + `app/page.tsx` line 4 (`export const dynamic = "force-static"`, no `"use client"`)
**Apply to:** All new files under `components/` (including `components/sections/*`, `components/providers/*`) must start with `"use client"`. `app/page.tsx` and `app/layout.tsx` stay server components — only compose, never directly import `lib/gsap.ts`/`lib/motion-preferences.ts`.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `lib/gsap.ts` | config | transform | First GSAP usage in codebase — no existing plugin-registration file to model. Use `.planning/research/STACK.md` Integration Pattern verbatim. |
| `components/providers/smooth-scroll-provider.tsx` (Lenis wiring portion only) | provider | event-driven | First Lenis usage — no existing scroll-engine provider. Use `.planning/research/ARCHITECTURE.md` Pattern 1 for the `<ReactLenis>`/ticker-sync wiring specifically (the parallax-hosting portion does have a codebase analog, see above). |

## Metadata

**Analog search scope:** `components/`, `app/`, `lib/`, `hooks/` (entire `local-2/` active source tree — confirmed via directory listing that no `providers/`, `sections/`, or prior GSAP/Lenis files exist)
**Files scanned:** `components/experience.tsx`, `app/page.tsx`, `app/layout.tsx`, `lib/contact-schema.ts`, `app/api/contact/route.ts`
**Pattern extraction date:** 2026-07-18
