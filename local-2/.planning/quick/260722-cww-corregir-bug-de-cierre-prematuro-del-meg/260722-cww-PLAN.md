---
quick_id: 260722-cww
status: planned
type: execute
autonomous: false
files_modified:
  - components/menu-overlay.tsx
must_haves:
  truths:
    - "Mover el mouse desde un ítem del nav con panel abierto hacia abajo, atravesando la franja de padding vertical de .site-header, hasta llegar al .mega-panel, mantiene el panel abierto — no se cierra tras el timer de 250ms mientras el mouse permanece dentro del panel."
    - "Un clic en un enlace del .mega-panel (o en un campo del formulario del panel de Contacto) funciona con normalidad tras haber movido el mouse desde el nav hacia el panel — el panel no desaparece antes de que el clic aterrice."
    - "Mover el mouse desde dentro del .mega-panel hacia un punto totalmente fuera de .nav-region (no de vuelta al nav) sigue cerrando el panel ~250ms después, sin regresión del comportamiento de cierre existente."
    - "Escape sigue cerrando el panel visualmente y devolviendo el foco al trigger exacto; clic en el backdrop sigue cerrando de inmediato."
    - "El overlay mobile/pointer:coarse a pantalla completa (botón Menú) y el drawer de servicio siguen funcionando sin cambios ni conflicto de z-index."
  artifacts:
    - path: "components/menu-overlay.tsx"
      provides: "onMouseEnter en el div .mega-panel que cancela closeTimerRef.current, cerrando el hueco geométrico entre el <li> del nav y el panel"
  key_links:
    - from: "div .mega-panel (onMouseEnter)"
      to: "closeTimerRef (via clearTimeout)"
      via: "handler inline que cancela cualquier scheduleClose() pendiente en cuanto el mouse entra al panel"
      pattern: "onMouseEnter=\\{\\(\\) => clearTimeout\\(closeTimerRef\\.current\\)\\}"
---

# Quick Task 260722-cww: Corregir cierre prematuro del mega-panel al mover el mouse hacia el panel - Plan

## Objetivo

Corregir el bug donde el mega-panel del header se cierra ~250ms después de que el usuario mueve el
mouse desde un `<li className="nav-item">` del nav hacia abajo, hacia el `<div className="mega-panel">`,
impidiendo hacer clic en cualquier contenido del panel (enlaces, campos del formulario de Contacto).

**Causa raíz (ya diagnosticada, no se re-investiga):** el wrapper `.nav-region` (`display:contents`)
solo tiene `onMouseLeave={scheduleClose}` y `onBlur={...}`; cada `<li className="nav-item">` tiene
`onMouseEnter={() => openPanel(item.key)}`/`onFocus`, que cancelan cualquier cierre programado — pero
el propio `<div className="mega-panel">` (hermano de `<nav>` dentro de `.nav-region` desde la
refactorización a panel único de 260721-td1) no tiene ningún `onMouseEnter` propio. Al mover el mouse
desde el `<li>` hacia el panel, el cursor atraviesa una franja del padding vertical de `.site-header`
(`padding:1.35rem 2rem`, `position:fixed`) que no pertenece a ningún descendiente de `.nav-region` — el
`<li>` se estira solo hasta el content-box del header vía `align-items:stretch`, mientras el
`.mega-panel` empieza en `top:100%` relativo al padding-box. Cruzar esa franja dispara `mouseleave` en
`.nav-region` → `scheduleClose()` arma un `setTimeout(250ms)` que llama `setOpenKey(null)`. Como
`.mega-panel` no cancela ese timer al recibir el mouse, el cierre programado se ejecuta igual aunque el
usuario ya esté interactuando dentro del panel.

Purpose: que el mega-panel se comporte como un mega-menú estándar — el cierre por hover solo se
dispara cuando el mouse sale de verdad de todo el conjunto nav+panel, nunca mientras cruza hacia el
panel o interactúa dentro de él.

Output: `components/menu-overlay.tsx` con un `onMouseEnter` en el `.mega-panel` que cancela
`closeTimerRef` — cambio quirúrgico de una sola línea, sin tocar `openKey`/`displayedKey`/`isSwapping`
ni ningún otro mecanismo ya verificado en rondas anteriores.

**No hay CONTEXT.md ni RESEARCH.md para esta quick task** — la causa raíz viene diagnosticada
completa por el orquestador en el prompt de planificación; este plan solo implementa y verifica el fix.

## Contexto

@components/menu-overlay.tsx

