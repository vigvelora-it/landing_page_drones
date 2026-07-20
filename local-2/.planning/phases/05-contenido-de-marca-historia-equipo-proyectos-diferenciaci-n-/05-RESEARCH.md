# Phase 5: Contenido de Marca - Research

**Researched:** 2026-07-20  
**Domain:** Integración de contenido editorial canónico, equipo con assets incompletos, proyectos reales, diferenciación basada en evidencia y descarga estática condicionada a un PDF real en Next.js 16 / React 19 / CSS vanilla.  
**Confidence:** HIGH para arquitectura, datos, assets y riesgos: todo fue verificado contra los archivos actuales de `local-2/`. MEDIUM únicamente para ajustes visuales finos que deben validarse en navegador.

## Summary

La Fase 5 no necesita nuevas dependencias ni fuentes externas. Los datos estructurados de equipo, proyectos y brochure ya existen en `lib/site-content.ts`; lo que falta es incorporar la historia, quiénes somos, misión, visión, seis valores y diferenciación exacta desde `.planning/BRAND-CONTENT.md`, renderizar ese modelo dentro de la página y reordenar la navegación a seis destinos.

La implementación responsable tiene dos límites no negociables confirmados en el repositorio:

1. No hay retratos identificables de Paulo, Harold, Luis o Juan bajo `public/`. La sección de equipo debe renderizar cuatro áreas de retrato neutrales 4:5 con iniciales decorativas (`aria-hidden="true"`), nunca reutilizar imágenes de drones/equipos ni inventar rostros. Esto entrega la estructura, nombres, cargos y bios, pero **TEAM-01 permanece incompleto en su criterio de foto** hasta recibir cuatro retratos reales.
2. No existe ningún PDF bajo `public/`. Mientras falte el archivo real, no se debe renderizar enlace, botón, pseudo-enlace, `href="#"`, screenshot ni sustituto. El bloque puede omitirse por completo. **BROCH-01 permanece incompleto** hasta que el cliente entregue el PDF y se verifique en `npm run build && npm start`.

Todo lo demás es implementable ahora. La recomendación es trabajar en **dos planes secuenciales**:

- **05-01 — Nosotros + contenido canónico + equipo:** extender el modelo de datos, reemplazar el manifiesto inventado por historia/quiénes somos/misión/visión/valores, renderizar el equipo 2×2/1×4 con placeholders honestos y agregar el fallback sin JavaScript para `data-reveal`.
- **05-02 — Proyectos + diferenciación + navegación + integración:** crear `#proyectos`, destacar GESAC, listar Lezard/Las Dunas, renderizar evidencia canónica, insertar la sección en `app/page.tsx`, actualizar los seis destinos/números y ejecutar la verificación integral.

No debe generarse un plan ejecutable de brochure hasta que exista el asset. Cuando lleguen el PDF y los retratos, un futuro plan pequeño **05-03 — Assets reales** puede cablear `team[].photo`, añadir el CTA `<a download>` y cerrar TEAM-01/BROCH-01 sin reabrir la composición editorial.

## Constraints and Non-Negotiables

| Regla | Fuente | Consecuencia para la fase |
|------|--------|---------------------------|
| Trabajar solo en `local-2/` | `PROJECT.md`, `CLAUDE.md` | Ningún cambio fuera del directorio; no tocar `../local/` ni `../produccion/` |
| No desplegar sin aprobación explícita puntual | `PROJECT.md`, `CLAUDE.md` | Solo servidor local para validación; no Vercel ni servicios externos |
| Contenido visible verbatim | `BRAND-CONTENT.md`, `05-UI-SPEC.md` | No resumir ni “mejorar” historia, misión, visión, valores, bios, proyectos o diferenciación |
| No copiar Fugro/Seequent | `PROJECT.md`, `REQUIREMENTS.md` | Reusar el sistema visual propio; referencias externas no son fuentes de código, copy, imágenes ni color |
| CSS vanilla y tokens existentes | `CLAUDE.md`, `05-UI-SPEC.md` | Sin Tailwind, shadcn, librería de iconos ni nuevos literales de color |
| Movimiento moderado | `05-UI-SPEC.md` | Solo reveal existente: 24px, 450ms, opacidad/translate; sin pinning, carruseles o GSAP timelines nuevos |
| No inventar assets o resultados | `BRAND-CONTENT.md`, `05-UI-SPEC.md` | Placeholders neutrales para retratos; proyectos tipográficos; brochure omitido |
| Flujo secuencial sin worktrees | `.planning/config.json` | Un plan a la vez; no dividir la fase en waves paralelas |

