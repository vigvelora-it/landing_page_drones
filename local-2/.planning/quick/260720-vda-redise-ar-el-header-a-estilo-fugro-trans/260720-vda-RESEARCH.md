# Header estilo Fugro (transparente → sólido + mega-menús hover) - Research

**Researched:** 2026-07-20
**Domain:** Header/nav accesible con mega-menús por hover (CSS vanilla + React 19), reutilizando hooks de scroll y coordinación ya existentes
**Confidence:** HIGH

## Summary

El header actual (`components/menu-overlay.tsx` + `.site-header`/`.menu-overlay` en `app/globals.css`) ya resuelve el mecanismo scroll-reactive (`useHeaderScrollState`, HEAD-01, `ScrollTrigger.create({ toggleClass })` sobre `.is-scrolled`) y la exclusión mutua con el drawer (`useOverlayCoordination`, `useScrollLock`). Ese mecanismo **no necesita cambios**: solo se reutiliza. Lo que falta es puramente visual/markup: (1) el header base hoy usa texto `var(--ink-primary)` (oscuro) siempre — nunca fue diseñado para verse "transparente con texto blanco", así que ese es el cambio real de CSS; (2) no existe hoy ningún nav horizontal — solo un botón "Menú" que abre el overlay a pantalla completa; (3) los mega-menús pueden construirse con un patrón CSS+React ya usado en el proyecto (estado por `<li>`, `aria-expanded`, cierre por Escape igual que `menu-overlay.tsx`), sin ninguna librería nueva.

El mayor riesgo real no es técnico sino de **contraste**: el `.hero-shade` actual es un scrim muy sutil (14–22% de `--ink-primary` mezclado) diseñado para el pivote a tema claro (Fase 1), no para garantizar AA en texto blanco superpuesto. Sobre la foto/video real del hero (cielo despejado, terreno claro) ese scrim es insuficiente para blanco AA. Se necesita un scrim **adicional, propio del header**, derivado con el mismo patrón `color-mix()` ya usado en el proyecto — no modificar `.hero-shade` en sí (afecta toda la sección), sino añadir un gradiente vertical local a `.site-header` en su estado no-scrolled.

Para el hover-nav: la detección de "puntero preciso" ya tiene un precedente exacto en `custom-cursor.tsx` (`window.matchMedia("(pointer: fine)")`) y en CSS (`@media(pointer:fine)` en la línea de `.custom-cursor`) — reutilizar literalmente ese media feature, no introducir `(hover:hover)` ni breakpoints de ancho nuevos. Como la página es `force-static`, el patrón correcto es **CSS puro** para decidir qué markup se ve (`@media(pointer:fine)` cambia `display`), no un `useState`+`matchMedia` en JS que re-renderice condicionalmente — eso causaría un mismatch de hidratación SSR/CSR que este proyecto no tiene hoy en ningún otro lado.

**Primary recommendation:** Extender `menu-overlay.tsx` (mismo componente, mismos hooks) añadiendo un `<nav>` horizontal + 4 `<li>` con mega-panel controlado por estado React (open/close con pequeño delay en `onMouseLeave`, apertura inmediata en `onMouseEnter`/`onFocus`, cierre con Escape) visible solo bajo `@media(pointer:fine)`; el botón "Menú"/overlay existente se oculta con la misma media query invertida (`@media not (pointer:fine)` o el complemento vía `display:none` en `@media(pointer:fine)`), sin tocar su lógica. Header pasa a `color:#FFFFFF` + gradiente-scrim propio en estado base, y a `color:var(--ink-primary)` + `background:var(--bg-surface)` en `.is-scrolled` (ya existe el toggle).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Scroll-reactive header background/color toggle | Browser/Client (CSS + GSAP ScrollTrigger) | — | Ya implementado en `useHeaderScrollState`; puramente visual, discreto (no scrub), corre en el cliente contra `document.body` scroll |
| Nav horizontal + mega-menú hover | Browser/Client (React state + CSS) | — | Interacción de puntero, sin datos de servidor; el contenido de cada mega-menú es estático (`lib/site-content.ts`), no requiere fetch |
| Overlay móvil a pantalla completa | Browser/Client (React state ya existente) | — | Sin cambios; se conserva intacto, solo se gatea su visibilidad por CSS `pointer` media feature |
| Contraste del texto blanco sobre hero | Browser/Client (CSS scrim) | — | Presentacional, resuelto con `color-mix()` como el resto de scrims del proyecto |
| Contenido de cada mega-panel | Datos estáticos (`lib/site-content.ts`) | Browser/Client (render) | Fuente de verdad ya centralizada; el header solo consume `services`/`projects`/`equipment`, no inventa copy |

