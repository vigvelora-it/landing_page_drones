# Rediseñar mega-panel del header a estilo Fugro (full-width + backdrop + 3 columnas) - Research

**Researched:** 2026-07-21
**Domain:** CSS positioning/stacking-context (mega-panel full-width + scrim) sobre un mecanismo de apertura/cierre React ya existente — sin librerías nuevas
**Confidence:** HIGH

## Summary

El componente actual (`components/menu-overlay.tsx` + `.mega-panel`/`.nav-item` en `app/globals.css`) ya resuelve por completo el mecanismo de apertura/cierre (hover con delay de 250ms, foco de teclado, Escape con retorno de foco al trigger exacto vía `triggerRefs`) — nada de eso se toca. El único cambio real es de **posicionamiento CSS y de composición JSX/datos**: el `.mega-panel` hoy es `position:absolute` dentro de `.nav-item{position:relative}`, así que se ancla al ítem. La forma más simple y robusta de hacerlo "ancho completo, debajo de todo el header" **sin JavaScript ni medición de altura** es quitar `position:relative` de `.nav-item` (no lo usa ninguna otra regla) para que el `.mega-panel` — que sigue viviendo exactamente en el mismo lugar del DOM, dentro del `<li>`, así que el hover/mouseleave existente sigue funcionando idéntico — resuelva su containing block contra `.site-header` (que ya es `position:fixed`, el único ancestro con `position` distinto de `static`). Con `top:100%;left:0;width:100%` el panel queda pegado exactamente al borde inferior del header, a todo lo ancho del viewport, sin calcular ningún alto en píxeles.

Para el backdrop: como `.site-header` tiene `z-index:500` y ya existe el precedente `.menu-overlay{z-index:400}` como hermano de `<header>` en el mismo fragment, el backdrop puede ser un `<div>` hermano adicional con `position:fixed;inset:0` y un z-index intermedio (p.ej. `450`, entre el contenido normal de página y el header). **No hace falta ningún `pointer-events` especial para "no tapar el header"**: al tener el header un z-index mayor y cubrir físicamente toda la franja superior (100% de ancho), el hit-testing del navegador entrega los eventos de puntero al elemento pintado más arriba en esa coordenada — el header — automáticamente, sin importar que el backdrop técnicamente se extienda por debajo de él (`inset:0` completo). Esto es el mismo principio que ya usa el proyecto con `.menu-overlay`/`.site-header` coexistiendo sin conflicto.

El clic-fuera-cierra reutiliza el patrón exacto de `service-drawer.tsx` (comparar `event.target === backdropElement`, o más simple aún: el propio backdrop es el único target posible ya que no tiene hijos) — pero como el usuario indicó explícitamente que un clic no necesita el delay de 250ms diseñado para hover accidental, el handler del backdrop debe llamar `clearTimeout(closeTimerRef.current); setOpenKey(null)` directo, sin pasar por `scheduleClose()`.

**Primary recommendation:** (1) Quitar `position:relative` de `.nav-item`; (2) cambiar `.mega-panel` a `position:absolute;top:100%;left:0;width:100%` (contenedor de posicionamiento pasa a ser `.site-header`, sin JS ni CSS var de altura); (3) añadir un nuevo `<div className="mega-panel-backdrop" data-open={openKey !== null || undefined} onClick={closeNow} />` como hermano de `<header>`, con `position:fixed;inset:0;z-index:450` y scrim `color-mix()` igual patrón que `.hero-shade`/`dialog.service-drawer::backdrop`; (4) reestructurar el contenido interno de `.mega-panel` a CSS grid de 3 columnas (título+descripción+link / lista / imagen), extendiendo `NavItem`/`NavPanelItem` con `description` e `image` por ítem, usando el patrón `<Image fill sizes="...">` dentro de un frame `aspect-ratio` ya establecido en el proyecto (`.sector-card__frame`, `.media-frame`).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Posicionamiento full-width del panel | Browser/Client (CSS containing-block trick) | — | Puramente presentacional; se resuelve con la cascada de `position`, cero JS nuevo |
| Backdrop/scrim | Browser/Client (CSS `position:fixed` + `color-mix()`) | React (estado `openKey` ya existente) | El "abierto/cerrado" ya vive en React; el backdrop solo lee ese estado agregado (`openKey !== null`), no introduce estado nuevo |
| Clic-fuera-cierra | Browser/Client (`onClick` en el backdrop) | React (mismo `setOpenKey`) | Mismo store de estado que ya gobierna hover/Escape — no se duplica lógica |
| Contenido de las 3 columnas | Datos estáticos (`lib/site-content.ts` + literales ya existentes en componentes) | Browser/Client (render) | CONTEXT.md ya fija las 4 fuentes de texto y las 4 imágenes verbatim — cero copy nuevo, cero fetch |
| Imagen destacada (columna 3) | Browser/Client (`next/image` con `fill`+`sizes`) | CDN/Static (`public/IMAGENES_PAGINA_WEB/`) | Mismo patrón ya usado en `brand-section.tsx`/`equipment-carousel.tsx`, assets locales ya en `public/` |

