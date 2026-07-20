# Roadmap: Sky Tech Perú — local-2 (v1.0-corporate — Identidad Corporativa Premium)

## Overview

Este roadmap lleva `local-2` desde la dirección visual oscura/cinematográfica (Dogstudio, archivada en `.planning/archive/v1.0-dogstudio-superseded/`) hasta una identidad corporativa clara, técnica y premium inspirada en Fugro/Seequent, reutilizando íntegramente el motor Lenis+GSAP, la arquitectura de componentes por sección y el formulario de contacto ya construidos. El trabajo está secuenciado fundación-primero: el sistema de tokens de tema claro y la especificación literal de "animación moderada" deben existir antes de tocar cualquier sección visual, o el mismo CSS/motion tendría que rehacerse dos veces. Le sigue una fase de modelo de datos y hooks compartidos (contenido real de marca, bloqueo de scroll compartido, corrección del cursor) que no produce salida visual propia pero desbloquea las tres fases de UI siguientes. El drawer de servicios y el header sticky se construyen en fases adyacentes porque comparten el mismo modo de fallo conocido (bloqueo de scroll de Lenis + `overflow-x` rompiendo `position: sticky`); el carrusel de equipos se agrupa con el header porque la propia especificación de header exige probarlo explícitamente con el carrusel presente. El roadmap cierra con las secciones de contenido real (historia, equipo, proyectos, diferenciación, brochure) y una fase de calidad y regresión final que verifica build/lint/typecheck, ausencia de overflow horizontal, representación visual balanceada del negocio (no solo drones) y que el formulario de contacto siga funcionando sin regresiones.

**Nota de numeración:** esta es la Fase 1 del milestone `v1.0-corporate`. El milestone anterior (Dogstudio, oscuro/cinematográfico) fue archivado sin completarse; por decisión explícita del usuario (ver PROJECT.md Key Decisions) la numeración de fases se reinicia en 1 en vez de continuar desde la Fase 1 técnica archivada.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Fundación — Tema Claro y Especificación de Movimiento Moderado** - Paleta clara WCAG AA y especificación literal de "animación moderada" que reemplaza el tema oscuro anterior (completed 2026-07-19)
- [x] **Phase 2: Modelo de Datos y Hooks Compartidos** - Contenido real de marca en `lib/site-content.ts`, `useScrollLock` compartido y `custom-cursor.tsx` con delegación de eventos (completed 2026-07-19)
- [x] **Phase 3: Servicios y Drawer de Detalle** - Los 5 ejes de servicio como tarjetas navegables con panel lateral accesible de detalle (completed 2026-07-20)
- [x] **Phase 4: Header Sticky y Carrusel de Equipos** - Header reactivo al scroll y carrusel de equipos/drones/cámaras, probados juntos con el drawer (completed 2026-07-20)
- [ ] **Phase 5: Contenido de Marca — Historia, Equipo, Proyectos, Diferenciación y Brochure** - Historia/misión/visión/valores, 4 geólogos, 3 proyectos reales, diferenciación basada en evidencia y brochure descargable
- [ ] **Phase 6: Calidad y Regresión Final** - Build/lint/typecheck limpios, revisión visual sin overflow, imágenes representativas del negocio y formulario de contacto sin regresiones

## Phase Details

### Phase 1: Fundación — Tema Claro y Especificación de Movimiento Moderado

**Goal**: El sitio se ve y se mueve con una identidad corporativa clara y técnica — paleta clara/celeste de bajo contraste, contraste WCAG AA garantizado en todos los pares texto/fondo, y una animación consistentemente moderada en todas las secciones — reemplazando por completo la dirección visual oscura/cinematográfica anterior antes de que empiece cualquier trabajo de contenido por sección.
**Depends on**: Nothing (first phase)
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04
**Success Criteria** (what must be TRUE):

  1. El sitio completo se renderiza con la nueva paleta clara/celeste (fondo blanco/gris claro, un solo acento restringido) — no queda ningún fondo oscuro de la dirección Dogstudio anterior.
  2. Un chequeo de contraste (automatizado o manual con una herramienta como el contrast checker de WebAIM) confirma que todos los pares texto/fondo cumplen 4.5:1 (texto normal) y que los anillos de foco y elementos UI grandes cumplen 3:1 (WCAG AA).
  3. Una búsqueda en el código por literales de color/`rgba()`/`blend-mode`/`filter` ajustados al tema oscuro anterior no devuelve resultados fuera de las variables CSS del nuevo sistema de tokens.
  4. Existe una especificación documentada y literal de "animación moderada" (distancias máximas de traslado, rangos de duración, límites de stagger, sin `pin`/scroll-jacking) y las secciones ya migradas la referencian de forma consistente en sus llamadas `useGSAP()`.

