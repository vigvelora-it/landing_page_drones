---
phase: 04-header-sticky-y-carrusel-de-equipos
verified: 2026-07-20T23:12:00Z
status: human_needed
score: 3/3 must-haves verified
decision_coverage:
  honored: 0
  total: 0
  not_honored: []
---

# Phase 4: Header Sticky y Carrusel de Equipos — Verification Report

**Phase Goal:** El header reacciona visualmente al scroll sin duplicar el motor de scroll existente, y los usuarios pueden explorar el equipo técnico (drones/cámaras) en un carrusel accesible por teclado y touch; ambas piezas se prueban juntas con el drawer de la Fase 3 para descartar conflictos entre `overflow-x`, `position: sticky` y Lenis.
**Verified:** 2026-07-20T23:12:00Z
**Status:** human_needed

## Goal Achievement

### Observable Truths

Los Success Criteria de `ROADMAP.md` son el contrato de fase y, conforme al protocolo GSD, prevalecen sobre los `must_haves` más detallados de cada plan.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | El header cambia a fondo sólido/sombra al superar 80 px mediante `ScrollTrigger.create({ toggleClass })`, vuelve al estado base arriba y no añade otro listener de scroll. | ✓ VERIFIED | `use-header-scroll-state.ts:5-16` crea un único ScrollTrigger sobre `document.body`; `menu-overlay.tsx:5,14,20` lo conecta con `.site-header`; `globals.css:21` mantiene `position: fixed` y define `.is-scrolled`. Playwright confirmó clase base en y=0, `.is-scrolled` en y=700 y reversión al volver a y=0. No hay `addEventListener` en los archivos de Fase 4. |
| 2 | Header, drawer, sticky de Tecnología y carrusel funcionan juntos sin romper el bloqueo Lenis, la liberación sticky ni provocar overflow horizontal. | ✓ VERIFIED | En producción local, Playwright abrió el drawer con fondo `inert`, comprobó que el scroll del fondo permanecía bloqueado y que el header retenía `.is-scrolled`; al cerrar, el scroll se reanudó. `.tech-sticky` midió top 0 durante pin y valores negativos al liberar. `scrollWidth === innerWidth` en 1440×900 y 390×844. |
| 3 | El carrusel Embla ofrece teclado, botones, dots y drag/touch, sin autoplay, con `data-lenis-prevent`; reduced motion vuelve instantáneos solo los saltos por control. | ✓ VERIFIED | `equipment-carousel.tsx:11-15,42-60,69-130` implementa Embla `loop:false`, teclado acotado al viewport, controles, dots, live region y track protegido. Playwright verificó 2 slides, estados disabled en ambos extremos, ArrowRight, dots, drag 1→2, ausencia de avance sin interacción y salto reducido inmediato (transform 0→-254 px, estable tras 400 ms) conservando drag. |

**Score:** 3/3 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `hooks/use-header-scroll-state.ts` | Estado de header dirigido por el ticker GSAP existente | ✓ EXISTS + SUBSTANTIVE + WIRED | Hook real de 18 líneas; crea y limpia ScrollTrigger; consumido por `MenuOverlay`. |
| `components/menu-overlay.tsx` | Header con clase objetivo y hook activo | ✓ EXISTS + SUBSTANTIVE + WIRED | Importa/llama `useHeaderScrollState()` y renderiza `.site-header`. |
| `lib/site-content.ts` | Fuente tipada de 2 equipos reales del proyecto | ✓ EXISTS + SUBSTANTIVE + WIRED | Exporta `EquipmentItem` y `equipment`; consumido por el carrusel. Los dos assets locales existen y tienen contenido. |
| `lib/motion-preferences.ts` | Consulta compartida de reduced motion | ✓ EXISTS + SUBSTANTIVE + WIRED | `prefersReducedMotion()` consulta `matchMedia`; se usa en cada navegación programática de Embla. |
| `components/equipment-carousel.tsx` | Carrusel accesible e interactivo | ✓ EXISTS + SUBSTANTIVE + WIRED | 135 líneas; estado Embla, limpieza de eventos, navegación, controles, dots, live region e imágenes locales; sin stubs ni autoplay. |
| `components/sections/technology-section.tsx` | Integración después de la escena sticky | ✓ EXISTS + SUBSTANTIVE + WIRED | Importa y renderiza una vez `EquipmentCarousel` después de `.technology-stage`. |
| `app/globals.css` | Estados del header, escena acotada y layout responsive sin overflow | ✓ EXISTS + SUBSTANTIVE + WIRED | Estado `.is-scrolled`, stage 180/130vh, slides 58/72/84%, controles de 44 px, focus/disabled; un solo `overflow-x` raíz. |

