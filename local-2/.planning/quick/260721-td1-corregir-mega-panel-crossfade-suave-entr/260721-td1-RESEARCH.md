# Quick Task 260721-td1: Corregir mega-panel (crossfade, Proceso/Contacto, imagen) - Research

**Researched:** 2026-07-21
**Domain:** React state/CSS transitions (panel único compartido) sobre un mecanismo de apertura/cierre ya existente — sin librerías nuevas
**Confidence:** HIGH

## Summary

El fix tiene 4 partes entrelazadas, todas resueltas con patrones ya presentes en el
proyecto (CSS vanilla + estado de React, cero dependencias nuevas): (1) mover el único
`<div className="mega-panel">` a **último hijo de `<header>`** (no fuera de `<header>`,
para conservar el truco de containing-block ya verificado en 260721-1nn sin medir alturas
en JS) con `data-open` puesto directamente en el propio panel; (2) desacoplar `openKey`
(qué trigger está activo, gobierna visibilidad del contenedor) de un nuevo
`displayedKey`/`isSwapping` (qué contenido se renderiza dentro), usando el evento
`transitionend` de `opacity` para completar el intercambio — esto da un fade-out real
seguido de fade-in real sin duplicar la duración en JS y respeta `prefers-reduced-motion`
automáticamente; (3) reemplazar los `id="submit-button"`/`id="form-status"` de
`ContactForm` por `useRef` (no se consultan desde ningún otro sitio — confirmado por
grep), eliminando de raíz el riesgo de HTML inválido sin necesidad de montaje condicional
ni `idPrefix`; (4) el guard de `onBlur` (`event.currentTarget.contains(relatedTarget)`)
que hoy vive en cada `<li>` **se rompe** al mover el panel fuera del `<li>` — debe migrar a
un wrapper que envuelva `<nav>` + el panel compartido.

**Primary recommendation:** un solo `.mega-panel` como último hijo de `<header>`, con
`data-open={openKey !== null || undefined}` en el panel mismo; contenido interno
gobernado por `displayedKey` (no por `openKey` directamente) sincronizado vía
`onTransitionEnd`; `ContactForm` migrado a `useRef` en vez de `id`+`querySelector`; guard
`onBlur`/`onFocus` de cierre movido a un `<div ref={navRegionRef}>` que envuelve `<nav>` y
el panel.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Posición/visibilidad del panel único | Browser/Client (CSS containing-block + `data-open`) | — | Igual patrón que 260721-1nn, solo cambia el selector (atributo en el propio nodo, no descendiente) |
| Qué contenido se muestra dentro del panel | React (estado `displayedKey`) | Browser/Client (CSS `opacity`/`transform` transition) | El contenido es datos de `navItems`; el estado de React decide QUÉ, CSS decide CÓMO se anima |
| Sincronización del swap fade-out→fade-in | Browser/Client (evento `transitionend`) | React (`setState` en el callback) | Evita hardcodear la duración en JS (ya vive en `--motion-duration-fast`); se adapta solo a `prefers-reduced-motion` |
| Formulario de Contacto embebido | React (`ContactForm` reutilizado tal cual) | Browser/Client (`useRef` en vez de `id`) | Mismo componente, mismo POST a `/api/contact`; el único cambio es cómo referencia sus propios nodos internamente |
| Cierre por foco (Tab fuera del nav+panel) | Browser/Client (`focusout`/`relatedTarget`) | React (`scheduleClose`) | Mismo mecanismo ya existente, solo cambia el elemento contenedor sobre el que se evalúa "sigue dentro" |

## Standard Stack

Ningún paquete nuevo. React 19.2.7 (`useRef`, `useState`, `useEffect` — ya en uso),
Next.js 16.2.10 (`next/image`, sin cambios de API), CSS vanilla (`transitionend`,
`prefers-reduced-motion` ya presente en `globals.css` línea 165). GSAP (`lib/gsap.ts`) está
disponible pero **no hace falta** — el crossfade se logra con `transition:opacity` +
`transitionend`, mismo nivel de control que ya usa `dialog.service-drawer` para su propio
fade.

