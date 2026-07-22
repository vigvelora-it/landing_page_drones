# Informe de implementación — mejoras inspiradas en fugro.com

> Trabajo realizado sobre `local-2` (Next.js 16 / React 19 / TypeScript / CSS vanilla,
> sitio corporativo de SkyTech Solutions). Referencia de diseño: `https://www.fugro.com/`,
> analizada en `DESIGN_ANALYSIS_FUGRO.md`. Ningún texto, imagen, logo, video, icono, código
> o composición exacta de Fugro fue copiado — solo principios generales de diseño/motion.

## Resumen de los cambios

Se aplicaron 5 mejoras puntuales, cada una justificada por un principio concreto extraído
del análisis de Fugro y aterrizado en una necesidad real de `local-2` (jerarquía, foco de
atención, continuidad del scroll, percepción de calidad) — no se agregó movimiento de
forma indiscriminada:

1. **Indicador de sección activa en el header** — subrayado que se desplaza al ítem del
   nav correspondiente a la sección visible, actualizado mediante scroll.
2. **Micro-interacciones de botones más "precisas"** — nuevo token de easing simétrico
   compartido (`--ease-snap`) aplicado a todos los CTAs/enlaces con hover.
3. **Hover de tarjetas** (proyectos, valores, sectores, equipo) — señal de interactividad
   plana (sin sombra), consistente con la estética ya establecida del sitio.
4. **Máscara de revelado progresivo** en las imágenes de la banda "Sectores que
   atendemos" — clip-path wipe en vez de solo fade.
5. **Corrección de un bug de layout preexistente** encontrado durante la verificación:
   el header desbordaba el viewport (botón "Contáctanos" cortado) en anchos de escritorio
   angostos (~768–950px) porque el nav de escritorio se activaba solo por tipo de puntero,
   sin considerar el ancho disponible.
6. **Corrección de un hallazgo de accesibilidad** (Lighthouse): el enlace del logo tenía
   un `aria-label` que no incluía todo su texto visible (mismatch WCAG 2.5.3).

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `app/globals.css` | Nuevo token `--ease-snap`; hover de `.nav-cta`/`.brochure-cta`/`.service-drawer-cta`/`.submit-button`/`.circle-link` migrado a ese token; hover nuevo en `.project-card`/`.value-card`/`.sector-card`/`.team-card`; máscara `clip-path` en `.sector-card__frame`; subrayado de sección activa en `.nav-item>a`; fix de breakpoint (`@media(pointer:fine)` → `@media(pointer:fine) and (min-width:1000px)`) |
| `components/menu-overlay.tsx` | Integra `useActiveSection`, aplica clase `.is-active` al ítem de nav correspondiente; fix de accesibilidad en el enlace del logo (`aria-hidden` en el símbolo decorativo + texto sr-only en vez de `aria-label` parcial) |
| `app/page.tsx` | `aria-hidden="true"` en el símbolo decorativo del footer (consistencia) |

## Archivos nuevos

| Archivo | Propósito |
|---|---|
| `DESIGN_ANALYSIS_FUGRO.md` | Informe de análisis de fugro.com (Fase 5 del pedido) — estructura, tipografía, color, espaciado, catálogo de animaciones, tecnología probable, rendimiento/accesibilidad |
| `hooks/use-active-section.ts` | Hook reutilizable: `IntersectionObserver` sobre una lista de ids de sección, devuelve el id actualmente visible |

## Dependencias instaladas

**Ninguna.** Todo se implementó con CSS moderno (`clip-path`, `cubic-bezier`, custom
properties) y `IntersectionObserver`, reutilizando GSAP/Lenis ya presentes en el proyecto
(no se tocaron). Se evaluó y se descartó instalar cualquier librería nueva — el análisis de
Fugro (sección 11 de `DESIGN_ANALYSIS_FUGRO.md`) concluyó que el propio sitio de referencia
tampoco usa una librería de animación JS dedicada para su motion principal.

## Mapeo: patrón de Fugro → adaptación en local-2

