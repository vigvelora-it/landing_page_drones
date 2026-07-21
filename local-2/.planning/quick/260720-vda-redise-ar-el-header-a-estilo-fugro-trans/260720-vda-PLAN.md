---
quick_id: 260720-vda
status: planned
type: execute
autonomous: false
files_modified:
  - components/menu-overlay.tsx
  - components/sections/brand-section.tsx
  - app/globals.css
must_haves:
  truths:
    - "En desktop (pointer:fine), sobre el hero sin hacer scroll, el header se ve transparente con logo/nav/CTA en blanco legible."
    - "Al superar 80px de scroll, el header cambia a fondo blanco sólido con texto oscuro, reutilizando useHeaderScrollState sin modificarlo."
    - "En desktop, el hover o foco sobre Nosotros, Capacidades, Tecnología o Proyectos despliega un mega-panel con los sub-ítems correctos, sin cerrarse al mover el mouse hacia el panel."
    - "El mega-panel es operable solo con teclado: Tab lo abre, Escape lo cierra y devuelve el foco al trigger."
    - "Los 4 sub-ítems de Nosotros navegan a secciones cuyo título queda completamente visible bajo el header fijo."
    - "El botón de contacto del header desplaza la página hasta #contacto."
    - "En viewports sin puntero preciso, el nav horizontal y el CTA no aparecen; el botón 'Menú' y su overlay a pantalla completa funcionan exactamente igual que antes del cambio."
  artifacts:
    - path: "components/menu-overlay.tsx"
      provides: "Nav horizontal + 4 mega-panels (hover/foco/teclado) + CTA de contacto, reutilizando useHeaderScrollState/useOverlayCoordination/useScrollLock sin tocar su lógica interna"
    - path: "components/sections/brand-section.tsx"
      provides: "4 ids de anclas internas navegables: historia, equipo, valores, sectores"
    - path: "app/globals.css"
      provides: "Header transparente/sólido (scrim propio), estilos de .site-nav/.nav-item/.mega-panel/.nav-cta, gating @media(pointer:fine), scroll-margin-top de los nuevos anchors"
  key_links:
    - from: "components/menu-overlay.tsx"
      to: "app/globals.css"
      via: "className site-nav / nav-item / mega-panel / nav-cta"
      pattern: "className=\"(site-nav|nav-item|mega-panel|nav-cta)"
    - from: "components/menu-overlay.tsx (panel Nosotros)"
      to: "components/sections/brand-section.tsx"
      via: "href=\"#historia|#equipo|#valores|#sectores\" apuntando a id equivalente"
      pattern: "id=\"(historia|equipo|valores|sectores)\""
    - from: "components/menu-overlay.tsx"
      to: "hooks/use-header-scroll-state.ts"
      via: "useHeaderScrollState() sin modificar, toggle de .is-scrolled"
      pattern: "useHeaderScrollState\\("
    - from: "app/globals.css .site-header"
      to: "@media(pointer:fine)"
      via: "mismo media feature que .custom-cursor/[data-cursor], gatea site-nav/nav-cta visibles y menu-toggle/menu-overlay/header-center ocultos"
      pattern: "@media\\(pointer:fine\\)"
---

# Quick Task 260720-vda: Rediseñar el header a estilo Fugro

## Objetivo

Convertir el header actual (botón "Menú" + overlay a pantalla completa en todos los
breakpoints) en un header estilo Fugro para escritorio: transparente con texto blanco sobre
el hero, sólido con texto oscuro al hacer scroll (mecanismo ya existente, sin cambios), nav
horizontal siempre visible con mega-menús por hover/foco en 4 de los 6 ítems, y un botón de
contacto con borde. El overlay móvil actual se conserva intacto — solo se oculta en desktop
vía CSS. Cero paquetes nuevos, cero tokens de color/tipografía/espaciado nuevos: todo
reutiliza `--accent`, `--bg-surface`, `--ink-primary`, `--border-subtle`, `--motion-*`,
`--ease-moderate` ya lockeados, y la escala de espaciado de 8 puntos (`xs..3xl`) ya declarada
en `01-UI-SPEC.md` para componentes nuevos desde Fase 2.

