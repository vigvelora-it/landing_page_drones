# Quick Task 260722-evm: Integrar biblioteca multimedia curada - Context

**Gathered:** 2026-07-22
**Status:** Ready for implementation

<domain>
## Task Boundary

El usuario curó una biblioteca de 9 fotos HD (2400px, con licencia Pexels/Unsplash) y 4
videos en `public/media-library/` (staging, no conectado a ningún componente todavía),
con `README.md` (recomendación por sección + prioridad de implementación) y
`PROVENANCE.md` (autor/fuente/licencia/hash SHA-256 de cada archivo) ya escritos por el
usuario. Pide: "usa el nuevo contenido visual, videos, fotos y colócalos en la página".

El propio `README.md` del usuario ya resuelve todas las decisiones de ubicación — se usa
como especificación autoritativa, no se re-preguntan las mismas decisiones.

</domain>

<decisions>
## Implementation Decisions

### Alcance de esta ronda: prioridades 1-4 del README, prioridad 5 diferida
El `README.md` del usuario tiene su propia "Prioridad de implementación" (1. Hero, 2.
Capacidades, 3. Portadas de sectores, 4. Proceso y contacto, 5. B-roll 4K de proyectos —
solo después de generar derivados web livianos). Se implementan 1-4 en esta ronda. La
prioridad 5 (`videos/projects-bridge-construction-4k.mp4` 97.6MB y
`videos/projects-open-pit-mine-4k.mp4` 92.7MB, ambos 3840×2160 reales) se **difiere
explícitamente**: este entorno no tiene `ffmpeg` disponible (verificado:
`ffmpeg: command not found`), por lo que no se pueden generar los derivados 1080p de 8-20MB
que el propio README exige antes de servir estos archivos en producción. Servir los
archivos maestros de 90+MB tal cual violaría la propia regla del README y el estándar de
rendimiento ya establecido en el sitio (Lighthouse 100, LCP <1.5s). Se documenta como
bloqueo técnico honesto, no se fabrica un workaround.

### Mapeo exacto (todo tomado literalmente del README del usuario, sin reinterpretar)

1. **Hero** (`components/sections/hero-section.tsx`): reemplazar la fuente del
   `<video><source src="/video/drone-flight-close.mp4">` por el nuevo
   `hero-drone-in-flight-hd.mp4` (1920×1080, 14.28s, 7.96MB — ya listo para producción,
   sin necesidad de derivado). Se copia a `public/video/hero-drone-in-flight.mp4`. El
   poster/imagen estática de fondo (`topografia-con-drones.jpg`) se conserva sin cambios
   (no hay reemplazo equivalente en la biblioteca nueva).
2. **Capacidades** (`components/sections/capabilities-section.tsx`): hoy es una lista de
   texto puro sin ninguna imagen. Se añade un panel visual nuevo (no existía antes) con
   `capabilities-total-station-hd.jpg` (2400×3200, vertical, imagen principal) y
   `technology-rtk-quarry-hd.jpg` (2400×1600, secundaria) — exactamente como indica el
   README ("Capacidades con estación total y RTK", prioridad 2). Se copian a
   `public/IMAGENES_PAGINA_WEB/`.
3. **Sectores** (`brand-section.tsx` vía `lib/site-content.ts`, banda "Sectores que
   atendemos" ya existente): se **upgradean** 3 de las 4 imágenes ya presentes (la banda
   ya es el lugar correcto — imágenes ilustrativas de sector, no ligadas a proyectos con
   nombre real, exactamente la regla de atribución del README):
   - Minería: `mineria-tajo-abierto.jpg` (actual) → `projects-open-pit-mine-hd.jpg`
     (nuevo, 2400×3601).
   - Infraestructura: `infraestructura-obra-civil.jpg` (actual) →
     `projects-bridge-construction-hd.jpg` (nuevo, 2400×3600).
   - Geología: `geologo-campo-roca.jpg` (actual) → `geology-rock-formations-hd.jpg`
     (nuevo, 2400×3600).
   - Topografía: sin cambio (no hay reemplazo en la biblioteca nueva).
   Las imágenes viejas (sourced de Unsplash en una ronda anterior) se quedan en el
   filesystem pero dejan de referenciarse — no se borran (podrían tener otro uso futuro).
4. **Proceso** (`components/sections/process-section.tsx`): se añade
   `process-engineers-plans-hd.jpg` (2400×1600) como imagen nueva — hoy Proceso solo tiene
   una imagen (`deliverable-image`, ya usada para el resultado GNSS/CAD, no se toca). La
   nueva imagen ilustra "coordinación técnica, revisión en campo" — se añade como bloque
   visual adicional dentro de la sección, junto a los 4 pasos del proceso.
5. **Contacto** (`components/sections/contact-section.tsx`): reemplazar el
   `.contact-backdrop` (`equipos1.png` a opacidad .12) por `contact-drone-pilot-hd.jpg`
   (2400×3600, vertical con espacio negativo — exactamente lo que pide el README para esta
   composición).

### No se toca (regla explícita del propio README, respetada literalmente)
- Retratos del equipo (`team-card__portrait`): siguen con iniciales, cero fotos de stock.
- Carrusel de equipos (`equipment-carousel.tsx`): sigue mostrando solo equipos reales.
- Brochure: no se sustituye nada.
- Fichas de los 3 proyectos reales con nombre (GESAC/Lezard/Las Dunas) en
  `projects-section.tsx`: no se les asocia ningún medio de stock nuevo — el README es
  explícito en que las imágenes "Sectores y proyectos" son para las **portadas de
  sector**, no para los proyectos reales con nombre.
- `technology-drone-operator-hd.jpg` y `videos/technology-drone-field-4k.mp4`: no están en
  la lista de prioridad 1-4 del README (son "apoyo"/opcional para Tecnología, no
  requeridos) — se dejan sin usar en esta ronda, disponibles para una futura iteración.

### Convención de archivos y procedencia
- Videos elegidos → `public/video/`, con entrada nueva en `public/video/CREDITS.md`
  (mismo formato ya usado para `drone-flight-close.mp4`).
- Imágenes elegidas → `public/IMAGENES_PAGINA_WEB/`, con entradas nuevas en
  `public/IMAGENES_PAGINA_WEB/PROVENANCE.md` (mismo formato ya usado en esa tabla:
  archivo/fuente/fotógrafo/licencia/URL).
- `public/media-library/` (carpeta de curaduría del usuario, con su propio README.md y
  PROVENANCE.md) se conserva intacta como registro de la selección original — no se
  borra ni se modifica.

</decisions>

<specifics>
## Specific Ideas

Ninguna — el `README.md` del usuario en `public/media-library/README.md` es la
especificación completa y ya aprobada de esta tarea.

</specifics>

<canonical_refs>
## Canonical References

- `public/media-library/README.md` — especificación de ubicación por sección y prioridad
  de implementación (fuente de verdad de esta tarea).
- `public/media-library/PROVENANCE.md` — autor/fuente/licencia/hash de cada archivo, a
  propagar hacia `public/IMAGENES_PAGINA_WEB/PROVENANCE.md` y `public/video/CREDITS.md`.
- `.planning/phases/01-fundaci-n-tema-claro-y-especificaci-n-de-movimiento-moderado/01-UI-SPEC.md`
  — tokens de diseño LOCKEADOS a reutilizar en el nuevo panel visual de Capacidades y el
  bloque nuevo de Proceso (sin introducir tamaños/colores/espaciados nuevos).

</canonical_refs>