Selectores CSS relevantes en `app/globals.css` (solo lectura, NO se modifican en este plan):
- `.site-header{position:fixed;...padding:1.35rem 2rem;...}` — origen geométrico de la franja que
  causa el `mouseleave` prematuro.
- `.nav-region{display:contents}` — wrapper sin caja propia; sus hijos (`.site-nav`, `.mega-panel`)
  son los que reciben `onMouseLeave`/`onBlur` vía bubbling.
- `.nav-item{display:flex;align-items:center}` bajo `@media(pointer:fine) and (min-width:1000px)`.
- `.mega-panel{position:absolute;top:100%;left:0;width:100%;...}` — panel único compartido.

## Tareas

<tasks>

<task type="auto">
  <name>Task 1: Agregar onMouseEnter al .mega-panel para cancelar el cierre programado</name>
  <files>components/menu-overlay.tsx</files>
  <action>
En el div `<div className="mega-panel" id="mega-panel-shared" data-open={openKey !== null || undefined}>`
(actualmente única línea, alrededor de la línea 248), agregar el atributo
`onMouseEnter={() => clearTimeout(closeTimerRef.current)}`. Puede quedar en la misma línea o
reformatearse a múltiples líneas (ambos estilos ya conviven en el archivo — comparar el
`<div className="mega-panel-visual">` de una línea con el `<button ref={toggleRef} ...>` multilinea
más abajo); el orden de los atributos JSX no importa.

Este único cambio cancela cualquier `setTimeout` armado por `scheduleClose()` en cuanto el mouse
entra al panel, sin importar por dónde haya entrado (directamente sobre el panel, o cruzando la
franja de padding del header desde el `<li>`). No se necesita ningún otro cambio: `closeTimerRef`
ya existe como ref module-level del componente (línea 112), `clearTimeout` ya se usa exactamente así
en `openPanel` (línea 122), `scheduleClose` (línea 127) y el `onClick` del backdrop (línea 323) — este
fix reutiliza el mismo patrón, solo en un cuarto punto de entrada.

**No tocar:** `openPanel`, `scheduleClose`, `finishSwap`, `handleContentTransitionEnd`, el efecto de
sincronización `displayedKey`/`isSwapping` (líneas 145-171), los handlers de Escape (líneas 189-201),
el `onMouseLeave`/`onBlur` de `.nav-region` (líneas 215-220), el `onMouseEnter`/`onFocus` de cada
`<li className="nav-item">` (línea 228-229), ni ninguna regla CSS de `.site-header`/`.nav-region`/
`.nav-item`/`.mega-panel` en `app/globals.css` — el fix es puramente cancelar el timer al entrar el
mouse al panel, no reposicionar ni cerrar la franja geométrica. No reintroducir ninguna regla
`:focus-within`/`:hover` en la cascada de visibilidad CSS (bug ya corregido en 260720-vda).
  </action>
  <verify>
    <automated>npx tsc --noEmit && grep -cF 'onMouseEnter={() => clearTimeout(closeTimerRef.current)}' components/menu-overlay.tsx | grep -qv '^0$' && npm run lint && npm run build && echo OK</automated>
  </verify>
  <done>
`components/menu-overlay.tsx` compila sin errores de tipo, pasa lint y build de producción; el div
`.mega-panel` tiene `onMouseEnter={() => clearTimeout(closeTimerRef.current)}`; ningún otro archivo ni
handler fue modificado.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Verificación real en navegador (build de producción) del fix de cierre prematuro</name>
  <what-built>
Un `onMouseEnter` en el `.mega-panel` que cancela el timer de cierre de 250ms en cuanto el mouse entra
al panel. Task 1 ya confirmó automáticamente que lint/typecheck/build están limpios — este checkpoint
cubre lo que la automatización de grep/tsc no puede juzgar por sí sola: el comportamiento real de
hover cruzando la franja del header, el cierre correcto cuando el mouse sale de verdad, y ausencia de
regresión en Escape/backdrop/mobile/drawer. Este componente tuvo bugs sutiles en 3 rondas anteriores
(260720-vda, 260721-1nn, 260721-td1) que pasaron checks automatizados pero fallaron en verificación
visual manual — no basta con confiar en aserciones de estado de React/CSS.
  </what-built>
  <how-to-verify>
1. Ejecutar `npm run build && npm run start`, abrir http://localhost:4173 en un navegador real a
   ~1440×900 (o 1920×1080).