Purpose: alinear visualmente el header con la dirección Fugro/Seequent ya adoptada en el
resto del sitio, mejorando la descubribilidad del contenido en desktop sin regresionar el
mecanismo de scroll-lock, la exclusión mutua header/drawer (SERV-03), ni el overlay móvil.

Output: `components/menu-overlay.tsx` extendido, 4 ids de ancla nuevos en
`components/sections/brand-section.tsx`, y las reglas CSS correspondientes en
`app/globals.css`.

## Contexto

@.planning/quick/260720-vda-redise-ar-el-header-a-estilo-fugro-trans/260720-vda-CONTEXT.md
@.planning/quick/260720-vda-redise-ar-el-header-a-estilo-fugro-trans/260720-vda-RESEARCH.md
@components/menu-overlay.tsx
@components/sections/brand-section.tsx
@hooks/use-header-scroll-state.ts
@hooks/use-overlay-coordination.ts
@hooks/use-scroll-lock.ts
@components/service-drawer.tsx
@components/custom-cursor.tsx
@lib/site-content.ts
@app/globals.css

## Tareas

<tasks>

<task type="auto">
  <name>Task 1: Nav horizontal + mega-panels + anchors de "Nosotros"</name>
  <files>components/menu-overlay.tsx, components/sections/brand-section.tsx</files>
  <action>
En `components/sections/brand-section.tsx`: añadir `id="historia"` al
`<article className="brand-copy brand-copy--history">` (hoy sin id); `id="equipo"` a
`<section className="team-region" aria-labelledby="team-heading">`; `id="valores"` a
`<section className="values-region" aria-labelledby="values-heading">`; `id="sectores"` a
`<section className="sectors-region" aria-labelledby="sectors-heading">`. No tocar los ids
existentes `team-heading`/`values-heading`/`sectors-heading` de los `<h3>` internos — esos
siguen sirviendo a `aria-labelledby`; los nuevos ids son anclas de scroll independientes en
los contenedores.

En `components/menu-overlay.tsx`: importar `services`, `projects`, `equipment` desde
`@/lib/site-content` (no requieren tipos nuevos). Declarar una constante de módulo con los 6
ítems de nav con este contrato exacto: {key:"nosotros", label:"Nosotros", href:"#nosotros",
panel:[{label:"Historia",href:"#historia"},{label:"Equipo",href:"#equipo"},
{label:"Valores",href:"#valores"},{label:"Sectores",href:"#sectores"}]};
{key:"capacidades", label:"Capacidades", href:"#capacidades",
panel: services.map(s => ({label:s.title, href:"#capacidades"}))};
{key:"tecnologia", label:"Tecnología", href:"#tecnologia",
panel: equipment.map(e => ({label:e.caption, href:"#tecnologia"}))};
{key:"proyectos", label:"Proyectos", href:"#proyectos",
panel: projects.map(p => ({label:p.name, href:"#proyectos"}))};
{key:"proceso", label:"Proceso", href:"#proceso", panel: undefined};
{key:"contacto", label:"Contacto", href:"#contacto", panel: undefined}.

Añadir estado: `openKey` (`useState<string | null>(null)`), `closeTimerRef`
(`useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`) y `triggerRefs`
(`useRef<Record<string, HTMLAnchorElement | null>>({})`, un mapa `key -> <a>` del trigger que
abrió cada panel, necesario para devolver el foco exacto al cerrar por teclado), con
`openPanel(key)` (limpia el timer y hace `setOpenKey(key)`) y `scheduleClose()` (limpia y arma
un `setTimeout(() => setOpenKey(null), 250)`) — mismo espíritu que `closeTimeoutRef` en
`components/service-drawer.tsx`. Añadir `useEffect(() => () => clearTimeout(closeTimerRef.current), [])`
para limpieza al desmontar.