**No aplica Package Legitimacy Audit** — no se instala ningún paquete.

## Architecture Patterns

### Patrón 1 — Panel único como último hijo de `<header>` (no fuera de `<header>`)

**Por qué no como hermano de `<header>`:** el containing-block trick verificado en
260721-1nn depende de que `.mega-panel` sea **descendiente** de `.site-header`
(`position:fixed`, único ancestro posicionado) para que `top:100%` resuelva contra la
altura real del header sin JS. Si el panel se mueve fuera de `<header>` (p.ej. junto al
`.mega-panel-backdrop`, que sí es hermano de `<header>`), habría que pasar a
`position:fixed` con un `top` en px medido — exactamente el anti-patrón que 260721-1nn ya
descartó explícitamente. **El panel debe quedar dentro de `<header>`**, fuera del
`<nav>`/`<ul>`/`<li>` (para no depender de un `openKey` específico por ítem), como último
hijo del `<header>`:

```tsx
// components/menu-overlay.tsx — estructura destino dentro de <header>
<header className="site-header">
  <a className="brand">...</a>
  <nav className="site-nav" aria-label="Navegación principal" ref={navRegionRef}
       onFocus={...} onBlur={...}>
    <ul>
      {navItems.map((item) => (
        <li key={item.key} className="nav-item" data-open={openKey === item.key || undefined}
            onMouseEnter={() => openPanel(item.key)} onMouseLeave={scheduleClose}>
          <a ref={...} href={item.href} aria-haspopup={Boolean(item.panel) || undefined}
             aria-expanded={item.panel ? openKey === item.key : undefined}
             aria-controls={item.panel ? "mega-panel-shared" : undefined}
             onFocus={() => item.panel && openPanel(item.key)}
             onClick={() => setOpenKey(null)}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>

  {/* ÚNICO panel, último hijo de <header> — SIEMPRE montado, visibilidad vía data-open en sí mismo */}
  <div className="mega-panel" id="mega-panel-shared" data-open={openKey !== null || undefined}>
    {activeItem && (
      <div className="mega-panel-grid" data-swapping={isSwapping || undefined}
           onTransitionEnd={handleContentTransitionEnd}>
        {/* contenido de activeItem: intro + links|process|form + imagen opcional */}
      </div>
    )}
  </div>

  <div className="header-center">...</div>
  <a className="nav-cta">...</a>
  <button className="menu-toggle">...</button>
</header>
```

**Nota clave:** `aria-controls` de los 6 triggers ahora apunta al MISMO id
(`mega-panel-shared`), no a uno por ítem — `aria-expanded` sigue siendo individual
(`openKey === item.key`). Es semánticamente correcto: un solo panel controlado por varios
triggers, solo uno "expandido" a la vez.

### Patrón 2 — Selector CSS: de descendiente a atributo propio

El selector actual `.nav-item[data-open] .mega-panel{visibility:visible;opacity:1}` deja
de tener sentido (el panel ya no es descendiente del `<li>`). Reemplazar por:

```css
/* app/globals.css — reemplaza la regla .nav-item[data-open] .mega-panel */
.mega-panel[data-open]{visibility:visible;opacity:1;pointer-events:auto}
```

Esto por sí solo YA elimina el parpadeo original: solo hay UN nodo `.mega-panel`, así que
no hay dos elementos compitiendo por `visibility`/`opacity` al cambiar de ítem — el
`data-open` del panel permanece `true` de forma continua mientras `openKey` va de un valor
no-null a otro no-null (el contenedor nunca se oculta durante el swap, solo su contenido
interno cambia — ver Patrón 3).

### Patrón 3 — Crossfade real del contenido interno vía `transitionend` (no `setTimeout`)

**Problema a resolver:** cuando `openKey` pasa de `"nosotros"` a `"capacidades"` (ambos
no-null), el contenido debe hacer fade-out → swap → fade-in, no un corte instantáneo.

