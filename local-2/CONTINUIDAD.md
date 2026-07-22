# Sky Tech Perú — ambiente local-2

## Propósito

Este directorio es un segundo ambiente de pruebas completamente local. La meta es transformar la web de Sky Tech Perú en una experiencia digital oscura, tecnológica y cinematográfica, inspirada en el lenguaje de movimiento de estudios creativos como Dogstudio, pero con composición, contenido e identidad propios.

## Límites obligatorios

- Trabajar únicamente dentro de `local-2/`.
- No modificar `../local/` ni `../produccion/`.
- No desplegar a Vercel ni a ningún servicio externo.
- Mantener `npm run deploy` bloqueado.
- Conservar la integración actual del formulario mediante `/api/contact`.
- Usar únicamente los recursos locales ubicados en `public/IMAGENES_PAGINA_WEB/`.

## Dirección creativa

- Fondo grafito casi negro y acento naranja corporativo.
- Tipografía editorial de gran escala.
- Navegación mínima y menú superpuesto.
- Hero de pantalla completa con capas topográficas y movimiento sutil.
- Animaciones vinculadas al desplazamiento: revelado, parallax, líneas y contadores.
- Casos/servicios presentados como escenas visuales, no como una cuadrícula corporativa genérica.
- Cursor contextual únicamente en dispositivos con puntero preciso.
- Movimiento reducido cuando el sistema indique `prefers-reduced-motion`.

## Plan de ejecución

1. Auditar estructura, recursos, contenido y estado técnico inicial.
2. Definir sistema visual, narrativa, componentes y sistema de movimiento.
3. Reemplazar la plantilla HTML inyectada por una implementación React/Next mantenible.
4. Implementar navegación, hero, manifiesto, servicios, proyectos, metodología y contacto.
5. Añadir animaciones progresivas y microinteracciones sin dependencias pesadas.
6. Ajustar escritorio, tableta y móvil; revisar accesibilidad y rendimiento.
7. Ejecutar `npm run lint`, `npm run typecheck` y `npm run build`.
8. Revisar visualmente el sitio local en varias resoluciones.

## Estado de avance

- [x] Se creó `local-2/` como copia verificada de `local/`.
- [x] Se confirmó que `local/` y `produccion/` permanecen intactos.
- [x] Se auditó la arquitectura inicial: Next.js 16, React 19, TypeScript y CSS global.
- [x] Se identificó la plantilla heredada (`landing-page-v4.html` + `lib/v4-template.ts`).
- [x] Sistema visual y narrativa implementados.
- [x] Interacciones y animaciones implementadas.
- [x] Responsive y accesibilidad base validados.
- [x] Lint, tipos y build aprobados.
- [x] Revisión visual final aprobada en escritorio y móvil.

## Decisiones técnicas

- Se evitará añadir una librería grande de animación: `IntersectionObserver`, `requestAnimationFrame` y CSS son suficientes para esta experiencia.
- La página principal se escribirá como JSX semántico para eliminar la dependencia de HTML inyectado.
- Las imágenes existentes se reutilizarán con `next/image` cuando sea apropiado.
- El formulario seguirá enviando JSON a `/api/contact`; su lógica visual pasará al nuevo componente cliente.
- El ambiente conserva los archivos de la plantilla V4 solamente como referencia; ya no forman parte del render activo.
- No se agregaron paquetes: el sistema de movimiento usa APIs del navegador y CSS.
- El segundo entorno se identifica permanentemente mediante la insignia `LOCAL · 2`.

## Implementación terminada

- Intro breve con barra de progreso y transición de color.
- Header fijo con mezcla de color y menú editorial a pantalla completa.
- Hero a pantalla completa con cuadrícula, órbitas, parallax y revelado tipográfico por líneas.
- Sección manifiesto con imagen de campo y métrica de precisión.
- Lista de seis capacidades con interacción de barrido en hover.
- Banda tipográfica continua y escena tecnológica sticky.
- Proceso en cuatro etapas y bloque de formatos de entrega.
- Contacto con formulario funcional, estados de envío y honeypot antispam.
- Cursor contextual para punteros precisos; desactivado en dispositivos táctiles.
- Adaptaciones específicas para 1000 px y 720 px.
- Fallback completo para `prefers-reduced-motion`.

## Validaciones realizadas — 17 de julio de 2026