## Standard Stack

Ningún paquete nuevo. Todo se construye con lo ya instalado:

| Herramienta | Versión instalada | Uso en esta tarea |
|---|---|---|
| React | 19.2.7 | Estado local del header (`useState` open-key, timers de cierre) |
| GSAP + `@gsap/react` | 3.15.0 / 2.1.2 | Sin cambios — `useHeaderScrollState` ya usa `ScrollTrigger.create({ toggleClass })`, se reutiliza tal cual |
| Lenis | 1.3.25 | Sin cambios de configuración — `anchors:true` en `SmoothScrollProvider` ya intercepta los `<a href="#...">` de los mega-paneles |
| CSS vanilla | — | `:focus-within`, `@media(pointer:fine)`, `color-mix()` — todo nativo, cero dependencias |

**No aplica Package Legitimacy Audit** — esta tarea no instala ningún paquete nuevo (confirmado por CONTEXT.md: "el proyecto usa CSS vanilla + hooks propios por decisión ya tomada").

## Architecture Patterns

### Diagrama de interacción (hover-nav desktop)

```
Puntero entra en <li class="nav-item"> (trigger <a href="#capacidades">)
        │
        ├─ pointer:fine? ──No──> CSS oculta .nav-item mega-panel por completo
        │                        (el <a> sigue siendo un link normal, navega igual)
        Sí
        │
        ▼
  onMouseEnter/onFocus → clearTimeout(closeTimer) → setOpenKey("capacidades")
        │
        ▼
  .nav-item[data-open="true"] .mega-panel → visibility:visible, opacity:1
  (panel es hijo DOM del mismo <li>, toca el borde inferior del header — sin gap)
        │
        ├─ puntero se mueve DENTRO del panel (mismo <li>) → sigue abierto (Hoverable)
        │
        ├─ Escape presionado → setOpenKey(null) + foco vuelve al trigger (Dismissible)
        │
        └─ onMouseLeave/onBlur (foco sale del <li>) → setTimeout(200-300ms, setOpenKey(null))
                 │
                 └─ si vuelve a entrar antes del timeout → clearTimeout (evita flicker)
```

### Recommended Project Structure

Sin archivos nuevos necesarios — todo cabe en los ya existentes:

```
components/
├── menu-overlay.tsx      # extender: añadir <nav> horizontal + mega-panels + estado openKey
                           # el botón "Menú"/overlay existente NO se toca, solo se envuelve en CSS gate
hooks/
├── use-header-scroll-state.ts   # SIN CAMBIOS — se reutiliza tal cual (HEAD-01)
├── use-overlay-coordination.ts  # SIN CAMBIOS
├── use-scroll-lock.ts           # SIN CAMBIOS
lib/
├── site-content.ts        # SIN CAMBIOS de forma — solo se leen services/projects/equipment
                            # ya existentes; si Nosotros necesita anclas internas nuevas
                            # (historia/equipo/valores/sectores) esas van en brand-section.tsx
                            # como atributos id, no en site-content.ts
app/
├── globals.css             # extender bloque "/* Navegación */": nuevas reglas .site-nav,
                             # .nav-item, .mega-panel, gated por @media(pointer:fine)
```

### Pattern 1: Mega-panel controlado por React con delay + CSS `:focus-within` de respaldo

**What:** Estado `openKey: string | null` en el propio `MenuOverlay`, un timer de cierre con gracia (~200-300ms) igual de espíritu al patrón `closeTimeoutRef` que ya existe en `service-drawer.tsx`, más `:focus-within` en CSS como red de seguridad si JS aún no hidrató.

**When to use:** Los 4 ítems con submenú (Nosotros, Capacidades, Tecnología, Proyectos). Proceso y Contacto son `<a>` simples, sin `<li className="nav-item">` wrapper ni panel.

