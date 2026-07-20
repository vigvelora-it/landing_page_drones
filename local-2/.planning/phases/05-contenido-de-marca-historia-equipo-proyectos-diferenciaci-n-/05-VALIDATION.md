---
phase: 5
slug: contenido-de-marca-historia-equipo-proyectos-diferenciacion-y-brochure
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-20
---

# Phase 5 — Validation Strategy

> Contrato de muestreo y verificación para contenido editorial canónico, assets faltantes y regresión visual/interactiva.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Ninguno — tests unit/E2E están fuera de alcance en `REQUIREMENTS.md`; Playwright CLI/manual + gates de source/build son el patrón aprobado |
| **Config file** | none |
| **Quick run command** | `npm.cmd run lint; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm.cmd run typecheck` |
| **Full suite command** | `npm.cmd run build` seguido de producción local con `npm.cmd run start` |
| **Estimated runtime** | ~90 segundos para gates; browser QA aparte |

---

## Sampling Rate

- **Después de cada task commit:** ejecutar al menos typecheck; lint+typecheck cuando exista JSX/CSS.
- **Después de cada plan:** ejecutar `npm.cmd run build` sin otro proceso Next escribiendo en `.next`.
- **Antes de verificar la fase:** servir el build local y completar matriz Playwright/manual 1440x900, 1000x800, 390x844 y 320x568.
- **Max feedback latency:** ~90 segundos para feedback automatizado.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | BRAND-01 | T-05-01 | Copy en fuente única, exacto y escapado por React | source + typecheck | `npm.cmd run typecheck; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; rg -n "brandStory|corporateValues" lib/site-content.ts` | N/A — source gate | ⬜ pending |
| 05-01-02 | 01 | 1 | BRAND-01, TEAM-01 | T-05-01, T-05-02 | 6 valores, 4 profiles, rama Image solo para photo real | lint + typecheck + source | `npm.cmd run lint; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm.cmd run typecheck; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; rg -n "member.photo|team.map|corporateValues.map" components/sections/brand-section.tsx` | N/A — source gate | ⬜ pending |
| 05-01-03 | 01 | 1 | BRAND-01, TEAM-01 | T-05-01 | Claims inventados ausentes; fallback no-JS presente | build + source + browser | `npm.cmd run build` + greps del plan | N/A — browser manual | ⬜ pending |
| 05-02-01 | 02 | 2 | PROJ-01, DIFF-01, BROCH-01 | T-05-04/05/06 | Facts exactos, cero competidores y cero control de descarga falso | lint + typecheck + source | `npm.cmd run lint; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm.cmd run typecheck` + greps del plan | N/A — source gate | ⬜ pending |
| 05-02-02 | 02 | 2 | PROJ-01, DIFF-01 | T-05-04 | Sección dentro de InertBoundary y layout 7/5→stack | typecheck + source | `npm.cmd run typecheck; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; rg -n "ProjectsSection" app/page.tsx` | N/A — source gate | ⬜ pending |
| 05-02-03 | 02 | 2 | PROJ-01, DIFF-01, BROCH-01 | T-05-05/06 | Menú 6 destinos, no overflow/regresión, brochure omitido | full build + browser | `npm.cmd run lint; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm.cmd run typecheck; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm.cmd run build` | N/A — browser manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*None — la infraestructura instalada cubre lint/typecheck/build y Playwright CLI/manual. No se añade test runner porque tests automatizados están explícitamente fuera de alcance.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Copy e integridad visual de Nosotros | BRAND-01 | Wrapping, jerarquía y coincidencia visual de párrafos largos requieren DOM/browser | Comparar Historia, ¿Quiénes somos?, Misión, Visión y 6 valores contra `BRAND-CONTENT.md`; confirmar texto completo, sin clamp/ellipsis en 4 viewports. |
| Equipo con assets faltantes | TEAM-01 | La identidad/fotografía no puede inferirse automatizadamente | Confirmar 4 cards/nombres/cargos/bios y 4 placeholders neutrales `aria-hidden`; cero img en team. Registrar TEAM-01 parcial por retratos faltantes. |
| Projects + evidence | PROJ-01, DIFF-01 | Prominencia 7/5 y peso visual necesitan inspección | Confirmar GESAC featured, Lezard/Las Dunas iguales, 3 facts por proyecto, 4 evidencias y copy exacto; cero competidores en body/accessible DOM. |
| Brochure omitido | BROCH-01 | Debe confirmarse que no existe affordance engañosa | Sin PDF: confirmar cero `[download]`, anchor/button/title interactivo o ruta rota en DOM; mantener BROCH-01 bloqueado. |
| Matriz responsive y menú | BRAND-01, PROJ-01, DIFF-01 | Fit real y anchors no se validan con TypeScript | En 1440x900, 1000x800, 390x844, 320x568: `scrollWidth===clientWidth`; 6 enlaces visibles/tabulables, aterrizan en anchors únicos, menu-meta no colisiona. |
| Regresión de interacciones | Fases 3–4 / soporte Phase 5 | Longitud/DOM nuevos pueden afectar sticky/Lenis/overlay | Smoke test header toggle, drawer open/close e inert, Technology sticky, carousel keyboard/buttons/dots/drag; repetir reduced-motion. |
| No-JS y reduced motion | BRAND-01 | Estado inicial reveal es opacity 0 sin fallback | Desactivar JavaScript y verificar copy visible; emular reduce y confirmar contenidos visibles/controles usables sin traslación. |

---

## Blocked Dependency Verification

| Requirement | Missing input | Current required disposition | Closure gate when supplied |
|-------------|---------------|------------------------------|----------------------------|
| TEAM-01 | 4 retratos reales identificados | 4 placeholders honestos; checkbox unchecked | Mapear foto↔persona confirmada, `next/image`, alt correcto, QA en 4 viewports |
| BROCH-01 | PDF final real | Omitir control del DOM; checkbox unchecked | `npm build/start`, HTTP 200, `application/pdf`, magic bytes `%PDF-`, click download |

---

## Validation Sign-Off

- [x] Todas las tasks tienen `<automated>` y las verificaciones visuales usan `<human-check>` al final de fase.
- [x] Muestreo continuo: ninguna task queda sin lint/typecheck/build/source gate.
- [x] Wave 0 no requiere infraestructura nueva.
- [x] No hay flags watch.
- [x] Feedback automatizado < 90s esperado.
- [x] `nyquist_compliant: true` en frontmatter.
- [x] TEAM-01/BROCH-01 tienen disposición bloqueada explícita y no pueden aprobarse falsamente.

**Approval:** approved 2026-07-20 — estrategia basada en lint/typecheck/build, gates de source y browser QA real, consistente con la decisión del proyecto de no añadir un framework de tests.
