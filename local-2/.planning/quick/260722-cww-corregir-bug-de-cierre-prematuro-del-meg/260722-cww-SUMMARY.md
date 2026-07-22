---
quick_id: 260722-cww
status: complete
---

# Summary: Corregir bug de cierre prematuro del mega-panel

**Status:** complete — 2/2 tareas, incluyendo el checkpoint de revisión visual (hecho por
el orquestador) sobre un build de producción limpio.

## What changed

- **`components/menu-overlay.tsx`**: se agregó `onMouseEnter={() => clearTimeout(closeTimerRef.current)}`
  al `<div className="mega-panel">`. Cambio quirúrgico de un solo atributo — no se tocó
  ninguna otra parte de la máquina de estados (`openPanel`, `scheduleClose`, `finishSwap`,
  el efecto de sincronización `displayedKey`/`isSwapping`, los dos efectos de Escape, el
  wrapper `.nav-region`, ni el CSS).

## Root cause (diagnosticado por el orquestador antes de planificar)

El wrapper `.nav-region` (`display:contents`) solo tenía `onMouseLeave`/`onBlur`. Cada
`<li className="nav-item">` cancelaba el cierre programado vía `onMouseEnter`/`onFocus`,
pero el `.mega-panel` en sí (hermano de `<nav>` desde la refactorización a panel único de
260721-td1) no tenía ningún handler propio. Al mover el mouse desde el `<li>` hacia el
panel, el cursor cruza la franja del padding vertical de `.site-header` (~1.35rem) — una
zona que no pertenece a ningún descendiente de `.nav-region` (el `<li>` se estira solo
hasta el content-box del header vía `align-items:stretch`; el panel empieza en `top:100%`
relativo al padding-box del header, ya que `.site-header` es `position:fixed`). Cruzar esa
franja dispara `mouseleave` → `scheduleClose()` arma un timer de 250ms, que se ejecutaba
igual sin importar que el mouse ya estuviera dentro del panel.

## Verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build`: limpios.
- Verificación propia con Playwright sobre build de producción (movimiento de mouse real
  con `page.mouse.move({steps:15})`, no saltos instantáneos):
  - Hover en un ítem → mover el mouse hasta un enlace dentro del panel → esperar 500ms
    (el doble del timer de 250ms) → panel sigue `visibility:visible` → clic en "Historia"
    navega correctamente a `#historia`.
  - Hover → entrar al panel → confirmar que sigue abierto → mover el mouse lejos (fuera de
    `.nav-region` por completo) → esperar 500ms → panel y backdrop pasan a
    `visibility:hidden` correctamente (sin regresión del cierre por alejamiento).
  - Escape: cierra el panel visualmente y devuelve el foco al trigger exacto.
  - Clic en backdrop: cierra de inmediato.
  - Mobile/touch real (`hasTouch:true, isMobile:true`): overlay a pantalla completa sin
    cambios.
  - Drawer de servicio: sigue abriendo por encima de todo, sin conflicto de z-index.
  - 0 errores de consola; 0px de overflow horizontal.

## Commits

- `9246318` (ejecutor: fix de una línea).
