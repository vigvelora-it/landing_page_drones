---
phase: 6
slug: calidad-y-regresion-final
status: draft
shadcn_initialized: false
preset: none
created: 2026-07-20
---

# Phase 6 — UI Design Contract

> Quality and regression contract for the completed frontend milestone. This phase audits and repairs the approved interface; it does not redesign it.

## Phase Boundary

Phase 6 closes `QA-01`, `QA-02`, `QA-03`, and `BRAND-02` by testing the production build, the combined interactive system, the subject balance of visible imagery, and the contact flow. The light technical visual system, typography, spacing, copy, motion limits, section hierarchy, drawer, sticky header, and carousel established in Phases 1–5 remain locked.

This contract must not silently close the two external Phase 5 gaps:

- `TEAM-01` remains incomplete until four real, identified founder portraits are supplied. Initials are an honest fallback, not completion evidence.
- `BROCH-01` remains blocked until the client supplies the real final PDF. A future path, screenshot, fabricated PDF, empty link, or disabled control is not completion evidence.

Phase 6 may report those gaps in final release evidence, but must not absorb them into `QA-03`, mark their requirement checkboxes, invent assets, or delay otherwise valid QA work. No deployment is part of this phase.

---

## Design System

| Property | Locked value |
|----------|--------------|
| Tool | none — existing vanilla CSS and CSS custom properties |
| Preset | not applicable |
| Component library | none — existing semantic React/Next.js components |
| Interaction libraries | existing GSAP + Lenis + Embla only; no new animation authority |
| Icon library | none — retain existing CSS/text/arrow language |
| Font | Space Grotesk (`--display`) + Inter (`--body`) |
| Visual direction | light, sober, technical, premium; moderate motion |

**Regression rule:** a QA repair must be the smallest change that restores the existing contract. Do not add a new palette, section, typography role, effect, dependency, claim, CTA, or content hierarchy while fixing a defect.

**Reference rule:** Fugro and Seequent remain quality/structure references only. No code, copy, images, video, colors, or literal design treatment may be copied from either source.

---

## Spacing Scale

No new layout scale is introduced. Repairs reuse the established values below.

| Token | Value | QA use |
|-------|-------|--------|
| xs | 4px | inline alignment and indicators |
| sm | 8px | compact control/caption gaps |
| md | 16px | mobile gutters and carousel gaps |
| lg | 24px | component gaps and drawer divisions |
| xl | 32px | internal panel padding |
| 2xl | 48px | large component separation |
| 3xl | 64px | section-level separation where already used |

Existing exceptions remain valid: 44×44px minimum icon-button targets, fluid `--shell`, and existing responsive `clamp()` values. A repair must not add a second global `overflow-x` suppression rule to hide a faulty component.

---

## Typography

Typography is audited for regression, not revised.

| Role | Locked treatment |
|------|------------------|
| Body | Inter, weight 400, existing responsive sizes and line heights |
| Labels / kickers | Inter, weight 500, uppercase/letter spacing already defined |
| Headings / display | Space Grotesk, weight 500, existing section-specific `clamp()` values |
| Status and validation copy | Existing Inter body treatment; never conveyed by color alone |
| Screen-reader status | Existing `.sr-only`/`aria-live` patterns; must remain in the accessibility tree |

No line clamping may hide biographies, project facts, drawer content, form feedback, or navigation labels at any target viewport.

---

## Color

All visual evidence is checked against the existing token layer; Phase 6 creates no new colors.

| Role | Locked token | QA expectation |
|------|--------------|----------------|
| Dominant surface | `--bg-surface` | primary page, carousel and form surfaces |
| Alternate surface | `--bg-surface-alt` / `--bg-surface-deep` | established section/card/media contrast only |
| Primary text | `--ink-primary` | headings and essential copy |
| Secondary text | `--ink-secondary` | supporting copy that still meets approved contrast |
| Accent | `--accent` | existing selected/focus/CTA uses only |
| Accent state | `--accent-hover` | existing hover/pressed treatment only |
| Focus | `--focus-ring` | visible keyboard focus |
| Borders | `--border-subtle` / `--border-strong` | established component separation |

Success/error/pending form states must remain distinguishable through live text and state class, not only color. Header, drawer, menu and carousel stacking must not introduce translucent combinations that make text unreadable.

---

## QA Matrix and Evidence Contract

### Environments

- Run `npm.cmd run lint`, then `npm.cmd run typecheck`, then `npm.cmd run build` sequentially. Do not run TypeScript and Next build concurrently against `.next`.
- Exercise browser QA against a local **production** server (`next start`), not only development mode. Record the exact localhost URL/port and confirm the process belongs to `local-2`.
- Do not invoke Vercel, `npm run deploy`, or any external deployment command.
- Capture reproducible evidence in Phase 6 planning/verification artifacts: commands and exit status, viewport, scenario, observed result, console/page errors, and screenshots for the principal desktop/mobile states.

### Required viewports

