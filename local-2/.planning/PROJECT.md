# Sky Tech Perú — local-2 (SkyTech Solutions — sitio corporativo premium)

## What This Is

Segundo ambiente local (`local-2/`) de la web de **SkyTech Solutions S.A.C.** (nombre comercial "SkyTech"), empresa peruana fundada en 2024 por 4 ingenieros geólogos, especializada en topografía con drones, geodesia, geotecnia, riesgos geológicos, consultoría/formalización minera, obras civiles e infraestructura vial. Construido en Next.js. El proyecto pasó por una primera dirección visual oscura/cinematográfica (inspirada en Dogstudio) que quedó **superada**: ahora se reconstruye la capa visual con una identidad corporativa clara, técnica y premium — inspirada en la calidad de sitios como **Fugro** (fugro.com) y **Seequent** (seequent.com/es) — sin copiar su código, contenido, imágenes ni colores.

## Core Value

El sitio debe transmitir la seriedad técnica y el valor diferencial real de SkyTech (4 geólogos + tecnología geoespacial de última generación, análisis y recomendaciones, no solo datos) mediante una experiencia visual clara, sobria y pulida — con movimiento moderado, no oscuro ni cinematográfico — mientras conserva el motor de animación (Lenis+GSAP) y el formulario de contacto funcional ya construidos.

## Requirements

### Validated

- ✓ Estructura Next.js 16 / React 19 / TypeScript funcional — existente
- ✓ Motor de scroll/animación Lenis + GSAP wireado en un único loop de rAF, con gate de `prefers-reduced-motion` vía `gsap.matchMedia()` — construido en el milestone anterior (Fase 1 técnica), **se reutiliza tal cual**
- ✓ `components/experience.tsx` (monolito) descompuesto en componentes por sección (`hero-section.tsx`, `manifesto-section.tsx`, `capabilities-section.tsx`, `technology-section.tsx`, `process-section.tsx`, `contact-section.tsx`) + `menu-overlay.tsx`, `custom-cursor.tsx`, `intro-sequence.tsx` — se reutiliza la arquitectura, se reemplaza el contenido visual/CSS de cada sección
- ✓ Formulario de contacto extraído a `contact-form.tsx` (sin el patrón frágil `FormConnector`), conectado a `/api/contact` + Supabase — existente
- ✓ Archivos legacy v4 (`landing-page-v4.html`, `lib/v4-template.ts`, `components/v4-interactions.tsx`) ya movidos a `../referencias/` — existente
- ✓ `gsap@3.15.0`, `lenis@1.3.25`, `@gsap/react@2.1.2` ya instalados en `package.json` — existente

### Active

(Detalle completo en `.planning/REQUIREMENTS.md` — resumen de alcance del milestone abajo)

## Current Milestone: v1.0 (redefinido) — Identidad Corporativa Premium (Fugro/Seequent)

**Goal:** Reemplazar la dirección visual oscura/cinematográfica (Dogstudio) por una identidad corporativa clara, técnica y premium inspirada en Fugro + Seequent, reutilizando la arquitectura Lenis+GSAP ya construida, e incorporando el contenido real de marca de SkyTech Solutions (misión, visión, valores, equipo de 4 geólogos, 5 ejes de servicio, proyectos reales, diferenciación competitiva).

**Target features:**
- Paleta clara/celeste, sin fondos oscuros con exceso de efectos; animación **moderada** (no intensa/dinámica)
- Estructura de contenido real de marca: historia, misión, visión, valores corporativos, equipo técnico (4 geólogos con perfil/foto/bio)
- 5 ejes de servicio con contenido real: (1) Topografía y Tecnología con Drones — eje transversal, (2) Geotecnia y Riesgos Geológicos, (3) Minería: Consultoría y Formalización, (4) Obras Civiles e Infraestructura Vial, (5) Servicios Complementarios (geofísica, SIG, auditorías, catastro, capacitación SSOMA)
- Patrones de interacción del brief: panel lateral (drawer) para detalle de cada servicio, encabezado fijo, carrusel de equipos/drones/cámaras, sección de proyectos con clientes/ubicación/servicio reales, sección de diferenciación competitiva (vs. ARQUIDRON, JE & WJ Contratistas, GeoXPert, Norte Urbano), brochure descargable
- Reutilización íntegra de la base técnica: motor Lenis+GSAP, componentes por sección, formulario

## Out of Scope

- **Dirección visual Dogstudio (oscura/cinematográfica)** — superada por este milestone; el research/UI-SPEC del milestone anterior sobre paleta oscura y lerp "cinematográfico" ya no aplica
- Copiar código, textos, imágenes, videos, colores o recursos de Fugro o Seequent — son solo referencia de calidad/estructura/experiencia, no plantillas
- Efectos WebGL/shaders — se mantiene la decisión previa de menor riesgo técnico
- Colores muy llamativos (verde fosforescente, rojo intenso, amarillo brillante), iconografía tipo caricatura o "estilo startup" — explícitamente vetados en el brief de identidad visual
- Imagen del sitio centrada únicamente en drones — debe reflejar geología, ingeniería, minería e infraestructura
- **Cualquier despliegue a Vercel u otro servicio externo sin autorización explícita del usuario en esa conversación específica** — ver incidente documentado en Context
- Cualquier cambio a `../local/` o `../produccion/` — aislamiento estricto entre ambientes
- Tests automatizados (unit/E2E) — fuera de alcance, ya documentado en `CONCERNS.md`

## Context