## Standard Stack

Ningún paquete nuevo — cero dependencias añadidas.

| Herramienta | Versión instalada | Uso en esta tarea |
|---|---|---|
| React 19.2.7 | ya instalado | Reutiliza el mismo `openKey`/`closeTimerRef` de `menu-overlay.tsx`; solo se añade una lectura derivada (`openKey !== null`) para el backdrop |
| Next.js 16.2.10 (`next/image`) | ya instalado | Imagen de la columna 3, patrón `fill` + `sizes` ya usado 2 veces en el proyecto (`brand-section.tsx`) |
| CSS vanilla | — | `position` containing-block trick, CSS Grid 3 columnas, `color-mix()`, `-webkit-line-clamp` (nuevo en este proyecto pero soporte universal en navegadores modernos — Chrome/Edge/Firefox/Safari todos lo soportan sin prefijo alternativo necesario desde hace años) |

**No aplica Package Legitimacy Audit** — no se instala ningún paquete.

## Architecture Patterns

### Diagrama de posicionamiento (containing-block trick)

```
<header class="site-header" style="position:fixed;z-index:500">     ← único ancestro con position≠static
  <nav class="site-nav">
    <ul>
      <li class="nav-item" data-open={openKey==="nosotros"}>        ← YA NO tiene position:relative
        <a href="#nosotros" onMouseEnter/onFocus/...>Nosotros</a>
        <div class="mega-panel">                                    ← position:absolute
          │  top:100%   → resuelto contra el BORDE INFERIOR de .site-header (no del <li>)
          │  left:0     → resuelto contra el borde izquierdo de .site-header (=0 del viewport,
          │               ya que site-header tiene width:100% y border:0 → padding-box=border-box)
          │  width:100% → mismo ancho que .site-header = 100vw efectivo
          ├─ col-1: título + descripción (line-clamp) + <a href="#nosotros">Ver overview</a>
          ├─ col-2: <ul> de sub-enlaces (contenido sin cambios, solo el contenedor)
          └─ col-3: <Image fill sizes="..."> dentro de frame aspect-ratio
        </div>
      </li>
      ... (Capacidades, Tecnología, Proyectos = mismo patrón; Proceso/Contacto sin panel)
    </ul>
  </nav>
</header>

<div class="mega-panel-backdrop"                                    ← HERMANO de <header>, no descendiente
     data-open={openKey !== null}
     onClick={() => { clearTimeout(closeTimerRef.current); setOpenKey(null) }}
     style="position:fixed;inset:0;z-index:450">                    ← 450 < 500(header) y > z-index de secciones (≤3)
</div>
```

**Por qué no hace falta medir el alto del header en JS:** al eliminar `position:relative` de `.nav-item`, el buscador de "containing block" para `position:absolute` sube por el árbol DOM y encuentra `.site-header` (el primer ancestro con `position` distinto de `static`). `top:100%` se resuelve entonces contra la altura REAL renderizada del header en cada momento (aunque cambie levemente por padding, no cambia porque `.is-scrolled` solo cambia `background`/`color`/`box-shadow`, nunca `padding`) — sin CSS var, sin `ResizeObserver`, sin `getBoundingClientRect()`.

**Por qué no hace falta `pointer-events` especial en el backdrop:** el backdrop y el header son ambos `position:fixed` y compiten por la misma región de pantalla en la franja superior. El navegador entrega los eventos de puntero al elemento con mayor z-index pintado en esa coordenada — `.site-header` (500) siempre gana sobre `.mega-panel-backdrop` (450) en la franja que el header cubre físicamente. El backdrop solo "captura" clics en la región de página que el header NO cubre (todo lo que está debajo de la franja del header), que es exactamente el efecto deseado.