| Class | Viewport | Purpose |
|-------|----------|---------|
| Desktop | 1440×900 | full composition, sticky/header threshold, overlay fit, carousel peek |
| Tablet | 1000×800 | 70vw drawer and intermediate grids |
| Mobile | 390×844 | primary mobile interaction and form layout |
| Narrow/short | 320×568 | long-copy wrapping, six-link menu fit, smallest supported regression case |

At every viewport measure `document.documentElement.scrollWidth - clientWidth`; required result is `0`. Also inspect the full vertical journey rather than a single above-the-fold screenshot.

### Required runtime modes

1. Default motion.
2. `prefers-reduced-motion: reduce` at desktop and mobile: content visible, hero video paused, decorative transitions effectively removed, carousel controls still usable.
3. JavaScript disabled at 390×844: static content, project facts and contact information remain visible; client-only interaction may be unavailable but must not leave opaque intro/reveal layers hiding the page.
4. Keyboard-only pass: visible focus, logical order, overlays closable and focus restored.

---

## Combined Interaction Stress Test — QA-02

The sticky header, menu, service drawer, Technology sticky region, Embla carousel and Lenis must be tested as one system in this order:

1. Load at the top: `.site-header` has no `.is-scrolled`; page has zero horizontal overflow and no console errors.
2. Fast flick beyond 80px and return: `.is-scrolled` toggles once per threshold crossing without flicker, lag, height shift or stale state.
3. At a scrolled position, open the main menu: scroll is locked, the header retains its current state, all six destinations fit and are keyboard reachable, Escape/close/navigation releases the lock and restores interaction.
4. Open a service drawer: background outside the active capability/drawer boundary is inert, menu cannot open simultaneously, internal drawer content scrolls, Escape/backdrop/close work, focus returns to the originating service, and Lenis resumes after close.
5. Use `Cotizar este servicio`: drawer closes, scroll resumes and arrives at `#contacto` without trapping focus or losing the header state.
6. Traverse `.technology-stage`: `.tech-sticky` pins and releases cleanly; the equipment showcase appears after release, never underneath an incorrect stacking layer.
7. Focus `.embla__viewport`: ArrowRight reaches the second slide, ArrowLeft returns; previous is disabled at the first snap, next at the last; dots and buttons update `aria-selected`, disabled state and live-region copy consistently.
8. Test pointer/touch drag with `data-lenis-prevent`: horizontal intent moves the carousel while vertical page scrolling remains available; no scroll-lock conflict and no page-width expansion.
9. Repeat overlay and carousel checks under reduced motion: control-triggered carousel navigation jumps instantly, drawer/header transitions do not animate materially, while user-driven drag remains functional.

**No-autoplay gate:** wait at least ten seconds on the first carousel slide without input. The selected snap must not change. Source/runtime evidence must show no interval/timer/auto-advance listener for carousel progression.

**Overflow diagnosis rule:** if any viewport fails, identify the exact overflowing element from bounding boxes. Fix that component locally. Do not add `overflow-x:hidden/clip` to `html`, `body`, or a large ancestor as a blanket workaround; the existing single body occurrence must remain the only global suppression.

---

## Image Subject Balance — QA-03

QA-03 is a semantic/provenance gate, not a filename-count or decorative-asset quota. The final visible page must not read as a drone-only company. The audit records each rendered image/video, where it appears, its verified subject, its provenance, its accessible description, and which business axis it supports.

Required represented axes in the page's visible media set:

| Axis | Passing subject evidence | Non-passing shortcut |
|------|--------------------------|----------------------|
| Geology | real terrain/rock/field geology context or geologist fieldwork with confirmed provenance | generic drone hardware labeled “geology” |
| Engineering | GNSS/control-point survey, technical instrumentation or engineering field practice | a camera/drone pack alone |
| Mining | a real mining/geological exploration context with confirmed provenance | mountains alone or an invented project association |
| Infrastructure | road, bridge, civil works or infrastructure survey context with confirmed provenance | generic aerial equipment with no infrastructure context |
| Drone/topography | existing aerial operation/equipment imagery | sufficient by itself; this axis cannot substitute for the four above |

The existing `monumentacion_puntos_referencia.png` may support engineering/geospatial fieldwork and the existing bridge/equipment composition may support infrastructure only after visual and provenance review. Their presence does not automatically prove geology or mining. Do not relabel generic assets as a named client project, founder, mine, or field campaign.

If an axis is genuinely absent, Phase 6 planning must treat it as a QA gap and use only an authorized local asset with honest alt/caption/provenance, or leave the requirement open and report the external dependency. Do not scrape, copy or generate a supposedly real client/project photo, and do not invent outcomes. Every non-decorative image needs useful alt text; repeated/decorative media should avoid redundant announcements.

The visual balance passes when a reviewer can identify geology, engineering, mining and infrastructure subjects in the rendered page without relying on drone-only imagery or misleading labels, at both 1440×900 and 390×844.

---

## Contact Form Regression — BRAND-02

### UI and accessibility states

