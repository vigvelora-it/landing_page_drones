# Requirements: Sky Tech Perú — local-2 (v1.0-corporate — Identidad Corporativa Premium)

**Defined:** 2026-07-18
**Core Value:** El sitio debe transmitir la seriedad técnica y el valor diferencial real de SkyTech (4 geólogos + tecnología geoespacial de última generación, análisis y recomendaciones, no solo datos) mediante una experiencia visual clara, sobria y pulida — con movimiento moderado, no oscuro ni cinematográfico — mientras conserva el motor de animación (Lenis+GSAP) y el formulario de contacto funcional ya construidos.

## v1 Requirements

### Foundation (tema claro y especificación de movimiento)

- [x] **THEME-01**: El sitio usa una paleta clara/celeste de bajo contraste (fondo blanco/gris claro, un solo acento restringido), reemplazando la paleta oscura anterior
- [x] **THEME-02**: Todos los pares texto/fondo y anillos de foco cumplen contraste WCAG AA (4.5:1 texto normal, 3:1 elementos grandes/UI)
- [x] **THEME-03**: No quedan literales de color/blend-mode/filtros ajustados para el tema oscuro anterior — todo pasa por las variables CSS del nuevo sistema de tokens
- [x] **THEME-04**: Existe una especificación literal de "animación moderada" (distancias de traslado, duraciones, límites de stagger, sin pinning) aplicada de forma consistente en todas las secciones — reemplaza la intensidad "cinematográfica" anterior

### Arquitectura (fundación de datos y hooks compartidos)

- [x] **ARCH-01**: `lib/site-content.ts` extendido con los datos reales de marca: 5 ejes de servicio (con detalle largo), equipo de 4 geólogos, 3 proyectos reales, y datos de la brochure
- [x] **ARCH-02**: Existe un hook compartido `useScrollLock` (basado en `lenis.stop()/start()`, no en `overflow:hidden`) usado tanto por el nuevo drawer como por el menú overlay existente
- [x] **ARCH-03**: `custom-cursor.tsx` usa delegación de eventos en vez de `querySelectorAll` en el montaje, para que funcione con elementos `[data-cursor]` añadidos dinámicamente (drawer, carrusel)

### Servicios y drawer de detalle

- [x] **SERV-01**: Los 5 ejes de servicio se presentan como tarjetas navegables (grid), no como texto corrido
- [x] **SERV-02**: Al seleccionar un eje, se abre un panel lateral (drawer) con el detalle del servicio, usando `<dialog>` nativo con `inert` en el fondo y retorno de foco al cerrar
- [x] **SERV-03**: El drawer y el menú overlay existente son mutuamente excluyentes (no pueden estar abiertos los dos a la vez) y comparten el mecanismo de bloqueo de scroll

### Header

- [x] **HEAD-01**: El header fijo existente gana un estado visual reactivo al scroll (fondo sólido/sombra al bajar), implementado con `ScrollTrigger.create({ toggleClass })` sobre el ticker único existente — no un segundo listener de scroll
- [x] **HEAD-02**: El header sticky se prueba explícitamente con el drawer abierto/cerrado y el carrusel presente, para evitar el conflicto conocido `overflow-x` + `position: sticky` + Lenis

### Equipo y proyectos

- [x] **TEAM-01**: Sección de equipo con los 4 geólogos fundadores (nombre, cargo, bio según el contenido ya redactado por el cliente; iniciales neutras como placeholder de foto). **Decisión del usuario (2026-07-21): las iniciales quedan como diseño final, no como placeholder temporal — no se requieren fotos reales.**
- [x] **PROJ-01**: Sección de proyectos con los 3 casos reales (GESAC/Huarmey, Lezard/Huaral, Las Dunas/Piura) con cliente, ubicación y servicio realizado, en formato "proyecto destacado + lista"

### Diferenciación y equipo técnico (carrusel)

- [x] **DIFF-01**: Sección de diferenciación competitiva basada en evidencia (casos/datos), sin nombrar competidores en la página
- [x] **EQUIP-01**: Carrusel de equipos/drones/cámaras usando `embla-carousel-react`, con paridad de teclado/touch y `data-lenis-prevent` en el track — sin auto-avance por defecto

### Brochure

- [ ] **BROCH-01**: Brochure descargable en PDF servido como asset estático (`public/`) con enlace `<a download>` — sin gating, verificado en build de producción (no solo `npm run dev`)

### Contenido y marca (heredado, sin cambios)