| Patrón observado en Fugro | Adaptación en local-2 | Animación | Activador | Tecnología |
|---|---|---|---|---|
| Ítem de nav activo con subrayado | `.nav-item.is-active>a:after` | `transform:scaleX()` wipe | Scroll (sección visible) | CSS + `IntersectionObserver` |
| Botón outline→sólido, easing simétrico ~0.2s | Unificación de hover de CTAs con `--ease-snap` | `background`/`color`/`transform` | hover/focus | CSS transition |
| Glass cards sobre fotografía documental | Hover con lift (translateY) en tarjetas, sin sombra | `transform` | hover | CSS transition |
| (Principio general: "revelado progresivo") | Máscara `clip-path` en imágenes de sectores | `clip-path` wipe | Scroll-into-view (observer ya existente) | CSS transition |

**Deliberadamente NO adaptado** (documentado en `DESIGN_ANALYSIS_FUGRO.md` §13): la barra
de navegación secundaria sticky "Jump to" de Fugro no se replicó como una segunda barra —
nuestro header principal ya es sticky/reactivo al scroll (a diferencia del de Fugro, que no
lo es), así que esa necesidad ya estaba cubierta; en su lugar se adaptó el mismo principio
de "orientación durante el scroll" como un subrayado de sección activa dentro del header que
ya existe, evitando duplicar UI. Tampoco se replicó el mega-menú de 3 columnas como patrón
nuevo (ya existía uno propio construido en sesiones anteriores) ni el volumen de martech,
CMS headless o video adaptativo (fuera de alcance/proporción para este sitio).

## Decisiones descartadas y motivo

| Decisión considerada | Motivo del descarte |
|---|---|
| Segunda barra de navegación sticky tipo "Jump to" | Redundante: el header principal de local-2 ya es sticky con estado reactivo al scroll (HEAD-01), a diferencia de Fugro cuyo header NO es sticky (por eso ellos necesitan la barra secundaria) |
| Parallax adicional en las nuevas tarjetas | El sitio ya tiene parallax en hero/tecnología; añadir más se sentiría redundante y no aporta jerarquía nueva |
| Reescribir el mega-menú para imitar el de Fugro literalmente | Ya existe un mega-menú propio (ancho completo + backdrop + crossfade) construido y verificado en rondas anteriores; no se justifica reconstruirlo por esta tarea |
| Instalar Framer Motion / GSAP adicional para el subrayado o el hover de tarjetas | CSS puro es suficiente para transiciones de esta simplicidad; GSAP ya se reserva para lo que CSS no puede resolver (scroll-trigger del header, carrusel) |
| Máscara `clip-path` aplicada a más elementos (equipo, proyectos) | Alcance acotado a `sectors-grid` para evitar "animación por todas partes" — variación visual con coherencia, no repetición indiscriminada |

## Consideraciones responsive

- Verificado en las 4 resoluciones pedidas: 1440×900, 1280×800, 768×1024, 390×844 — 0px de
  overflow horizontal en las cuatro.
- Bug real encontrado y corregido: el nav de escritorio (gateado antes solo por
  `pointer:fine`) desbordaba el header en ventanas de escritorio angostas (768–950px
  aprox.). Ahora requiere además `min-width:1000px`; por debajo de eso, el botón "Menú" +
  overlay a pantalla completa (ya existente, sin cambios) se activa sin importar el tipo de
  puntero.
- El subrayado de sección activa y el hover de tarjetas son puramente CSS/observer, sin
  lógica adicional por breakpoint — se comportan igual en todos los tamaños donde el nav de
  escritorio está visible.

## Consideraciones de accesibilidad

- Lighthouse (Chrome DevTools MCP), navegación real contra el build de producción:
  **Accessibility 100/100** en desktop y mobile, **0 audits fallidos** (61/61 en desktop,
  59/59 en mobile) tras el fix del `aria-label`.
- `prefers-reduced-motion: reduce` verificado con Playwright (`page.emulateMedia`): todas
  las transiciones nuevas (hover de botones/tarjetas, subrayado, máscara de imagen) quedan
  neutralizadas automáticamente por la regla global ya existente
  (`*,*:before,*:after{transition-duration:.01ms!important}`) — no fue necesario escribir
  ninguna regla nueva de reduced-motion.
- Navegación por teclado verificada de punta a punta: `Tab` alcanza cada ítem del nav,
  abre su mega-panel (incluyendo el de "Contacto" con el formulario real), y el foco entra
  correctamente en los campos del formulario con anillo de foco visible.
