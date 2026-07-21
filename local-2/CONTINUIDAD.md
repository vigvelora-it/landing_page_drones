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

### Progreso: 20/22 requisitos completos (91%) — actualizado 2026-07-21

**Completo:** THEME-01..04, ARCH-01..03, SERV-01..03, HEAD-01/02, EQUIP-01, BRAND-01/02, PROJ-01, DIFF-01, QA-01/02, **TEAM-01**.

**Decisión del usuario (2026-07-21): TEAM-01 se cierra usando iniciales neutras (PC, HS, LZ, JG) como diseño final** — no se requieren fotos reales de los 4 geólogos, esto no es un placeholder temporal.

**Aún bloqueado — requiere assets reales del usuario:**
1. **BROCH-01**: no existe ningún control de descarga en el sitio (deliberadamente, para no fingir un enlace roto). Falta el PDF final real de la brochure — solo tenemos capturas de pantalla del documento compartido en el chat.
2. **QA-03**: el sitio usa solo imágenes de drones/equipos (mismo render promocional reciclado 2 veces: `equipos1.png`, `dron.png`). Falta fotografía autorizada y con procedencia documentada que muestre geología/minería, y falta documentar la procedencia de las imágenes PNG/JPG actuales (`public/IMAGENES_PAGINA_WEB/*`).

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

El milestone **no debe marcarse completo ni desplegarse** mientras TEAM-01/BROCH-01/QA-03 sigan abiertos (esto lo dejó explícito el propio reporte de verificación de Codex en `06-VERIFICATION.md`). Para cerrar el milestone se necesita del usuario:
1. 4 fotos reales de los geólogos (o autorización para usar las iniciales como solución final)
2. El PDF final de la brochure
3. Fotos autorizadas de geología/minería/infraestructura, o procedencia documentada de las imágenes actuales

Documentos clave para retomar: `.planning/phases/06-calidad-y-regresi-n-final/06-VERIFICATION.md` (gaps exactos), `.planning/REQUIREMENTS.md` (checklist), `.planning/BRAND-CONTENT.md` (contenido de marca canónico).