2. Si tienes acceso a un CLI/MCP de Playwright (este proyecto ya usa uno — ver capturas y logs en
   `.playwright-cli/`), automatiza esta secuencia antes de la revisión visual manual: mover el mouse
   sobre el trigger "Nosotros" del nav (o cualquier ítem con panel) hasta que `#mega-panel-shared`
   tenga `data-open` presente; luego mover el mouse en pasos (no un salto instantáneo) desde las
   coordenadas del trigger hacia un punto dentro de `.mega-panel` (por ejemplo, sobre uno de los
   enlaces de `.mega-panel-links` o sobre el primer campo del formulario si el panel es Contacto);
   esperar 400-500ms (más que el timer de 250ms) sin mover el mouse; confirmar que `#mega-panel-shared`
   sigue teniendo `data-open` y que un clic sobre ese enlace/campo funciona (navega al ancla o recibe
   foco/texto, según corresponda) sin que el panel haya desaparecido antes del clic.
3. Con el panel todavía abierto, mover el mouse desde dentro de `.mega-panel` hacia un punto
   claramente fuera de `.nav-region` por completo (por ejemplo, hacia el contenido de la página varios
   cientos de px por debajo del header, no de vuelta al `<nav>`); esperar ~300-400ms y confirmar que el
   panel SÍ se cierra (visibility/opacity vuelven a su estado cerrado) — este paso confirma que el fix
   no rompió el cierre normal por hover-away.
4. Repetir el paso 2 manualmente con el mouse real (sin Playwright) para al menos 2 ítems distintos del
   nav, incluyendo movimientos lentos y rápidos, confirmando visualmente que el panel nunca parpadea ni
   desaparece mientras el mouse cruza la franja del header hacia el panel.
5. Presionar Tab hasta abrir un panel por foco, luego presionar Escape: confirmar que el panel se
   cierra visualmente y que el foco vuelve exactamente al trigger que lo abrió. Con un panel abierto,
   hacer clic en la zona oscurecida del backdrop y confirmar cierre inmediato sin demora.
6. Redimensionar a 390×844 o emular puntero táctil/coarse (DevTools > toggle device toolbar) y
   confirmar que el botón "Menú" y su overlay a pantalla completa funcionan exactamente igual que antes
   de este cambio (el fix no afecta esta ruta, ya que `onMouseEnter` no dispara en touch).
7. Abrir el drawer de un servicio desde "Capacidades" (clic en una fila de servicio, no en el trigger
   del nav) y confirmar que sigue abriéndose sin conflicto de z-index con el mega-panel/backdrop.
  </how-to-verify>
  <resume-signal>Escribe "aprobado" si los 7 pasos se ven correctos, o describe qué falta ajustar.</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|--------------|
| Mega-panel hover/timer | Cambio puramente de comportamiento de UI cliente (timer de cierre); sin input de usuario nuevo, sin endpoint nuevo, sin dato cruzando ningún límite de confianza |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-------------------|
| T-260722-cww-01 | S/T/R/I/D/E (general) | components/menu-overlay.tsx (.mega-panel onMouseEnter) | accept | Sin input de usuario nuevo, sin endpoint nuevo — solo cancela un `setTimeout` de UI existente; no hay superficie de ataque nueva |
| T-260722-cww-SC | Tampering | npm installs | accept | No aplica — este plan no instala ningún paquete nuevo |
</threat_model>

<verification>
- `npx tsc --noEmit`, `npm run lint`, `npm run build` limpios (Task 1, grep automatizado confirma el
  `onMouseEnter` agregado).
- Revisión humana en navegador (build de producción) confirma: el panel permanece abierto al mover el
  mouse desde el nav hacia el panel y esperar 400-500ms; un clic dentro del panel funciona tras ese
  movimiento; el panel sigue cerrando correctamente cuando el mouse sale hacia afuera de todo
  `.nav-region`; Escape/backdrop/mobile/drawer de servicio sin regresión (Task 2).
</verification>

<success_criteria>
- El mega-panel ya no se cierra prematuramente cuando el usuario mueve el mouse desde un ítem del nav
  hacia el panel — el usuario puede hacer clic en cualquier enlace o campo del panel sin que
  desaparezca antes.
- El cierre por hover-away (mouse saliendo de todo el conjunto nav+panel) sigue funcionando sin cambios.
- Cero regresión en Escape, backdrop, overlay mobile/pointer:coarse y drawer de servicio.
- Cambio de una sola línea en un solo archivo (`components/menu-overlay.tsx`); ningún otro mecanismo
  del componente (estado, CSS, otros handlers) fue modificado.
</success_criteria>

<output>
Crear `.planning/quick/260722-cww-corregir-bug-de-cierre-prematuro-del-meg/260722-cww-SUMMARY.md`
al finalizar.
</output>