**Artifacts:** 7/7 verified

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `components/menu-overlay.tsx` | `hooks/use-header-scroll-state.ts` | import + `useHeaderScrollState()` | ✓ WIRED | Líneas 5 y 14. El falso negativo de `verify.key-links` se debe a su patrón de extracción; la llamada existe en el código real. |
| `hooks/use-header-scroll-state.ts` | `.site-header` | `toggleClass.targets` | ✓ WIRED | Línea 13 apunta a `.site-header`; CSS y runtime confirman el estado. |
| `technology-section.tsx` | `equipment-carousel.tsx` | import + JSX tras `.technology-stage` | ✓ WIRED | Líneas 6 y 54. |
| `equipment-carousel.tsx` | `lib/site-content.ts` | alias import + `equipment.map` | ✓ WIRED | Líneas 7, 77 y 117. El falso negativo de `verify.key-links` no reconoce el alias `@/`; la referencia está presente. |
| `equipment-carousel.tsx` | Embla | `useEmblaCarousel` + eventos `select`/`reInit` | ✓ WIRED | Líneas 4, 11-15 y 28-40 sincronizan estado y limpian listeners. |
| Controles programáticos | reduced motion | argumento `jump` por llamada | ✓ WIRED | Líneas 44-49 pasan `prefersReducedMotion()` a prev/next/dot; el drag no se modifica. |
| Track Embla | Lenis | `data-lenis-prevent` | ✓ WIRED | Línea 76; confirmado en DOM de producción. |

**Wiring:** 7/7 connections verified

## Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| HEAD-01: estado visual de header vía ScrollTrigger, sin segundo listener | ✓ SATISFIED | — |
| HEAD-02: prueba conjunta de header, drawer, carrusel, sticky y overflow | ✓ SATISFIED | — |
| EQUIP-01: carrusel Embla con teclado/touch, Lenis prevent y sin autoplay | ✓ SATISFIED | — |

**Coverage:** 3/3 requirements satisfied

## Behavioral Verification

| Check | Result | Detail |
|-------|--------|--------|
| `npm run lint` | ✓ PASS | Repetido por el verificador, sin errores. |
| `npm run typecheck` | ✓ PASS | Repetido por el verificador, sin errores. |
| `npm run build` | ✓ PASS | Gate independiente del coordinador: Next 16.2.10, `/` estático y `/api/contact` dinámico. Se ejecutó sin un servidor concurrente sobre `.next`. |
| Producción local, desktop 1440×900 | ✓ PASS | Header reversible, drawer/Lenis, sticky release, teclado/dots/drag/reduced motion y `scrollWidth 1440/innerWidth 1440`; consola sin errores. |
| Producción local, mobile 390×844 | ✓ PASS | Slide 328 px (84vw), stage 1097 px (130vh), controles dentro de x=16..374 y `scrollWidth 390/innerWidth 390`; consola sin errores ni warnings. |
| Test suite automatizada | N/A | No existe runner de unit/E2E y está explícitamente fuera de alcance en `REQUIREMENTS.md`; la evidencia se obtuvo con gates y Playwright contra producción local. |

## Test Quality Audit

- No hay archivos de test vinculados a los requisitos de esta fase, por decisión explícita del milestone; por tanto no existen tests deshabilitados ni fixtures circulares que auditar.
- Las comprobaciones Playwright interactuaron con el sistema renderizado y midieron estado DOM, geometría, overflow, estados disabled, selección y transformaciones; no se limitaron a comprobar presencia de texto.
- La evidencia de `04-02-SUMMARY.md` fue contrastada de forma independiente con el código real y una segunda sesión de navegador.

## Anti-Patterns Found

No se encontraron `TBD`, `FIXME`, `XXX`, `TODO`, `HACK`, contenido placeholder ni implementaciones vacías en los artefactos introducidos por la Fase 4. Las coincidencias globales de `placeholder` corresponden al pseudo-elemento CSS de inputs y “todo tipo” es contenido real, no una marca TODO.

**Anti-patterns:** 0 found (0 blockers, 0 warnings)

## Decision Coverage

No existe `04-CONTEXT.md` para esta fase; el gate de cobertura de decisiones se omite limpiamente. Las decisiones aplicables están documentadas en `04-UI-SPEC.md`, `04-RESEARCH.md`, planes y summaries, y se observan en los artefactos entregados.

## Human Verification Required

### 1. Aprobación visual e interactiva de fin de fase

**Test:** En la URL local preparada por el coordinador, recorrer la página en desktop y móvil; bajar/subir para observar el header, abrir/cerrar un servicio y usar el carrusel con flechas, dots, teclado y gesto horizontal.

**Expected:** El header cambia de manera limpia, el drawer bloquea y libera el fondo, la escena Tecnología fija y libera sin saltos, el carrusel se lee y opera cómodamente, y no aparece barra horizontal.

**Why human:** `workflow.human_verify: end-of-phase` exige aceptación explícita del usuario. La verificación automatizada y técnica pasó, pero no sustituye esa aprobación.

## Gaps Summary

**No technical gaps found.** Los tres criterios y requisitos de fase están satisfechos. El único estado pendiente es el checkpoint humano obligatorio; no se requiere plan de corrección.

## Verification Metadata

**Verification approach:** Goal-backward sobre Success Criteria de `ROADMAP.md`
**Must-haves source:** Success Criteria de `ROADMAP.md` (prevalecen sobre PLAN frontmatter)
**Automated/technical checks:** 17 passed, 0 failed
**Human checks required:** 1 checkpoint de aprobación final
**GSD helper caveat:** `verify.artifacts` pasó 8/8 por plan; `verify.key-links` produjo 2 falsos negativos corregidos por inspección manual del código y runtime

---
*Verified: 2026-07-20T23:12:00Z*
*Verifier: Codex (gsd-verifier subagent)*