**Example:**
```tsx
// Patrón de timer con limpieza — mismo espíritu que closeTimeoutRef en service-drawer.tsx
const OPEN_DELAY_MS = 0
const CLOSE_DELAY_MS = 250 // dentro del rango 200-300ms recomendado por la industria
                            // para evitar "flicker" al cruzar el hueco trigger→panel

const [openKey, setOpenKey] = useState<string | null>(null)
const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

function openPanel(key: string) {
  clearTimeout(closeTimer.current)
  setOpenKey(key)
}

function scheduleClose() {
  clearTimeout(closeTimer.current)
  closeTimer.current = setTimeout(() => setOpenKey(null), CLOSE_DELAY_MS)
}

useEffect(() => () => clearTimeout(closeTimer.current), [])

useEffect(() => {
  if (!openKey) return
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return
    setOpenKey(null)
    // devolver foco al trigger — mismo patrón que menu-overlay.tsx ya usa con toggleRef
  }
  window.addEventListener("keydown", closeOnEscape)
  return () => window.removeEventListener("keydown", closeOnEscape)
}, [openKey])
```

```tsx
// JSX de un nav-item con mega-panel
<li
  className="nav-item"
  onMouseEnter={() => openPanel("capacidades")}
  onMouseLeave={scheduleClose}
  onFocus={() => openPanel("capacidades")}
  onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) scheduleClose()
  }}
>
  <a href="#capacidades" aria-expanded={openKey === "capacidades"}>Capacidades</a>
  <div className="mega-panel" data-open={openKey === "capacidades" || undefined}>
    {services.map((service) => (
      <a key={service.id} href="#capacidades">{service.title}</a>
    ))}
  </div>
</li>
```

```css
/* Source: patrón estándar CSS-only fallback (Adobe Accessible Mega Menu / MDN :focus-within) */
/* Zero-gap: el panel toca el borde inferior del header porque el <li> se estira
   a la altura completa de .site-header (align-items:stretch en el <nav>) */
.site-nav{display:none}
@media(pointer:fine){
  .site-nav{display:flex;align-items:stretch;height:100%}
  .menu-toggle,.menu-overlay{display:none}
}
.nav-item{position:relative;display:flex;align-items:center}
.mega-panel{
  position:absolute;top:100%;left:0;right:0;
  visibility:hidden;opacity:0;pointer-events:none;
  transition:opacity var(--motion-duration-fast) var(--ease-moderate);
}
.nav-item[data-open],.nav-item:focus-within .mega-panel{
  visibility:visible;opacity:1;pointer-events:auto;
}
```

### Pattern 2: Scrim propio del header (no reescribir `.hero-shade`)

**What:** Un gradiente vertical `color-mix()`-based, aplicado directamente al `.site-header` en su estado base (no-scrolled), independiente del scrim del hero.

**When to use:** Solo si tras implementar se detecta que el contraste del texto blanco falla AA sobre la foto/video real (verificar con axe/WebAIM tras integrar). Reutiliza la MISMA técnica que `.hero-shade`/`.tech-vignette` (gradiente + `color-mix(in srgb, var(--ink-primary) X%, transparent)`), no un enfoque nuevo — satisface la instrucción de CONTEXT.md de "reutilizar el patrón... en vez de crear uno nuevo".

**Example:**
```css
/* Source: mismo patrón que .hero-shade (línea 25 de app/globals.css), aplicado al header */
.site-header{
  background:linear-gradient(
    180deg,
    color-mix(in srgb,var(--ink-primary) 45%,transparent) 0%,
    transparent 100%
  );
  color:#FFFFFF; /* mismo literal ya usado en .menu-overlay/.service-row:hover — no hay
                    token --ink-inverse declarado, seguir la convención existente */
}
.site-header.is-scrolled{
  background:var(--bg-surface); /* ya existente — sobrescribe el gradiente por completo */
  color:var(--ink-primary);
  box-shadow:0 1px 0 var(--border-subtle),0 8px 24px color-mix(in srgb,var(--ink-primary) 6%,transparent);
}
```

### Anti-Patterns to Avoid

