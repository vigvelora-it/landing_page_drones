# Biblioteca multimedia candidata

Fecha de curaduría: 2026-07-22

Esta carpeta contiene material candidato para una futura iteración visual de `local-2`. Los archivos ya están descargados y verificados, pero **todavía no están conectados a ningún componente de la página**.

## Recomendación por sección

### Hero

- Primera opción: [`videos/hero-drone-in-flight-hd.mp4`](videos/hero-drone-in-flight-hd.mp4). El dron sí aparece volando en cuadro; es la opción que responde literalmente al requerimiento de mostrar un dron en movimiento.
- Apoyo o transición: [`videos/technology-drone-field-4k.mp4`](videos/technology-drone-field-4k.mp4). Es una toma aérea fluida de campo y montaña; funciona bien como introducción territorial, aunque el dron no aparece en cuadro.
- Antes de producción: crear una versión web de 1080p, sin audio, de 8 a 12 segundos, con `poster`, `preload="metadata"` y alternativa estática para `prefers-reduced-motion`.

### Nosotros, historia y enfoque geológico

- [`images/brand-geologists-field-hd.jpg`](images/brand-geologists-field-hd.jpg): ideal como imagen editorial de historia, trabajo de campo o enfoque geológico. El blanco y negro funciona bien con una sección de narrativa institucional.
- [`images/geology-rock-formations-hd.jpg`](images/geology-rock-formations-hd.jpg): fondo o detalle para geología, geotecnia y lectura del terreno.
- Equipo humano: usar únicamente fotografías reales de los cuatro geólogos. No usar personas de stock como si fueran miembros de VIG.

### Capacidades y servicios

- [`images/capabilities-total-station-hd.jpg`](images/capabilities-total-station-hd.jpg): opción principal para topografía convencional, control y captura de datos. El formato vertical permite un recorte editorial fuerte.
- [`images/technology-rtk-quarry-hd.jpg`](images/technology-rtk-quarry-hd.jpg): opción secundaria para GNSS/RTK, precisión y trabajo en cantera.

### Tecnología y equipos

- [`images/technology-drone-operator-hd.jpg`](images/technology-drone-operator-hd.jpg): apoyo para fotogrametría con dron o tecnología UAV.
- [`images/technology-rtk-quarry-hd.jpg`](images/technology-rtk-quarry-hd.jpg): apoyo para posicionamiento satelital y levantamiento RTK.
- El carrusel de equipos debe seguir mostrando equipos reales de la empresa. Estas fotos son contextuales y no prueban propiedad de los dispositivos mostrados.

### Sectores y proyectos

- Minería: [`images/projects-open-pit-mine-hd.jpg`](images/projects-open-pit-mine-hd.jpg) como portada estática y [`videos/projects-open-pit-mine-4k.mp4`](videos/projects-open-pit-mine-4k.mp4) como fondo de alto impacto.
- Infraestructura: [`images/projects-bridge-construction-hd.jpg`](images/projects-bridge-construction-hd.jpg) y [`videos/projects-bridge-construction-4k.mp4`](videos/projects-bridge-construction-4k.mp4).
- Geología: [`images/geology-rock-formations-hd.jpg`](images/geology-rock-formations-hd.jpg).
- Regla de atribución: estos medios son ilustrativos. No deben presentarse como proyectos ejecutados por VIG ni llevar nombres, cifras o resultados de proyectos reales.

### Proceso

- [`images/process-engineers-plans-hd.jpg`](images/process-engineers-plans-hd.jpg): coordinación técnica, revisión en campo y comunicación con el cliente.
- [`images/capabilities-total-station-hd.jpg`](images/capabilities-total-station-hd.jpg): levantamiento y control de calidad en campo.

### Contacto

- [`images/contact-drone-pilot-hd.jpg`](images/contact-drone-pilot-hd.jpg): fondo vertical con espacio negativo, útil para una composición con formulario o llamada a la acción.
- Alternativa sobria: usar un fotograma optimizado del video del Hero, manteniendo continuidad visual.

### Brochure

No se recomienda sustituir la portada o las páginas de la brochure con stock. La brochure debe permanecer como documento corporativo real del cliente.

## Prioridad de implementación

1. Hero con el dron visible en movimiento.
2. Capacidades con estación total y RTK.
3. Portadas de sectores: minería, infraestructura y geología.
4. Proceso y contacto.
5. B-roll 4K de proyectos, solo después de generar derivados web livianos.

## Reglas de uso

- Conservar [`PROVENANCE.md`](PROVENANCE.md) junto con los archivos.
- No atribuir personas, equipos, ubicaciones ni obras de stock a VIG.
- No usar stock para los retratos del equipo ni para fichas de proyectos reales.
- Mantener la atribución en el repositorio aunque las licencias no la exijan públicamente.
- Los videos 4K son archivos maestros. No deben servirse directamente en producción: primero generar MP4/WebM de 1080p con peso objetivo de 8 a 20 MB por clip.
- Verificar nuevamente la licencia si se vuelve a descargar o reemplazar cualquier archivo.