- Corrección de un hallazgo real: el enlace del logo (`<a className="brand">`) tenía un
  `aria-label` que no incluía el símbolo decorativo "✳" en su comparación de texto visible
  vs. nombre accesible (regla axe `label-content-name-mismatch`, WCAG 2.5.3). Se resolvió
  marcando el símbolo `aria-hidden="true"` y reemplazando el `aria-label` por un `span`
  `sr-only` dentro del propio contenido, de forma que el nombre accesible se deriva
  directamente del contenido visible (sin posibilidad de mismatch).

## Consideraciones de rendimiento

- Performance trace (Chrome DevTools MCP) contra el build de producción, sin throttling:
  **LCP 1453ms**, **CLS 0.00**, **TTFB 13ms**. El LCP está dominado por el retraso de
  render (~1439ms), que corresponde al timer de la secuencia de introducción ya existente
  en el sitio (no introducido por este trabajo) — sigue dentro del rango "bueno" de Core
  Web Vitals (<2.5s).
- Ninguna de las mejoras nuevas agrega JavaScript de animación: todo es CSS (`transition`,
  `clip-path`) más un `IntersectionObserver` liviano (mismo patrón ya usado en cada sección
  del sitio) — sin impacto de peso de bundle ni de bloqueo de hilo principal.
- Cero dependencias nuevas instaladas.

## Resultado de las pruebas

| Prueba | Resultado |
|---|---|
| `npm run lint` | Limpio, 0 errores/warnings |
| `npx tsc --noEmit` | Limpio, 0 errores de tipo |
| `npm run build` | Compila y prerrenderiza sin advertencias |
| Lighthouse desktop (Chrome DevTools MCP) | Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100 — 61/61 audits |
| Lighthouse mobile (Chrome DevTools MCP) | Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100 — 59/59 audits |
| Performance trace | LCP 1453ms, CLS 0.00, TTFB 13ms |
| Consola del navegador | 0 errores/advertencias en toda la sesión de verificación |
| Overflow horizontal | 0px en 1440×900, 1280×800, 768×1024, 390×844 |
| `prefers-reduced-motion` | Todas las transiciones nuevas neutralizadas correctamente |
| Navegación por teclado | Verificada de punta a punta, incluyendo el formulario embebido |

## Errores encontrados y corregidos

1. **Header desbordado en anchos de escritorio angostos (768–950px)** — botón
   "Contáctanos" cortado fuera del viewport. Causa: el nav de escritorio se activaba solo
   por `pointer:fine`, sin piso de ancho. Corregido añadiendo `and (min-width:1000px)` a la
   media query (reutilizando el breakpoint `1000px` ya establecido en el resto del
   proyecto, sin introducir un valor mágico nuevo).
2. **Mismatch de accesibilidad en el enlace del logo** (`label-content-name-mismatch`,
   Lighthouse). Corregido con `aria-hidden` en el símbolo decorativo + `span` `sr-only`
   dentro del contenido en vez de un `aria-label` externo parcial.

Ningún otro problema (elementos cortados, animaciones bruscas, saltos de layout, scroll
horizontal, bajo contraste, errores de consola, problemas de hidratación) fue detectado en
la verificación final.

## Comandos para ejecutar el proyecto

```bash
cd local-2
npm install
npm run build
npm start -- -p 4173
# abrir http://localhost:4173
```

Para desarrollo (hot reload):

```bash
cd local-2
npm run dev
```

## Tabla final

| Sección | Animación aplicada | Activador | Tecnología | Responsive | Reduced motion |
|---|---|---|---|---|---|
| Header / nav | Subrayado de sección activa | Scroll (sección visible) | CSS + IntersectionObserver | Solo desktop ≥1000px con puntero fino | Sí (regla global) |
| Header / CTAs y enlaces | Hover más preciso (`--ease-snap`) | hover/focus | CSS transition | Todos | Sí (regla global) |
| Nosotros → Sectores que atendemos | Máscara `clip-path` de imagen | Scroll-into-view | CSS + IntersectionObserver (ya existente) | Todos | Sí (regla global) |
| Proyectos / Valores / Equipo / Sectores | Hover con lift (tarjetas) | hover | CSS transition | Solo desktop (hover real) | Sí (regla global) |
| Header (fix) | — (bug de layout, no animación) | Ancho de viewport | CSS media query | Corregido en 768–950px | N/A |

---

*Trabajo realizado dentro de `local-2/` únicamente. `../local/` y `../produccion/` no fueron
tocados. No se desplegó nada — el proyecto queda ejecutable localmente en
`http://localhost:4173`.*