<phase_requirements>
## Phase Requirements

| ID | Estado de insumos | Qué sí puede entregar esta fase | Criterio para marcar completo |
|----|-------------------|---------------------------------|-------------------------------|
| BRAND-01 | Disponible | Historia, quiénes somos, misión, visión y seis valores exactos | Todos los textos visibles coinciden con `BRAND-CONTENT.md`, sin el manifiesto/claims inventados actuales |
| TEAM-01 | **Retratos faltantes** | Intro, cuatro nombres, cargos y bios completos; composición definitiva; placeholders 4:5 honestos | No marcar completo hasta que las cuatro fotos reales estén en `public/` y asociadas correctamente |
| PROJ-01 | Disponible | GESAC destacado + Lezard y Las Dunas como soporte; cliente, ubicación y servicio | Tres casos completos, sin resultado/entregables inventados ni imágenes genéricas atribuidas |
| DIFF-01 | Disponible | Ventaja y mensaje exactos + cuatro celdas de evidencia canónica | Ningún competidor en DOM/accesibilidad/código de página; ninguna afirmación añadida |
| BROCH-01 | **PDF faltante** | Solo dejar preparada la referencia de datos existente; no mostrar control | No marcar completo hasta recibir PDF real, servirlo desde `public/` y verificar descarga en producción local |

**Resultado honesto esperado al terminar los dos planes actuales:** BRAND-01, PROJ-01 y DIFF-01 completos; TEAM-01 y BROCH-01 registrados como dependencias externas pendientes, nunca falsamente aprobados.
</phase_requirements>

## Current State Verified Against the Codebase

### Data layer

`lib/site-content.ts` ya contiene:

- `TeamMember` con `photo?: string`, `teamIntro` y los cuatro miembros en el orden canónico.
- `Project` y los tres proyectos exactos; GESAC ya tiene `featured: true`.
- `Brochure` y la ruta futura `/brochures/skytech-solutions-brochure.pdf`.
- No contiene todavía historia, quiénes somos, misión, visión, valores ni diferenciación.

Los nombres, cargos, bios y proyectos existentes coinciden con `BRAND-CONTENT.md`. No deben volver a redactarse ni duplicarse dentro de componentes.

### Composition layer

`app/page.tsx` renderiza actualmente:

```text
Hero
ManifestoSection (#nosotros)
Capabilities (#capacidades)
Technology (#tecnologia)
Process (#proceso)
Contact (#contacto)
```

No existe `#proyectos`. El nuevo orden debe ser:

```text
Hero
BrandSection / Nosotros (#nosotros)
Capabilities (#capacidades)
Technology (#tecnologia)
Projects (#proyectos)
Process (#proceso)
Contact (#contacto)
```

`InertBoundary` ya envuelve el bloque Technology/Process/Contact cuando el drawer de servicios está abierto. `ProjectsSection` debe insertarse dentro de ese mismo `InertBoundary`, entre Technology y Process, para conservar SERV-02 sin introducir coordinación adicional.

### Existing `#nosotros`

`components/sections/manifesto-section.tsx` contiene copy inventado y claims no respaldados para esta fase:

- “Donde otros ven superficie...”
- “Reducimos semanas...”
- “±2 cm precisión GNSS”

La Fase 5 debe sustituir ese contenido, no conservarlo junto al copy canónico. El archivo puede transformarse y renombrarse a `brand-section.tsx`; si se crea el archivo nuevo, se debe retirar el componente viejo tras actualizar `app/page.tsx` para no dejar código muerto.

### Navigation and numbering

`components/menu-overlay.tsx` tiene cinco destinos y aún usa `Perspectiva`. También los kickers de Process y Contact están numerados 04/05. La fase debe actualizar coherentemente:

| Número | Menú/kicker | Anchor |
|--------|-------------|--------|
| 01 | Nosotros | `#nosotros` |
| 02 | Capacidades | `#capacidades` |
| 03 | Tecnología | `#tecnologia` |
| 04 | Proyectos | `#proyectos` |
| 05 | Proceso | `#proceso` |
| 06 | Contacto | `#contacto` |

