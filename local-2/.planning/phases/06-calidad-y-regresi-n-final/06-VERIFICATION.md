---
phase: 06-calidad-y-regresi-n-final
verified: 2026-07-20T21:30:00-05:00
status: gaps_found
score: 3/4 requirements verified
requirements_verified: [QA-01, QA-02, BRAND-02]
requirements_blocked: [QA-03]
verifier: independent
---

# Phase 6 — Independent Verification Report

**Goal:** verificar, desde el objetivo y contra código/runtime real, la calidad final, la regresión integrada, el balance de medios y el formulario local sin escrituras externas.

## Resultado goal-backward

| Requirement | Estado | Evidencia independiente |
|---|---|---|
| QA-01 | ✓ VERIFIED | `npm.cmd run lint` y `npm.cmd run typecheck` se repitieron independientemente contra `HEAD` y terminaron exit 0. El build final consta exit 0 en `evidence/quality-gates.md`; no se reconstruyó encima del `.next` servido. El listener único PID 36092 corresponde a `local-2` + `next start -p 4173` y responde HTTP 200. |
| QA-02 | ✓ VERIFIED | Spot-check Playwright independiente: recorridos 1440x900 y 390x844 dieron overflow 0, un h1 y cero errores de consola. La evidencia versionada cubre además 1000x800, 320x568, reduced motion, no-JS, teclado, touch, zoom efectivo y 10.5 s sin autoplay. Los gates de fuente confirman una sola supresión `overflow-x`, `loop:false`, teclado, live region y `data-lenis-prevent`. |
| BRAND-02 | ✓ VERIFIED | Código enlaza `fetch("/api/contact")` → `contactSchema.safeParse` → `createSupabaseAdmin` → `contact_requests.insert`. Con `.env*` real y ambas variables ausentes, pruebas localhost independientes devolvieron 400 para JSON malformado/schema/honeypot y 503 para payload sintético válido, antes de Supabase. La evidencia de browser mocks cubre pending, envío único, 201, 400 y 500 sin red externa. |
| QA-03 | ✗ BLOCKED | El runtime muestra medios de drone/topografía, equipo/geomática e infraestructura genérica parcial. No hay sujeto visual autorizado y documentado que pruebe geología y minería; únicamente el video tiene `public/video/CREDITS.md`, mientras los PNG/JPG carecen de provenance. No es posible completar el requisito sin insumos reales. |

**Score: 3/4 requirements verified. Status: `gaps_found`.**

## Confirmación de fixes críticos

### Menú — Escape, foco y Lenis

- Código: `menu-overlay.tsx` conserva referencias al toggle y primer enlace, mueve el foco al abrir y registra/limpia Escape solo mientras el menú está abierto.
- Runtime: abrir produjo `aria-expanded=true`, foco en `01 Nosotros` y `lenis-stopped=true`.
- Escape produjo `aria-expanded=false`, foco restaurado a `Abrir menú` y `lenis-stopped=false`.

### Drawer CTA — cierre y carrera Lenis

- Código: `service-drawer.tsx` programa el scroll después del cierre animado, permitiendo que `onClose` actualice estado y `useScrollLock` reinicie Lenis.
- Runtime: el drawer abrió modal con Lenis detenido; tras `Cotizar este servicio`, el diálogo quedó cerrado, Lenis activo y `#contacto` terminó a 2 px del borde superior después del scroll suave.

## Auditoría de evidencia y seguridad

- Los commits `6beb082`, `9b178f9` y `ecc0cce` corresponden a gates, fixes/evidencia browser y auditoría media/contacto.
- No se detectaron timers/autoplay en `equipment-carousel.tsx`.
- No se desplegó ni se accedió a Supabase. Las pruebas directas usaron exclusivamente localhost y datos sintéticos.
- El servidor local final se dejó activo en `http://127.0.0.1:4173/`.

## Gaps exactos

1. **QA-03 (Phase 6):** faltan medios autorizados con provenance que representen honestamente geología y minería, además de provenance para los PNG/JPG actuales.
2. **TEAM-01 (heredado de Phase 5):** faltan cuatro retratos reales identificados; los perfiles conservan iniciales.
3. **BROCH-01 (heredado de Phase 5):** falta el PDF final real; no se creó un enlace de descarga falso.

TEAM-01 y BROCH-01 no pertenecen al cierre verificable de Phase 6 y permanecen abiertos. El milestone no debe marcarse completo ni desplegarse con estos gaps.