- `npm.cmd run lint`: aprobado.
- `npm.cmd run typecheck`: aprobado.
- `npm.cmd run build`: aprobado; página principal prerenderizada y `/api/contact` dinámico.
- Escritorio revisado a `1440 × 900`.
- Móvil revisado a `390 × 844`.
- Ancho de documento verificado: sin overflow horizontal en ambas resoluciones.
- Consola del navegador: sin errores.
- Menú: apertura, cierre y estado accesible verificados.
- Formulario: envío simulado interceptando `/api/contact`; estado final de éxito verificado.
- No se hizo ningún despliegue.

## Adición de video — 17 de julio de 2026

- [x] Se seleccionó un video real donde el dron aparece claramente en movimiento.
- [x] El MP4 se guardó en `public/video/drone-flight-close.mp4`; no depende de recursos remotos al reproducirse.
- [x] Fuente y licencia registradas en `public/video/CREDITS.md`.
- [x] Integrado como fondo principal del hero con `autoplay`, `muted`, `loop`, `playsInline` y `preload="metadata"`.
- [x] La imagen topográfica anterior se conserva como poster y fallback si el video no carga.
- [x] Se agregó un control accesible para pausar y reanudar el video.
- [x] Con `prefers-reduced-motion: reduce`, el video se pausa automáticamente.
- [x] Reproducción verificada en escritorio y móvil; archivo servido localmente y sin errores de consola.
- [x] Resolución del archivo: 1280 × 720; duración detectada: 24.15 segundos; peso: 9.37 MB.
- [x] Sin overflow horizontal a 1440 × 900 ni 390 × 844 después de la integración.
- [x] La primera opción evaluada, con un dron lejano sobre un lago, fue descartada y eliminada porque el equipo no se distinguía durante gran parte del ciclo.

## Archivos previstos

- `app/page.tsx`: narrativa y estructura semántica.
- `app/globals.css`: sistema visual completo y responsive.
- `components/experience.tsx`: menú, scroll, cursor, revelados y formulario.
- `app/layout.tsx`: tipografías y metadatos corregidos.
- `CONTINUIDAD.md`: bitácora viva y punto de reanudación.

## Cómo ejecutar

```powershell
Set-Location F:\ClaudeCode\Pagina_Web_Mayra\local-2
npm.cmd run dev
```

La URL prevista es `http://localhost:4173`.

## Próximo paso exacto (histórico — superado por la fase GSD de abajo)

La transformación solicitada (v1, sin GSAP/Lenis) está terminada. Ver la sección "Milestone 2" para el trabajo actual en curso.

---

## Milestone 2 — Rediseño cinematográfico con GSAP + Lenis (iniciado 2026-07-18)

### Qué se pidió

El usuario quiere elevar `local-2` a un nivel de pulido visual/animado comparable a estudios creativos premium (referencia: dogstudio.co/mx), usando el flujo formal de GSD (planificación completa con research, requisitos, roadmap) y documentando todo para poder continuar si se agotan los tokens.

### Decisiones clave ya tomadas con el usuario

- **Stack de animación**: se aprueba agregar **GSAP + Lenis** (antes el proyecto usaba solo CSS + IntersectionObserver + rAF, sin librerías). Versiones investigadas: `gsap@^3.15.0`, `lenis@^1.3.25`, `@gsap/react@^2.1.2`. GSAP es 100% gratuito desde abril 2025 (incluye ScrollTrigger y SplitText, antes de pago).
- **Sin WebGL/shaders** en el hero — se evoluciona el video del dron existente, no se introduce un stack gráfico nuevo.
- **Se incluye deuda técnica en el alcance**: eliminar archivos legacy v4 (`landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx`), optimizar video (WebM/AV1, hoy pesa 9.37 MB) e imágenes (WebP), y refactorizar el patrón frágil `FormConnector` (acoplamiento por `querySelector`).
- **No se toca el copy/contenido actual** — solo visual y movimiento.
- **Ninguna sección es intocable** — todo abierto a rediseño.
- **Estructura del roadmap**: capas horizontales (no MVP vertical), porque es una sola página, no múltiples features independientes.
- Config GSD: modo YOLO, granularidad estándar, ejecución en paralelo, research/plan-check/verifier activados, modelos balanced (Sonnet).

### Estado de la inicialización GSD (todo dentro de `local-2/.planning/`)

