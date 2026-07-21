---
phase: 6
slug: calidad-y-regresion-final
status: gaps_found
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-20
---

# Phase 6 — Validation Strategy

> Contrato Nyquist para QA de release local. No agrega un framework de tests: el proyecto mantiene explícitamente unit/E2E automatizados fuera de alcance y usa gates CLI, Playwright CLI y evidencia reproducible.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Ninguno nuevo; ESLint + TypeScript + Next build + Playwright CLI global + requests localhost |
| **Config file** | none |
| **Quick run command** | `npm.cmd run lint`; luego `npm.cmd run typecheck` |
| **Full suite command** | `npm.cmd run lint`; `npm.cmd run typecheck`; `npm.cmd run build`; producción local + matriz browser/API |
| **Production URL** | `http://127.0.0.1:4173`, después de verificar PID y command line de `local-2` |
| **Estimated feedback latency** | 2–8 minutos según matriz/fixes; ninguna espera individual supera 60 segundos |

---

## Sampling Rate

- **Preflight:** detener únicamente el `next start` verificado; ejecutar lint → typecheck → build, nunca concurrentes.
- **Después de un fix:** rerun desde lint, reconstruir/reiniciar y repetir el escenario fallido antes del smoke completo.
- **Browser:** cuatro viewports en default; desktop+mobile reduced; móvil no-JS; keyboard/touch/zoom según contrato.
- **Formulario:** API directa solo en rutas que no alcanzan persistencia; estados 201/error por interception same-origin.
- **Phase gate:** evidencia agregada y `06-VERIFICATION.md`; la aprobación humana ocurre al final de fase, no reemplaza los checks automáticos.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command / Harness | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-----------------------------|-------------|--------|
| 06-01-01 | 06-01 | 1 | QA-01 | T-06-01/02/03 | Solo PID local verificado; gates secuenciales; evidencia sin secretos | CLI + process/HTTP | `npm.cmd run lint`; `npm.cmd run typecheck`; `npm.cmd run build`; listener/HTTP check | evidence creado durante ejecución | ⬜ pending |
| 06-01-02 | 06-01 | 1 | QA-02 | T-06-06 | Cero overflow/console; interacciones coordinadas; fixes mínimos | Playwright CLI + grep/build | matriz 1440/1000/390/320 + reduced/no-JS/keyboard/touch/zoom + source gates | evidence creado durante ejecución | ⬜ pending |
| 06-01-03A | 06-01 | 1 | BRAND-02 | T-06-03/04 | API 400/503 y browser mocks sin insert/mensaje externo | localhost API + Playwright route interception + grep | malformed/schema/honeypot/503 safe gate; mocks 201/400/500; wiring source | evidence creado durante ejecución | ⬜ pending |
| 06-01-03B | 06-01 | 1 | QA-03 | T-06-05 | No falsear sujeto/provenance ni fabricar assets | DOM + visual + inventory | inventario de cada medio renderizado y cruce con créditos locales | evidence creado durante ejecución | ⚠️ blocked — faltan geología/minería autorizadas y provenance PNG/JPG |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ blocked/flaky*

---

## Wave 0 Requirements

No hay scaffold que crear. El milestone excluye tests unitarios/E2E persistentes y `playwright-cli.cmd` ya está disponible. Los artefactos `evidence/*.md` son salidas de ejecución, no infraestructura de test. `wave_0_complete: true` es correcto.

---

## Automated Gates

### QA-01 final

PowerShell 5.1, secuencial y sin `&&`:

1. `npm.cmd run lint`; abortar si `$LASTEXITCODE -ne 0`.
2. `npm.cmd run typecheck`; abortar si `$LASTEXITCODE -ne 0`.
3. `npm.cmd run build`; abortar si `$LASTEXITCODE -ne 0`.
4. Iniciar `next start`, verificar listener/PID/command line y HTTP 200.

### QA-02 source/runtime

- `rg -n "overflow-x" app/globals.css` produce exactamente una ocurrencia global preexistente.
- Carousel: `data-lenis-prevent`, `loop: false`, `onKeyDown`, live region; cero timer/autoplay.
- Runtime por viewport: `document.documentElement.scrollWidth - clientWidth === 0`, un solo h1 y cero `pageerror`/`console.error`.
- No-autoplay: snap inicial no cambia en ≥10 segundos.

### BRAND-02 safe API/runtime