**Por qué `transitionend` y no `setTimeout(200)`:** el proyecto ya tiene una regla global
`@media(prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}`
(`app/globals.css` línea 165). Un `setTimeout` con el valor hardcodeado de
`--motion-duration-fast` (200ms) quedaría **desincronizado** para usuarios con
`prefers-reduced-motion` (la transición real dura .01ms pero el timer seguiría esperando
200ms completos antes de swapear el contenido, produciendo un panel "congelado" con el
contenido viejo visible pero invisible por opacity 0 durante ~200ms). Usar el evento
`transitionend` del propio nodo se adapta automáticamente a la duración real de la CSS,
sin duplicar el valor en JS.

```tsx
// components/menu-overlay.tsx
const [displayedKey, setDisplayedKey] = useState<string | null>(null)
const [isSwapping, setIsSwapping] = useState(false)
const pendingKeyRef = useRef<string | null>(null)
const swapFallbackRef = useRef<ReturnType<typeof setTimeout>>()

useEffect(() => {
  if (openKey === null) return // el cierre lo anima el contenedor (.mega-panel[data-open]); el contenido se queda "congelado" detrás mientras se desvanece todo el panel
  if (displayedKey === null) {
    setDisplayedKey(openKey) // abrir desde cerrado: sin crossfade de contenido, el fade lo hace el contenedor
    return
  }
  if (displayedKey === openKey || isSwapping) return
  pendingKeyRef.current = openKey
  setIsSwapping(true) // dispara fade-out del contenido (opacity 0, translateY 8px)
  // red de seguridad si transitionend no dispara (p.ej. display:none inesperado)
  clearTimeout(swapFallbackRef.current)
  swapFallbackRef.current = setTimeout(() => finishSwap(), 400)
}, [openKey, displayedKey, isSwapping])

function finishSwap() {
  clearTimeout(swapFallbackRef.current)
  if (pendingKeyRef.current) setDisplayedKey(pendingKeyRef.current)
  pendingKeyRef.current = null
  setIsSwapping(false) // el mismo nodo pasa de opacity:0 a opacity:1 -> fade-in automático
}

function handleContentTransitionEnd(event: React.TransitionEvent) {
  if (event.propertyName !== "opacity" || event.target !== event.currentTarget) return
  if (isSwapping) finishSwap()
}
```

```css
/* app/globals.css */
.mega-panel-grid{transition:opacity var(--motion-duration-fast) var(--ease-moderate),transform var(--motion-duration-fast) var(--ease-moderate)}
.mega-panel-grid[data-swapping]{opacity:0;transform:translateY(8px)}
```

**Por qué NO usar `key={item.key}` en el `<div className="mega-panel-grid">` para forzar
remount:** un remount desmonta el nodo viejo instantáneamente (React quita el DOM node
inmediato, no espera la transición CSS) — es exactamente el mismo "corte" que ya existía
con los N paneles separados, solo que ahora dentro de un único contenedor. El patrón de
arriba mantiene el MISMO nodo DOM (`mega-panel-grid`) durante todo el swap, mutando su
contenido interno solo cuando la opacidad ya llegó a 0 — eso es lo que produce un
crossfade perceptible en vez de un corte.

**8px de desplazamiento vertical:** valor literal, no hay un token `--motion-distance-*`
que coincida (`--motion-distance-min` es 12px, pensado para reveals de scroll, un caso de
uso distinto) — introducir `8px` como literal en la regla es consistente con otros
valores puntuales del archivo (p.ej. `translateY(-3px)` en `.submit-button:hover`).

### Patrón 4 — El guard de `onBlur`/`onFocus` debe migrar de cada `<li>` a un wrapper `<nav>`

**Bug real si no se corrige:** el guard actual vive en cada `<li className="nav-item">`:
```tsx
onBlur={(event) => {
  if (!event.currentTarget.contains(event.relatedTarget as Node)) scheduleClose()
}}
```
`event.currentTarget` es el `<li>`. Hoy el panel es descendiente de ese mismo `<li>`, así
que tabular desde el trigger hacia un link/input DENTRO del panel mantiene
`contains(relatedTarget) === true` (no cierra). **Tras mover el panel a hijo de
`<header>` (fuera del `<li>`), ese mismo Tab hará que `contains()` devuelva `false`** →
`scheduleClose()` se dispara al primer Tab hacia dentro del panel — cerraría el panel
apenas el usuario intenta navegar su contenido con teclado, y **rompería por completo el
formulario de Contacto** (Tab hacia el primer `<input>` cerraría el panel antes de que el
usuario pueda escribir).

