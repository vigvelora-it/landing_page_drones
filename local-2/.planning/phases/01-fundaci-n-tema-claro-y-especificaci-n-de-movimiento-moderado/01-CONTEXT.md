# Phase 1: Fundación — Tema Claro y Especificación de Movimiento Moderado - Context

**Gathered:** 2026-07-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase reemplaza por completo el sistema de tokens de color oscuro y la intensidad de animación "cinematográfica" del milestone anterior por un sistema claro (paleta celeste/gris-blanco) y una especificación literal de "animación moderada", aplicados a todo el sitio existente. No introduce nuevos componentes ni cambia la estructura de secciones — es un reemplazo de tokens/valores CSS y de constantes de movimiento (Lenis lerp, distancias, duraciones, easing) sobre la arquitectura ya construida.

</domain>

<decisions>
## Implementation Decisions

### Imágenes/video existentes bajo el tema claro
- **D-01 (decisión de Claude, sin objeción del usuario):** Se acepta un estado visual transitorio para las fotos/video existentes (hero, tecnología) una vez eliminados los filtros de oscurecimiento (`saturate`/`contrast`/`brightness`) — sin filtro puente. Esto es literalmente lo que exige THEME-03 ("no quedan literales... ajustados al tema oscuro") y lo que el UI-SPEC ya especificó explícitamente ("use none unless a later phase's UI-SPEC specifies otherwise"). La Fase 5 reemplaza el contenido/fotografía real; hasta entonces las imágenes actuales se ven "crudas" sin tratamiento, lo cual es aceptable como estado intermedio.

### PALETA-DE-MARCA.md
- **D-02 (decisión de Claude, sin objeción del usuario):** No se actualiza `PALETA-DE-MARCA.md` como parte de esta fase — ningún requisito THEME-01–04 lo menciona, y es un documento de referencia de marca (extraído del brochure), no código. Queda como tarea de documentación separada, fuera del alcance de ejecución de esta fase.

### Claude's Discretion
- Orden exacto de migración dentro de `app/globals.css` (por bloque de variables, por selector, etc.)
- Tratamiento de `.hero-orbit`/`.moving-band` (anillos giratorios, marquee) — el UI-SPEC ya los marcó como "flagged, not removed" en esta fase; pertenecen a la fase que reescriba el contenido de esa sección (Phase 3+)
- Nombres exactos de las nuevas variables CSS de movimiento (ya especificados en el UI-SPEC: `--motion-distance-max`, `--motion-duration-base`, etc.) — se implementan tal cual el contrato

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Contrato de diseño (fuente de verdad para esta fase)
- `.planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-UI-SPEC.md` — paleta exacta, contraste WCAG verificado, especificación literal de movimiento, checklist de retiro de literales oscuros, 2 rondas de confirmación del usuario ya incorporadas (acento celeste, footer claro, 2 pesos tipográficos)

### Proyecto y requisitos
- `.planning/PROJECT.md` — brief completo de marca, incidente de despliegue documentado
- `.planning/REQUIREMENTS.md` — THEME-01, THEME-02, THEME-03, THEME-04 (requisitos de esta fase)
- `.planning/ROADMAP.md` — criterios de éxito de la Fase 1

### Research de milestone
- `.planning/research/SUMMARY.md`, `.planning/research/PITFALLS.md` — pitfalls 1-3 (literales oscuros sobrevivientes, regresión de contraste, migración de animación a medias)

### Código existente
- `app/globals.css` — sistema de tokens actual a reemplazar
- `.planning/codebase/CONVENTIONS.md` — convenciones CSS/BEM existentes a preservar

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Arquitectura Lenis+GSAP (`components/providers/`) — solo se retunan valores (`lerp`), no se reescribe

### Established Patterns
- Sistema de variables CSS custom properties + BEM-ish, documentado en `.planning/codebase/CONVENTIONS.md` — se extiende con nuevos tokens, no se reemplaza por Tailwind

### Integration Points
- `app/globals.css` es el único archivo que necesita reescritura de valores en esta fase — ningún componente `.tsx` cambia su lógica, solo las clases/variables que consumen

</code_context>

<specifics>
## Specific Ideas

Ninguna referencia adicional — el UI-SPEC ya contiene todos los valores exactos (hex, contraste, timing) necesarios.

</specifics>

<deferred>
## Deferred Ideas

- Actualizar `PALETA-DE-MARCA.md` → tarea de documentación separada, no parte de esta fase de ejecución
- Reconsiderar la escala tipográfica de tamaños del hero/headings (hasta 9.2rem, ajustada para el tema cinematográfico anterior) → Fase 3-5, cuando se toque contenido de sección
- Tratamiento final de `.hero-orbit`/`.moving-band` → Fase 3+ (contenido de sección)

</deferred>

---

*Phase: 01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado*
*Context gathered: 2026-07-18*