- [x] `.planning/codebase/` — codebase mapeado (7 documentos: STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, INTEGRATIONS, CONCERNS). Commit `7f36b1a`.
- [x] `.planning/PROJECT.md` — contexto del proyecto, requisitos activos, decisiones clave. Commit `27a8053`.
- [x] `.planning/config.json` — preferencias de workflow. Commit `67fe959`.
- [x] `.planning/research/` — 4 investigaciones de dominio (STACK, FEATURES, ARCHITECTURE, PITFALLS) + `SUMMARY.md` sintetizado. Commit `86bfaaf`.
- [x] `.planning/REQUIREMENTS.md` — 24 requisitos v1 en 7 categorías (FOUND, ARCH, MOTION, SIGNATURE, POLISH, PERF, QA). Commit `26a8a6a`.
- [x] `.planning/ROADMAP.md` — 5 fases con cobertura 100% de los 24 requisitos. Commit `22a848b`.
- [x] `CLAUDE.md` generado con contexto de stack/convenciones/arquitectura para futuras sesiones. Mismo commit `22a848b`.

**Nota técnica**: el repo git vive en `F:\ClaudeCode\Pagina_Web_Mayra` (no dentro de `local-2/`), así que todos los commits de planning se hacen contra ese repo padre, con rutas relativas a `local-2/`.

### Las 5 fases del roadmap

1. **Motion Foundation & Architecture Cleanup** — Lenis+GSAP sincronizados en un solo loop rAF, `gsap.matchMedia()` para reduced-motion, `experience.tsx` descompuesto en componentes por sección, `FormConnector` y archivos legacy v4 eliminados. (Requisitos: FOUND-01/02/03, ARCH-01/02/03)
2. **GSAP-Native Reveal, Parallax, Cursor & Typography** — reveal/parallax/cursor/menú migrados de vanilla a GSAP/ScrollTrigger nativo, loop rAF manual eliminado, titulares con SplitText. (MOTION-01…05)
3. **Signature Moments** — transición tipo máscara hero→primera sección (el momento de mayor impacto visual), intro refinada con `ScrollTrigger.refresh()`. (SIGNATURE-01/02)
4. **Differentiators & Polish** — CTAs magnéticos (2-4 máx.), revelado de imágenes por wrapper+transform, marquee CSS puro, timeline de proceso scrubbed por scroll. (POLISH-01…04)
5. **Performance & Quality Gate** — video a WebM/AV1, imágenes a WebP, verificación con CPU throttling móvil, auditoría completa de reduced-motion, lint/typecheck/build limpios, formulario sin regresiones. (PERF-01…04, QA-01/02/03)

### Hallazgos técnicos críticos del research (evitar estos errores)

1. **Un solo loop de rAF**: Lenis debe inicializarse con `autoRaf: false` y alimentarse desde `gsap.ticker.add((t) => lenis.raf(t * 1000))`, con `lenis.on('scroll', ScrollTrigger.update)`. Dos loops compitiendo = jitter.
2. **`prefers-reduced-motion` no es solo CSS**: GSAP/Lenis lo ignoran por defecto — hay que envolver todo con `gsap.matchMedia()`.
3. **Usar `useGSAP()` de `@gsap/react`**, no `useEffect` crudo — evita fugas de memoria y problemas con el doble-render de StrictMode en React 19.
4. **GSAP/Lenis deben inicializarse solo dentro de un client boundary** — riesgo real de romper `npm run build` (hidratación/SSR) si no.
5. **El loop de parallax rAF manual actual debe eliminarse**, no coexistir con el nuevo sistema ScrollTrigger.
6. **Verificar rendimiento en `matchMedia` breakpoints desde el inicio**, no como ajuste posterior — el video de 9.37 MB ya compite por recursos en móvil.

### UI-SPEC de la Fase 1 — aprobado (2026-07-18)