### Recommended Project Structure

Sin archivos nuevos:

```
components/
├── menu-overlay.tsx    # extender: NavItem gana `description`/`image`; JSX del .mega-panel
│                        # pasa a 3 columnas; nuevo <div className="mega-panel-backdrop">
│                        # como hermano de <header> (mismo fragment ya existente)
app/
├── globals.css          # .nav-item pierde position:relative; .mega-panel cambia position
│                        # a full-width; nuevas reglas .mega-panel-grid/-intro/-links/-visual;
│                        # nueva regla .mega-panel-backdrop
```

### Pattern 1: Full-width panel sin JS (containing-block trick)

**What:** Quitar `position:relative` de `.nav-item`, dejar que `.mega-panel` resuelva su posición contra `.site-header`.
**When to use:** Los 4 ítems con panel (Nosotros, Capacidades, Tecnología, Proyectos) — Proceso/Contacto no tienen `.mega-panel`, no se ven afectados.
**Example:**
```css
/* app/globals.css — reemplaza la regla actual de .nav-item y .mega-panel */
.nav-item{display:flex;align-items:center} /* sin position:relative */
.mega-panel{
  position:absolute;top:100%;left:0;width:100%;
  visibility:hidden;opacity:0;pointer-events:none;
  background:var(--bg-surface);color:var(--ink-primary);
  border-top:1px solid var(--border-subtle);
  box-shadow:0 24px 48px color-mix(in srgb,var(--ink-primary) 10%,transparent);
  transition:opacity var(--motion-duration-fast) var(--ease-moderate);
}
.nav-item[data-open] .mega-panel{visibility:visible;opacity:1;pointer-events:auto}
```

### Pattern 2: Backdrop reutilizando `color-mix()` (mismo patrón que `.hero-shade`/`dialog.service-drawer::backdrop`)

**What:** Un `<div>` hermano de `<header>`, visible solo cuando algún panel está abierto.
**When to use:** Se muestra mientras `openKey !== null` (cualquiera de los 4 ítems), se oculta al cerrar por hover-out/Escape/click.
**Example:**
```tsx
// components/menu-overlay.tsx — añadir como hermano de <header>, dentro del mismo <> ... </>
<div
  className="mega-panel-backdrop"
  data-open={openKey !== null || undefined}
  aria-hidden="true"
  onClick={() => {
    clearTimeout(closeTimerRef.current)
    setOpenKey(null)
  }}
/>
```
```css
/* Source: mismo patrón que dialog.service-drawer::backdrop (color-mix + opacity transition) */
.mega-panel-backdrop{
  position:fixed;inset:0;z-index:450;
  background:color-mix(in srgb,var(--ink-primary) 45%,transparent);
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity var(--motion-duration-fast) linear,visibility 0s var(--motion-duration-fast);
}
.mega-panel-backdrop[data-open]{
  opacity:1;visibility:visible;pointer-events:auto;
  transition:opacity var(--motion-duration-fast) linear,visibility 0s;
}
```
**Nota de z-index:** `.mega-panel-backdrop{z-index:450}` queda entre `.site-header{z-index:500}` y el resto del contenido de página (`.equipment-showcase{z-index:3}` y similares) — visible por encima del contenido normal, oculto por debajo del header. No colisiona con `.menu-overlay{z-index:400}` porque ambos nunca están abiertos a la vez (el nav horizontal con mega-panels solo existe bajo `@media(pointer:fine)`, mismo breakpoint donde `.menu-overlay` ya está `display:none`).

### Pattern 3: Grid de 3 columnas dentro del panel

**What:** `display:grid` con 3 columnas de proporción asimétrica (columna de texto más angosta, lista media, imagen más ancha o similar — ajustable), igual espíritu que `.statement-grid{grid-template-columns:minmax(0,1.7fr) minmax(260px,.75fr)}` ya usado en la sección "Perspectiva".
**Example:**
```css
.mega-panel-grid{
  display:grid;grid-template-columns:minmax(240px,.9fr) minmax(200px,.7fr) minmax(280px,1.1fr);
  gap:clamp(2rem,4vw,4rem);
  width:var(--shell);margin-inline:auto;
  padding:clamp(2rem,4vw,3.5rem) 0;
}
.mega-panel-intro p{
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
  color:var(--ink-secondary);font-size:.85rem;line-height:1.7;
}
.mega-panel-visual{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--bg-surface-deep)}
.mega-panel-visual img{object-fit:cover}
```
```tsx
// Source: patrón fill+sizes ya usado en components/sections/brand-section.tsx líneas 95-100
<div className="mega-panel-visual">
  <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 1000px) 100vw, 33vw" />
</div>
```