El CSS actual solo define delays explícitos hasta `nth-child(5)`. Debe añadirse el sexto estado y comprobarse que las seis filas no se solapen con `.menu-meta` en 390×844 y 320×568.

### Styling and motion

`app/globals.css` ya expone todos los tokens requeridos por `05-UI-SPEC.md`:

- superficies: `--bg-surface`, `--bg-surface-alt`, `--bg-surface-deep`
- texto: `--ink-primary`, `--ink-secondary`
- acento/foco: `--accent`, `--accent-hover`, `--focus-ring`
- bordes: `--border-subtle`, `--border-strong`
- movimiento: `--motion-distance-max:24px`, `--motion-duration-base:450ms`, `--motion-stagger-max:60ms`, `--ease-moderate`
- tipografía: `--display`, `--body`

No hay necesidad de añadir tokens, colores ni dependencias. Existe una sola regla global `body { overflow-x:hidden }`; no se debe añadir otra solución global de overflow.

La convención `[data-reveal]` se repite localmente con `IntersectionObserver` en cada sección. El CSS de reduced motion ya fuerza estado final. Sin embargo, el HTML prerenderizado mantiene `opacity:0` si JavaScript falla. Como el UI-SPEC exige contenido accesible aun sin JavaScript, el plan debe incluir un fallback `<noscript>` global que fuerce `[data-reveal]` y sus title spans a estado visible, o evitar `data-reveal` en contenido crítico. La opción preferida es un pequeño `<noscript><style>...</style></noscript>` en `app/layout.tsx`, porque también corrige las secciones existentes sin alterar la autoridad de animación.

### Asset inventory

Archivos confirmados bajo `public/`:

- imágenes genéricas de campo/equipos: `usar-drones-en-topografia.jpg`, `topografia-con-drones.jpg`, `monumentacion_puntos_referencia.png`, `MUSEO ZEN L1.png`, `equipos1.png`, `dron.png`
- video existente de Hero: `video/drone-flight-close.mp4`
- PDFs: **0**
- retratos identificables de los fundadores: **0**
- imágenes con procedencia confirmada para GESAC/Lezard/Las Dunas: **0**

Ninguno de los assets existentes puede convertirse semánticamente en retrato o evidencia de un proyecto nombrado.

## Recommended Data Model Additions

La fuente única debe seguir siendo `lib/site-content.ts`. Los componentes solo mapean datos; no almacenan párrafos largos. Estructura recomendada:

```typescript
export interface CorporateValue {
  id: string
  name: string
  description: string
}

export const brandStory = {
  history: "...texto canónico completo...",
  about: "...texto canónico completo...",
  mission: "...texto canónico completo...",
  vision: "...texto canónico completo...",
}

export const corporateValues: CorporateValue[] = [
  { id: "precision", name: "Precisión", description: "..." },
  // seis registros exactos, en el orden del brief
]

export const differentiation = {
  advantage: "...ventaja principal exacta...",
  message: "...mensaje principal exacto...",
}
```

Los índices visuales `01`–`06`, labels de UI (`Historia breve`, `¿Quiénes somos?`, `Cliente`, `Ubicación`, `Servicio realizado`) e iniciales son estructura de interfaz, no claims de marca. La puntuación y capitalización de los valores de marca debe mantenerse exactamente.

Para la evidencia se recomienda derivar cantidades de los arrays existentes cuando sea posible:

```typescript
const evidence = [
  { value: String(team.length), label: "Ingenieros Geólogos" },
  { value: String(projects.length), label: "Proyectos reales" },
  { value: "2024", label: "Fundación" },
  {
    value: "Huarmey · Huaral · Castilla",
    label: "Ancash · Lima · Piura",
  },
]
```

Esta cuarta celda agrupa exclusivamente ubicaciones canónicas. No se deben añadir cobertura nacional, porcentajes, años combinados, precisión, entregables o resultados.

## Recommended Component Architecture

```text
lib/site-content.ts
├─ brandStory (NEW)
├─ corporateValues (NEW)
├─ differentiation (NEW)
├─ team/teamIntro (existing)
├─ projects (existing)
└─ brochure (existing, not rendered while asset is absent)

components/sections/
├─ brand-section.tsx (NEW; replaces manifesto-section.tsx)
│  ├─ story/about blocks
│  ├─ mission + vision
│  ├─ values grid
│  └─ team grid with real-photo branch + initials fallback
└─ projects-section.tsx (NEW)
   ├─ featured GESAC article
   ├─ supporting project list
   └─ differentiation/evidence band

app/page.tsx
└─ wires BrandSection and ProjectsSection in the approved order
```