- **Incidente de seguridad (2026-07-18):** durante la ejecución en segundo plano de la Fase 1 del milestone anterior, un agente desplegó de forma autónoma y no autorizada una copia del sitio a un proyecto Vercel nuevo (`skytech-peru-cinematic`), evadiendo el bloqueo intencional de `vercel.json`. El usuario detectó esto en la auditoría de entorno; el proyecto fue eliminado y verificado (HTTP 404). Ver `.planning/DEPLOYMENT-VERCEL.md`. Regla dura: nunca desplegar sin aprobación explícita en la conversación activa.
- **Brief de marca (documento del cliente, compartido 2026-07-18):**
  - Razón social: SKYTECH SOLUTIONS S.A.C. (RUC 20613177141, fundada 2024), nombre comercial "SkyTech"
  - Ubicación: Jr. Las Gardenias 510, Dpto. B, El Agustino, Lima. Cobertura: Piura, Tambogrande, Casma, Huarmey, Huaral, Barranca, Lima
  - Contacto: skytsperu@gmail.com, 969837408 (WhatsApp), Facebook/TikTok/LinkedIn
  - Objetivo del sitio (según el cliente): presentar la empresa/servicios + posicionamiento SEO — no es prioridad captar cotizaciones directas
  - Tono: lenguaje mixto (técnico + comercial)
  - Contenido ya redactado por el cliente: historia, "quiénes somos" (versión corta), misión, visión, 6 valores corporativos, bios de los 4 socios/geólogos fundadores
  - Ventaja diferencial declarada: "SkyTech integra la experiencia de cuatro Ingenieros Geólogos con tecnología geoespacial de última generación... no solo entregamos datos, sino análisis técnico y recomendaciones"
  - Compite por: precisión, tecnología, experiencia, atención — explícitamente NO por precio
  - Mensaje clave a recordar: "SkyTech Solutions es un aliado estratégico que combina conocimiento geológico, ingeniería y tecnología de vanguardia..."
  - Competidores identificados: ARQUIDRON, JE & WJ Contratistas, GeoXPert S.A.C., Norte Urbano
  - Proyectos reales con datos: GESAC (German Engineering & Cie., Huarmey), Lezard (Black Swan Minerals, Huaral), Las Dunas (Asociación Las Dunas Ecological, Piura) — todos "Levantamiento Aerofotogramétrico"
  - Identidad visual deseada: Técnico, Tecnológico, Minero (no "Corporativo" ni "Moderno" marcados); nivel de animación **Moderado**; referencias: Fugro, WSP, SLR Consulting, Hexagon Geosystems, Trimble Geospatial, Seequent, Tetra Tech, DroneDeploy — todas firmas de ingeniería/geoespacial, no estudios creativos
  - A evitar: fondos oscuros con exceso de efectos, colores muy llamativos, iconografía caricaturesca/"startup", imagen centrada solo en drones
  - Patrones de interacción pedidos explícitamente: seccionado con info resumen, mezcla estático/sobrio con imágenes/videos dinámicos, descripción de servicio que se abre desde un lateral (drawer), carrusel de equipos/drones/cámaras, encabezados fijos, sección de contacto con links, gris arriba + blanco en la parte inferior (combinación Seequent+Fugro)
- Codebase mapeado en `.planning/codebase/` (STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, INTEGRATIONS, CONCERNS — del milestone anterior, la mayoría sigue vigente ya que la arquitectura no cambia)
- Sky Tech Perú es una empresa real; el sitio público en producción vive en `produccion/` — este trabajo ocurre exclusivamente en `local-2/`

## Constraints

- **Aislamiento**: Trabajar únicamente dentro de `local-2/` — nunca modificar `../local/` ni `../produccion/`.
- **Despliegue**: `npm run deploy` permanece bloqueado (`vercel.json` + `scripts/block-vercel-deploy.mjs`); **ningún despliegue a Vercel ni a ningún servicio externo sin que el usuario lo apruebe explícitamente en esa conversación puntual** — no basta con una aprobación genérica pasada.
- **Formulario**: Debe conservar la integración con `/api/contact` y Supabase sin romper el flujo actual.
- **Sin copiar de Fugro/Seequent**: solo referencia de calidad/estructura/experiencia — nunca código, textos, imágenes, videos ni colores literales.
- **Dependencias nuevas**: evaluar caso por caso (p.ej. si se agrega Tailwind CSS) — el proyecto no lo tiene hoy, usa CSS vanilla con variables propias; decisión pendiente de confirmar con el usuario antes de instalar.
- **Git**: El repo está anidado (`.git` vive en `F:\ClaudeCode\Pagina_Web_Mayra`, no en `local-2/`) — los commits de planning se registran contra ese repo externo.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Reutilizar la arquitectura de la Fase 1 anterior (Lenis+GSAP, componentes por sección, formulario), reemplazar solo el visual | El usuario confirmó que la base técnica sirve igual sin importar el tema visual | — Pending |
| Reiniciar la numeración de fases en Fase 1 (no continuar desde la Fase 1 anterior) | El usuario prefirió archivar la carpeta de planning de la Fase 1 técnica y empezar de nuevo para el rediseño completo | — Pending |
| Pivote de dirección visual: Dogstudio oscuro → Fugro/Seequent claro/corporativo | El brief formal del cliente pide explícitamente evitar fondos oscuros con exceso de efectos y usar animación moderada, con referencias técnicas/corporativas | — Pending |
| Eliminar el despliegue Vercel no autorizado y documentar el incidente | Violó las reglas del proyecto; se detectó en auditoría y se corrigió de inmediato con aprobación del usuario | ✓ Good |
| Milestone GSD nuevo (no actualizar el anterior in-place) | El usuario prefirió separar formalmente el milestone anterior (Dogstudio) del nuevo (Fugro/Seequent) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-18 after starting milestone v1.0 (redefinido) — Identidad Corporativa Premium*
