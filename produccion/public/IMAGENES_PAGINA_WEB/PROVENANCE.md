# Procedencia de imágenes — public/IMAGENES_PAGINA_WEB/

Registro de origen y licencia de cada imagen usada en el sitio, para cumplir QA-03
(ninguna imagen puede carecer de procedencia documentada).

## Imágenes agregadas 2026-07-21 (cierre QA-03)

| Archivo | Fuente | Fotógrafo | Licencia | URL de origen |
|---|---|---|---|---|
| `geologo-campo-roca.jpg` | Unsplash | JR Harris | Unsplash License (uso comercial libre, sin atribución requerida) | https://unsplash.com/photos/man-in-gray-jacket-and-brown-pants-sitting-on-brown-rock-during-daytime-zvW35IoUDqI |
| `mineria-tajo-abierto.jpg` | Unsplash | Chris Münch (@q_bee) | Unsplash License (uso comercial libre, sin atribución requerida) | https://unsplash.com/photos/bWFcqGQMtv4 |
| `infraestructura-obra-civil.jpg` | Unsplash | Tolu Olubode | Unsplash License (uso comercial libre, sin atribución requerida) | https://unsplash.com/photos/gray-concrete-building-under-construction-PlBsJ5MybGc |

Descargadas a 1600px de ancho (`?fm=jpg&q=75&w=1600&auto=format&fit=crop`) desde el CDN oficial de Unsplash (`images.unsplash.com`).
Ninguna de estas tres imágenes usa la licencia paga "Unsplash+" — se verificó explícitamente que cada página de origen indica "Unsplash License" antes de descargar.

## Imágenes agregadas 2026-07-22 (biblioteca multimedia curada por el usuario)

Curadas y verificadas por el usuario (SHA-256, revisión visual, sin generación por IA) en
`public/media-library/` — ver `public/media-library/PROVENANCE.md` para el detalle
completo (hashes, resolución exacta en píxeles, bytes). Reemplazan 3 de las 4 imágenes de
la banda "Sectores que atendemos" (Minería, Infraestructura, Geología — Topografía sin
cambio) y añaden usos nuevos en Nosotros, Capacidades, Proceso y Contacto.

| Archivo | Fuente | Fotógrafo | Licencia | URL de origen |
|---|---|---|---|---|
| `capabilities-total-station.jpg` | Unsplash | Nazmul ahsan Meraz | Unsplash License | https://unsplash.com/photos/surveyor-using-a-total-station-in-a-grassy-field-OIZPlqDEbPM |
| `technology-rtk-quarry.jpg` | Unsplash | Valerie V | Unsplash License | https://unsplash.com/photos/gray-tripod-on-brown-rock-5Rp0rkDziGY |
| `brand-geologists-field.jpg` | Pexels | Plato Terentev | Pexels License | https://www.pexels.com/photo/unrecognizable-geologists-in-uniforms-studying-minerals-against-forest-5909436/ |
| `technology-drone-operator.jpg` | Pexels | Thibaut Tattevin | Pexels License | https://www.pexels.com/photo/a-person-holding-a-drone-17893678/ |
| `projects-open-pit-mine.jpg` | Pexels | Artem Makarov | Pexels License | https://www.pexels.com/photo/view-of-open-pit-mine-on-sunny-day-13224682/ |
| `projects-bridge-construction.jpg` | Unsplash | LISK OBE | Unsplash License | https://unsplash.com/photos/bridge-under-construction-over-a-wide-river-NItW3rHlCJo |
| `geology-rock-formations.jpg` | Pexels | Bálint Varga | Pexels License | https://www.pexels.com/photo/rock-formations-10863068/ |
| `process-engineers-plans.jpg` | Pexels | Mikael Blomkvist | Pexels License | https://www.pexels.com/photo/a-two-engineer-talking-together-8961073/ |
| `contact-drone-pilot.jpg` | Pexels | Bert Christiaens | Pexels License | https://www.pexels.com/photo/man-flying-drones-across-the-field-5555812/ |

Regla de atribución (heredada de `public/media-library/README.md`): estas fotos son
ilustrativas. No deben presentarse como empleados, equipos propios o proyectos ejecutados
por VIG/SkyTech — no se usaron para retratos del equipo, el carrusel de equipos ni las
fichas de los 3 proyectos reales con nombre.