### BrandSection

- Mantener `id="nosotros"`, `section-pad` y `.site-shell`.
- Usar `<h2>Nosotros</h2>` como heading de la sección.
- Historia y quiénes somos son bloques separados con párrafos `max-width:68ch`.
- Misión y Visión: dos `<article>` iguales en desktop/tablet, uno por fila en móvil.
- Valores: lista semántica o seis `<article>`; 3×2, 2×3, 1×6.
- Equipo: intro exacta y cuatro `<article>`; 2×2 en desktop/tablet, 1×4 en móvil.
- No truncar, clamplear, ocultar en hover ni mover contenido a modal/accordion.

### Team portrait fallback

El componente debe estar preparado para assets reales sin mentir mientras faltan:

```tsx
<div className="team-card__portrait">
  {member.photo ? (
    <Image
      src={member.photo}
      alt={`Retrato de ${member.name}`}
      fill
      sizes="(max-width: 720px) 100vw, 50vw"
    />
  ) : (
    <span className="team-card__initials" aria-hidden="true">
      {getInitials(member.name)}
    </span>
  )}
</div>
```

- `getInitials` puede derivar la primera y última palabra del nombre; no debe alterar el nombre visible.
- El contenedor usa `aspect-ratio:4/5`, `--bg-surface-deep` y no necesita texto visible de “foto pendiente”.
- El nombre inmediatamente posterior aporta la identidad accesible; el placeholder es decorativo.
- Solo cuando `photo` apunte a un retrato real confirmado se renderiza `next/image` con alt de retrato.

### ProjectsSection

- Crear un único `<section id="proyectos">` después de Technology y antes de Process.
- GESAC es el único `featured`; no conviene depender silenciosamente de `projects[0]`. Separar por `project.featured` y mantener una validación estructural de exactamente un destacado.
- Usar `<dl>` para Cliente/Ubicación/Servicio, con valores siempre visibles.
- Desktop: 7/5; tablet/móvil: una columna.
- Sin imágenes, logos, fechas, testimonios, resultados ni scopes inventados.
- La diferenciación vive dentro de esta sección después de los proyectos, con `<h3>` propio.

### Brochure

Mientras el PDF falte, `brochure` permanece como dato futuro pero ningún componente debe importarlo para renderizar un control. No se recomienda una condición runtime basada en `fetch`, filesystem del cliente o HEAD request: sería complejidad innecesaria para contenido estático y podría producir estados engañosos.

Cuando llegue el archivo real, el wiring correcto será:

```tsx
<a
  className="brochure-cta"
  href={brochure.href}
  download
  type="application/pdf"
>
  Descargar brochure
</a>
```

No `target="_blank"`, no gating y no JavaScript de descarga.

## CSS Composition

Crear un bloque dedicado, por ejemplo `/* Contenido de marca */`, antes de `/* Proceso */`. Recomendación de clases:

```text
.brand-section
.brand-heading
.brand-story-grid
.brand-copy
.purpose-grid
.purpose-card
.values-region
.values-grid
.value-card
.team-region
.team-intro
.team-grid
.team-card
.team-card__portrait
.team-card__initials
.team-card__role
.team-card__bio

.projects-section
.projects-layout
.project-card
.project-card--featured
.project-facts
.project-supporting
.differentiation
.evidence-grid
.evidence-cell
```

Aplicar exclusivamente la escala aprobada:

- gaps/padding: 4, 8, 16, 24, 32, 48, 64px
- body/bio: `.95rem`, peso 400, `line-height:1.7`
- label: `.68rem`, peso 500, `line-height:1.4`
- subheading/name: `clamp(1.6rem,2.4vw,2.2rem)`, peso 500
- display: `clamp(3.2rem,6.5vw,6.8rem)`, peso 500
- cada grid child de copy largo: `min-width:0`
- no `text-overflow`, line clamp ni horizontal scroll

Breakpoints exactos:

| Viewport | Values | Team | Projects | Evidence |
|----------|--------|------|----------|----------|
| >1000px | 3×2 | 2×2 | 7/5 | 4 columnas |
| 721–1000px | 2×3 | 2×2 | apilado | 2×2 |
| ≤720px | 1×6 | 1×4 | apilado | 1 columna |

No reutilizar `.media-frame` para placeholders de personas: esa clase incluye hover scale para `<img>` y comunica tratamiento de fotografía real. El placeholder necesita clase neutral propia.

## Interaction and Motion

Esta fase es editorial y estática. No introducir estado React salvo el observer local de reveal; no hay fetch, carrusel, modal, acordeón ni interacción dependiente de hover.

Patrón permitido:

- `IntersectionObserver` local y cleanup, igual al resto de secciones.
- `[data-reveal]` una sola vez.
- translate máximo de 24px y 450ms, ya definido por tokens.
- stagger opcional máximo 60ms, solo opacidad/translate.
- reduced motion queda resuelto por el media query global existente.
- fallback `<noscript>` para que el contenido no desaparezca sin JS.

No usar GSAP timelines, `ScrollTrigger` nuevo, pinning, parallax sobre copy largo, marquee, auto-advance, cards flip o biografías hover-only.

## Plan Decomposition

### Plan 05-01 — Contenido canónico de Nosotros y equipo

**Requirements:** BRAND-01; TEAM-01 (estructura/contenido, dependencia de fotos documentada)  
**Files probables:** `lib/site-content.ts`, `components/sections/brand-section.tsx`, `components/sections/manifesto-section.tsx` (retiro), `app/page.tsx`, `app/layout.tsx`, `app/globals.css`.

1. Añadir `brandStory`, `corporateValues` y sus interfaces con copy exacto.
2. Construir BrandSection con heading correcto, historia, quiénes somos, misión, visión y seis valores.
3. Renderizar teamIntro + cuatro cards desde `team`, con rama para `photo` real y placeholder neutral actual.
4. Sustituir ManifestoSection sin conservar claims antiguos y añadir fallback no-JS de reveals.
5. Validar copy, jerarquía, 1440/1000/390/320 y registrar TEAM-01 como pendiente de cuatro fotos.

### Plan 05-02 — Proyectos, diferenciación e integración de navegación

**Requirements:** PROJ-01, DIFF-01; BROCH-01 solo como dependencia explícitamente omitida  
**Files probables:** `lib/site-content.ts`, `components/sections/projects-section.tsx`, `components/menu-overlay.tsx`, `components/sections/process-section.tsx`, `components/sections/contact-section.tsx`, `app/page.tsx`, `app/globals.css`.

1. Añadir diferenciación exacta al modelo y construir ProjectsSection.
2. Renderizar GESAC destacado + Lezard/Las Dunas y hechos con `<dl>`.
3. Renderizar evidencia canónica y ventaja/mensaje exactos, sin competidores.
4. Insertar `#proyectos`; actualizar menú y kickers a 01–06.
5. No renderizar brochure mientras el PDF falte; documentar BROCH-01 pendiente.
6. Ejecutar lint/typecheck/build y validación visual/interactiva completa.

### Future Plan 05-03 — Assets reales (no crear/ejecutar todavía)

**Entrada obligatoria:** cuatro retratos identificados + PDF final.  
**Requirements:** cerrar TEAM-01 y BROCH-01.

1. Colocar assets en paths estables bajo `public/`.
2. Asignar cada retrato a la persona correcta y verificar alt/dimensiones.
3. Renderizar CTA de brochure y confirmar descarga real en producción local.
4. Marcar requisitos completos solo después de la verificación.

## Common Pitfalls

### Pitfall 1: Marcar TEAM-01 completo porque existen cuatro cards

**Por qué falla:** el requisito exige foto, nombre, cargo y bio. Los placeholders son una solución visual honesta, no una foto.  
**Prevención:** summary y verification deben declarar `TEAM-01 blocked: four real portraits missing`; checkbox permanece vacío.

### Pitfall 2: Renderizar un CTA “deshabilitado” o un enlace a la ruta futura

**Por qué falla:** la ruta de datos no demuestra que el archivo exista; un control roto/deceptivo viola UI-SPEC y BROCH-01.  
**Prevención:** cero control de brochure en DOM hasta que el PDF sea real.

### Pitfall 3: Duplicar copy canónico dentro de JSX

