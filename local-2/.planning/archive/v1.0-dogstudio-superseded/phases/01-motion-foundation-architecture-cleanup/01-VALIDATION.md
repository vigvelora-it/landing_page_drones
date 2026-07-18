---
phase: 1
slug: motion-foundation-architecture-cleanup
status: ready_for_human_approval
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-18
validated: 2026-07-18T07:27:02Z
---

# Phase 1 — Validation Record

> Completed technical, structural, and browser evidence for the Phase 1 architecture and motion-foundation gate. Final visual acceptance remains the explicit plan-08 human checkpoint.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | No project test runner by design; production gates plus local Playwright CLI review |
| Quality commands | `npm run lint`, `npm run typecheck`, `npm run build` |
| Browser target | Local production server at `http://127.0.0.1:4173` |
| Viewports | Desktop 1440×900; mobile 390×844 |
| Remote writes | None; `/api/contact` intercepted and fulfilled locally |

## Automated Quality Gate

Executed sequentially on the final tree, including the favicon correction:

| Command | Result | Evidence |
|---------|--------|----------|
| `npm run lint` | ✅ green | ESLint exited 0 with zero findings |
| `npm run typecheck` | ✅ green | `tsc --noEmit` exited 0 |
| `npm run build` | ✅ green | Next.js 16.2.10 compiled, type-checked, generated 7/7 static pages, and emitted `/`, `/api/contact`, `/icon.svg`, `/robots.txt`, `/sitemap.xml` |

## Requirement Verification Map

| Task ID | Plan | Requirement | Test Type | Evidence | Status |
|---------|------|-------------|-----------|----------|--------|
| 01-02-03 + 01-06-01/02 + 01-07-02 | 02, 06, 07 | FOUND-01 | structural + browser | One provider mount; only `hooks/use-legacy-parallax.ts` contains `requestAnimationFrame`; ReactLenis options show `autoRaf:false`; fast wheel scroll reached the target without console/page errors or observable double-scroll | ✅ green |
| 01-02-02/03 + 01-07-02 | 02, 07 | FOUND-02 | structural + browser media emulation | Normal ReactLenis fiber props: `lerp:0.07`; reduced-motion props: `lerp:0.15`; smoothing remains active, video pauses, and all 35 reveals remain visible | ✅ green |
| 01-02-02/03 + 01-06-01 + 01-07-01/02 | 02, 06, 07 | FOUND-03 | build + runtime | Production build exits 0; layout stays server-side; browser console 0 errors/0 warnings and pageerror count 0 | ✅ green |
| 01-01-01 + 01-05-03 + 01-07-01/02 | 01, 05, 07 | ARCH-01 | structural + mocked browser POST | `ContactForm` owns `onSubmit`; all six payload keys plus empty honeypot captured; success state rendered; no remote request escaped interception | ✅ green |
| 01-03/04/05 + 01-06-02 + 01-07-01/02 | 03–07 | ARCH-02 | structural + visual/runtime | `Experience` absent; six section files and six scoped `useGSAP` lifecycles; no GSAP-native reveal migration; original section order and all 35 reveals verified at both viewports | ✅ green |
| 01-01-02 + 01-07-01 | 01, 07 | ARCH-03 | filesystem + build | Zero legacy files under `local-2`; all three preserved under `../referencias`; no active source references; production build green | ✅ green |

## Structural Evidence

- Forbidden references (`FormConnector`, `form-event-bridge`, `components/experience`, `<Experience`): **0**.
- Contact contract: direct `onSubmit={handleSubmit}`, `/api/contact` fetch, fields `name`, `company`, `email`, `service`, `message`, and honeypot `website`: **all present**.
- Root `<SmoothScrollProvider>` mounts: **1**.
- Application `requestAnimationFrame` references: **1**, only in `hooks/use-legacy-parallax.ts`.
- Section components: **6**; section files containing scoped `useGSAP`: **6**.
- Premature `gsap.from`, `gsap.to`, or `ScrollTrigger.create` calls in sections: **0**.
- Exact packages: `@gsap/react@2.1.2`, `gsap@3.15.0`, `lenis@1.3.25`.
- Legacy files: active tree **0**, archive **3**.

## Browser Regression Evidence

| Check | Desktop 1440×900 | Mobile 390×844 | Status |
|-------|------------------|----------------|--------|
| Horizontal overflow | `scrollWidth=1440`, `clientWidth=1440` | `scrollWidth=390`, `clientWidth=390` | ✅ |
| Section order | inicio → nosotros → capacidades → tecnologia → proceso → contacto | same | ✅ |
| Reveal completion | 35/35 visible | 35/35 visible | ✅ |
| Menu | opens with `aria-expanded=true`, closes after anchor, body lock removed | opens/closes; contact anchor resolves | ✅ |
| Hero video | plays; toggle pauses and resumes with correct label | plays; control remains inside viewport | ✅ |
| Footer / badge | footer present; `LOCAL · 2` present | footer present; `LOCAL · 2` present | ✅ |
| Console / page errors | 0 / 0 on fresh production session | 0 / 0 during combined run | ✅ |

Visual artifacts:

- `../.playwright-cli/phase1-desktop-1440x900-final.png`
- `../.playwright-cli/phase1-mobile-390x844-final.png`
- `../.playwright-cli/phase1-desktop-full.png`
- `../.playwright-cli/phase1-mobile-full.png`

The initial screenshots captured the intentionally still-visible intro transition at 1.7s. Final viewport screenshots were repeated after 3s and confirm the completed hero state (`visibility:hidden` on the intro).

## Reduced Motion Evidence

- Browser media emulation reports `prefers-reduced-motion: reduce = true`.
- ReactLenis runtime props change from `{ lerp: 0.07, autoRaf: false, anchors: true }` to `{ lerp: 0.15, autoRaf: false, anchors: true }`.
- The hero video is paused and its button label changes to `Reproducir video de fondo`.
- Smooth scrolling remains instantiated rather than being disabled.
- All 35 reveal elements remain visible while reduced motion is active.

## Contact Form Evidence

The browser intercepted `**/api/contact` before submission. Captured payload:

```json
{
  "name": "Prueba local",
  "company": "Sky Tech QA",
  "email": "qa@local.test",
  "service": "Topografía con drones",
  "message": "Validación local sin escritura remota",
  "website": ""
}
```

The form rendered `Solicitud recibida. Nos pondremos en contacto contigo.` with class `form-status is-success`. The intercepted route prevented any Supabase or other remote write.

## Validation Sign-Off

- [x] All automated quality commands green
- [x] All structural acceptance checks green
- [x] Both target viewports reviewed with no overflow
- [x] Runtime console/page error count zero
- [x] Menu, anchors, video, reveals, reduced motion, and mocked contact submission green
- [x] Evidence artifacts retained locally
- [ ] User visual approval — plan 01-08 checkpoint

**Technical status:** green. **Phase status:** awaiting explicit human approval.