| State | Required behavior and copy source |
|-------|-----------------------------------|
| Idle | Name, company, email, service, project and hidden honeypot remain present; submit is `Enviar solicitud` |
| Pending | submit disabled; live region announces `Enviando solicitud…` |
| Client/API validation error | non-2xx response leaves data intact, re-enables submit and exposes the API's Spanish corrective message in `#form-status` |
| Configuration unavailable | local server without credentials returns 503 and the existing safe fallback points to `skytsperu@gmail.com`; no secret appears in UI/log evidence |
| Success | 201 resets the form, re-enables submit and announces `Solicitud recibida. Nos pondremos en contacto contigo.` |

Required non-destructive validation:

1. Send an invalid payload directly to local `/api/contact` (for example malformed JSON and a schema-invalid object). Expect 400 and the canonical Spanish error. This must never reach Supabase.
2. With Supabase credentials absent, submit one clearly synthetic browser payload. Expect the documented 503 fallback; verify pending → error → enabled state, and do not treat this expected local configuration response as a regression.
3. If credentials are present, do **not** send a live browser submission or create a persistent production row by default. Verify wiring structurally (`ContactForm` → POST `/api/contact` → `contactSchema.safeParse` → `createSupabaseAdmin` → `contact_requests.insert`) and use a request interception/mock for client pending/success/error states.
4. A real Supabase insert may be tested only against a confirmed non-production/test project and with disposable data plus documented cleanup. Never print, screenshot, commit or otherwise expose environment values or service-role keys.
5. Confirm the honeypot rejects non-empty `website`, service options still derive from canonical `services`, repeated submission is blocked while pending, `aria-live="polite"` remains present, and keyboard focus can reach every visible field/control.

**No-external-message rule:** this flow persists a contact request; it must not be expanded to send email, WhatsApp or another real external message during QA. The visible mail address remains a fallback link only.

---

## Copywriting Contract

Phase 6 adds no marketing copy. Existing client-authored brand content remains verbatim from `.planning/BRAND-CONTENT.md`.

| Element | Locked copy/behavior |
|---------|----------------------|
| Primary form action | `Enviar solicitud` |
| Pending state | `Enviando solicitud…` |
| Success state | `Solicitud recibida. Nos pondremos en contacto contigo.` |
| Invalid name | `Ingresa tu nombre.` |
| Invalid email | `Ingresa un correo electrónico válido.` |
| Short project description | `Cuéntanos un poco más sobre tu proyecto.` |
| Missing Supabase fallback | `El formulario aún no está disponible. Escríbenos a skytsperu@gmail.com.` |
| Destructive confirmation | not applicable — this interface has no destructive user action |
| Empty state | not applicable — no collection/list empty state is introduced |

Automated evidence labels and planning documentation may use technical QA language, but no such internal language is rendered on the client-facing page.

---

## Accessibility, Motion and Resilience Gates

- Exactly one page `<h1>`; section headings preserve logical hierarchy.
- All interactive controls have accessible names and visible `:focus-visible` treatment.
- Menu and drawer state uses correct `aria-expanded`, `aria-hidden`, modal semantics/inert boundary, Escape behavior and focus restoration.
- Carousel exposes its name, slide position, tab selection, disabled endpoints and polite live status without auto-advance.
- Form labels remain programmatically associated through wrapping labels; status remains `aria-live="polite"`; honeypot remains out of keyboard flow.
- Text and controls remain readable at 200% browser zoom in the desktop viewport without two-dimensional page scrolling.
- `prefers-reduced-motion` disables decorative/reveal/parallax motion and pauses the hero video while retaining controls and content.
- With JavaScript disabled, intro/reveal CSS must not hide essential content; static contact methods remain available even though POST enhancement cannot run.
- Browser console has zero errors in all core scenarios. Warnings are recorded and classified, not silently ignored.

---

## Registry Safety

| Registry | Blocks used | Safety gate |
|----------|-------------|-------------|
| shadcn official | none | not applicable |
| third-party UI registry | none | not applicable |
| new npm dependency | none expected | any proposal requires explicit scope review before install |

The existing headless Embla package is not a registry import and remains unchanged unless a verified regression requires a minimal fix.

---

## Release Evidence and Acceptance Criteria

1. `lint`, `typecheck` and production `build` all pass sequentially (`QA-01`).
2. Desktop, tablet, mobile and narrow/short browser matrices show zero horizontal overflow, zero console errors and correct combined header/menu/drawer/sticky/carousel behavior (`QA-02`).
3. Reduced-motion, keyboard-only and mobile touch paths remain usable; no-JS preserves essential readable content.
4. A provenance-backed rendered-media inventory demonstrates geology, engineering, mining, infrastructure and drone/topography subjects without misleading labels (`QA-03`).
5. `/api/contact` passes invalid-payload and no-credentials behavior locally; browser states are verified by safe interception; structural Supabase wiring is intact and no real production row/message is created (`BRAND-02`).
6. No new palette/type/spacing system, copied reference asset, fabricated claim, dependency or deployment is introduced.
7. `TEAM-01` and `BROCH-01` remain explicitly partial/blocked unless and until their real client assets are supplied and independently verified.
8. Phase verification documents any remaining gap instead of forcing approval. Only the four Phase 6 requirement checkboxes may be changed from this phase's evidence.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending independent gsd-ui-checker