- `.planning/phases/01-motion-foundation-architecture-cleanup/01-UI-SPEC.md` — commit `fa2170d`.
- Decisiones bloqueadas en el contrato de diseño:
  - **Sin librería de componentes** (shadcn omitido) — se sigue con CSS vanilla + variables propias.
  - **Lenis `lerp: 0.07`** en modo normal (sensación cinematográfica, más pesada que el default 0.1).
  - **`prefers-reduced-motion` = "suavizado, no apagado binario"**: con la preferencia activa, Lenis usa `lerp: 0.15` (más directo) y las animaciones GSAP se acortan/suavizan (menor duración/distancia, easing más suave) — NO se saltan instantáneamente al estado final ni se desactivan por completo. Esta interpretación ya quedó reflejada en `ROADMAP.md` (Fase 1, criterio de éxito #3, commit `35be6af`).
  - **Cero cambios visuales en esta fase** — tipografía/espaciado/color se heredan tal cual de `app/globals.css`; esta fase es puramente arquitectura/motor de animación.
- El verificador de UI (`gsd-ui-checker`) aprobó el spec con 3 flags no bloqueantes (todos justificados por ser una fase sin cambios visuales). Nota pendiente: cuando se redacte el UI-SPEC de la Fase 5, corregir también `ROADMAP.md` Fase 5 criterio #3 ("zero animations fire") para que coincida con el contrato "suavizado, no apagado" ya fijado aquí.

### Próximo paso exacto

El roadmap y el UI-SPEC de la Fase 1 están aprobados y comiteados. El siguiente paso es `/gsd-plan-phase 1` (o `/gsd-discuss-phase 1` antes, si se quiere afinar más contexto de implementación) para descomponer la Fase 1 en tareas ejecutables, seguido de `/gsd-execute-phase`. **Aún no se ha modificado ningún código de la aplicación** — todo el trabajo hasta ahora es planificación en `.planning/`.

Si se retoma tras un corte de contexto: leer este archivo, luego `local-2/.planning/PROJECT.md`, `local-2/.planning/ROADMAP.md` y `local-2/.planning/STATE.md` para recuperar el estado exacto.

---

## Milestone v1.0-corporate — estado al 2026-07-21

**Resumen:** las Fases 1-4 se ejecutaron con Claude (este agente); las Fases 5 y 6 las ejecutó **Codex** siguiendo un prompt de traspaso que replicaba el mismo flujo GSD (UI-SPEC → research → plan → execute → verify). Verifiqué el trabajo de Codex de forma independiente (build/lint/typecheck propios + revisión visual con Playwright) y es de calidad alta — honesto sobre lo que no pudo completar, sin fabricar contenido.

### Progreso: 22/22 requisitos completos (100%) — actualizado 2026-07-21

**Completo:** THEME-01..04, ARCH-01..03, SERV-01..03, HEAD-01/02, EQUIP-01, BRAND-01/02, PROJ-01, DIFF-01, QA-01/02, TEAM-01, BROCH-01, **QA-03**.

**Decisión del usuario (2026-07-21): TEAM-01 se cierra usando iniciales neutras (PC, HS, LZ, JG) como diseño final** — no se requieren fotos reales de los 4 geólogos, esto no es un placeholder temporal.

**BROCH-01 resuelto (2026-07-21):** el usuario proporcionó el PDF real (`public/brochures/skytech-solutions-brochure.pdf`, 55 MB). Se agregó el bloque de descarga en `projects-section.tsx` (después de Diferenciación, antes de Proceso, según el UI-SPEC de Fase 5) y se verificó en build de producción real (`npm run build && npm start`): `Content-Type: application/pdf`, tamaño exacto, magic bytes `%PDF-` confirmados en la respuesta HTTP real — no es un 404 ni el fallback HTML de Next.js.

**QA-03 resuelto (2026-07-21, quick task `260720-ud7`):** decisión del usuario — usar fotografía HD descargada de bancos de imágenes de licencia libre para uso comercial ("puedes descargar de internet, necesita quedar bien visualmente"). Se agregó una nueva sección "Sectores que atendemos" en `brand-section.tsx` (entre Misión/Visión y Valores corporativos) con 4 fotos: Topografía (reutiliza `monumentacion_puntos_referencia.png`), Geología, Minería e Infraestructura/ingeniería civil. Las 3 nuevas se descargaron de Unsplash verificando individualmente que cada una usa la licencia gratuita "Unsplash License" (no la de pago "Unsplash+"). Procedencia (fotógrafo, licencia, URL de origen) documentada en `public/IMAGENES_PAGINA_WEB/PROVENANCE.md`. Verificado en build de producción, sin overflow horizontal, sin errores de consola, en 1440×900 y 390×844.

### Cambios estructurales relevantes hechos por Codex en Fase 5
- Se eliminó `components/sections/manifesto-section.tsx` (contenía 3 afirmaciones inventadas del milestone anterior) y se reemplazó por `components/sections/brand-section.tsx` con historia/misión/visión/valores/equipo **verbatim** de `BRAND-CONTENT.md`.
- Se agregó `components/sections/projects-section.tsx` (GESAC destacado + Lezard/Las Dunas).
- El sitio pasó de 5 a **6 secciones numeradas**: 01 Nosotros, 02 Capacidades, 03 Tecnología, 04 Proyectos, 05 Proceso, 06 Contacto — el menú y los kickers se renumeraron en consecuencia.
- `workflow.use_worktrees` se puso en `false` en `.planning/config.json` (necesario para que Codex pudiera ejecutar — Codex no soporta el aislamiento con git worktrees que usa Claude).

### Verificación independiente (Fase 6, por Codex + confirmada por mí)
- `npm run lint && npm run typecheck && npm run build`: limpio.
- Pruebas de runtime reales (Playwright): menú con foco/Escape/Lenis, drawer con CTA y scroll diferido, formulario `/api/contact` probado con y sin credenciales (400/503 correctos, sin red externa), 0 errores de consola en 1440×900 y 390×844, sin overflow horizontal.
- Servidor de producción local sigue corriendo en `http://127.0.0.1:4173/` (no se desplegó a ningún lado externo).

### Próximo paso exacto

Los 22/22 requisitos del milestone v1.0-corporate están completos y verificados (`.planning/REQUIREMENTS.md`, `.planning/STATE.md`). **No se ha desplegado nada** — sigue vigente la regla dura de no desplegar a Vercel/ningún servicio externo sin aprobación explícita del usuario en la conversación activa. El siguiente paso, cuando el usuario lo pida, es una revisión final conjunta (visual + contenido) antes de considerar un despliegue autorizado.

Documentos clave para retomar: `.planning/REQUIREMENTS.md` (checklist 22/22), `.planning/STATE.md` (estado + tabla de quick tasks), `.planning/BRAND-CONTENT.md` (contenido de marca canónico), `public/IMAGENES_PAGINA_WEB/PROVENANCE.md` (procedencia de imágenes).

## Quick task 260720-vda — Rediseño del header a estilo Fugro (2026-07-21)

Trabajo posterior al cierre del milestone (22/22), pedido explícitamente por el usuario a partir de dos capturas de fugro.com. Flujo completo: discuss → research → plan → plan-checker (2 iteraciones, encontró 2 blockers reales: selector CSS `data-open` desalineado con su ancestro, y el handler de Escape no devolvía el foco al trigger) → executor → verificación visual propia con Playwright.

**Durante mi propia verificación** (más allá de lo que el ejecutor había comprobado) encontré un tercer bug no capturado por el plan-checker ni por el script de verificación del ejecutor: el fallback CSS `:focus-within` dejaba el mega-panel **visualmente abierto** después de Escape, aunque `aria-expanded` y el foco ya estaban correctos — porque el foco vuelve a un elemento que sigue siendo descendiente de `.nav-item`. Lo arreglé eliminando esa regla CSS redundante (la apertura ya la maneja el estado de React vía `onFocus`), reconstruí en producción y reverifiqué todo el flujo de teclado.

**Resultado:** header transparente/degradado sobre el hero (texto blanco, contraste verificado con muestreo de píxeles — ~9:1 incluso sobre las nubes más brillantes del hero) que pasa a blanco sólido al hacer scroll (reutiliza `useHeaderScrollState` de HEAD-01 sin tocar su lógica); nav horizontal con mega-menús accesibles por hover y teclado en Nosotros/Capacidades/Tecnología/Proyectos; overlay móvil a pantalla completa intacto, verificado con un contexto Playwright de touch real (`pointer:coarse`), no solo con resize de viewport. Sin regresiones en SERV-03 (drawer sigue dejando el header `inert`). Commits: `1a78571`, `9074a32`, `235d45b`, `72939df` (revisión del plan), `cd800f7` (fix de Escape), `4bfa0b7` (docs).

## Quick task 260721-1nn — Mega-panel a ancho completo estilo Fugro (2026-07-21)

Segunda iteración sobre el mismo header, pedida por el usuario tras ver el mega-panel inicial (dropdown pequeño de 260720-vda) contra la referencia real de fugro.com (sección "Expertise"): quería un panel a **todo el ancho de pantalla**, con un **backdrop que oscurece el resto de la página**, y contenido en **3 columnas** (título+descripción+"Ver overview" / enlaces / imagen destacada). Mismo flujo GSD completo: discuss (3 decisiones: fuente del copy, asignación de imágenes, backdrop clickeable) → research → plan → plan-checker (PASSED, 1 warning cosmético sobre z-index de `.custom-cursor`/`.environment-badge`, sin impacto funcional por ser `pointer-events:none`) → executor (interrumpido dos veces por errores de red/límite de sesión, cada vez retomado verificando primero el estado real en git antes de continuar) → verificación visual propia con Playwright.

**A diferencia de la ronda anterior, esta vez mi verificación independiente no encontró ningún bug nuevo** — específicamente reverifiqué el mismo tipo de fallo que había encontrado antes (Escape cerrando el estado ARIA/React pero no el panel visualmente) y esta vez `visibility` pasa a `hidden` correctamente porque la regla `:focus-within` nunca se reintrodujo.

**Resultado:** `.mega-panel` pasó de `position:absolute` anclado al `<li>` (ancho fijo 240px) a `position:absolute;width:100%` resuelto contra `.site-header` (que ya es `position:fixed`) — ancho completo, mismo borde superior sin importar qué ítem esté abierto. Nuevo `.mega-panel-backdrop` (`position:fixed;inset:0;z-index:450`, entre `.menu-overlay` y `.site-header`) que oscurece el contenido de fondo y cierra el panel al hacer clic (sin el delay de 250ms del hover). Contenido reorganizado en 3 columnas reutilizando copy 100% verbatim ya existente (`brandStory.about`, párrafos de `capabilities-section.tsx`/`equipment-carousel.tsx`, `differentiation.message`) e imágenes ya presentes en el sitio. Sin regresiones: mobile/`pointer:coarse` intacto (verificado con contexto de touch real), drawer de servicio sigue sin conflicto de z-index. Commits: `2d1819f`, `2938828`, `4cdb368` (docs).

Documentos: `.planning/quick/260720-vda-redise-ar-el-header-a-estilo-fugro-trans/` (CONTEXT, RESEARCH, PLAN, SUMMARY).

## Quick task 260721-td1 — Correcciones del mega-panel (2026-07-22)

Tercera iteración sobre el mismo header. El usuario reportó 3 problemas tras usar la versión de ancho completo: (1) parpadeo al pasar de un ítem a otro, (2) Proceso y Contacto no abrían panel — Contacto además debía incluir el formulario real, (3) Capacidades y Tecnología compartían la misma imagen. Mismo flujo GSD completo: discuss (3 decisiones: Proceso usa sus 4 pasos existentes, Contacto en 2 columnas con `<ContactForm/>` real, Capacidades → `mineria-tajo-abierto.jpg`) → research (diagnosticó la causa raíz del parpadeo: N paneles independientes con `visibility` cambiando instantáneo mientras `opacity` seguía animando) → plan (6 tareas: panel único compartido, crossfade con `transitionend` + fallback de 400ms, wrapper `.nav-region` para el guard de cierre, `useRef` en `ContactForm` para evitar ids duplicados) → plan-checker (PASSED) → executor (interrumpido dos veces por errores de red, cada vez retomado verificando el estado real primero) → verificación visual propia.

**Encontré y corregí 2 bugs reales que ni el plan-checker ni el ejecutor detectaron:**
1. El formulario embebido en el panel de Contacto se renderizaba con `data-reveal` (opacidad 0 hasta que un `IntersectionObserver` de sección le agrega `.is-visible`) — el mega-panel no tiene ese observer, así que el formulario quedaba invisible al 100%, funcional pero nunca mostrado. Confirmado con una captura real (columna derecha en blanco) y con `getComputedStyle`. Arreglado con un prop `reveal` en `ContactForm` (default `true`, sin cambios para la sección de Contacto normal).
2. Una condición de carrera real: si se cerraba el panel (Escape/backdrop/mouseleave) en medio de una transición cruzada y de inmediato se pasaba el mouse a un tercer ítem dentro de los ~400ms del fallback de seguridad, el nuevo cambio no se programaba (el flag `isSwapping` seguía en `true`) y el panel resolvía momentáneamente al ítem interrumpido en vez del que realmente se estaba hovering. Reproducido con un script de Playwright cronometrado al milisegundo antes del fix, confirmado resuelto después.

**Resultado:** panel único compartido con crossfade real (fade-out→fade-in, sin corte instantáneo, verificado con muestreo de opacidad cada 30ms); los 6 ítems del nav abren panel; Contacto tiene el formulario real funcionando (probado end-to-end: escribir en los campos no cierra el panel, envío real sin credenciales Supabase locales responde con el mismo mensaje de fallback ya verificado en la sección principal, sin ids duplicados); Capacidades y Tecnología con imágenes distintas. Sin regresiones: Escape/backdrop/mobile/drawer de servicio verificados de nuevo, todos correctos. Commits: `c8c9c2b`, `2a87345`, `3cd3713`, `fa68c22`, `bc0e933` (ejecutor), `58b4381` (mis 2 fixes), `6bb8cc2` (docs).

Documentos: `.planning/quick/260721-td1-corregir-mega-panel-crossfade-suave-entr/` (CONTEXT, RESEARCH, PLAN, SUMMARY).

## Análisis de referencia Fugro + polish de motion/jerarquía (2026-07-22)

Pedido explícito del usuario: analizar `fugro.com` como referencia de diseño/movimiento/UX (Chrome DevTools MCP + Playwright CLI) y aplicar un nivel similar de fluidez/jerarquía a `local-2`, sin copiar nada literal. Flujo: inspección del proyecto → checkpoint de git (`e83dd75`, limpio) → análisis de Fugro delegado a un subagente (Playwright CLI, ya que Chrome DevTools MCP no estaba disponible al inicio de la tarea) → `DESIGN_ANALYSIS_FUGRO.md` (15 secciones, 19 capturas de referencia interna, conclusión: Fugro usa CSS puro/styled-components, sin GSAP/Framer/Lenis/Three.js) → mapeo de 4 principios a componentes reales → implementación → verificación con Chrome DevTools MCP (ya disponible) + Playwright CLI.

**Mejoras aplicadas** (CSS + un hook nuevo, cero dependencias): indicador de sección activa en el header (subrayado, `use-active-section.ts`), token `--ease-snap` unificando el hover de todos los CTAs, hover plano (sin sombra) en tarjetas de proyectos/valores/sectores/equipo, máscara `clip-path` de revelado en las imágenes de "Sectores que atendemos". Se descartó deliberadamente replicar la barra sticky secundaria "Jump to" de Fugro (nuestro header ya es sticky, a diferencia del de ellos) y cualquier instalación de librería nueva.

**2 bugs reales encontrados y corregidos durante la verificación** (Lighthouse vía Chrome DevTools MCP, no solo capturas):
1. El nav de escritorio se gateaba solo por `pointer:fine`, sin piso de ancho — el botón "Contáctanos" quedaba cortado fuera del viewport en ventanas de escritorio angostas (~768–950px, confirmado con capturas + medición de `getBoundingClientRect`). Corregido añadiendo `and (min-width:1000px)` a la media query.
2. Accesibilidad (Lighthouse `label-content-name-mismatch`, WCAG 2.5.3): el `aria-label` del logo no incluía el símbolo decorativo "✳" en la comparación de texto visible. Corregido con `aria-hidden` en el símbolo + `span` `sr-only` en vez de `aria-label` parcial.

**Resultado verificado:** Lighthouse 100/100/100/100 (accesibilidad/best-practices/SEO/agentic) en desktop y mobile, 0 audits fallidos; LCP 1453ms, CLS 0.00; 0px overflow horizontal en 1440×900/1280×800/768×1024/390×844; `prefers-reduced-motion` neutraliza todo lo nuevo automáticamente (regla global ya existente); navegación por teclado verificada de punta a punta incluyendo el formulario embebido. Commit: `6bdb85e`.

Documentos: `DESIGN_ANALYSIS_FUGRO.md`, `IMPLEMENTATION_REPORT.md` (raíz de `local-2/`).

## Backup V1 (2026-07-22)

A pedido explícito del usuario ("haz un backup, cuando yo diga V1 debemos volver a este punto"), se creó el tag de git anotado `V1` en el commit `e449faf` (estado justo después del polish inspirado en Fugro, antes del fix del bug de hover del mega-panel de abajo). Para volver a ese punto cuando el usuario diga "V1": confirmar con el usuario y ejecutar `git reset --hard V1` (operación destructiva, requiere confirmación explícita en el momento).

## Quick task 260722-cww — Bug de cierre prematuro del mega-panel (2026-07-22)

El usuario reportó (con captura) que al bajar el mouse desde un ítem del nav hacia el mega-panel, este desaparecía y no dejaba interactuar con su contenido. Diagnostiqué la causa raíz antes de planificar (sin research adicional): el wrapper `.nav-region` solo cancelaba el cierre programado desde el `<li>` del nav (`onMouseEnter`/`onFocus`), pero el `.mega-panel` en sí — hermano de `<nav>` desde la refactorización a panel único de 260721-td1 — no tenía ningún handler propio. Al cruzar la franja del padding vertical del header (~1.35rem, zona que no pertenece a ningún descendiente de `.nav-region` por la diferencia entre el content-box donde se estira el `<li>` y el padding-box donde empieza `top:100%` del panel), el mouse disparaba `mouseleave` → `scheduleClose()` armaba un timer de 250ms que se ejecutaba igual sin importar que el usuario ya estuviera dentro del panel.

**Fix** (quick task con `--validate`, sin discuss/research ya que la causa raíz estaba clara): una sola línea — `onMouseEnter={() => clearTimeout(closeTimerRef.current)}` en el `.mega-panel`. Plan-checker: PASSED sin observaciones. Verificación propia con Playwright usando movimiento de mouse real (`page.mouse.move({steps:15})`, no saltos instantáneos): hover → mover al panel → esperar 500ms (el doble del timer) → panel sigue abierto y el clic en un enlace navega correctamente; hover → panel → alejar el mouse → cierra correctamente. Sin regresión en Escape, backdrop, mobile/touch real, ni drawer de servicio. Commit: `9246318` (fix), `f5d811d` (docs).

Documentos: `.planning/quick/260722-cww-corregir-bug-de-cierre-prematuro-del-meg/` (PLAN, SUMMARY).

## Quick task 260722-evm — Integración de biblioteca multimedia curada por el usuario (2026-07-22)

El usuario creó su propia biblioteca de medios en `public/media-library/` (9 fotos HD 2400px + 4 videos, licencias Pexels/Unsplash, verificadas con SHA-256, sin generación por IA), con `README.md` (recomendación por sección + prioridad de implementación) y `PROVENANCE.md` (autor/fuente/licencia/hash) ya escritos por él mismo. Pidió: "usa el nuevo contenido visual, videos, fotos y colócalos en la página". Su propio README ya resolvía todas las decisiones de ubicación — se usó como especificación autoritativa sin volver a preguntar.

**Implementado** (prioridades 1-4 del propio README del usuario): Hero (video cambiado a `hero-drone-in-flight.mp4`, el dron aparece claramente en vuelo), Capacidades (nuevo panel visual con estación total + RTK — antes sin ninguna imagen), Sectores (3 de 4 imágenes de la banda "Sectores que atendemos" actualizadas: Minería/Infraestructura/Geología), Proceso (nueva imagen + leyenda de coordinación técnica), Contacto (backdrop reemplazado por foto vertical de piloto de dron). Procedencia propagada a `public/IMAGENES_PAGINA_WEB/PROVENANCE.md` y `public/video/CREDITS.md`.

**Diferido explícitamente** (prioridad 5 del propio README): 2 videos 4K de b-roll de sectores (~90-98MB cada uno, 3840×2160 reales). El README del usuario exige generar derivados web de 1080p antes de servirlos en producción — este entorno no tiene `ffmpeg` disponible, así que no se generaron esos derivados; se documentó como bloqueo técnico honesto en vez de servir los archivos maestros pesados o fabricar un workaround.

**Respetado sin excepciones** (regla explícita del usuario sobre no atribuir stock a VIG/SkyTech): retratos del equipo (siguen con iniciales), carrusel de equipos (sigue mostrando equipos reales), brochure, y las 3 fichas de proyectos reales con nombre (GESAC/Lezard/Las Dunas) — ningún medio de stock nuevo se asoció a ellas.

**Verificado:** lint/typecheck/build limpios; Lighthouse (Chrome DevTools MCP) 100/100/100/100, 61/61 audits, sin regresión; LCP 1585ms/CLS 0.00 sin regresión por el nuevo video del hero; 0px overflow en las 4 resoluciones; 0 errores de consola. Commit: `891c1af`.

Documentos: `.planning/quick/260722-evm-integrar-biblioteca-multimedia-curada-po/` (CONTEXT, SUMMARY).

## Backup v2 + Quick task 260722-gmy — Correcciones posteriores a auditoria (2026-07-22)

Antes de modificar se creo el tag anotado `v2` en `e1ee23a`, a pedido explicito del
usuario. La orden futura "regresa a v2" significa restaurar el codigo rastreado de
`local-2` a ese punto, sin tocar `local/` ni `produccion/` y confirmando antes cualquier
operacion destructiva.

La auditoria detecto tres causas estructurales: mosaico de Capacidades con ~406px de
vacio, Tecnologia con un sticky de 180vh que generaba ~720px de scroll sin cambio y un
carrusel de dos imagenes verticales de 835x1067. Tambien se corrigieron contraste del
hero, densidad de Nosotros/Proceso, proyectos con apariencia incompleta y fotografia de
Contacto debajo del formulario.

**Resultado:** hero legible; mosaico 1+2; Tecnologia sin sticky (810px desktop/621px
movil); carrusel horizontal con peek, contador y progreso (936x550 desktop); valores y
perfiles con divulgacion progresiva accesible en movil; proyectos con visual cartografico
abstracto sin atribuir stock a clientes; Contacto con imagen contenida. Se retiraron
`240K`, `45MP` y `Matrice 350 RTK` por no estar confirmados en el brief y se usaron
RTK/PPK, LiDAR y CAD/GIS, que si son capacidades canonicas.

**Metros finales:** desktop 16,909px -> 14,754px; movil 21,761px -> 16,563px; cero
overflow horizontal. `lint`, `typecheck` y `build` limpios; Playwright confirmo drawer,
Escape, carrusel 01->02 y controles `aria-expanded`; cero errores de consola. No hubo
despliegue.

Documentos: `.planning/quick/260722-gmy-corregir-hallazgos-de-auditoria-visual-t/`
(CONTEXT, SUMMARY).