**Por qué falla:** multiplica fuentes de verdad y facilita divergencias de acentos/puntuación.  
**Prevención:** todo párrafo de marca en `lib/site-content.ts`; los componentes solo importan/mapean.

### Pitfall 4: Atribuir imágenes genéricas a personas o proyectos

**Por qué falla:** crea evidencia falsa y alt text engañoso.  
**Prevención:** equipo con iniciales; proyectos tipográficos; no usar `next/image` salvo asset con procedencia confirmada.

### Pitfall 5: Inventar resultados para “enriquecer” proyectos

**Por qué falla:** `Resultado/entregables` figura no especificado.  
**Prevención:** mostrar únicamente proyecto, cliente, ubicación y servicio.

### Pitfall 6: Exponer competidores fuera del texto visible

**Por qué falla:** DIFF-01 prohíbe nombrarlos en la página, incluyendo accesibilidad, comments, metadata y labels.  
**Prevención:** grep de `app/`, `components/` y `lib/` por los cuatro nombres; planning docs no forman parte del bundle/página.

### Pitfall 7: Romper la secuencia de anchors

**Por qué falla:** añadir Proyectos sin renumerar Process/Contact produce menú y kickers incoherentes.  
**Prevención:** actualizar los seis puntos como una sola tarea y probar cada link desde el overlay.

### Pitfall 8: Overflow por nombres, cargos o copy largo a 320px

**Por qué falla:** nombres completos y párrafos canónicos no pueden truncarse.  
**Prevención:** `min-width:0`, grids apilados, `overflow-wrap` solo si una cadena real lo exige, nunca reducir la tipografía ni añadir otro `overflow-x:hidden`.

### Pitfall 9: Dejar contenido de reveal invisible sin JavaScript

**Por qué falla:** el CSS base comienza en `opacity:0`.  
**Prevención:** fallback `<noscript>` o no aplicar `data-reveal` a contenido crítico. Preferencia: fallback global pequeño y verificable.

## Validation Architecture

No existe framework de tests automatizados y está fuera de alcance. La verificación debe combinar gates de código, build de producción y Playwright/manual real.

### Commands

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start
```

No ejecutar build y typecheck simultáneamente sobre `.next`.

### Requirement Test Map

| Req | Gate estructural | Gate de navegador | Resultado esperado actual |
|-----|------------------|-------------------|---------------------------|
| BRAND-01 | `brandStory` + 6 values importados desde `site-content`; claims viejos ausentes | Comparar `textContent` de historia/about/mission/vision/value cards contra constantes | Completo |
| TEAM-01 | 4 registros y 4 articles; sin imágenes falsas | 4 nombres/cargos/bios completos; 4 placeholders `aria-hidden`; sin truncación | Pendiente fotos |
| PROJ-01 | exactamente un `featured`; 3 projects | GESAC destacado, dos support; cada uno con Cliente/Ubicación/Servicio | Completo |
| DIFF-01 | diferenciación desde datos; grep sin nombres de competidores en código de página | evidencia exacta; ninguna mención en `document.body.innerText`/accessible DOM | Completo |
| BROCH-01 | confirmar que no hay `.pdf` y que no se renderiza `[download]` | cero control roto | Pendiente PDF |

### Structural Checks

```powershell
# Debe seguir habiendo un solo overflow-x global
rg -n "overflow-x" app/globals.css

# No deben existir controles falsos de brochure mientras falta el PDF
rg -n "download|brochure.href|skytech-solutions-brochure.pdf" app components

# La nueva composición debe tener un solo anchor por destino
rg -n 'id="(nosotros|capacidades|tecnologia|proyectos|proceso|contacto)"' components
```

El grep de brochure sí seguirá encontrando la ruta futura en `lib/site-content.ts`; eso es aceptable. La ausencia requerida es en `app/` y `components/`.

### Browser Matrix

Validar 1440×900, 1000×800, 390×844 y 320×568:

1. `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
2. Un solo `<h1>` y headings en orden: h2 para Nosotros/Proyectos/Proceso/Contacto; h3 para subsecciones.
3. Los seis enlaces del menú caben, son tabulables y aterrizan en su anchor.
4. Seis valores y cuatro bios completos, sin ellipsis/clamp/hover dependency.
5. GESAC tiene jerarquía destacada; Lezard y Las Dunas igual peso entre sí.
6. Cada proyecto muestra Cliente, Ubicación y Servicio realizado.
7. Cuatro placeholders neutrales, no `<img>` dentro del team mientras falten retratos.
8. Ningún `[download]` mientras falte PDF.
9. Consola sin errores y sin regresión de drawer/header/carrusel al atravesar la nueva longitud de página.
10. Con `prefers-reduced-motion: reduce`, todo contenido nuevo termina visible y usable.