**Fix:** mover el guard del `<li>` a un elemento que envuelva tanto el `<nav>` (todos los
triggers) como el `.mega-panel` compartido — deben ser ambos descendientes de un mismo
contenedor con el handler:

```tsx
// components/menu-overlay.tsx — nuevo wrapper, sigue siendo hijo de <header>
<div
  ref={navRegionRef}
  className="nav-region" // wrapper sin estilos propios de layout — no debe tener position propio
  onFocus={(event) => {
    const key = (event.target as HTMLElement).closest<HTMLElement>("[data-nav-key]")?.dataset.navKey
    if (key) openPanel(key)
  }}
  onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) scheduleClose()
  }}
>
  <nav className="site-nav">...</nav>
  <div className="mega-panel" data-open={...}>...</div>
</div>
```

`onMouseEnter`/`onMouseLeave` por-ítem (para abrir/cerrar por hover) **se quedan en cada
`<li>` sin cambios** — ese mecanismo no depende de `contains()`, solo del timer, y sigue
funcionando igual (mover el mouse entre triggers ya limpia el timer vía `openPanel`).
Se recomienda usar `data-nav-key` + delegación en `onFocus` (un solo handler) en vez de un
`onFocus` por `<a>` individual, para reducir superficie de cambio — aunque mantener
`onFocus={() => openPanel(item.key)}` en cada `<a>` (como hoy) también funciona, es
opcional cuál de las dos formas se elige; lo que **no es opcional** es que el `onBlur` de
cierre se evalúe contra un contenedor que incluya el panel, no contra el `<li>` individual.

**Nota sobre `.nav-region` y el containing-block trick:** el wrapper NO debe declarar
`position` propio (ni `relative` ni ningún valor ≠ `static`) — si lo hiciera, se
convertiría en el nuevo containing block del `.mega-panel` (que es descendiente suyo),
rompiendo el `top:100%` relativo a `.site-header` completo. Confirmar con grep tras
implementar que `.nav-region` no aparece en ninguna regla CSS con `position`.

### Patrón 5 — `ContactForm`: `useRef` en vez de `id`+`querySelector`

Confirmado por grep en todo el proyecto: `#submit-button`/`#form-status` **no se
consultan desde ningún otro archivo** (ni CSS — las reglas `.submit-button{...}`/
`.form-status{...}` son selectores de CLASE, no de ID — ni JS). Los únicos consumidores
son las dos líneas `form.querySelector` dentro del propio `handleSubmit`. Es seguro y de
bajo riesgo reemplazar por refs, lo que elimina el problema de raíz sin importar cuántas
instancias de `<ContactForm />` coexistan en la página (panel + sección `#contacto`
siempre montada):

```tsx
// components/contact-form.tsx
export function ContactForm() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const button = buttonRef.current
    const status = statusRef.current
    // ... resto de la lógica sin cambios, solo usa button/status directamente
  }

  return (
    <form className="contact-form" data-reveal noValidate onSubmit={handleSubmit}>
      {/* ... */}
      <button className="submit-button magnetic" ref={buttonRef} type="submit">
        <span>Enviar solicitud</span><Arrow />
      </button>
      <p className="form-status" ref={statusRef} aria-live="polite" />
    </form>
  )
}
```

