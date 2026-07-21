# Browser matrix — production local

URL probada: `http://127.0.0.1:4173/`. Build de producción final, listener y PID verificados en `quality-gates.md`.

## Matriz responsive

| Viewport | Recorrido vertical completo | `scrollWidth-clientWidth` | h1 | console errors | Resultado | Screenshot |
|---|---:|---:|---:|---:|---|---|
| 1440x900 | sí | 0 | 1 | 0 | PASS | `desktop-full.png` |
| 1000x800 | sí | 0 | 1 | 0 | PASS | `tablet-full.png` |
| 390x844 | sí | 0 | 1 | 0 | PASS | `mobile-full.png` |
| 320x568 | sí | 0 | 1 | 0 | PASS | `narrow-full.png` |

La consola produjo una clase de warning no bloqueante: el poster hero precargado puede no consumirse inmediatamente porque el video toma el plano visible. No hubo `console.error` ni `pageerror`. La única supresión global `overflow-x` sigue siendo la preexistente en `body`; no se agregó ninguna.

## Combined stress test

- Header: en top `.is-scrolled=false`; al pasar 80 px cambia a `true`; al volver cambia a `false`. Altura estable `72.1875px`, sin flicker ni layout shift.
- Menú: seis destinos visibles y alcanzables en 1440x900 y 320x568; Lenis pasa a `lenis-stopped`; foco entra en Nosotros. Se reprodujo y corrigió el único gap: Escape ahora cierra, libera Lenis y restaura foco al toggle.
- Exclusión: con drawer abierto el toggle tiene `aria-disabled=true`; no pueden coexistir.
- Drawer: diálogo modal, foco inicial en Cerrar, background nativo inert por `showModal`, `data-lenis-prevent` interno, Escape/backdrop/botón Cerrar funcionan y el foco regresa al servicio. El panel conserva su scroll interno cuando el contenido excede el alto.
- CTA: se reprodujo y corrigió una carrera entre `dialog.onClose` y Lenis. `Cotizar este servicio` ahora deja `drawerOpen=false`, Lenis activo y `#contacto` en top `1px`.
- Sticky: `.tech-sticky` mantiene `position: sticky`, libera antes del showcase y el showcase está después en orden DOM/visual, con fondo y `z-index` propios.
- Carrusel: viewport enfocado pasa 1→2 con ArrowRight y 2→1 con ArrowLeft; botones extremos, dots, `aria-selected` y live `Equipo N de 2` coinciden. `data-lenis-prevent` presente.
- Pointer y touch: drag horizontal desde área libre cambia 1→2. Touch CDP emulado cambia 1→2; gesto vertical simultáneamente permitido mueve `scrollY` de 10683 a 10908. Overflow permanece 0.
- No autoplay: el live region permaneció `Equipo 1 de 2` tras 10.5 segundos sin input. No hay `autoplay`, `setInterval` ni `setTimeout` en `equipment-carousel.tsx`.

Screenshot de estado principal del carrusel: `carousel-desktop.png`.

## Reduced motion

| Viewport | Video paused | reveals ocultos | transición header | control carrusel | drag | overflow |
|---|---:|---:|---:|---|---|---:|
| 1440x900 | sí | 0 | `0.00001s` | instantáneo a equipo 2 | preservado | 0 |
| 390x844 | sí | 0 | `0.00001s` | instantáneo a equipo 2 | preservado | 0 |

Evidencia: `reduced-1440.png`, `reduced-390.png`.

## Keyboard, no-JS y zoom 200%

- Keyboard-only: foco visible (`outline-style:auto` sobre primer destino), orden lógico; menú/drawer cierran con Escape y restauran foco. Todos los campos visibles del formulario permanecen tabulables; honeypot está fuera del tab order.
- JavaScript disabled, 390x844: intro `display:none`; 0 reveals esenciales ocultos; Nosotros, Proyectos, Contacto y enlace email presentes; h1=1; overflow 0. Evidencia: `no-js-mobile.png`.
- El harness no expone zoom real de navegador. El intento diagnóstico `body.style.zoom=2` no se tomó como gate porque escala también bandas/orbitas deliberadamente recortadas y reporta un falso `+51px`. El proxy reproducible correcto usa viewport CSS efectivo 720x450 (equivalente a 1440x900 a 200%): overflow 0, h1=1, toggle visible y 29 controles visibles. Evidencia: `zoom-200-effective-viewport.png`.

## Repairs

Solo se tocaron los componentes que fallaron:

1. `menu-overlay.tsx`: Escape, entrada de foco y restauración al toggle.
2. `service-drawer.tsx`: scroll a contacto 50 ms después de completar el cierre y reiniciar Lenis.

Cada reparación fue seguida por lint, typecheck, build y retest. No hubo rediseño, dependencia, copy, color, asset ni workaround global nuevo.
