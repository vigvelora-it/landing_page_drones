# Sky Tech Perú — local-2 (rediseño visual cinematográfico)

## What This Is

Segundo ambiente local (`local-2/`) de la web de Sky Tech Perú (empresa de topografía con drones), construido en Next.js. Ya tiene una primera versión funcional con dirección oscura/editorial y animaciones básicas en CSS vanilla. Este trabajo eleva esa experiencia a un nivel de pulido visual y de movimiento comparable a estudios creativos premium como Dogstudio (dogstudio.co/mx), sin copiar su diseño literal.

## Core Value

La experiencia debe sentirse tan fluida, animada y pulida como un sitio de estudio creativo de alto nivel — scroll físico suave, transiciones elaboradas, micro-interacciones cuidadas — mientras conserva la identidad de marca de Sky Tech Perú y el formulario de contacto funcional.

## Requirements

### Validated

- ✓ Estructura Next.js 16 / React 19 / TypeScript funcional — existente
- ✓ Sistema visual oscuro/grafito con acento naranja corporativo — existente
- ✓ Hero con video de dron, menú overlay, formulario conectado a `/api/contact` — existente
- ✓ Animaciones base (reveal, parallax, cursor contextual) con CSS + IntersectionObserver + rAF — existente

### Active

- [ ] Scroll suave físico en todo el sitio (Lenis)
- [ ] Timelines de animación complejos para transiciones de sección y reveals (GSAP + ScrollTrigger)
- [ ] Transiciones de sección/página con efecto tipo máscara o equivalente
- [ ] Hero evolucionado: mismo video de dron + tipografía editorial de gran escala + capas, sin WebGL/shaders
- [ ] Micro-interacciones pulidas: cursor contextual mejorado, hover states, elementos "magnéticos" donde aplique
- [ ] Formulario de contacto sigue funcionando vía `/api/contact` (Supabase) sin regresiones
- [ ] Eliminar archivos legacy v4 sin uso (`landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx`)
- [ ] Optimizar video del hero (WebM/AV1 con fallback MP4, reduce peso desde 9.37 MB)
- [ ] Optimizar imágenes PNG a WebP
- [ ] Refactorizar `FormConnector` para eliminar el acoplamiento frágil por `querySelector`
- [ ] Responsive completo (desktop/tablet/mobile) sin overflow horizontal
- [ ] `prefers-reduced-motion` respetado en toda la nueva capa de animación (GSAP + Lenis incluidos)
- [ ] `npm run lint`, `npm run typecheck` y `npm run build` pasan sin errores

### Out of Scope

- Efectos WebGL/shaders (distorsión de imágenes tipo Dogstudio real) — usuario prefiere menor riesgo técnico y evolucionar el hero actual en vez de introducir un stack gráfico nuevo
- Reescritura de copy/contenido (manifiesto, capacidades, proceso, contacto) — el esfuerzo se enfoca en visual/movimiento, no en redacción
- Despliegue a Vercel o cualquier servicio externo — `npm run deploy` permanece bloqueado deliberadamente
- Cualquier cambio a `../local/` o `../produccion/` — aislamiento estricto entre ambientes
- Tests automatizados (unit/E2E) — fuera de alcance de este milestone; codebase ya documenta esta brecha en `CONCERNS.md`

## Context

- Historial: `CONTINUIDAD.md` documenta que `local-2` ya pasó por una primera transformación completa (intro, header, hero, manifiesto, capacidades, proceso, contacto, cursor contextual, video) usando solo APIs del navegador, sin librerías de animación.
- Codebase mapeado en `.planning/codebase/` (STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, INTEGRATIONS, CONCERNS — 7 documentos, ~1720 líneas).
- Referencia de dirección de movimiento: dogstudio.co/mx — scroll narrativo, tipografía editorial expansiva, transiciones medidas y sofisticadas, paleta de alto contraste.
- Sky Tech Perú es una empresa real de topografía con drones; el sitio es su cara pública en el ambiente `produccion/`, pero este trabajo ocurre exclusivamente en `local-2/`.
- `CONCERNS.md` (mapeo de codebase) identificó deuda técnica concreta que el usuario decidió incluir en el alcance: archivos legacy v4 sin uso, video sin optimizar (9.37 MB), imágenes PNG sin comprimir, y el patrón frágil `FormConnector`.

## Constraints

- **Aislamiento**: Trabajar únicamente dentro de `local-2/` — nunca modificar `../local/` ni `../produccion/`.
- **Despliegue**: `npm run deploy` permanece bloqueado; no se despliega a Vercel ni a ningún servicio externo durante este trabajo.
- **Formulario**: Debe conservar la integración con `/api/contact` y Supabase (cuando hay credenciales locales) sin romper el flujo actual.
- **Recursos**: Solo assets locales en `public/IMAGENES_PAGINA_WEB/` y `public/video/` — sin dependencias de imágenes remotas.
- **Dependencias nuevas**: GSAP + Lenis aprobadas explícitamente por el usuario (estándar de la industria para este tipo de experiencia). No se introducen otras librerías pesadas sin aprobación.
- **Git**: El repo está anidado (`.git` vive en `F:\ClaudeCode\Pagina_Web_Mayra`, no en `local-2/`) — los commits de planning se registran contra ese repo externo.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Adoptar GSAP + Lenis para animación | Usuario aprobó explícitamente tras comparar con mantener el stack 100% vanilla; es el estándar de la industria para scroll suave y timelines complejos tipo Dogstudio | — Pending |
| Sin WebGL/shaders en el hero | Usuario prefiere menor riesgo técnico y evolucionar el video/tipografía existente en vez de introducir un stack gráfico nuevo | — Pending |
| Incluir limpieza de deuda técnica en el alcance | Usuario decidió aprovechar este trabajo para eliminar archivos legacy v4, optimizar video/imágenes y refactorizar `FormConnector`, en vez de dejarlo fuera | — Pending |
| Mantener copy/contenido actual | Usuario prefiere que el esfuerzo se concentre en visual/movimiento, no en redacción | — Pending |
| Ningún cambio de scope por sección — todo abierto a rediseño | Usuario confirmó que ninguna sección es intocable | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-18 after initialization*