- [x] **BRAND-01**: El texto de historia, "quiénes somos", misión, visión y valores corporativos usa el contenido ya redactado por el cliente, sin reescritura
- [x] **BRAND-02**: El formulario de contacto sigue funcionando vía `/api/contact` + Supabase sin regresiones

### Calidad

- [x] **QA-01**: `npm run lint`, `npm run typecheck` y `npm run build` pasan sin errores
- [x] **QA-02**: Revisión visual manual en desktop y móvil sin overflow horizontal, con el header sticky, drawer y carrusel probados juntos
- [ ] **QA-03**: Ninguna imagen del sitio depende solo de drones — refleja también geología, ingeniería, minería e infraestructura (según el veto explícito del brief)

## v2 Requirements

Deferido a una futura iteración. No se planifica en este roadmap.

### Contenido avanzado

- **V2-01**: Brochure con variante gated para captura de leads (solo si el cliente cambia su prioridad declarada de SEO/presentación)
- **V2-02**: Sub-páginas propias por eje de servicio más allá del drawer (solo si el contenido crece más de lo que cabe en el panel)
- **V2-03**: Soporte multi-idioma, mapa interactivo de proyectos, páginas de detalle por caso de estudio

## Out of Scope

Explícitamente excluido. Documentado para prevenir scope creep.

| Feature | Reason |
|---------|--------|
| Copiar código, textos, imágenes, videos o colores de Fugro/Seequent | Son solo referencia de calidad/estructura, no plantillas — brief del cliente lo prohíbe explícitamente |
| Efectos WebGL/shaders | Se mantiene la decisión previa de menor riesgo técnico |
| Colores muy llamativos, iconografía caricaturesca/"estilo startup" | Vetado explícitamente en el brief de identidad visual |
| Fondos oscuros con exceso de efectos, animación intensa/cinematográfica | Vetado explícitamente — el brief pide "Moderado", no "Dinámico" |
| Nombrar competidores en la página | El cliente quiere diferenciación basada en evidencia, no comparación directa |
| Adoptar Tailwind CSS | El research confirma que el sistema de variables CSS existente es suficiente; migrar sería un riesgo/costo no justificado para este milestone |
| Cualquier despliegue a Vercel u otro servicio externo sin autorización explícita | Ver incidente documentado en `PROJECT.md` — regla dura tras la corrección aplicada |
| Cualquier cambio a `../local/` o `../produccion/` | Aislamiento estricto entre ambientes |
| Tests automatizados (unit/E2E) | Fuera de alcance, ya documentado en `CONCERNS.md` |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01, THEME-02, THEME-03, THEME-04 | Phase 1 — Fundación: Tema Claro y Especificación de Movimiento Moderado | Complete |
| ARCH-01, ARCH-02, ARCH-03 | Phase 2 — Modelo de Datos y Hooks Compartidos | Pending |
| SERV-01, SERV-02, SERV-03 | Phase 3 — Servicios y Drawer de Detalle | Pending |
| HEAD-01, HEAD-02 | Phase 4 — Header Sticky y Carrusel de Equipos | Complete |
| EQUIP-01 | Phase 4 — Header Sticky y Carrusel de Equipos | Complete |
| BRAND-01 | Phase 5 — Contenido de Marca: Historia, Equipo, Proyectos, Diferenciación y Brochure | Complete |
| TEAM-01 | Phase 5 — Contenido de Marca: Historia, Equipo, Proyectos, Diferenciación y Brochure | Complete (iniciales aceptadas como diseño final) |
| PROJ-01 | Phase 5 — Contenido de Marca: Historia, Equipo, Proyectos, Diferenciación y Brochure | Complete |
| DIFF-01 | Phase 5 — Contenido de Marca: Historia, Equipo, Proyectos, Diferenciación y Brochure | Complete |
| BROCH-01 | Phase 5 — Contenido de Marca: Historia, Equipo, Proyectos, Diferenciación y Brochure | Pending |
| QA-01, QA-02, QA-03 | Phase 6 — Calidad y Regresión Final | Pending |
| BRAND-02 | Phase 6 — Calidad y Regresión Final | Complete |

**Coverage:**

- v1 requirements: 22 total (correción: el conteo previo de "24" en este documento era incorrecto; el conteo real de IDs únicos THEME/ARCH/SERV/HEAD/TEAM/PROJ/DIFF/EQUIP/BROCH/BRAND/QA es 22)
- Mapped to phases: 22/22 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-18*
*Last updated: 2026-07-18 after ROADMAP.md creation (gsd-roadmapper) — traceability mapped, count corrected from 24 to 22*