Añadir un segundo `useEffect` (independiente del `useEffect` de `menuOpen` ya existente en
líneas 20-32, no fusionarlos) que, mientras `openKey` no sea null, escuche `keydown` en
`window` y en `Escape` guarde el `openKey` vigente en una variable local, llame
`triggerRefs.current[openKey]?.focus()` para devolver el foco visible al trigger que abrió el
panel, y luego `setOpenKey(null)` — mismo patrón exacto que el ya usado para
`menuOpen`/`toggleRef`, con la llamada a `.focus()` añadida explícitamente antes de cerrar (sin
ella el foco quedaría perdido/en `body`, incumpliendo el must-have "Escape... devuelve el foco
al trigger").

Dentro del `<header className="site-header">` existente, entre el `<a className="brand">` y
el `<div className="header-center">`, renderizar `<nav className="site-nav" aria-label="Navegación principal">`
con un `<ul>` que mapea la constante de nav-items: para ítems con `panel`, un
`<li className="nav-item" data-open={openKey === item.key || undefined}>` — el atributo
`data-open` vive en el `<li>` (el ancestro), NO en el `.mega-panel`, porque la regla CSS de la
Tarea 2 es `.nav-item[data-open] .mega-panel` (selector de ancestro) — con
`onMouseEnter`/`onFocus={() => openPanel(item.key)}` y `onMouseLeave={scheduleClose}` +
`onBlur` que solo llama `scheduleClose` si
`!event.currentTarget.contains(event.relatedTarget as Node)` (guarda de contención, evita
cerrar al tabular entre el trigger y su propio panel); dentro, un link con
`ref={(el) => { triggerRefs.current[item.key] = el; }}`, `href={item.href}`,
`aria-haspopup="true"`, `aria-expanded={openKey === item.key}`, `aria-controls` apuntando al
id del panel (`mega-` + `item.key`), y `onClick={() => setOpenKey(null)}`; junto a un
`<div className="mega-panel">` con ese mismo id (sin `data-open` propio — el estado abierto se
lee del `<li>` padre vía CSS), y un `<ul>` de
`<li><a href={sub.href} onClick={() => setOpenKey(null)}>{sub.label}</a></li>` por cada entrada
de `item.panel`. Para ítems sin `panel` (Proceso, Contacto), un
`<li className="nav-item"><a href={item.href}>{item.label}</a></li>` simple.

Después del `.header-center` existente (sin tocarlo) y antes del `<button ref={toggleRef} className="menu-toggle"...>`
existente, añadir un anchor `className="nav-cta"` con `href="#contacto"`, texto "Contáctanos"
y `onClick={() => setOpenKey(null)}`. No llamar `lenis.scrollTo` manualmente —
`SmoothScrollProvider` ya intercepta clicks de `<a href="#...">` vía `anchors:true`
(RESEARCH.md Don't-Hand-Roll); una segunda autoridad de scroll es justo lo que
CONTEXT.md/RESEARCH.md piden evitar. A diferencia de `service-drawer.tsx`'s `handleCtaClick`,
aquí no hace falta secuenciar el cierre antes del scroll porque el mega-panel no usa
`useScrollLock` (no hay Lenis detenido que reanudar).

No eliminar, renombrar ni reestructurar el `<button className="menu-toggle">` ni el
`<div className="menu-overlay">` existentes — quedan intactos byte a byte; su ocultamiento en
desktop es 100% CSS y se hace en la Tarea 2.
  </action>
  <verify>
    <automated>npx tsc --noEmit && grep -c 'id="historia"' components/sections/brand-section.tsx | grep -qv '^0$' && grep -c 'id="equipo"' components/sections/brand-section.tsx | grep -qv '^0$' && grep -c 'id="valores"' components/sections/brand-section.tsx | grep -qv '^0$' && grep -c 'id="sectores"' components/sections/brand-section.tsx | grep -qv '^0$' && grep -c 'className="site-nav"' components/menu-overlay.tsx | grep -qv '^0$' && grep -c 'className="mega-panel"' components/menu-overlay.tsx | grep -qv '^0$' && grep -c 'className="nav-cta"' components/menu-overlay.tsx | grep -qv '^0$' && echo OK</automated>
  </verify>
  <done>
`brand-section.tsx` expone 4 ids de ancla nuevos (historia/equipo/valores/sectores);
`menu-overlay.tsx` renderiza un `.site-nav` con 6 `<li className="nav-item">`, 4 con
`data-open` en el propio `<li>` y su `.mega-panel` controlado por hover/foco/teclado, poblado
desde `services`/`equipment`/`projects`/datos inline de Nosotros, más un `.nav-cta` apuntando a
`#contacto`; Escape cierra el panel abierto y devuelve el foco visible al trigger vía
`triggerRefs.current[openKey]?.focus()`; `tsc --noEmit` pasa sin errores; el
`.menu-toggle`/`.menu-overlay` preexistente no cambió.
  </done>
</task>

<task type="auto">
  <name>Task 2: CSS del header transparente/sólido + mega-panel + gating desktop</name>
  <files>app/globals.css</files>
  <action>
Dentro del bloque `/* Navegación */` (líneas 20-22): en la regla base `.site-header` (no
`.is-scrolled`), reemplazar `color:var(--ink-primary)` por `color:#FFFFFF` (mismo literal ya
usado en `.menu-overlay`/`.service-row:hover` — no existe token `--ink-inverse`) y añadir un
`background` en gradiente vertical con la misma técnica `color-mix(in srgb,var(--ink-primary)
X%,transparent)` que ya usa `.hero-shade` (sin tocar `.hero-shade` — este scrim es local al
header, RESEARCH.md Pattern 2/Pitfall 1), decreciente hacia transparente al final de la banda
del header (~80-90px). En `.site-header.is-scrolled`, añadir explícitamente
`color:var(--ink-primary)` (hoy hereda del base; al pasar el base a blanco, `.is-scrolled`
debe reafirmar el oscuro) — el `background`/`box-shadow` que ya tiene esa regla no cambian.

Añadir un bloque `@media(pointer:fine)` (mismo media feature que `[data-cursor]`/
`.custom-cursor` en la línea 115 — no usar `(hover:hover)` ni un breakpoint de ancho) que:
cambie `.site-header` de grid a `display:flex;align-items:stretch;justify-content:space-between`
(el `<li>` del nav necesita estirarse a la altura completa del header para el fix de Pitfall
2); oculte `.header-center{display:none}` (no forma parte del set cerrado "logo, nav, botón
de contacto" que exige CONTEXT.md) y `.menu-toggle,.menu-overlay{display:none}` (desktop usa
`.site-nav` en su lugar); muestre `.site-nav{display:flex;align-items:stretch}` con su `<ul>`
en `display:flex;align-items:stretch;list-style:none;margin:0;padding:0;gap:24px` (24px =
token `lg` de la escala de 8 puntos de `01-UI-SPEC.md`); y `.nav-item{position:relative;
display:flex;align-items:center}`. Fuera del bloque `pointer:fine` (mobile-first por
defecto), añadir `.site-nav{display:none}` y `.nav-cta{display:none}` — mismo patrón espejo
que `.custom-cursor{display:none}` en el bloque `max-width:720px` (oculto por defecto,
revelado solo bajo `pointer:fine`). Nota de alcance conocida: este gating por `pointer:fine`
(sin combinarlo con un breakpoint de ancho) no cubre el caso intermedio de una ventana de
escritorio angosta con puntero fino por debajo de los 1000px (p.ej. 1024×768), donde
`.header-center` ya se oculta por el breakpoint existente `max-width:1000px` mientras
`.site-nav`/`.nav-cta` seguirían visibles bajo `pointer:fine` — se acepta como conocido y fuera
de alcance para este quick task orientado a escritorio ancho (no se exige pixel-perfect en ese
ancho intermedio).

Añadir `.mega-panel{position:absolute;top:100%;left:0;visibility:hidden;opacity:0;
pointer-events:none;min-width:240px;background:var(--bg-surface);color:var(--ink-primary);
border:1px solid var(--border-subtle);box-shadow:0 8px 24px color-mix(in srgb,var(--ink-primary)
6%,transparent);padding:24px;transition:opacity var(--motion-duration-fast) var(--ease-moderate)}`
— el panel es siempre opaco (fondo claro/texto oscuro) sin importar si el header está en su
estado transparente o `.is-scrolled` (Pitfall 1: un panel transparente sobre la foto del hero
sería ilegible). Su `<ul>` interno: `list-style:none;margin:0;padding:0;display:flex;
flex-direction:column;gap:8px` (8px = token `sm`); sus `li a`: `color:var(--ink-primary);
font-size:.85rem;line-height:1.6` (mismo tamaño que `.service-drawer-group li`, línea 135).

Añadir la regla de apertura: `.nav-item[data-open] .mega-panel,.nav-item:focus-within .mega-panel{
visibility:visible;opacity:1;pointer-events:auto}` — `data-open` lo asigna la Tarea 1 al propio
`<li className="nav-item">` (el selector es de ancestro, no `.mega-panel[data-open]`), por lo
que hover/foco vía JS abre el panel correctamente; `:focus-within` es el respaldo CSS-only por
teclado de RESEARCH.md Pattern 1, redundante mientras `data-open` esté activo pero necesario
para el caso en que el navegador no dispare `onFocus` del trigger (foco directo por Tab sin
pasar por `openPanel`).

Añadir `.nav-cta{display:inline-flex;align-items:center;justify-content:center;min-height:48px;
padding:0 24px;border:1px solid currentColor;border-radius:999px;font-size:.72rem;
font-weight:500;letter-spacing:.1em;text-transform:uppercase;transition:background
var(--motion-duration-fast) var(--ease-moderate),color var(--motion-duration-fast)
var(--ease-moderate)}` (reutiliza el tamaño/tipografía pill de `.brochure-cta`, líneas 96-97,
pero con borde en vez de relleno — `currentColor` hereda blanco en el header transparente y
oscuro tras `.is-scrolled` automáticamente) y `.nav-cta:hover{background:var(--accent);
border-color:var(--accent);color:#FFFFFF}` (mismo criterio hover-fill-a-accent que
`.circle-link:hover`, línea 26).

Añadir `:focus-visible` con `outline:2px solid var(--focus-ring);outline-offset:2px` (misma
receta que `.service-drawer-cta:focus-visible`, línea 141) a `.nav-item > a:focus-visible` y
`.nav-cta:focus-visible`.

Añadir `scroll-margin-top:100px` (valor recomendado por RESEARCH.md Pitfall 4 — aproxima la
altura real del header fijo más margen) a `#historia,#equipo,#valores,#sectores` (los 4 ids
nuevos de la Tarea 1).

No modificar `.hero-shade`, `.tech-vignette` ni ningún otro scrim/viñeta existente.
  </action>
  <verify>
    <automated>grep -c "@media(pointer:fine)" app/globals.css | grep -qv '^0$' && grep -c "mega-panel" app/globals.css | grep -qv '^0$' && grep -c "nav-cta" app/globals.css | grep -qv '^0$' && grep -c "scroll-margin-top:100px" app/globals.css | grep -qv '^0$' && echo OK</automated>
  </verify>
  <done>
`app/globals.css` gatea `.site-nav`/`.nav-cta` visibles y `.header-center`/`.menu-toggle`/
`.menu-overlay` ocultos bajo `@media(pointer:fine)`; `.site-header` base es blanco sobre un
scrim propio y `.is-scrolled` es oscuro sobre el fondo sólido existente (sin tocar
`.hero-shade`); `.mega-panel` abre por `.nav-item[data-open]` (asignado en el `<li>`, Tarea 1)
o `:focus-within` con transición de opacidad y fondo siempre opaco; los 4 anchors nuevos de la
Tarea 1 declaran `scroll-margin-top:100px`.
  </done>
</task>

<task type="auto">
  <name>Task 3: Verificación automatizada — lint, typecheck, build y comportamiento en navegador</name>
  <files>ninguno (script de verificación desechable, no se commitea al repo)</files>
  <action>
Ejecutar en orden `npm run lint`, `npx tsc --noEmit` y `npm run build`; los tres deben salir
con código 0 y cero errores antes de continuar. Levantar el server de producción
(`npm run start`, puerto 4173 según `package.json`) en background.

Usando la automatización de navegador disponible en el entorno (Playwright — mismo mecanismo
ya usado para verificación visual en el quick task `260720-ud7`), escribir un script
desechable (no se commitea) que: (a) cargue `http://localhost:4173` en viewport 1440×900,
confirme que `.site-header` NO tiene la clase `is-scrolled` y que `.site-nav` es visible
mientras `.menu-toggle` no lo es; (b) haga hover sobre el trigger "Nosotros" y confirme que
su `.mega-panel` se vuelve visible con 4 links, luego mueva el puntero hacia dentro del panel
y confirme que sigue visible (sin cierre prematuro); (c) navegue por Tab desde el body hasta
el trigger "Capacidades", confirme `aria-expanded="true"` y el panel visible, presione
`Escape`, confirme `aria-expanded="false"` y foco de vuelta en el trigger (`document.activeElement`
debe ser el mismo `<a>` del trigger "Capacidades", verificado vía `ref`/`triggerRefs` de la
Tarea 1); (d) haga scroll 200px y confirme que `.site-header` gana la clase `is-scrolled`; (e)
haga clic en el link "Historia" del mega-panel de Nosotros y confirme que el
`boundingClientRect().top` del elemento `#historia` queda por debajo del borde inferior del
header (no tapado); (f) cambie a viewport 390×844 con emulación de puntero táctil/coarse y
confirme que `.site-nav` no es visible mientras `.menu-toggle` sí lo es, haga clic en él y
confirme que `.menu-overlay` abre exactamente como antes; (g) recolecte cualquier evento
`console.error`/`pageerror` durante toda la corrida.

Detener el server de producción. Reportar el resultado pasa/falla de cada aserción (a)-(g) y
los errores de consola capturados (si los hay), como insumo para el checkpoint de la Tarea 4.
  </action>
  <verify>
    <automated>npm run lint && npx tsc --noEmit && npm run build</automated>
  </verify>
  <done>
`npm run lint`, `npx tsc --noEmit` y `npm run build` salen con código 0; las aserciones
(a)-(g) del script de Playwright desechable pasan todas —incluyendo que Escape devuelve el
foco real (`document.activeElement`) al trigger "Capacidades"— sin errores de consola.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Revisión visual manual en producción</name>
  <files>ninguno (solo revisión visual)</files>
  <what-built>
Header estilo Fugro completo: transparente sobre el hero con scrim propio, sólido al hacer
scroll, nav horizontal con 4 mega-panels accesibles por hover/foco/teclado, botón
"Contáctanos" con borde, overlay móvil intacto. La Tarea 3 ya confirmó automáticamente el
comportamiento estructural (clases, `aria-expanded`, foco de retorno tras Escape, scroll,
ausencia de errores de consola) — este checkpoint cubre lo que la automatización no puede
juzgar por sí sola: legibilidad real del contraste y la sensación visual general "estilo
Fugro".
  </what-built>
  <how-to-verify>
1. `npm run build && npm run start`, abrir http://localhost:4173 en un navegador real a
   ~1440×900.
2. Confirmar que el header es transparente sobre el hero con logo/nav/CTA en blanco legible;
   verificar el contraste con axe DevTools o el checker de WebAIM contra una captura del
   texto del header sobre la parte más clara de la foto/video del hero — debe cumplir ≥4.5:1
   (texto normal) / ≥3:1 (texto grande). Si falla, subir el porcentaje del `color-mix()` del
   scrim del header en `app/globals.css` (sin tocar `.hero-shade`) y volver a verificar.
3. Hacer scroll más de 80px y confirmar que el header pasa a blanco sólido con texto oscuro y
   la sombra existente (sin scrub, sin regresión de HEAD-01).
4. Pasar el mouse por "Nosotros", "Capacidades", "Tecnología" y "Proyectos" uno por uno;
   confirmar que cada mega-panel muestra los sub-ítems correctos y no parpadea al cruzar en
   diagonal desde el link hacia el panel.
5. Usando solo Tab/Shift+Tab (sin mouse), abrir un mega-panel, confirmar que Escape lo cierra
   y devuelve el foco visible (anillo de foco) al trigger exacto que lo abrió.
6. Hacer clic en cada sub-ítem de "Nosotros" y confirmar que el título de destino queda
   completamente visible, no tapado por el header.
7. Redimensionar a 390×844 (o emular puntero táctil/coarse) y confirmar que el nav horizontal
   y el CTA no aparecen, y que el botón "Menú" y su overlay a pantalla completa funcionan
   exactamente igual que antes.
8. Abrir el drawer de un servicio desde "Capacidades" y confirmar que el header (incluyendo
   el nuevo nav) queda `inert` mientras el drawer está abierto (sin regresión de SERV-03).
  </how-to-verify>
  <resume-signal>Escribe "aprobado" si los 8 pasos se ven correctos, o describe qué falta ajustar.</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|--------------|
| Header nav / mega-panel | Enlaces `<a href="#...">` estáticos derivados de `lib/site-content.ts` (ya confiable); sin input de usuario ni fetch nuevo |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-------------------|
| T-260720-vda-01 | S/T/R/I/D/E (general) | components/menu-overlay.tsx (nav + mega-panel) | accept | Sin input de usuario, sin endpoint nuevo, sin dato sensible — solo navegación estática a anclas ya existentes en la misma página; conclusión ya documentada en RESEARCH.md "Security Domain" (ASVS V2-V6 no aplican) |
| T-260720-vda-SC | Tampering | npm installs | accept | No aplica — este plan no instala ningún paquete nuevo (RESEARCH.md: "No aplica Package Legitimacy Audit") |
</threat_model>

<verification>
- `npm run lint`, `npx tsc --noEmit`, `npm run build` limpios (Tarea 3).
- Script de Playwright desechable confirma: header transparente sin scroll, `.is-scrolled`
  tras 80px, apertura/cierre de mega-panel por hover y teclado sin parpadeo, Escape devuelve
  el foco real al trigger, navegación de anclas de Nosotros sin overlap, overlay móvil intacto
  en 390×844, cero errores de consola (Tarea 3).
- Revisión visual humana confirma contraste AA real y la sensación "estilo Fugro" (Tarea 4).
</verification>

<success_criteria>
- Header transparente sobre el hero (blanco) y sólido en scroll (oscuro), mismo umbral de
  80px que HEAD-01, sin cambios en `useHeaderScrollState`.
- Nav horizontal siempre visible en desktop con 4 mega-panels accesibles por mouse y teclado,
  cumpliendo WCAG 1.4.13 (hoverable, dismissible, persistent) y devolviendo el foco al trigger
  al cerrar con Escape.
- Anchors internos de Nosotros navegables y no tapados por el header.
- CTA de contacto desplaza a `#contacto` vía Lenis (`anchors:true`), sin segunda autoridad de
  scroll.
- Overlay móvil, scroll-lock y exclusión mutua con el drawer de servicios sin regresión.
- Cero tokens de color/tipografía/peso nuevos; cero paquetes nuevos.
</success_criteria>

<output>
Crear `.planning/quick/260720-vda-redise-ar-el-header-a-estilo-fugro-trans/260720-vda-SUMMARY.md`
al finalizar.
</output>
