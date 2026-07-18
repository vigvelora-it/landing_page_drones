# Requirements: Sky Tech Perú — local-2 (rediseño visual cinematográfico)

**Defined:** 2026-07-18
**Core Value:** La experiencia debe sentirse tan fluida, animada y pulida como un sitio de estudio creativo de alto nivel — scroll físico suave, transiciones elaboradas, micro-interacciones cuidadas — mientras conserva la identidad de marca de Sky Tech Perú y el formulario de contacto funcional.

## v1 Requirements

### Foundation (motor de movimiento)

- [ ] **FOUND-01**: El sitio usa scroll físico suave (Lenis) sincronizado en un único loop de `requestAnimationFrame` con el ticker de GSAP — sin desincronización ni jitter
- [ ] **FOUND-02**: `prefers-reduced-motion` desactiva/suaviza el motor de movimiento completo (Lenis + todas las animaciones GSAP), no solo CSS, mediante `gsap.matchMedia()`
- [ ] **FOUND-03**: `npm run build` pasa limpio con GSAP/Lenis inicializados solo en el límite de cliente (sin errores de hidratación/SSR)

### Arquitectura (deuda estructural)

- [ ] **ARCH-01**: El formulario de contacto tiene su markup y su manejador `onSubmit` en el mismo componente (sin `FormConnector` ni acoplamiento por `querySelector`)
- [ ] **ARCH-02**: `components/experience.tsx` (monolito actual) se descompone en componentes por sección, cada uno con su propio scope de animación (`useGSAP`)
- [ ] **ARCH-03**: Se eliminan `landing-page-v4.html`, `lib/v4-template.ts` y `components/v4-interactions.tsx` (archivos legacy sin uso)

### Movimiento principal

- [ ] **MOTION-01**: Sistema de revelado por scroll (actualmente `[data-reveal]` + IntersectionObserver) migrado a ScrollTrigger, con el mismo lenguaje visual pero más pulido
- [ ] **MOTION-02**: Parallax existente migrado a ScrollTrigger/Lenis; el loop `requestAnimationFrame` manual actual se elimina (no queda en paralelo)
- [ ] **MOTION-03**: Cursor contextual migrado a `gsap.quickTo` (solo en dispositivos con puntero preciso, como hoy)
- [ ] **MOTION-04**: Menú overlay abre/cierra como timeline de GSAP (fondo → enlaces en cascada)
- [ ] **MOTION-05**: Titulares del hero y de cada sección usan revelado tipográfico por palabra/línea (SplitText)

### Momentos distintivos

- [ ] **SIGNATURE-01**: Una transición tipo máscara/bloque entre el hero y la primera sección (el momento de mayor impacto visual del sitio)
- [ ] **SIGNATURE-02**: Secuencia de intro breve refinada, con `ScrollTrigger.refresh()` al completarse

### Pulido / diferenciadores

- [ ] **POLISH-01**: Botones/CTA principales (máx. 2-4) con efecto magnético en hover
- [ ] **POLISH-02**: Imágenes clave con revelado en scroll vía técnica de wrapper+transform (no animar `clip-path` directamente)
- [ ] **POLISH-03**: Banda de capacidades con efecto marquee/ticker continuo (CSS puro)
- [ ] **POLISH-04**: Sección de proceso con timeline scrubbed por scroll

### Rendimiento y accesibilidad

- [ ] **PERF-01**: Video del hero optimizado (WebM/AV1 con fallback MP4), reduciendo el peso desde 9.37 MB
- [ ] **PERF-02**: Imágenes PNG (`dron.png`, `equipos1.png`, `monumentacion_puntos_referencia.png`) convertidas a WebP
- [ ] **PERF-03**: Verificación de rendimiento móvil (CPU throttling) sin caída perceptible de FPS en las secciones animadas
- [ ] **PERF-04**: Auditoría de `prefers-reduced-motion` en todo el sitio (emulación DevTools) confirmando que ninguna animación se ejecuta con la preferencia activa