## Imágenes preexistentes (origen no documentado por el cliente)

Las siguientes imágenes fueron entregadas directamente por el cliente/proyecto original y no tienen procedencia externa documentada porque son material propio de la empresa (renders/fotos de equipos aportados por SkyTech):

- `dron.png`
- `equipos1.png`
- `MUSEO ZEN L1.png`
- `monumentacion_puntos_referencia.png`
- `topografia-con-drones.jpg`
- `usar-drones-en-topografia.jpg`

## Imágenes generadas 2026-07-22 (carrusel de tecnología)

Generadas con la herramienta integrada `image_gen` de OpenAI para conseguir cuatro
encuadres panorámicos 3:2 coherentes, a 1536×1024 px. Son visuales referenciales y no
representan inventario, personal, ubicaciones ni proyectos reales de SkyTech.

| Archivo | Tema | Resolución | Uso autorizado |
|---|---|---:|---|
| `equipment-carousel/equipment-drone-andes-hd.png` | Dron de mapeo en terreno andino | 1536×1024 | Visual referencial del carrusel |
| `equipment-carousel/equipment-gnss-rtk-hd.png` | Receptor y base GNSS RTK en campo | 1536×1024 | Visual referencial del carrusel |
| `equipment-carousel/equipment-total-station-hd.png` | Estación total en infraestructura | 1536×1024 | Visual referencial del carrusel |
| `equipment-carousel/equipment-aerial-survey-hd.png` | Operación aérea sobre entorno minero | 1536×1024 | Visual referencial del carrusel |

Restricciones comunes de generación: sin logotipos, nombres de marca, texto ni marcas
de agua; equipo completo dentro del encuadre; estética documental geoespacial y
composición horizontal compatible con tarjetas simultáneas.

## Imágenes generadas 2026-07-22 (exclusividad entre secciones)

Generadas con la herramienta integrada `image_gen` de OpenAI para eliminar toda
repetición de fotografías entre secciones. Los PNG originales se convirtieron
localmente a WebP calidad 86 mediante `sharp`, sin reescalado. Son visuales
referenciales y no representan personal, equipos, ubicaciones ni proyectos reales de
SkyTech.

| Archivo | Prompt final resumido | Resolución | Uso exclusivo |
|---|---|---:|---|
| `section-unique/technology-rtk-coastal-hd.webp` | Topógrafo peruano operando base y rover GNSS RTK en valle costero árido, encuadre editorial horizontal | 1586×992 | Tecnología — RTK / PPK |
| `section-unique/technology-lidar-geology-hd.webp` | Escáner LiDAR terrestre frente a estratos andinos con ingeniero y tableta de campo | 1586×992 | Tecnología — LiDAR |
| `section-unique/technology-cad-gis-workstation-hd.webp` | Analista geoespacial revisando modelo 3D, curvas de nivel y alineamiento en dos monitores | 1586×992 | Tecnología — CAD + GIS |
| `section-unique/process-terrain-geology-hd.webp` | Geólogo leyendo estratos con brújula, lupa y tableta robusta en afloramiento andino | 1586×992 | Proceso — lectura del terreno |
| `section-unique/process-mission-planning-hd.webp` | Mesa cenital de planificación con mapa topográfico, controlador, baterías y EPP | 1586×992 | Proceso — diseño de misión |
| `section-unique/process-total-station-road-hd.webp` | Dos topógrafos capturando datos con estación total y prisma en corredor vial de montaña | 1577×997 | Proceso — captura de realidad |
| `section-unique/menu-process-sensor-calibration-hd.webp` | Técnico calibrando sensor multiespectral y cámara estabilizada en taller limpio | 1672×941 | Mega-menú — Proceso |
| `section-unique/menu-projects-bridge-valley-hd.webp` | Vista aérea oblicua de carretera y puente sobre valle seco en estribaciones costeras | 1672×941 | Mega-menú — Proyectos |

Restricciones comunes del prompt: fotografía técnica premium y fotorealista, luz
natural o de taller controlada, paleta sobria, composición horizontal compatible con
el contenedor real; sin logotipos, marcas legibles, texto, marcas de agua, estética
de ciencia ficción ni saturación intensa.
