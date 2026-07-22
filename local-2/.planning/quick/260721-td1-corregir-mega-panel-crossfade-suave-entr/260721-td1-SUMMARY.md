---
quick_id: 260721-td1
status: complete
---

# Summary: Corregir mega-panel (crossfade, Proceso/Contacto, imagen)

**Status:** complete — 6/6 tareas, incluyendo el checkpoint de revisión visual (hecho por
el orquestador), que encontró y corrigió 2 bugs reales no detectados por lint/tsc/build
ni por el propio checkpoint del ejecutor.

## What changed

- **Panel único compartido**: los 6 ítems del nav ahora comparten un solo
  `<div className="mega-panel" id="mega-panel-shared">` (antes había uno por `<li>`).
  Su contenido se deriva de `displayedItem = navItems.find(i => i.key === displayedKey)`.
  Esto elimina de raíz el parpadeo original: ya no hay dos nodos DOM independientes
  compitiendo por visibilidad.
- **Crossfade real**: máquina de estados `displayedKey`/`isSwapping`/`pendingKeyRef`/
  `swapFallbackRef`. Al cambiar de ítem, el contenido actual baja opacidad y solo se
  reemplaza por el nuevo cuando termina su transición (`onTransitionEnd`, filtrado a
  `propertyName==="opacity"`), con un fallback de 400ms por si el evento no dispara.
  Verificado con muestreo real de opacidad: transición suave sin corte instantáneo.
- **`.nav-region`**: wrapper nuevo alrededor de `<nav>` + el panel, que ahora posee el
  guard de cierre (`onMouseLeave`/`onBlur`) — antes vivía en cada `<li>`, lo cual habría
  roto el hover/tab hacia el contenido del panel (incluyendo los campos del formulario de
  Contacto) una vez que el panel dejó de ser descendiente del `<li>`.
- **Proceso**: ahora abre panel con los 4 pasos existentes (`process` en
  `lib/site-content.ts`) como enlaces.
- **Contacto**: ahora abre panel de 2 columnas (intro + `<ContactForm />` real, mismo
  componente que usa la sección de Contacto de la página).
- **`ContactForm`**: `id="submit-button"`/`id="form-status"` + `form.querySelector`
  reemplazados por `useRef` — permite 2 instancias simultáneas en la página (panel +
  sección) sin ids HTML duplicados.
- **Capacidades**: imagen cambiada a `mineria-tajo-abierto.jpg` (antes compartía
  `dron.png` con Tecnología, que la conserva).

## Bugs found and fixed during my own verification (not caught by the plan-checker, lint/tsc/build, or the executor's own checks)

1. **Formulario de Contacto invisible**: `ContactForm` siempre renderiza con
   `data-reveal` (regla global `opacity:0` hasta que un `IntersectionObserver` de la
   sección le agrega `.is-visible`). El mega-panel no tiene ningún observer así — el
   formulario embebido quedaba permanentemente en `opacity:0`, presente en el DOM y
   funcional, pero invisible al 100%. Capturado con una captura de pantalla real (columna
   derecha completamente en blanco) y confirmado con `getComputedStyle(...).opacity==="0"`.
   **Fix**: nuevo prop `reveal` en `ContactForm` (default `true`, sin cambios para
   `contact-section.tsx`); el panel pasa `reveal={false}`.
2. **Carrera de estado al cerrar en medio de un crossfade**: `isSwapping`/
   `pendingKeyRef`/`swapFallbackRef` nunca se reseteaban al cerrar el panel (Escape, clic
   en backdrop, mouseleave) — solo `finishSwap()` los limpiaba. Si se cerraba durante un
   swap activo y de inmediato se pasaba el mouse a un ítem distinto dentro de la ventana
   de ~400ms del fallback, el nuevo swap no se programaba (`isSwapping` seguía en `true`)
   y el panel resolvía momentáneamente al ítem interrumpido en vez del que realmente se
   estaba pasando el mouse. Reproducido con un script de Playwright cronometrado
   (Escape a los 20ms de iniciado un swap, seguido de inmediato por hover a un tercer
   ítem) — confirmado el salto incorrecto antes del fix y la resolución directa/correcta
   después. **Fix**: al cerrar (`openKey === null`), se cancela cualquier swap en curso de
   forma síncrona.

## Verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build`: limpios (antes y después de mis
  2 fixes).
- Crossfade muestreado con opacidad real cada 30ms: transición fade-out→fade-in suave,
  sin corte instantáneo (a diferencia del comportamiento original reportado por el
  usuario).
- Los 6 paneles verificados visualmente: Nosotros, Capacidades (imagen nueva confirmada
  distinta de Tecnología), Tecnología, Proyectos, Proceso (4 pasos), Contacto (formulario
  completo y funcional).
- Formulario embebido: foco/escritura en los campos no cierra el panel; envío real
  probado (sin credenciales Supabase locales, responde 503 con el mensaje de fallback
  esperado — mismo comportamiento ya verificado en la sección de Contacto original); sin
  errores de ids duplicados en consola.
- Escape cierra visualmente el panel y el backdrop (`visibility:hidden` real, no solo
  `aria-expanded`), foco vuelve al trigger.
- Clic en el backdrop cierra de inmediato.
- Mobile/touch real (contexto Playwright `hasTouch:true, isMobile:true`): nav, backdrop
  ocultos; botón "Menú" y overlay a pantalla completa sin cambios.
- Drawer de servicio: sigue abriendo por encima de todo, sin conflicto de z-index con el
  backdrop del mega-panel.
- 0 errores de consola inesperados; 0px de overflow horizontal.

## Commits

- `c8c9c2b` (Task 1: ContactForm useRef base), `2a87345` (Task 2: navItems), `3cd3713`
  (Task 3: panel único + nav-region), `fa68c22` (Task 4: crossfade transitionend),
  `bc0e933` (Task 5: auto-fix de lint) — todos del ejecutor.
- `58b4381` (mis 2 fixes: ContactForm reveal prop + reset de isSwapping al cerrar).