**Plans**: 4 plans
Plans:

- [x] 01-01-PLAN.md — Layer de tokens claros (:root) + tokens de movimiento + reglas base/reveal + Lenis lerp 0.1
- [x] 01-02-PLAN.md — Migración de secciones superiores: Apertura, Navegación, Hero, Perspectiva
- [x] 01-03-PLAN.md — Migración de secciones centrales: Capacidades, Tecnología, Proceso
- [x] 01-04-PLAN.md — Migración de Contacto/Footer/Cursor/Badge + audit de fase completo (grep gates + build/lint/typecheck)

**UI hint**: yes

### Phase 2: Modelo de Datos y Hooks Compartidos

**Goal**: Existe la base de contenido real de marca y los hooks/infraestructura compartidos (bloqueo de scroll vía Lenis, cursor con delegación de eventos) que las fases de UI siguientes van a consumir directamente, sin necesidad de volver a tocarlos más adelante.
**Depends on**: Phase 1
**Requirements**: ARCH-01, ARCH-02, ARCH-03
**Success Criteria** (what must be TRUE):

  1. `lib/site-content.ts` exporta datos completos y tipados para los 5 ejes de servicio (con detalle largo), los 4 geólogos del equipo, los 3 proyectos reales y los datos de la brochure.
  2. `hooks/use-scroll-lock.ts` existe, envuelve `lenis.stop()/lenis.start()` (no `overflow: hidden`), y `menu-overlay.tsx` ya lo usa en vez de su mecanismo de bloqueo anterior.
  3. `custom-cursor.tsx` ya no usa `querySelectorAll` en el montaje — usa delegación de eventos, y reacciona correctamente sobre un elemento `[data-cursor]` insertado dinámicamente después del montaje inicial (verificable con una prueba manual).

**Plans**: 2 plans
Plans:

- [x] 02-01-PLAN.md — Modelo de datos tipado real de marca en lib/site-content.ts (5 ejes, 4 geólogos, 3 proyectos, brochure)
- [x] 02-02-PLAN.md — Hooks compartidos: useScrollLock (Lenis) en menu-overlay + CustomCursor con delegación de eventos

### Phase 3: Servicios y Drawer de Detalle

**Goal**: Los usuarios pueden explorar los 5 ejes de servicio como tarjetas navegables y ver el detalle de cualquiera de ellos en un panel lateral accesible, sin abandonar la página ni entrar en conflicto con el menú overlay existente.
**Depends on**: Phase 2
**Requirements**: SERV-01, SERV-02, SERV-03
**Success Criteria** (what must be TRUE):

  1. Los 5 ejes de servicio se presentan como tarjetas en un grid navegable (no como texto corrido).
  2. Al seleccionar una tarjeta se abre un `<dialog>` nativo (drawer lateral) con `inert` aplicado al fondo, foco atrapado dentro del panel y devuelto al elemento disparador al cerrarlo (Esc o botón de cierre).
  3. Con el drawer abierto no puede abrirse el menú overlay (y viceversa) — son mutuamente excluyentes y ambos usan `useScrollLock` de la Fase 2 sin que el scroll de Lenis quede en un estado inconsistente.

**Plans**: 3 plans
Plans:

- [x] 03-01-PLAN.md — Store de coordinación de overlays + componente ServiceDrawer (`<dialog>` nativo) + CSS del drawer
- [x] 03-02-PLAN.md — Conversión de las filas de servicio a botones-disparadores (SERV-01) + wiring del drawer + CSS de fila (focus-visible, disabled, indicador seleccionado)
- [x] 03-03-PLAN.md — Exclusión mutua lado-menú (SERV-03) + InertBoundary aplicado en page.tsx (fondo `inert`)

**UI hint**: yes

### Phase 4: Header Sticky y Carrusel de Equipos

**Goal**: El header reacciona visualmente al scroll sin duplicar el motor de scroll existente, y los usuarios pueden explorar el equipo técnico (drones/cámaras) en un carrusel accesible por teclado y touch — ambas piezas se prueban juntas, con el drawer de la Fase 3 presente, para descartar el conflicto conocido entre `overflow-x`, `position: sticky` y Lenis.
**Depends on**: Phase 3
**Requirements**: HEAD-01, HEAD-02, EQUIP-01
**Success Criteria** (what must be TRUE):

  1. El header cambia a fondo sólido/sombra al hacer scroll hacia abajo, implementado vía `ScrollTrigger.create({ toggleClass })` sobre el ticker único existente — no existe un segundo `window.addEventListener('scroll')` en el código.
  2. El comportamiento sticky del header se verifica manualmente con el drawer de servicio abierto y cerrado, y con el carrusel de equipos visible en la página, sin que `position: sticky` se rompa por `overflow-x`.
  3. El carrusel de equipos/drones/cámaras (`embla-carousel-react`) permite navegación completa por teclado y touch/swipe, sin auto-avance por defecto, con `data-lenis-prevent` en el track.