- **`useState` + `window.matchMedia("(pointer: fine)")` en JS para decidir qué árbol de markup renderizar:** en una página `force-static`, el HTML servido siempre asume un caso; si el cliente decide lo contrario tras hidratar, hay un parpadeo de contenido incorrecto y riesgo de warning de hidratación. Usar solo CSS (`@media(pointer:fine){ display:... }`) para esta decisión — el proyecto no tiene ningún precedente de bifurcar markup por JS condicional, solo "degradar" tras montar (ver `hero-section.tsx`, que SIEMPRE renderiza el video y solo lo pausa en `useEffect`, nunca cambia qué elemento existe).
- **Cerrar el mega-panel al primer `mouseleave` sin timeout:** provoca el "gap flicker" documentado (Smashing Magazine, ver Sources) cuando el puntero cruza en diagonal del link al panel. Usar el patrón de timer con `clearTimeout` en re-entrada (Pattern 1).
- **Reescribir `.hero-shade` para oscurecerlo globalmente:** afectaría la legibilidad del hero completo (ya ajustada y locked en Fase 1 UI-SPEC — THEME-02 contraste verificado). El scrim del header debe ser local a `.site-header`, no una modificación del scrim del hero.
- **Abrir el drawer de servicio directamente desde el mega-panel de Capacidades:** CONTEXT.md ya lo prohíbe explícitamente — cada ítem enlaza a `#capacidades`, nunca dispara `CapabilitiesSection`'s drawer state desde el header (evitaría duplicar la lógica de `useOverlayCoordination`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detección de puntero preciso | Un segundo mecanismo de detección (p.ej. combinar ancho de viewport + `ontouchstart`) | El mismo `(pointer: fine)` ya usado en `custom-cursor.tsx` (JS) y en CSS (línea `@media(pointer:fine){[data-cursor]{cursor:none}}`) | Dos mecanismos de detección distintos para la "misma" clase de dispositivo divergen en edge cases (tablets con mouse, Surface) y duplican mantenimiento |
| Toggle de fondo del header al hacer scroll | Un nuevo listener de scroll o IntersectionObserver | `useHeaderScrollState` (ya existe, HEAD-01) | Ya implementado, probado, y cumple la restricción THEME-04 de "discrete threshold toggle, never scrub" — reescribirlo arriesga violar esa regla lockeada |
| Scroll suave a un ancla tras cerrar el header | `element.scrollIntoView()` manual o un segundo motor de scroll | `lenis.scrollTo("#ancla")` (ya usado en `service-drawer.tsx`'s `handleCtaClick`) o simplemente un `<a href="#ancla">` normal (Lenis ya intercepta clicks de anchor vía `anchors:true`) | Evita una segunda autoridad de scroll compitiendo con Lenis — mismo principio ya aplicado en todo el proyecto (single ticker wiring, THEME-04) |
| Compensar la altura del header fijo al saltar a un ancla | Offset manual en JS (`scrollTo(0, targetY - headerHeight)`) | `scroll-margin-top` en CSS sobre el elemento destino — confirmado [VERIFIED: node_modules/lenis/dist/lenis.mjs líneas 773-778] que `lenis.scrollTo()` lee `getComputedStyle(node).scrollMarginTop` y lo resta automáticamente | Ya soportado nativamente por la versión de Lenis instalada (1.3.25); no hay que tocar `SmoothScrollProvider` ni pasar `offset` manualmente por cada link |

**Key insight:** este header no necesita ninguna pieza nueva de infraestructura — todos los "primitivos" (scroll-reactive toggle, scroll-lock, overlay-coordination, scroll suave con Lenis) ya existen y están probados por fases anteriores. El trabajo real es 100% visual/markup dentro de `menu-overlay.tsx` + `app/globals.css`.

## Common Pitfalls

### Pitfall 1: Texto blanco sin contraste AA sobre la foto/video real del hero
**What goes wrong:** El `.hero-shade` actual (`color-mix(in srgb,var(--ink-primary) 22%,transparent)` en el punto más oscuro) fue ajustado en Fase 1 para el pivote a tema claro, no para garantizar 4.5:1 con texto blanco encima. Sobre zonas claras de la foto (cielo, terreno), el logo/nav blanco puede caer muy por debajo de AA.
**Why it happens:** El scrim del hero y el scrim del header son necesidades distintas — uno es para toda la sección, el otro solo para la franja donde vive el header (~80-90px).
**How to avoid:** Aplicar un gradiente propio en `.site-header` (Pattern 2), verificar con una herramienta de contraste (axe DevTools / WebAIM) contra un frame representativo del video, y solo si aun así falla, subir la opacidad del `color-mix()` del header (no la del hero global).
**Warning signs:** El brief del cliente y THEME-02 exigen WCAG AA explícitamente — cualquier combinación por debajo de 4.5:1 (normal) o 3:1 (elementos grandes tipo logo) es un defecto bloqueante, no cosmético.

### Pitfall 2: Gap muerto entre el trigger y el mega-panel provoca cierre prematuro
**What goes wrong:** Si el `<li>` del nav-item solo mide la altura del texto del link (no la altura completa del header), hay una franja de header vacía entre el link y donde empieza el panel — el puntero "sale" del área hoverable al cruzar esa franja y el panel se cierra antes de llegar.
**Why it happens:** Diseño típico de "gap" documentado ampliamente (Smashing Magazine, ver Sources) — el panel no está physically adyacente al elemento cuyo `:hover`/estado controla su visibilidad.
**How to avoid:** Estirar el `<li>` a la altura completa del header (`align-items:stretch` en el `<nav>` padre) para que no exista franja sin cubrir, y además usar el timer de gracia de 200-300ms (Pattern 1) como defensa adicional contra movimientos diagonales imprecisos.
**Warning signs:** El mega-panel "parpadea" (abre y cierra) al mover el mouse lentamente desde el link hacia el panel.

### Pitfall 3: Anclas internas de "Nosotros" (historia, equipo, valores, sectores) no existen todavía como `id` navegable
**What goes wrong:** Hoy solo existen `id="sectors-heading"`, `id="values-heading"`, `id="team-heading"` en `brand-section.tsx` — y están puestos en los `<h3>` internos, no en las secciones contenedoras; **no existe ningún `id` para "Historia"** en absoluto. Si el mega-panel de Nosotros enlaza a `#historia` sin que ese id exista, el navegador simplemente no hace scroll (silently no-op).
**Why it happens:** `brand-section.tsx` fue construido en Fase 5 con `aria-labelledby` en mente (accesibilidad de landmarks), no con navegación por ancla desde el header en mente — CONTEXT.md ya lo marca como pendiente de verificar/añadir.
**How to avoid:** Añadir `id="historia"` al `<article className="brand-copy brand-copy--history">` (o a un wrapper), y decidir si reutilizar los `id` existentes en los `<h3>` (`sectors-heading`, `values-heading`, `team-heading`) tal cual o mover esos `id` a los elementos `<section>`/`<div>` contenedores — cualquiera de las dos opciones funciona para anclas, pero **cada uno necesita `scroll-margin-top`** (Pitfall 4) porque no tienen el padding generoso de `.section-pad` que sí protege a los anchors de nivel superior (`#nosotros`, `#capacidades`, etc.).
**Warning signs:** Clic en un sub-ítem del mega-panel de Nosotros no mueve el scroll, o lo mueve pero el título queda tapado por el header.

### Pitfall 4: El header fijo tapa el destino del scroll en anclas sin `scroll-margin-top`
**What goes wrong:** `SmoothScrollProvider` usa `anchors: true` (sin `offset`) — [VERIFIED: `node_modules/lenis/dist/lenis.mjs`] Lenis SÍ resta `scroll-margin-top` del elemento destino automáticamente, pero **ningún elemento del proyecto lo declara hoy** (cero hits de `scroll-margin` en el codebase). Los anchors de nivel superior (`#nosotros`, `#capacidades`...) sobreviven porque `.section-pad` les da `clamp(7rem,12vw,13rem)` de padding superior, pero los nuevos sub-anchors de Nosotros (Pitfall 3) no tienen ese colchón.
**Why it happens:** El header, hasta ahora, no era "siempre visible" en desktop (era un botón + overlay), así que el overlap real con contenido normal era mínimo. Con el nav horizontal permanente, el header cubre ~80-90px de la parte superior del viewport en todo momento.
**How to avoid:** Declarar `scroll-margin-top: 100px` (o el alto real del header + margen) en los nuevos `id` de sub-anchors, y considerar declararlo también, por consistencia, en los `id` de sección de nivel superior aunque hoy "funcionen" por el padding generoso — evita que un futuro ajuste de `.section-pad` rompa silenciosamente el offset.
**Warning signs:** El título de la sub-sección aparece parcialmente oculto detrás del header tras hacer clic en un ítem del mega-panel.

### Pitfall 5: Duplicar el `<header className="site-header">` en vez de extender el existente
**What goes wrong:** Crear un segundo `<header>`/componente para el nav de escritorio, dejando el de `menu-overlay.tsx` solo para móvil, rompe `useHeaderScrollState` (que hace `toggleClass` sobre el selector `.site-header` — si hay dos elementos con esa clase, ambos reciben `.is-scrolled`, pero solo uno de los dos, dependiendo de breakpoint, es el visible/correcto) y rompe `InertBoundary` (que envuelve `<MenuOverlay />` completo para el gate de `inert` cuando el drawer está abierto — un segundo header fuera de ese wrapper no heredaría el `inert` automáticamente).
**Why it happens:** Tentación de "separar" desktop/mobile en componentes distintos por claridad.
**How to avoid:** Un solo `<header className="site-header">` dentro de `menu-overlay.tsx`, con el `<nav>` horizontal y el botón "Menú" ambos presentes en el markup, visibilidad resuelta 100% por CSS (`@media(pointer:fine)`). Esto es exactamente lo que CONTEXT.md pide: "el componente y sus hooks... se conservan intactos para el breakpoint móvil".

## Code Examples

### Reutilización del gate de "puntero preciso" ya existente (JS)
```ts
// Source: components/custom-cursor.tsx (patrón ya en el codebase, verbatim)
const supportsPointer = window.matchMedia("(pointer: fine)").matches
```
Nota: para el nav-hover en sí, **no hace falta** replicar esto en JS — es puramente un gate de CSS (`@media(pointer:fine)`). Solo sería necesario en JS si se necesitara, por ejemplo, evitar registrar los listeners de `onMouseEnter`/`onMouseLeave` en dispositivos táctiles (optimización menor, no crítica dado que esos listeners son inertes si el elemento está `display:none`).

### Reutilización del patrón de cierre con Escape (ya existente)
```tsx
// Source: components/menu-overlay.tsx líneas 20-32 (patrón verbatim a replicar para el mega-panel)
useEffect(() => {
  if (!menuOpen) return
  firstLinkRef.current?.focus()
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return
    setMenuOpen(false)
    toggleRef.current?.focus()
  }
  window.addEventListener("keydown", closeOnEscape)
  return () => window.removeEventListener("keydown", closeOnEscape)
}, [menuOpen])
```

### Fuente de datos por mega-panel (sin inventar copy nuevo)
```ts
// lib/site-content.ts ya expone todo lo necesario:
import { services } from "@/lib/site-content"   // Capacidades → 5 ítems (services[].title → #capacidades)
import { projects } from "@/lib/site-content"   // Proyectos   → 3 ítems (projects[].name → #proyectos)
import { equipment } from "@/lib/site-content"  // Tecnología  → 2 ítems (equipment[].caption → #tecnologia)
// Nosotros → 4 ítems fijos (Historia, Equipo, Valores, Sectores) apuntando a
// anchors internos de brand-section.tsx (ver Pitfall 3) — no hay array existente
// para esto en site-content.ts, se declaran inline en menu-overlay.tsx
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Botón "Menú" + overlay fullscreen en todos los breakpoints | Nav horizontal siempre visible + mega-menú hover en desktop, overlay conservado solo en touch/imprecise pointer | Este quick task | Cambia el patrón de descubribilidad de contenido en desktop, sin tocar el mecanismo móvil ya probado |
| `.site-header` con texto oscuro fijo, sin variante transparente | Header con dos estados de color (blanco transparente → oscuro sólido), toggle ya soportado por `useHeaderScrollState` | Este quick task | Requiere el scrim propio del header (Pitfall 1); no afecta el hook de scroll en sí |

**Deprecated/outdated:** Ninguno — no se retira ninguna pieza de infraestructura, solo se extiende visualmente.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | El scrim actual de `.hero-shade` es insuficiente para AA con texto blanco sin verificación por herramienta (axe/WebAIM) contra un frame real del video | Pitfall 1 | Si el scrim SÍ alcanza AA en la práctica, el planner añadiría un scrim de header innecesario (sobre-oscurecimiento visual); mitigar con una verificación manual explícita como task, no asumir el resultado |
| A2 | 200-300ms es el rango de delay recomendado para el cierre del mega-panel | Pattern 1 / Pitfall 2 | Es un rango ampliamente citado en la industria (no un valor WCAG normativo) — un valor fuera de ese rango no rompe 1.4.13 en sí, solo afecta percepción de "snappy" vs "pegajoso"; el planner puede ajustar sin repetir research |
| A3 | El contenido del mega-panel de "Tecnología" se puebla desde el array `equipment` (2 ítems) | Code Examples | CONTEXT.md solo dice "referencia a Equipo técnico / carrusel (#tecnologia)" sin especificar la fuente exacta — si el usuario prefiere un contenido distinto (p.ej. specs RTK/LiDAR/45MP ya visibles en la sección), el planner debe confirmarlo en discuss-phase antes de fijarlo como dato |

## Open Questions

1. **¿Los mega-panels deben ser un panel único de ancho completo (como las capturas de Fugro compartidas) o un dropdown acotado al ancho del ítem?**
   - What we know: CONTEXT.md no especifica; delega "estructura exacta del markup" a discreción de Claude.
   - What's unclear: Fugro usa paneles de ancho completo con multi-columna; con solo 2-5 ítems por sub-menú aquí, un dropdown angosto podría ser visualmente más proporcionado.
   - Recommendation: El planner puede decidir en la fase de planning; ambas opciones son CSS-only y no cambian el patrón de accesibilidad (Pattern 1) ni el data flow.

2. **¿Se debe declarar `scroll-margin-top` de forma global (todas las secciones) o solo en los nuevos sub-anchors?**
   - What we know: Los anchors de nivel superior ya "funcionan" gracias al padding de `.section-pad`.
   - What's unclear: Si el header cambia de altura entre estados (transparente vs scrolled) o breakpoints, un valor fijo de `scroll-margin-top` podría quedar ligeramente desalineado en algún caso extremo.
   - Recommendation: Aplicar `scroll-margin-top` explícito al menos en los sub-anchors nuevos (obligatorio, Pitfall 4); extenderlo a los anchors existentes es una mejora de robustez opcional, no bloqueante.

## Validation Architecture

> `nyquist_validation: true` en `.planning/config.json`, pero el proyecto declara explícitamente "Tests automatizados (unit/E2E) — fuera de alcance" en `PROJECT.md` Out of Scope, y no existe ningún framework de test instalado (`package.json` no tiene `jest`/`vitest`/`playwright`, no hay archivos `*.config.*` de test en el repo).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Ninguno instalado — fuera de alcance del proyecto (decisión documentada) |
| Config file | — |
| Quick run command | — |
| Full suite command | — |

### Verificación manual recomendada (sustituye a comandos automatizados)
| Comportamiento | Cómo verificar |
|---|---|
| Header transparente sobre hero con texto blanco legible | Inspección visual + contraste con axe DevTools/WebAIM contra el hero real, en los breakpoints ≥1000px |
| Header pasa a blanco sólido al hacer scroll >80px | Scroll manual en navegador, confirmar `.is-scrolled` se aplica (ya cubierto por HEAD-01, no debería regresar) |
| Mega-panel se abre por hover y por Tab (teclado) | Navegación manual con mouse Y con Tab/Shift+Tab únicamente, sin mouse |
| Mega-panel no se cierra al mover el puntero hacia el panel | Mover el mouse en diagonal lenta desde el link hacia el panel |
| Escape cierra el panel y devuelve foco al trigger | Abrir con Tab, presionar Escape, confirmar foco visible en el trigger |
| Overlay móvil intacto | Reducir viewport / emular touch (`pointer:coarse`), confirmar que aparece el botón "Menú" y el overlay fullscreen de siempre, sin nav horizontal visible |
| Exclusión mutua con el drawer de servicios | Abrir el drawer de un servicio, confirmar que el header (incluido el nav nuevo) queda `inert` (ya cubierto por `InertBoundary`, no debería regresar) |
| Anclas de sub-ítems de Nosotros no quedan tapadas por el header | Clic en cada sub-ítem del mega-panel de Nosotros, confirmar que el título de destino es completamente visible bajo el header |

### Wave 0 Gaps
- Ninguno — no hay infraestructura de test que instalar; la verificación es 100% manual por decisión de alcance ya documentada del proyecto.

## Security Domain

> `security_enforcement: true` (ASVS level 1) en `.planning/config.json`.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | El sitio no tiene login |
| V3 Session Management | No | No aplica |
| V4 Access Control | No | Contenido público, sin roles |
| V5 Input Validation | No | El header no introduce ningún input nuevo (solo `<a>` de navegación) |
| V6 Cryptography | No | No aplica |

Esta tarea es puramente presentacional/navegación (enlaces `href="#..."` estáticos derivados de datos ya confiables en `lib/site-content.ts`) — no introduce superficie de ataque nueva. No se identifican patrones de amenaza STRIDE relevantes más allá de los ya cubiertos por el proyecto (formulario de contacto, fuera del alcance de este header).

## Sources

### Primary (HIGH confidence — verificado directamente en el codebase)
- `hooks/use-header-scroll-state.ts` — mecanismo scroll-reactive existente, no modificar
- `hooks/use-overlay-coordination.ts`, `hooks/use-scroll-lock.ts` — coordinación de overlays existente
- `components/custom-cursor.tsx` — patrón `matchMedia("(pointer: fine)")` a reutilizar
- `components/service-drawer.tsx` — patrón de timer de cierre + `lenis.scrollTo` tras cerrar overlay
- `components/inert-boundary.tsx` — confirma que el header ya hereda `inert` cuando el drawer está abierto
- `app/globals.css` (líneas 20-22, 25-26) — reglas actuales de `.site-header`/`.menu-overlay`/`.hero-shade`
- `node_modules/lenis/dist/lenis.mjs` (líneas 540-558, 755-780) — [VERIFIED] confirma que `anchors:true` intercepta clicks de `<a href="#...">` y que `scrollTo()` respeta `scroll-margin-top` vía `getComputedStyle`
- `.planning/phases/01-.../01-UI-SPEC.md` — tokens de color/motion lockeados (THEME-01–04), restricciones "no scrub", "no mix-blend-mode", motion tokens

### Secondary (MEDIUM confidence — WebSearch con fuentes oficiales/reconocidas)
- [Exploring WCAG 2.1 — 1.4.13 Content on Hover or Focus (Knowbility)](https://knowbility.github.io/knowbility-website/blog/2018/WCAG21-1413ContentHoverFocus/) — definición de Dismissible/Hoverable/Persistent
- [1.4.13 Content on Hover or Focus (Deque University)](https://dequeuniversity.com/resources/wcag2.1/1.4.13-content-on-hover-or-focus)
- [User-Friendly Mega-Dropdowns: When Hover Menus Fail (Smashing Magazine)](https://www.smashingmagazine.com/2021/05/frustrating-design-patterns-mega-dropdown-hover-menus/) — problema del "gap" y necesidad de delay
- [Accessible Mega Menu (Adobe)](https://adobe-accessibility.github.io/Accessible-Mega-Menu/) y [AllThingsSmitty/accessible-mega-menu (GitHub)](https://github.com/AllThingsSmitty/accessible-mega-menu) — implementaciones de referencia del patrón `:focus-within` + teclado
- [Accessible Navigation Menus: Best Practices Guide (Level Access)](https://www.levelaccess.com/blog/accessible-navigation-menus-pitfalls-and-best-practices/)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — cero dependencias nuevas, todo verificado leyendo el código instalado
- Architecture: HIGH — mecanismos de scroll/overlay ya existentes y verificados en el codebase, no se reinterpretan
- Accesibilidad (WCAG 1.4.13): HIGH — patrón confirmado por múltiples fuentes oficiales/reconocidas (Deque, Adobe, W3C-adjacent)
- Contraste del scrim del header: MEDIUM — la necesidad de un scrim adicional es una inferencia razonada (no medida con herramienta real todavía), marcada como Assumption A1

**Research date:** 2026-07-20
**Valid until:** Sin fecha de caducidad relevante — no depende de versiones de librerías externas que puedan cambiar; válido mientras `menu-overlay.tsx`/`app/globals.css`/`lib/site-content.ts` no se reestructuren de forma mayor.