### Calidad

- [ ] **QA-01**: `npm run lint`, `npm run typecheck` y `npm run build` pasan sin errores tras todos los cambios
- [ ] **QA-02**: Revisión visual manual en desktop (1440×900) y móvil (390×844) sin overflow horizontal
- [ ] **QA-03**: Formulario de contacto sigue enviando correctamente a `/api/contact` sin regresiones

## v2 Requirements

Deferido a una futura iteración. No se planifica en este roadmap.

### Movimiento avanzado

- **MOTION-V2-01**: Efectos reactivos a la velocidad de scroll (skew/stretch)
- **MOTION-V2-02**: Transiciones adicionales tipo máscara más allá del momento hero→sección

## Out of Scope

Explícitamente excluido. Documentado para prevenir scope creep.

| Feature | Reason |
|---------|--------|
| Efectos WebGL/shaders | Usuario prefiere menor riesgo técnico; evolucionar el hero existente en vez de introducir un stack gráfico nuevo |
| Reescritura de copy/contenido | El esfuerzo se concentra en visual/movimiento, no en redacción |
| Despliegue a Vercel/producción | `npm run deploy` permanece bloqueado deliberadamente; ningún cambio sale de `local-2/` |
| Tests automatizados (unit/E2E) | Codebase ya documenta esta brecha en `CONCERNS.md`; fuera de alcance de este milestone |
| Sonido/audio design | No mencionado por el usuario; fuera del lenguaje de marca actual |
| Gestor de transiciones de ruta completo | Sitio de una sola página estática, sin rutas entre las que transicionar |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 - Motion Foundation & Architecture Cleanup | Pending |
| FOUND-02 | Phase 1 - Motion Foundation & Architecture Cleanup | Pending |
| FOUND-03 | Phase 1 - Motion Foundation & Architecture Cleanup | Pending |
| ARCH-01 | Phase 1 - Motion Foundation & Architecture Cleanup | Pending |
| ARCH-02 | Phase 1 - Motion Foundation & Architecture Cleanup | Pending |
| ARCH-03 | Phase 1 - Motion Foundation & Architecture Cleanup | Pending |
| MOTION-01 | Phase 2 - GSAP-Native Reveal, Parallax, Cursor & Typography | Pending |
| MOTION-02 | Phase 2 - GSAP-Native Reveal, Parallax, Cursor & Typography | Pending |
| MOTION-03 | Phase 2 - GSAP-Native Reveal, Parallax, Cursor & Typography | Pending |
| MOTION-04 | Phase 2 - GSAP-Native Reveal, Parallax, Cursor & Typography | Pending |
| MOTION-05 | Phase 2 - GSAP-Native Reveal, Parallax, Cursor & Typography | Pending |
| SIGNATURE-01 | Phase 3 - Signature Moments — Mask Transition & Intro | Pending |
| SIGNATURE-02 | Phase 3 - Signature Moments — Mask Transition & Intro | Pending |
| POLISH-01 | Phase 4 - Differentiators & Polish | Pending |
| POLISH-02 | Phase 4 - Differentiators & Polish | Pending |
| POLISH-03 | Phase 4 - Differentiators & Polish | Pending |
| POLISH-04 | Phase 4 - Differentiators & Polish | Pending |
| PERF-01 | Phase 5 - Performance & Quality Gate | Pending |
| PERF-02 | Phase 5 - Performance & Quality Gate | Pending |
| PERF-03 | Phase 5 - Performance & Quality Gate | Pending |
| PERF-04 | Phase 5 - Performance & Quality Gate | Pending |
| QA-01 | Phase 5 - Performance & Quality Gate | Pending |
| QA-02 | Phase 5 - Performance & Quality Gate | Pending |
| QA-03 | Phase 5 - Performance & Quality Gate | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-18*
*Last updated: 2026-07-18 after roadmap creation (5 phases, full coverage)*
