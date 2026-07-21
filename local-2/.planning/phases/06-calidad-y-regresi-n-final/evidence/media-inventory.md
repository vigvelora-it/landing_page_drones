# Rendered media inventory — QA-03

Auditoría visual y DOM contra producción local en 1440x900 y 390x844. El filename o el alt no se usaron para inventar procedencia, cliente, mina ni campaña.

| Sección/render | Ruta fuente | Alt/decorativo | Sujeto observado | Provenance verificable | Eje defendible |
|---|---|---|---|---|---|
| Hero poster | `/IMAGENES_PAGINA_WEB/topografia-con-drones.jpg` | `Drone realizando un levantamiento topográfico sobre un modelo de terreno` | Drone/representación de terreno | No documentado | drone/topografía, parcial |
| Hero video | `/video/drone-flight-close.mp4` | Fondo audiovisual; control Pausar disponible | Drone en vuelo cercano | `public/video/CREDITS.md`: Mixkit 44644 | drone/topografía |
| Tecnología principal | `/IMAGENES_PAGINA_WEB/dron.png` | `Drone profesional para levantamientos de alta precisión` | Plataforma aérea/equipo | No documentado | drone/topografía, parcial |
| Carrusel 1 | `/IMAGENES_PAGINA_WEB/equipos1.png` | `Equipo de captura fotogramétrica utilizado en campo` | Equipo de captura con puente al fondo | No documentado | ingeniería e infraestructura genérica, parcial |
| Carrusel 2 | `/IMAGENES_PAGINA_WEB/dron.png` | `Drone Matrice 350 RTK, plataforma aérea de precisión` | Plataforma aérea | No documentado | drone/topografía; repetición |
| Proceso | `/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png` | `Equipo GNSS usado para puntos de control topográfico` | Receptor GNSS en terreno montañoso | No documentado | ingeniería/geomática de campo, parcial |
| Contacto | `/IMAGENES_PAGINA_WEB/equipos1.png` | alt vacío, repetición decorativa | Misma composición de equipo/puente | No documentado | decorativo; no agrega eje |

El runtime contiene seis `<img>` (una repetición decorativa) y un video. El `currentSrc` de cada imagen es la transformación same-origin `/_next/image` de la ruta local indicada.

## Dictamen

- Drone/topografía: representado.
- Ingeniería/geomática de campo: parcialmente representada por GNSS/equipo.
- Infraestructura: parcialmente representada por el puente genérico; no se atribuye a proyecto.
- Geología: no existe sujeto visual autorizado y con provenance que la pruebe.
- Minería: no existe contexto minero autorizado y con provenance que la pruebe.
- Provenance: solo el video tiene créditos locales; los PNG/JPG carecen de registro.

**QA-03: blocked/gap.** No puede aprobarse el balance simultáneo de geología, ingeniería, minería e infraestructura. Se requieren assets reales autorizados de geología/minería y provenance de los PNG/JPG. No se agregó, generó, renombró ni reinterpretó ningún asset.