**Nota — `padding-top:7rem`/`align-self:end` en `.contact-form`:** la regla actual en
`globals.css` línea 127 (`.contact-form{align-self:end;padding-top:7rem}`) es un selector
de CLASE sin scope (`.contact-form`, no `.contact-grid .contact-form`) — se aplicará
también dentro del mega-panel, produciendo un espacio superior de 7rem indeseado y un
`align-self:end` sin efecto real fuera de un grid (efecto nulo si el padre del panel no es
grid, pero el `padding-top` SÍ se aplica siempre). El plan debe añadir un override
específico para el contexto del panel, p.ej. `.mega-panel .contact-form{padding-top:0}`
(no es necesario tocar la regla original, que sigue siendo correcta para
`contact-section.tsx`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sincronizar el swap de contenido con la duración real de la transición CSS | `setTimeout` con la duración de `--motion-duration-fast` hardcodeada en JS | Evento `transitionend` sobre `propertyName === "opacity"` | Se adapta solo a `prefers-reduced-motion` (ya activo globalmente en el proyecto); evita que JS y CSS se desincronicen si el token cambia en el futuro |
| Evitar ids duplicados en un componente reutilizado 2 veces en la página | Prop `idPrefix`/`useId()` + `` `#${id}` `` en el querySelector, o montaje condicional del panel | `useRef` en vez de `id`+`querySelector` | Confirmado por grep que nada externo depende de esos ids — elimina el problema de raíz con menos código y sin coordinar un prefijo entre 2 instancias |
| Detectar "el foco salió del nav+panel" | Listener global de `document` con `contains()` manual en cada `mousedown`/`focus` | `onBlur` nativo (evento `focusout` con bubbling en React ≥17) sobre un wrapper que envuelve `<nav>` + panel, comparando `event.relatedTarget` | Mismo patrón cero-listener-global ya usado por el proyecto (`event.currentTarget.contains`); solo cambia el nivel del wrapper, no el mecanismo |

**Key insight:** todo el fix es una recomposición de patrones que el propio proyecto ya
usa en otra parte (`transitionend` de estilo similar al de `dialog.service-drawer`,
`contains()`-based blur guard, `useRef` en vez de query por id) — no hace falta inventar
ni instalar nada nuevo.

## Common Pitfalls

### Pitfall 1: Mover el panel fuera de `<header>` en vez de dentro
**What goes wrong:** si el panel se coloca como hermano de `<header>` (junto al
`.mega-panel-backdrop`), pierde el containing-block gratuito (`.site-header{position:fixed}`)
y necesitaría `position:fixed` + un `top` medido en JS.
**How to avoid:** el panel debe seguir siendo descendiente de `<header>` — solo sale de
`<nav>`/`<ul>`/`<li>`, no del `<header>` completo.
**Warning signs:** el panel aparece en `y:0` (pegado arriba del todo) en vez de debajo del
header, o requiere lógica nueva de medición de altura.

### Pitfall 2: `setTimeout` desincronizado con `prefers-reduced-motion`
**What goes wrong:** ver Patrón 3 — un timer hardcodeado a 200ms no coincide con la
duración real (`.01ms`) bajo `prefers-reduced-motion:reduce`, dejando el contenido
"congelado" invisible por ~200ms de más.
**How to avoid:** usar `transitionend`, con el `setTimeout` solo como red de seguridad de
mayor duración (400ms), no como mecanismo primario.
**Warning signs:** con "reducir movimiento" activado en el SO, el contenido del panel
parpadea/desaparece brevemente al cambiar de ítem en vez de cambiar instantáneamente.

### Pitfall 3: onBlur guard no migrado tras mover el panel fuera del `<li>`
**What goes wrong:** ver Patrón 4 — Tab hacia el panel (incluyendo hacia el
`<ContactForm />`) dispara `scheduleClose()` de inmediato porque `currentTarget` (el
`<li>`) ya no contiene al panel.
**How to avoid:** mover el guard a un wrapper que envuelva `<nav>` + panel.
**Warning signs:** el panel se cierra apenas se presiona Tab desde el trigger hacia
adentro; el formulario de Contacto es imposible de completar por teclado.

### Pitfall 4: `.contact-form{padding-top:7rem;align-self:end}` sin scope filtra al panel
**What goes wrong:** ver Patrón 5 — espacio superior de 7rem indeseado dentro del panel de
Contacto.
**How to avoid:** añadir `.mega-panel .contact-form{padding-top:0}` (o equivalente) como
override.
**Warning signs:** el formulario dentro del panel aparece con un hueco vacío arriba,
desalineado respecto a la columna de intro.

### Pitfall 5: Reintroducir `key={item.key}` para forzar remount del contenido
**What goes wrong:** ver Patrón 3 — un remount por `key` desmonta el nodo instantáneamente
sin esperar la transición CSS, reproduciendo el mismo corte brusco que se busca eliminar
(y además desmontaría/remontaría `<ContactForm />` en cada swap, perdiendo cualquier
estado de campo si el usuario hubiera empezado a escribir y luego el `openKey` cambiara
por error).
**How to avoid:** mantener el mismo nodo DOM (`mega-panel-grid`) durante todo el ciclo de
swap; solo su contenido interno (hijos) cambia, en el punto en que su propia opacidad ya
llegó a 0.
**Warning signs:** el crossfade se ve "cortado" igual que antes del fix, o el formulario
de Contacto pierde el texto tecleado si el usuario cambia brevemente a otro ítem y vuelve.

## Code Examples

### Contenido de Proceso (mismo patrón de 3 columnas, datos ya existentes)
```tsx
// components/menu-overlay.tsx — nueva entrada en navItems, usa `process` de lib/site-content.ts
{
  key: "proceso",
  label: "Proceso",
  href: "#proceso",
  panel: process.map(([, title]) => ({ label: title, href: "#proceso" })), // 4 pasos, mismo href (sin anclas por paso, ya confirmado en CONTEXT.md)
  description: "Un proceso trazable en cada etapa, desde la planificación hasta el archivo final.", // verbatim de components/sections/process-section.tsx línea 34
  image: {
    src: "/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png",
    alt: "Equipo GNSS usado para puntos de control topográfico", // verbatim de process-section.tsx línea 48
  },
},
```

### Contenido de Contacto (2 columnas, sin `panel` de enlaces)
```tsx
{
  key: "contacto",
  label: "Contacto",
  href: "#contacto",
  description: "Cuéntanos qué necesitas medir. Nuestro equipo responderá con el enfoque técnico adecuado.", // verbatim de contact-section.tsx línea 43
  // sin `panel` (no hay lista de enlaces) y sin `image` — layout de 2 columnas manejado
  // en el render condicional del panel: si item.key === "contacto", renderiza <ContactForm />
  // en la columna derecha en vez de <ul className="mega-panel-links">/<div className="mega-panel-visual">
},
```
El render del panel necesita una rama condicional explícita por tipo de contenido
(`item.key === "contacto"` → intro + `<ContactForm />`; resto de ítems con `panel` →
intro + lista de enlaces + imagen opcional) — no es una extensión trivial del shape
`NavPanelItem[]` existente, es un tercer tipo de columna derecha.

### Imagen distinta para Capacidades (ya en `sectors`, decisión ya cerrada en CONTEXT.md)
```tsx
// capacidades ahora usa mineria-tajo-abierto.jpg (antes compartía dron.png con tecnologia)
image: {
  src: "/IMAGENES_PAGINA_WEB/mineria-tajo-abierto.jpg",
  alt: "Operación minera a tajo abierto con maquinaria pesada", // verbatim de lib/site-content.ts línea 221 (sectors)
},
```
Tecnología conserva `dron.png` sin cambios.

## Runtime State Inventory

No aplica — no es un rename/refactor/migración de datos persistentes.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | `useRef` reemplazando `id`+`querySelector` en `ContactForm` no rompe nada externo | Patrón 5 | Verificado por grep exhaustivo (`submit-button`/`form-status`) en todo `.ts`/`.tsx`/`.css` del proyecto — sin hits externos a `contact-form.tsx`. Riesgo residual: algún test E2E/Playwright ad-hoc no versionado (`.playwright-cli/`) podría referenciar esos ids por selector — no verificable por grep del código fuente; si el planner encuentra scripts de Playwright con esos selectores, actualizarlos también. |
| A2 | El wrapper `.nav-region` (Patrón 4) puede añadirse sin `position` propio y sin romper el `display:flex`/`display:grid` que `.site-header` aplica a sus hijos directos | Patrón 4 | Si el wrapper interfiere con el layout flex/grid de `.site-header` (p.ej. ocupa una columna del grid `1fr auto 1fr` de forma inesperada), el `nav`+panel podría desalinearse visualmente — mitigar dándole `display:contents` o replicando el `display:flex` que ya tenía `.site-nav` como hijo directo, verificado visualmente antes de cerrar el plan. |

## Open Questions

1. **¿El wrapper `.nav-region` debe usar `display:contents` para no alterar el layout de `.site-header`?**
   - What we know: `.site-header` hoy tiene `.site-nav` como hijo directo dentro de un
     `display:flex` (dentro de `@media(pointer:fine)`); envolver `.site-nav` + el panel en
     un `<div>` intermedio inserta un nivel extra en el árbol de layout de `.site-header`.
   - What's unclear: si `display:contents` en el wrapper preserva exactamente el mismo
     comportamiento de flex hijos (¿el panel, que es `position:absolute`, participaría
     igual del flex-layout con o sin `display:contents`, dado que los elementos
     `position:absolute` ya están fuera del flujo normal de todas formas?).
   - Recommendation: dado que TANTO `.site-nav` como `.mega-panel` tienen su propio
     `display`/`position` explícito (`.site-nav{display:flex}`, `.mega-panel{position:absolute}`),
     el wrapper probablemente no necesita `display:contents` — puede ser un `<div>` normal
     sin estilos propios y `.mega-panel` seguirá resolviendo su posición contra
     `.site-header` igual (el trick de containing-block no depende de que el wrapper
     intermedio sea `display:contents`, solo de que ninguno de los ancestros intermedios
     tenga `position≠static`). Verificar visualmente tras implementar: 1 minuto en
     DevTools confirmando que `.site-nav` sigue alineado igual dentro de `.site-header`.

## Environment Availability

No aplica — sin dependencias externas nuevas.

## Validation Architecture

Sin suite de tests automatizada en el proyecto (heredado de 260720-vda/260721-1nn) —
verificación 100% manual.

### Verificación manual recomendada
| Comportamiento | Cómo verificar |
|---|---|
| Cero parpadeo al mover el mouse entre 2 ítems con panel (p.ej. Nosotros → Capacidades) | Hover lento y rápido entre triggers, confirmar que el contenido hace fade-out/fade-in sin un "hueco" de fondo visible ni doble render |
| El panel nunca se cierra al hacer Tab desde el trigger hacia su contenido | Tab dentro de cada uno de los 6 paneles, confirmar que el panel permanece abierto mientras el foco está en cualquier link/input interno |
| El formulario de Contacto es completable por teclado dentro del panel | Tab hasta el campo "Nombre", escribir, Tab a través de todos los campos, enviar — confirmar que no se cierra el panel en ningún punto |
| Envío del formulario funciona igual dentro del panel que en la sección `#contacto` | Enviar el formulario desde AMBAS instancias (panel y sección), confirmar POST exitoso a `/api/contact` en ambos casos sin error de consola por id duplicado |
| HTML válido con ambas instancias de ContactForm montadas simultáneamente | DevTools → abrir panel de Contacto (queda montado junto a la sección `#contacto` siempre presente) → confirmar 0 ids duplicados en el DOM (`document.querySelectorAll('[id="submit-button"]')` ya no debería existir tras el fix de refs) |
| Capacidades y Tecnología muestran imágenes distintas | Hover en cada uno, confirmar visualmente `mineria-tajo-abierto.jpg` vs `dron.png` |
| `prefers-reduced-motion:reduce` no deja el panel "congelado" a mitad de swap | Activar la preferencia del SO, repetir el hover entre ítems, confirmar que el cambio de contenido es prácticamente instantáneo sin quedar en opacity intermedia |
| Regresión: Escape sigue cerrando y devolviendo foco (bug de 260720-vda ya corregido) | Abrir con Tab, Escape, confirmar cierre visual + foco en el trigger exacto |
| Regresión: clic en backdrop sigue cerrando sin delay | Abrir un panel, clic en zona oscurecida, confirmar cierre inmediato |

### Wave 0 Gaps
Ninguno — sin infraestructura de test que instalar, heredado del alcance ya documentado.

## Security Domain

Tarea puramente presentacional + reutilización de un formulario ya validado (mismo POST a
`/api/contact`, misma validación server-side sin cambios) — no introduce superficie de
ataque nueva. `security_enforcement` heredado del proyecto; V5 Input Validation no aplica
cambios (el formulario reutilizado no cambia su lógica de envío/validación, solo cómo
referencia sus propios nodos DOM internos).

## Sources

### Primary (HIGH confidence — verificado directamente en el codebase)
- `components/menu-overlay.tsx` — implementación actual completa (navItems, openKey,
  closeTimerRef, triggerRefs, openPanel, scheduleClose, onBlur guard, JSX de los 4
  `.mega-panel` actuales, backdrop)
- `app/globals.css` líneas 20-33, 127, 160-165 — `.nav-item`/`.mega-panel`/
  `.mega-panel-grid`/`-intro`/`-links`/`-visual`/`-backdrop`, `.contact-form` sin scope,
  regla global de `prefers-reduced-motion`
- `components/contact-form.tsx` — confirmado: únicos consumidores de
  `#submit-button`/`#form-status` son las 2 líneas de `form.querySelector` dentro del
  propio componente (grep exhaustivo sin hits externos)
- `components/sections/contact-section.tsx` — párrafo intro verbatim, uso actual (siempre
  montado) de `<ContactForm />`
- `components/sections/process-section.tsx` — 4 pasos vía `process.map`, párrafo intro
  verbatim, imagen `monumentacion_puntos_referencia.png` con alt ya redactado
- `lib/site-content.ts` líneas 169-174, 205-223 — confirmado verbatim: `process` (4
  pasos), `sectors[2]` (`mineria-tajo-abierto.jpg` + alt)
- `hooks/use-overlay-coordination.ts`, `hooks/use-scroll-lock.ts` — confirmado: ninguno de
  los dos es consumido por el mecanismo de mega-panel (`openKey`) — solo por `menuOpen`
  (drawer móvil) y `service-drawer` — sin cambios necesarios
- `.planning/quick/260721-1nn-.../260721-1nn-RESEARCH.md` — containing-block trick,
  backdrop, z-index, anti-patrón de `:focus-within` (no reintroducir)
- `.planning/quick/260720-vda-.../260720-vda-SUMMARY.md` — bug de `:focus-within` ya
  corregido, no reintroducir

### Secondary (MEDIUM confidence)
- Comportamiento de `transitionend` con `React.TransitionEvent` en React 19 sobre nodos
  que cambian de `display`/hijos — comportamiento estándar del navegador, sin
  verificación con captura visual real en este proyecto todavía (ver Open Question 1 y
  Assumptions Log)

## Metadata

**Confidence breakdown:**
- Estructura panel único + selector CSS: HIGH — extensión directa y verificada del
  trabajo ya hecho en 260721-1nn
- Mecanismo de crossfade (`transitionend`): HIGH — patrón estándar de la plataforma,
  coherente con la regla `prefers-reduced-motion` ya existente en el proyecto
- Fix de `onBlur` guard: HIGH — bug concreto identificado por inspección directa del
  código, con fix de bajo riesgo verificado contra el mismo mecanismo ya usado
- Fix de ids en `ContactForm`: HIGH — verificado por grep exhaustivo, sin dependencias
  externas a los ids actuales
- Contenido de Proceso/Contacto e imagen de Capacidades: HIGH — todos los textos/rutas
  confirmados verbatim en el codebase

**Research date:** 2026-07-21
**Valid until:** Sin fecha de caducidad relevante — no depende de versiones de librerías
externas; válido mientras `menu-overlay.tsx`/`contact-form.tsx`/`app/globals.css` no se
reestructuren de forma mayor.