### Anti-Patterns to Avoid

- **Medir la altura del header en JS (`ResizeObserver`/`getBoundingClientRect`) para posicionar el panel:** innecesario — el containing-block trick (Pattern 1) resuelve `top:100%` de forma nativa y automática contra la altura real del header en todo momento, sin listener adicional.
- **`pointer-events:none` selectivo o recortes de `inset` en el backdrop para "no tapar el header":** innecesario — la diferencia de z-index entre header (500) y backdrop (450) ya resuelve el hit-testing correctamente (ver Pattern 2). Añadir lógica de recorte manual es una fuente de bugs de sincronización si el alto del header cambia.
- **Convertir el `.mega-panel` en `<dialog>` nativo (como `service-drawer.tsx`):** CONTEXT.md/el enunciado del focus lo descarta explícitamente — el `<dialog>` con `showModal()` entra en el "top layer" del navegador (por encima de TODO, incluyendo el propio `.site-header` con z-index:500), lo que rompería la interacción "mover el mouse a otro ítem del nav mientras el panel está abierto" (el nav quedaría visualmente debajo del panel/backdrop del dialog). El backdrop del mega-panel debe vivir en el stacking context normal (Pattern 2), no en el top layer.
- **Reintroducir `:focus-within` como regla de visibilidad del `.mega-panel`:** ya se identificó y corrigió como bug en 260720-vda (el panel quedaba visualmente abierto tras Escape porque el foco vuelve a un descendiente del propio `.nav-item`). La visibilidad debe depender EXCLUSIVAMENTE de `[data-open]` controlado por React — no tocar esta regla en el rediseño.
- **`width:100vw` en el `.mega-panel`/backdrop cuando ya existe `overflow-x:hidden` en `body`:** `100vw` incluye el ancho del scrollbar en navegadores de escritorio (Windows/algunos Linux), lo que puede causar un desbordamiento horizontal de unos ~15-17px más allá del viewport visible real, incluso con `overflow-x:hidden` en `body` (ese overflow-x SÍ recorta el desbordamiento visual, pero puede dejar una franja de fondo sin cubrir o causar jitter de layout en el primer render). Usar `width:100%`/`inset-inline:0` relativo al `.site-header` (que ya usa `width:100%`, no `100vw`, en su propia regla) es más seguro y consistente con el patrón ya establecido en el proyecto (el propio `.site-header` nunca usa `100vw`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Backdrop/scrim oscurecido | Un overlay con opacidad fija sin variables de marca | `color-mix(in srgb,var(--ink-primary) 45%,transparent)` — mismo valor exacto que `dialog.service-drawer::backdrop` (línea 133 de `globals.css`) | Consistencia visual entre los dos overlays del sitio (drawer de servicio y mega-panel); reutilizar el valor ya calibrado evita introducir una segunda "cantidad de oscurecimiento" no verificada |
| Clic-fuera-cierra | Listener global de `document.addEventListener("click", ...)` con comprobación de `contains()` | `onClick` directo en el propio elemento backdrop (mismo patrón que `dialog.service-drawer`'s `onClick` comparando `event.target === dialogRef.current`) | El backdrop ya es un elemento dedicado que solo existe cuando el panel está abierto; un listener global duplicaría lógica y complicaría el cleanup en `useEffect` |
| Posicionamiento full-width | Medir/observar el ancho de viewport en JS y setear `style.width` inline | El containing-block trick (Pattern 1) — CSS puro | Cero JS adicional, cero riesgo de layout thrash o de desincronización en resize |

**Key insight:** todo lo necesario para este rediseño ya existe en el proyecto como precedente directo — el scrim `color-mix()` (drawer de servicio y `.hero-shade`), el patrón `<Image fill sizes>` (brand-section), el patrón de frame `aspect-ratio` (`.sector-card__frame`/`.media-frame`), y el propio mecanismo de apertura/cierre del panel. El trabajo es 100% composición de patrones ya probados, no invención de ninguno nuevo.

## Common Pitfalls

### Pitfall 1: Quitar `position:relative` de `.nav-item` rompe algo no obvio
**What goes wrong:** Si algún otro elemento dentro de `.nav-item` dependiera implícitamente de ese contexto de posicionamiento (por ejemplo, un futuro badge/indicador con `position:absolute`), se movería inesperadamente a anclar contra `.site-header` en vez de contra el `<li>`.
**Why it happens:** `position:relative` en un contenedor "de paso" es una técnica común para aislar hijos posicionados; removerla cambia la cascada de containing-block para TODOS los descendientes con `position:absolute`, no solo `.mega-panel`.
**How to avoid:** Confirmado por grep en `app/globals.css` que la única regla que depende de `.nav-item{position:relative}` es la propia `.mega-panel` — es seguro quitarla. Si en el futuro se añade otro elemento absolutamente posicionado dentro de `.nav-item` (p.ej. un badge "Nuevo"), habrá que envolverlo en su propio wrapper con `position:relative` local.
**Warning signs:** Cualquier elemento decorativo dentro del `<li>` que antes se veía "pegado" al ítem y ahora aparece estirado a todo el ancho del header.

### Pitfall 2: `left:0;width:100%` en `.mega-panel` asume que `.site-header` no tiene `transform`/`filter`
**What goes wrong:** Si en algún momento se añade una animación de entrada al header usando `transform` (p.ej. un slide-in), eso cambiaría el comportamiento de containing-block para descendientes `position:fixed` (no para `position:absolute`, que no se ve afectado por `transform` del ancestro en el mismo sentido) — no es un riesgo inmediato con `position:absolute`, pero sí sería un riesgo si en el futuro el panel pasara a `position:fixed`.
**Why it happens:** `position:absolute` siempre resuelve contra el ancestro posicionado más cercano sin importar `transform`; `position:fixed` en cambio SÍ se ve capturado por cualquier ancestro con `transform`/`filter`/`will-change:transform`/`contain:paint`. Como esta investigación recomienda `position:absolute` (no `fixed`) para el panel, este pitfall no aplica hoy, pero es relevante documentarlo por si el planner considera `position:fixed` como alternativa.
**How to avoid:** Mantener `position:absolute` para `.mega-panel` (Pattern 1) — no hay necesidad real de `position:fixed` aquí, ya que el panel siempre vive dentro de `.site-header`, que a su vez ya es `position:fixed` y se mueve con el viewport como una unidad.
**Warning signs:** El panel se "despega" visualmente del header o queda en una posición incorrecta tras cualquier futura animación del header.

### Pitfall 3: El backdrop cubre visualmente secciones con su propio `z-index` local alto
**What goes wrong:** Algunas secciones ya usan z-index locales bajos (`.equipment-showcase{z-index:3}`, `.hero-orbit{z-index:3}`, `.hero-index{z-index:4}`, `.hero-shade{z-index:1}`) — todos muy por debajo de 450, así que el backdrop (450) los cubre correctamente sin excepciones. Verificar con un grep de `z-index` en `globals.css` antes de fijar el valor 450 por si aparece algún elemento de página con z-index ≥450 no documentado aquí.
**Why it happens:** El z-index del backdrop se decide en aislamiento sin revisar todos los z-index existentes del proyecto.
**How to avoid:** El grep ya realizado en esta investigación (`z-index` en `app/globals.css`) confirma que el valor máximo fuera de `.site-header`(500)/`.menu-overlay`(400)/`.intro`(10000, solo durante la carga inicial) es 4 (`.hero-index`) — 450 es seguro.
**Warning signs:** Alguna sección de la página queda visible "por encima" del scrim oscuro cuando el mega-panel está abierto.

### Pitfall 4: `-webkit-line-clamp` sin fallback si el texto es más corto que 3 líneas
**What goes wrong:** No es realmente un riesgo (line-clamp simplemente no trunca si el contenido cabe), pero conviene no asumir que TODOS los textos de columna 1 necesitan el clamp — CONTEXT.md especifica que solo "Nosotros" y "Proyectos" (los párrafos más largos, `brandStory.about`/`differentiation.message`) lo necesitan; "Capacidades"/"Tecnología" ya tienen el largo correcto sin truncar.
**Why it happens:** Aplicar `-webkit-line-clamp:3` de forma global a `.mega-panel-intro p` es inofensivo (no trunca textos cortos), así que es seguro aplicarlo uniformemente a los 4 ítems sin lógica condicional — CONTEXT.md ya lo anticipa ("truncar visualmente igual que Nosotros si excede ~3 líneas").
**How to avoid:** Aplicar `-webkit-line-clamp:3` a la clase compartida `.mega-panel-intro p` para los 4 ítems por igual; no se necesita una clase condicional por ítem.
**Warning signs:** Ninguno esperado — este es un no-issue si se aplica la clase compartida.

## Runtime State Inventory

No aplica — esta tarea no es un rename/refactor/migración de datos persistentes. Es un cambio de layout visual + extensión de un array de datos ya en memoria (`navItems` en `menu-overlay.tsx`). No hay bases de datos, servicios externos, tareas de SO, secretos ni artefactos de build involucrados.

## Common Pitfalls (continuación) — Accesibilidad del backdrop

### Pitfall 5: `aria-hidden="true"` en el backdrop podría interferir con lectores de pantalla si captura foco
**What goes wrong:** El backdrop es un `<div>` sin `tabindex`, así que nunca recibe foco de teclado — `aria-hidden="true"` es seguro y correcto (es un elemento puramente decorativo/de interacción de mouse, el cierre por teclado ya lo cubre Escape, no el backdrop).
**Why it happens:** N/A — mitigado por diseño (elemento no enfocable).
**How to avoid:** No añadir `tabindex` ni `role` al backdrop; mantenerlo como `<div aria-hidden="true">` puramente decorativo/de clic.
**Warning signs:** Si algún linter de accesibilidad marca el backdrop, confirmar que no tiene `tabindex`/`role="button"` que contradiga `aria-hidden`.

## Code Examples

### Extensión de `NavItem` con `description`/`image` (sin cambiar la lógica de apertura/cierre)
```tsx
// components/menu-overlay.tsx — shape extendido, valores exactos ya fijados en CONTEXT.md
interface NavItem {
  key: string
  label: string
  href: string
  description?: string
  image?: { src: string; alt: string }
  panel?: NavPanelItem[]
}

const navItems: NavItem[] = [
  {
    key: "nosotros",
    label: "Nosotros",
    href: "#nosotros",
    description: brandStory.about, // truncado visualmente vía CSS, no reescrito
    image: { src: "/IMAGENES_PAGINA_WEB/geologo-campo-roca.jpg", alt: "..." },
    panel: [/* sin cambios */],
  },
  // Capacidades / Tecnología / Proyectos: mismo shape, fuentes ya fijadas en CONTEXT.md
]
```

### JSX de la columna 1 (título + descripción + "Ver overview")
```tsx
<div className="mega-panel-intro">
  <p className="mono-label">{item.label}</p>
  {item.description && <p>{item.description}</p>}
  <a href={item.href} onClick={() => setOpenKey(null)}>Ver overview</a>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `.mega-panel` `position:absolute` anclado a `.nav-item{position:relative}`, `min-width:240px`, 1 columna de enlaces | `.mega-panel` `position:absolute` anclado a `.site-header{position:fixed}` (tras quitar `position:relative` del `.nav-item`), `width:100%`, 3 columnas | Este quick task | Cambia el containing-block del panel sin tocar el DOM nesting ni los handlers de React — el mecanismo hover/foco/Escape es indiferente a este cambio |
| Sin backdrop | `.mega-panel-backdrop` nuevo, hermano de `<header>`, z-index 450 | Este quick task | Nueva capa visual; reutiliza `color-mix()` ya calibrado en el proyecto, no introduce una nueva técnica de scrim |

**Deprecated/outdated:** Ninguno — no se retira infraestructura, solo se reposiciona/extiende.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | `z-index:450` para el backdrop es un valor seguro (entre 400 de `.menu-overlay` y 500 de `.site-header`, por encima de todos los z-index de contenido de página verificados ≤4) | Pattern 2 / Pitfall 3 | Si el planner detecta algún z-index de página no cubierto por este grep (poco probable, ya verificado), el backdrop podría quedar detrás de algún elemento — mitigar re-verificando `grep z-index app/globals.css` antes de fijar la regla en el plan |
| A2 | El `padding` horizontal de `.site-header` (2rem) no desplaza el `left:0` del `.mega-panel` porque `box-sizing:border-box` + `border:0` hacen que la padding-box coincida con la border-box (ancho total = 100%) | Pattern 1 | Verificado por razonamiento del modelo de caja CSS estándar, no por captura visual real — si el planner detecta un gap de 2rem en el borde izquierdo del panel tras implementar, la corrección es trivial (`left:calc(-1 * ...)` o mover el padding del header a un wrapper interno), no invalida el resto del enfoque |

**Verificación recomendada antes de fijar el plan:** confirmar visualmente en un build local que el panel efectivamente queda a `left:0` exacto tras el cambio — es una verificación de 1 minuto (DevTools) que despeja A2 sin necesidad de research adicional.

## Open Questions

1. **¿El backdrop debe animar su aparición con el mismo `--motion-duration-fast` que el panel, o puede ser instantáneo?**
   - What we know: `dialog.service-drawer::backdrop` usa `opacity` transition con `var(--motion-duration-fast) linear`.
   - What's unclear: CONTEXT.md deja la opacidad exacta a discreción de Claude, pero no menciona explícitamente el timing de la transición del backdrop del mega-panel.
   - Recommendation: Reutilizar `var(--motion-duration-fast)` (200ms) igual que `dialog.service-drawer::backdrop` — mismo patrón, sin research adicional necesario.

2. **¿La columna 3 (imagen) necesita el mismo `<Image>` para los 4 ítems o alguno podría usar `<img>` plano si el asset es muy pequeño?**
   - What we know: Todos los assets referenciados en CONTEXT.md (`geologo-campo-roca.jpg`, `dron.png`, `topografia-con-drones.jpg`) ya están en `public/IMAGENES_PAGINA_WEB/` y son fotos reales de tamaño considerable — candidatos naturales para `next/image` con optimización.
   - What's unclear: Nada realmente — es un caso claro.
   - Recommendation: Usar `next/image` con `fill`+`sizes` para los 4 ítems por consistencia (mismo patrón ya usado en `brand-section.tsx`), sin excepciones.

## Environment Availability

No aplica — no hay dependencias externas nuevas (herramientas, servicios, runtimes). El proyecto ya tiene Next.js/React/TypeScript instalados y funcionando; no se requiere ninguna herramienta adicional para esta tarea.

## Validation Architecture

> `nyquist_validation: true` en `.planning/config.json` (heredado), pero el proyecto declara explícitamente "Tests automatizados (unit/E2E) — fuera de alcance" (confirmado en 260720-vda-RESEARCH.md, sin cambios desde entonces — no hay `jest`/`vitest`/`playwright` instalado como dependencia, aunque sí existe `.playwright-cli/` como herramienta ad-hoc de verificación manual, no como suite de tests versionada).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Ninguno instalado como suite versionada — verificación manual (igual que 260720-vda) |
| Config file | — |
| Quick run command | — |
| Full suite command | — |

### Verificación manual recomendada
| Comportamiento | Cómo verificar |
|---|---|
| Panel ocupa 100% del ancho del viewport, sin gap lateral | Inspección visual + DevTools (confirmar `left:0` real, sin offset de 2rem — ver A2) |
| Panel aparece pegado al borde inferior del header completo, no del ítem | Hover en cada uno de los 4 ítems, confirmar que el panel siempre inicia en la misma altura Y, independiente de qué ítem está activo |
| Backdrop oscurece el resto de la página mientras el panel está abierto | Inspección visual — contenido bajo el header visiblemente atenuado |
| Backdrop NO bloquea el header/nav — se puede mover el mouse de un ítem a otro sin cierre accidental | Mover el mouse en línea recta horizontal entre 2 triggers del nav sin bajar al panel, confirmar que no hay parpadeo/cierre inesperado |
| Clic en el backdrop cierra el panel inmediatamente (sin esperar 250ms) | Abrir un panel, hacer clic en la zona oscurecida bajo el panel, confirmar cierre inmediato |
| Escape sigue cerrando y devolviendo foco al trigger (regresión de 260720-vda) | Abrir con Tab, Escape, confirmar cierre visual + foco en el trigger — el bug de `:focus-within` ya corregido no debe reaparecer |
| 3 columnas se ven correctamente en el ancho objetivo (≥1000px, `pointer:fine`) | Inspección visual en viewport de escritorio típico (1280px, 1440px, 1920px) |
| Imagen de columna 3 carga con `next/image` sin layout shift | DevTools Network + Performance, confirmar dimensiones reservadas por el frame `aspect-ratio` antes de que cargue la imagen |
| 0px de overflow horizontal (`overflow-x:hidden` en body ya existente) | Scroll horizontal manual / DevTools, confirmar `document.documentElement.scrollWidth === window.innerWidth` |

### Wave 0 Gaps
- Ninguno — no hay infraestructura de test que instalar; la verificación es 100% manual por decisión de alcance ya documentada del proyecto (heredada de 260720-vda).

## Security Domain

> `security_enforcement: true` (ASVS level 1), heredado del proyecto.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | Sin login |
| V3 Session Management | No | No aplica |
| V4 Access Control | No | Contenido público |
| V5 Input Validation | No | No se introduce ningún input nuevo — solo `<a>`/`<div onClick>` de navegación/cierre |
| V6 Cryptography | No | No aplica |

Tarea puramente presentacional (layout CSS + reorganización de datos estáticos ya confiables de `lib/site-content.ts`) — no introduce superficie de ataque nueva. Sin patrones STRIDE relevantes adicionales a los ya cubiertos por el proyecto.

## Sources

### Primary (HIGH confidence — verificado directamente en el codebase)
- `components/menu-overlay.tsx` — implementación actual completa (estado `openKey`, timers, Escape, `triggerRefs`)
- `app/globals.css` líneas 20-33 — `.site-header`/`.nav-item`/`.mega-panel`/`.menu-overlay`, z-index actuales, scrim `.hero-shade`
- `app/globals.css` líneas 130-155 — `dialog.service-drawer`/`::backdrop`, patrón de scrim con `color-mix()` ya calibrado
- `components/service-drawer.tsx` — patrón de clic-fuera-cierra (`event.target === dialogRef.current`) y `<dialog>` top-layer (confirmado como anti-patrón a NO replicar para el mega-panel)
- `components/sections/brand-section.tsx` líneas 95-100 — patrón `<Image fill sizes>` ya en uso
- `app/globals.css` líneas 60-61, 40 — `.sector-card__frame`/`.media-frame`, patrón de frame `aspect-ratio` para imágenes destacadas
- `lib/site-content.ts` líneas 214, 241-242, 369-370 — confirmado verbatim: `sectors[1].image` (geologo-campo-roca.jpg), `brandStory.about`, `differentiation.message`
- `components/sections/capabilities-section.tsx` línea 41, `components/equipment-carousel.tsx` línea 67 — confirmado verbatim los párrafos de Capacidades/Tecnología citados en CONTEXT.md
- `hooks/use-header-scroll-state.ts` — confirmado: `.is-scrolled` solo cambia `background`/`color`/`box-shadow`, nunca `padding` — el alto del header es estable entre estados
- `CLAUDE.md` — confirma `body{overflow-x:hidden}` como constraint ya activo del proyecto

### Secondary (MEDIUM confidence)
- Modelo de caja CSS estándar (padding-box vs border-box con `box-sizing:border-box`) para el razonamiento de A2 — conocimiento de especificación CSS ampliamente documentado, no verificado con captura visual real en este proyecto todavía (ver Assumptions Log)

## Metadata

**Confidence breakdown:**
- Positioning/containing-block trick: HIGH — verificado contra el CSS real del proyecto y el modelo de caja estándar de CSS
- Backdrop/z-index stacking: HIGH — verificado contra los z-index reales existentes en `globals.css` (grep exhaustivo)
- Contenido de las 3 columnas: HIGH — todas las fuentes de texto/imagen confirmadas verbatim en el codebase
- Accesibilidad del backdrop: MEDIUM — razonamiento estándar (elemento no enfocable, `aria-hidden` seguro), sin verificación con lector de pantalla real

**Research date:** 2026-07-21
**Valid until:** Sin fecha de caducidad relevante — no depende de versiones de librerías externas; válido mientras `menu-overlay.tsx`/`app/globals.css`/`lib/site-content.ts` no se reestructuren de forma mayor.
