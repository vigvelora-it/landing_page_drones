---
phase: 06-calidad-y-regresi-n-final
verified: 2026-07-20T21:10:00-05:00
status: gaps_found
score: 3/4 requirements verified
requirements_verified: [QA-01, QA-02, BRAND-02]
requirements_blocked: [QA-03]
---

# Phase 6 — Verification Report

**Goal:** probar el milestone integrado contra producción local, reparar solo regresiones reproducidas y verificar el formulario sin escrituras externas.

## Goal achievement

| Requirement | Status | Evidence |
|---|---|---|
| QA-01 | ✓ VERIFIED | `evidence/quality-gates.md`: lint, typecheck y build exit 0 en orden; repetidos tras cada fix. Listener final único, local-2/next start, HTTP 200. |
| QA-02 | ✓ VERIFIED | `evidence/browser-matrix.md`: 1440x900, 1000x800, 390x844 y 320x568 con overflow 0, h1=1 y console errors 0; sistema header/menu/drawer/sticky/carrusel, touch, reduced, no-JS, keyboard y zoom efectivo aprobado. |
| BRAND-02 | ✓ VERIFIED | `evidence/contact-regression.md`: API 400/503 canónica y wiring Supabase intacto; mocks 201/400/500 prueban pending/success/error y doble envío sin salir de localhost. |
| QA-03 | ✗ BLOCKED | `evidence/media-inventory.md`: geología/minería no tienen sujetos autorizados con provenance; solo el video tiene créditos. No se fabricó evidencia. |

**Score: 3/4 requirements verified.**

## Regression repairs

1. `menu-overlay.tsx`: Escape ahora cierra, foco entra al primer destino y vuelve al toggle.
2. `service-drawer.tsx`: la CTA espera a que `onClose` reactive Lenis antes de desplazarse a Contacto.

Ambas fallas fueron reproducidas en el build servido, corregidas localmente y revalidadas con gates completos. No hubo dependencia, rediseño, copy, asset o overflow blanket nuevo.

## Contact safety

- `.env*` real, URL Supabase y service-role key: ausentes.
- El payload válido directo terminó en 503 antes de una llamada externa.
- Los estados 201/error del browser fueron interceptados antes de red.
- Cero insert, email, WhatsApp, deployment o acceso a servicio externo.

## Remaining gaps

- **QA-03:** requiere medios reales autorizados de geología/minería y provenance de PNG/JPG.
- **TEAM-01 heredado:** cuatro perfiles tienen iniciales; faltan cuatro retratos reales identificados.
- **BROCH-01 heredado:** falta el PDF final real; no existe un control de descarga falso.

## Decision

QA-01, QA-02 y BRAND-02 están completos. Phase 6 y el milestone permanecen con gaps porque QA-03 está bloqueado; TEAM-01 y BROCH-01 tampoco se alteran. El servidor local queda ejecutando el build final verificado en `http://127.0.0.1:4173/`. No hubo deployment.