- Malformed JSON, schema-invalid y honeypot responden 400 antes de Supabase.
- Payload válido directo solo con ambas credenciales confirmadas ausentes; responde 503 antes de cualquier request externa.
- Interception local verifica pending, un solo request, 201/reset/success y 400/500/error/preservación.
- Source wiring: `fetch("/api/contact")` → `safeParse` → `createSupabaseAdmin` → `contact_requests.insert`.

### QA-03 inventory

- Enumerar todo `img`/video renderizado, alt/decorativo, sujeto observado, ruta, provenance y eje.
- El video cruza con `public/video/CREDITS.md`; los PNG/JPG sin registro se marcan como provenance ausente.
- Geología/minería no se infieren. El estado permanece blocked hasta recibir medios autorizados y documentados.

---

## Manual / Visual Verifications

| Behavior | Requirement | Why visual/manual evidence remains necessary | Instructions |
|----------|-------------|----------------------------------------------|--------------|
| Composición completa en cuatro viewports | QA-02 | Bounding boxes no prueban jerarquía, stacking ni legibilidad | Recorrido vertical + screenshots 1440×900, 1000×800, 390×844 y 320×568; inspeccionar menú, drawer, sticky, carousel y formulario. |
| Coordinación header/menu/drawer/Lenis | QA-02 | Requiere secuencia real de foco, scroll lock y restauración | Ejecutar los pasos 1–6 del stress test en orden, incluida CTA a `#contacto`. |
| Carousel touch y reduced motion | QA-02 | La física/gesto no queda demostrada solo con source grep | Touch/pointer drag horizontal, gesto vertical de página, controles instantáneos bajo reduce y drag funcional. |
| Balance/provenance visual | QA-03 | El sujeto no se determina honestamente por filename/alt | Inspeccionar cada imagen/video y registrar solo el sujeto realmente visible y provenance disponible. |
| Evidencia final | QA-01/02/03, BRAND-02 | La fase debe separar pass de gaps externos | Revisar `06-VERIFICATION.md`: 3 requisitos ejecutables pueden pasar; QA-03, TEAM-01 y BROCH-01 no se fuerzan. |

---

## Feedback and Repair Policy

- Primero reproducir y capturar el fallo.
- Localizar el elemento/componente responsable; reparar width/focus/state allí.
- Prohibido añadir blanket overflow, nueva paleta, copy, sección, dependencia, animación o asset no autorizado.
- Tras cualquier cambio: detener solo el listener verificado, rerun lint/typecheck/build, reiniciar y repetir escenario + smoke.
- Máximo 2–3 iteraciones por hallazgo; si persiste, documentar gap real en vez de aprobar por fuerza.

---

## Validation Sign-Off

- [x] Cada task tiene un `<automated>` gate y evidencia estable.
- [x] Lint/typecheck/build están serializados y se repiten después del último fix.
- [x] La matriz contiene cuatro viewports, reduced motion, no-JS, teclado, touch, zoom y no-autoplay.
- [x] API/formulario se valida sin persistencia ni mensajes externos.
- [x] Inventario de medios trata QA-03 como gap, no como cuota de filenames.
- [x] TEAM-01/BROCH-01 permanecen fuera de los requisitos ejecutables de esta fase.
- [x] No hay watch mode, worktree, deploy ni dependencia nueva.
- [x] `nyquist_compliant: true` y `wave_0_complete: true` son consistentes.

**Planning approval:** strategy ready for independent gsd-plan-checker; runtime statuses remain pending until `06-01` executes.

## Final execution — 2026-07-20

| Gate | Final status | Evidence |
|---|---|---|
| 06-01-01 / QA-01 | ✅ green | `evidence/quality-gates.md`: tres secuencias post-fix limpias; build final servido por PID verificado. |
| 06-01-02 / QA-02 | ✅ green | `evidence/browser-matrix.md`: cuatro viewports, stress, reduced motion, no-JS, keyboard, touch y zoom efectivo. |
| 06-01-03A / BRAND-02 | ✅ green | `evidence/contact-regression.md`: 400/503 locales y mocks 201/400/500 sin escritura externa. |
| 06-01-03B / QA-03 | ⚠️ blocked | `evidence/media-inventory.md`: faltan sujetos/provenance autorizados de geología y minería. |

TEAM-01 permanece parcial y BROCH-01 bloqueado como gaps heredados. El resultado no autoriza cierre de milestone ni deployment.