**Plans**: 2 plans
Plans:

- [x] 04-01-PLAN.md — Header scroll-reactive (`.is-scrolled` vía ScrollTrigger toggleClass) + hook + CSS (HEAD-01, HEAD-02)
- [x] 04-02-PLAN.md — Carrusel de equipos (embla-carousel-react) + datos + wiring en Tecnología + gate de estrés HEAD-02 (EQUIP-01, HEAD-02)

**UI hint**: yes

### Phase 5: Contenido de Marca — Historia, Equipo, Proyectos, Diferenciación y Brochure

**Goal**: El sitio cuenta la historia real de SkyTech — misión, visión, valores, los 4 geólogos fundadores, 3 proyectos reales y una diferenciación basada en evidencia — y permite descargar la brochure de la empresa, todo sobre la base visual y de datos ya construida en las fases anteriores.
**Depends on**: Phase 4
**Requirements**: BRAND-01, TEAM-01, PROJ-01, DIFF-01, BROCH-01
**Success Criteria** (what must be TRUE):

  1. El texto de historia, "quiénes somos", misión, visión y los 6 valores corporativos aparece en el sitio exactamente como lo redactó el cliente (sin reescritura), integrado con la paleta clara de la Fase 1.
  2. La sección de equipo muestra a los 4 geólogos fundadores con foto, nombre, cargo y bio según el contenido ya redactado por el cliente.
  3. La sección de proyectos muestra los 3 casos reales (GESAC/Huarmey, Lezard/Huaral, Las Dunas/Piura) con cliente, ubicación y servicio realizado, en formato "proyecto destacado + lista".
  4. La sección de diferenciación presenta evidencia/datos concretos (casos, no afirmaciones genéricas) sin nombrar a ningún competidor en el texto visible de la página.
  5. El brochure en PDF se descarga correctamente desde un enlace `<a download>` que apunta a un asset estático en `public/`, verificado corriendo `npm run build && npm start` (no solo `npm run dev`).

**Plans**: 2 plans
Plans:

- [ ] 05-01-PLAN.md — Nosotros canónico, misión/visión/valores y equipo con fallback honesto; TEAM-01 queda parcial por retratos faltantes
- [ ] 05-02-PLAN.md — Proyectos, diferenciación, navegación 01–06 y verificación integral; BROCH-01 queda bloqueado por PDF faltante
**UI hint**: yes

### Phase 6: Calidad y Regresión Final

**Goal**: El milestone completo pasa todos los gates de calidad técnica y de contenido antes de considerarse listo: build limpio, sin overflow horizontal en ningún viewport, imágenes representativas de todos los ejes del negocio (no solo drones), y el formulario de contacto intacto tras todos los cambios visuales y estructurales.
**Depends on**: Phase 5
**Requirements**: QA-01, QA-02, QA-03, BRAND-02
**Success Criteria** (what must be TRUE):

  1. `npm run lint`, `npm run typecheck` y `npm run build` se ejecutan sin errores.
  2. Una revisión visual manual en desktop (p.ej. 1440×900) y móvil (p.ej. 390×844) no muestra overflow horizontal en ninguna página, con el header sticky, el drawer y el carrusel probados juntos.
  3. Ninguna imagen del sitio depende únicamente de drones — la revisión confirma presencia de imágenes de geología, ingeniería, minería e infraestructura también.
  4. El formulario de contacto sigue enviando correctamente a `/api/contact` (Supabase) sin regresiones introducidas por los cambios de este milestone.

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Fundación — Tema Claro y Especificación de Movimiento Moderado | 4/4 | Complete   | 2026-07-19 |
| 2. Modelo de Datos y Hooks Compartidos | 2/2 | Complete   | 2026-07-19 |
| 3. Servicios y Drawer de Detalle | 3/3 | Complete   | 2026-07-20 |
| 4. Header Sticky y Carrusel de Equipos | 2/2 | Complete    | 2026-07-20 |
| 5. Contenido de Marca — Historia, Equipo, Proyectos, Diferenciación y Brochure | 0/2 | Planned | - |
| 6. Calidad y Regresión Final | 0/TBD | Not started | - |