### Future PDF Verification

Solo después de recibir el archivo:

1. `npm.cmd run build`.
2. `npm.cmd run start` en local.
3. Solicitar `/brochures/skytech-solutions-brochure.pdf`.
4. Confirmar HTTP 200, `Content-Type: application/pdf`, primeros bytes `%PDF-` y que el body no sea HTML/404 de Next.
5. Activar el link y confirmar descarga con nombre estable.

## Security Domain

La fase añade datos estáticos y markup; no agrega entradas, autenticación, sesión, API, persistencia ni llamadas externas.

| Riesgo | STRIDE/ASVS | Mitigación |
|--------|-------------|------------|
| Copy futuro proveniente de CMS/HTML sin sanitizar | Injection / V5 | No aplica ahora: constantes TypeScript renderizadas como texto por React; no usar `dangerouslySetInnerHTML` |
| Download a URL externa o archivo no-PDF | Tampering / V5 | Ruta same-origin estática, atributo `download`, verificación de status/content-type/magic bytes antes de habilitar |
| Foto asociada a persona equivocada | Integrity / business logic | Requerir mapeo explícito confirmado por cliente; alt solo después de identificación |
| Competidores filtrados a metadata/aria/comments | Information disclosure | Grep de `app/`, `components/`, `lib/` y auditoría DOM/accesibilidad |

No usar `dangerouslySetInnerHTML`; todos los textos canónicos deben renderizarse con interpolación React normal.

## Environment Availability

| Dependencia/asset | Disponible | Disposición |
|-------------------|------------|-------------|
| Next.js 16 / React 19 | Sí | Reusar |
| GSAP/Lenis/reveal pattern | Sí | Reusar sin nuevas timelines |
| CSS tokens y breakpoints | Sí | Reusar |
| `team`, `projects`, `brochure` data | Sí | Extender, no duplicar |
| Retratos reales de 4 fundadores | **No** | Placeholder neutral; TEAM-01 pendiente |
| PDF real de brochure | **No** | Omitir control; BROCH-01 pendiente |
| Imágenes de proyectos con procedencia | **No** | Layout tipográfico |
| Nueva librería UI/iconos | No requerida | No instalar |
| Despliegue | Prohibido sin permiso | No ejecutar |

## Sources

### Primary (HIGH confidence)

- Inspección directa del repositorio actual: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/menu-overlay.tsx`, `components/inert-boundary.tsx`, todas las secciones actuales, `lib/site-content.ts`, `lib/gsap.ts`, `package.json`.
- `.planning/BRAND-CONTENT.md` — única fuente canónica de copy y hechos.
- `.planning/phases/05-contenido-de-marca-historia-equipo-proyectos-diferenciaci-n-/05-UI-SPEC.md` — contrato visual aprobado.
- `.planning/PROJECT.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/config.json`, `CLAUDE.md`.
- Inventario directo de `public/` — confirma ausencia de PDF, retratos y assets de proyectos identificados.

### Secondary

- Research/planes/resúmenes de Fases 3–4 para confirmar patrones ya aceptados de `InertBoundary`, reveals locales, tokens, breakpoints y verificación con Playwright.

### External sources

Ninguna. No fue necesario consultar Fugro, Seequent ni otra web; la fase está determinada por el brief canónico, el UI-SPEC aprobado y el código instalado.

## Metadata

**Confidence breakdown:**

- Contenido y asset status: HIGH — archivos y ausencia de dependencias verificados directamente.
- Arquitectura/composición: HIGH — `app/page.tsx`, boundaries y componentes actuales leídos directamente.
- Responsive/visual: MEDIUM hasta completar browser QA en los cuatro viewports.
- Cierre de TEAM-01/BROCH-01: BLOCKED por archivos externos, no por incertidumbre técnica.

**Research date:** 2026-07-20  
**Valid until:** hasta que el cliente entregue retratos o brochure; reauditar `public/` inmediatamente cuando llegue cualquier asset.
