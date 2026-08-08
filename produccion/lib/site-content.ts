export interface ServiceGroup {
  heading?: string
  items: string[]
}

export interface Service {
  id: string
  number: string
  title: string
  detail: string
  tagline: string
  groups: ServiceGroup[]
  note?: string
  icon?: string
  image?: string
}

export const services: Service[] = [
  {
    id: "topografia-drones",
    number: "01",
    title: "Topografía y Fotogrametría con RPAS",
    detail: "Levantamientos aerofotogramétricos de alta precisión milimétrica para proyectos de ingeniería y construcción.",
    tagline: "Levantamientos aerofotogramétricos de alta precisión milimétrica para proyectos de ingeniería y construcción.",
    groups: [
      {
        items: [
          "Levantamientos topográficos de alta precisión mediante drones equipados con sistemas RTK/PPK y control terrestre.",
          "Generación de ortomosaicos georreferenciados de alta resolución espacial.",
          "Escaneo LiDAR aéreo para la obtención de modelos digitales de terreno (MDT/MDS) y nubes de puntos 3D.",
          "Cálculo de volúmenes de movimiento de tierras, pozas, tajos y stockpiles.",
          "Monitoreo periódico de avance de obra e inspección aérea de infraestructura crítica (taludes, vías, líneas de transmisión).",
        ],
      },
    ],
    note: "Optimizamos los tiempos de captura en campo hasta en un 60% en comparativa con la topografía convencional, garantizando tolerancias de precisión milimétrica y entregables compatibles con tus plataformas CAD y GIS.",
  },
  {
    id: "geotecnia-riesgos",
    number: "02",
    title: "Estudios Geotécnicos, Evaluación y Control de Riesgos Geológicos",
    detail: "Evaluación especializada del macizo rocoso, suelos y modelamiento 3D para garantizar la estabilidad operativa y prevenir contingencias en tu proyecto.",
    tagline: "Evaluación especializada del macizo rocoso, suelos y modelamiento 3D para garantizar la estabilidad operativa y prevenir contingencias en tu proyecto.",
    groups: [
      {
        items: [
          "Estudios de estabilidad de taludes en proyectos mineros y plataformas de perforación diamantina.",
          "Estudio, control y monitoreo de canteras con tecnología RPAS.",
          "Caracterización geomecánica de macizos rocosos y suelos orientada al diseño seguro de infraestructuras para ingeniería y/o minería.",
          "Modelamiento fotogramétrico 3D de macizos rocosos (mapeo de familias de discontinuidades en frentes inaccesibles mediante sensores aéreos).",
          "Zonificación y mapeo de peligros geológicos (deslizamientos, huaycos, caída de rocas y flujo de detritos).",
          "Inspección e inventario técnico de riesgos geológicos para programas de prevención.",
          "Monitoreo periódico de grietas y deformaciones estructurales mediante análisis fotogramétrico y nubes de puntos 3D.",
        ],
      },
    ],
    note: "Reducimos la exposición del personal en frentes inestables o de alta pendiente. Capturamos datos estructurales en zonas de difícil acceso con drones de alta resolución, entregando modelos de elevación y mapas de discontinuidades listos para software de análisis geotécnico.",
  },
  {
    id: "mineria-consultoria",
    number: "03",
    title: "Geomática Minera y Consultoría Técnica",
    detail: "Control topográfico de avances, cubicación de volúmenes y soporte normativo ambiental para operaciones mineras en exploración y explotación.",
    tagline: "Control topográfico de avances, cubicación de volúmenes y soporte normativo ambiental para operaciones mineras en exploración y explotación.",
    groups: [
      {
        items: [
          "Levantamiento aerofotogramétrico de relaves mediante tecnología RPAS, para el monitoreo volumétrico, control geométrico y seguimiento del comportamiento estructural de depósito de relaves mineros.",
          "Elaboración de instrumentos de gestión ambiental (IGAFOM / IGAC / DIA / EIA): desarrollo de componentes ambientales y líneas base geológicas para cumplimiento normativo.",
          "Soporte para formalización minera (REINFO): tramitación de permisos de uso de tierra, saneamiento de concesiones y expediente técnico ante DREM y MINEM.",
          "Evaluación geológica de proyectos mineros en todas sus etapas, desde cateo hasta perforación: mapeo de alteraciones, estructuras, muestreo geoquímico y soporte técnico a campañas de exploración.",
        ],
      },
    ],
    note: "Optimizamos el cálculo de inventarios de mineral y control de avances en horas en lugar de días, eliminando la interrupción del tránsito de maquinaria pesada y reduciendo los riesgos de personal en frentes de minado.",
  },
  {
    id: "obras-civiles",
    number: "04",
    title: "Obras Civiles",
    detail: "Topografía de precisión, mecánica de suelos y control de materiales para las etapas iniciales de proyectos de edificación e infraestructura.",
    tagline: "Topografía de precisión, mecánica de suelos y control de materiales para las etapas iniciales de proyectos de edificación e infraestructura.",
    groups: [
      {
        items: [
          "Topografía de precisión y modelado del terreno: levantamientos georreferenciados para lotización, edificaciones, carreteras, puentes y obras hidráulicas.",
          "Estudios de mecánica de suelos para cimentaciones: calicatas, perfiles estratigráficos, cálculo de capacidad portante y análisis de riesgo de asentamiento.",
          "Ensayos de laboratorio para infraestructura vial: ensayos CBR, proctor, proctor modificado, clasificación SUCS/AASHTO y límites de Atterberg para pavimentos y afirmados.",
          "Control de calidad y ensayos de materiales (concreto y asfalto): ensayos de agregados, diseño de mezclas y pruebas de resistencia a la compresión para cimentaciones y estructuras.",
          "Estudios de riesgo sísmico y estabilidad de taludes: evaluación de peligro sísmico-geotécnico y estabilidad de cortes pre-construcción.",
        ],
      },
    ],
    note: "Unimos la rapidez de la topografía mediante tecnología RPAS con el rigor de nuestro laboratorio de suelos para garantizar expedientes aprobables bajo las normativas técnicas peruanas vigentes (E.050) y manuales carretera del MTC, respaldados por procesos alineados a estándares certificables de calidad.",
  },
  {
    id: "servicios-complementarios",
    number: "05",
    title: "Servicios Complementarios",
    detail: "Prospección geofísica especializada para minería y agua subterránea, integración GIS y soporte técnico en exploración geológico-minera.",
    tagline: "Prospección geofísica especializada para minería y agua subterránea, integración GIS y soporte técnico en exploración geológico-minera.",
    groups: [
      {
        items: [
          "Geofísica para exploración minera: Tomografía de Resistividad Eléctrica (ERT), Polarización Inducida (IP) y métodos magnéticos para detección de estructuras y cuerpos mineralizados.",
          "Geofísica para agua subterránea: prospección mediante Sondajes Eléctricos Verticales (VES) y ERT para localización de acuíferos, nivel freático y diseño de pozos operacionales.",
          "Sistemas de Información Geográfica (GIS): procesamiento de datos de campo, sensores aéreos y geología en bases de datos espaciales y mapas temáticos para QGIS y ArcGIS.",
          "Capacitación técnica en exploración y geomática: talleres aplicados en uso de tecnología RPAS, fotogrametría aérea y herramientas GIS enfocados a equipos de exploración geológico-minera.",
        ],
      },
    ],
    note: "Correlacionamos la información aérea capturada vía RPAS con el modelamiento geofísico del subsuelo (ERT / IP / VES), entregando a tu equipo de exploración bases de datos GIS unificadas para la toma de decisiones estratégicas.",
  },
]

export const process = [
  ["01", "Diagnóstico y Definición Técnica", "Analizamos los requerimientos del cliente, definimos la normativa aplicable, establecemos la precisión requerida y planificamos la logística y condiciones de seguridad en campo."],
  ["02", "Diseño de Misión y Prospección", "Diseñamos la estrategia de exploración: planificación de rutas de vuelo fotogramétrico, disposición de tenderos geofísicos (ERT/IP/VES), puntos de ensayo geotécnico y red geodésica GNSS."],
  ["03", "Ejecución en Campo y Control de Calidad", "Desplegamos nuestros equipos en sitio para la toma de datos aéreos, mapeo geológico, muestreo de suelos y prospección del subsuelo, realizando validaciones de calidad en tiempo real."],
  ["04", "Gabinete, Ensayos e Integración GIS", "Procesamos la información en gabinete, ejecutamos ensayos de laboratorio, modelamos el subsuelo en 3D y elaboramos expedientes técnicos e informes compatibles con plataformas CAD y GIS."],
]

export interface EquipmentItem {
  id: string
  image: string
  alt: string
  caption: string
  description: string
  objectPosition?: string
}

export const equipment: EquipmentItem[] = [
  {
    id: "flota-rpas",
    image: "/skytech-real/general/05.webp",
    alt: "Piloto de Skytech operando un dron de levantamiento durante una misión de campo",
    caption: "Flota RPAS de Fotogrametría y Monitoreo",
    description: "Drones de alta autonomía equipados con cámaras de alta resolución para cobertura de áreas extensas.",
    objectPosition: "center 42%",
  },
  {
    id: "gnss-rtk-ppk",
    image: "/skytech-real/general/06.webp",
    alt: "Receptor GNSS RTK de Skytech instalado sobre un punto de control en campo",
    caption: "Estaciones Base y Receptores GNSS RTK/PPK",
    description: "Equipos geodésicos de precisión centimétrica para el establecimiento de puntos de control terrestre (GCP).",
    objectPosition: "center 34%",
  },
  {
    id: "prospeccion-geofisica",
    image: "/skytech-real/general/04.webp",
    alt: "Brigada de Skytech operando instrumental de campo durante una campaña de prospección",
    caption: "Equipos de Prospección Geofísica (ERT / IP / VES)",
    description: "Instrumentación para tomografía de resistividad eléctrica y sondeos para exploración de agua y minerales.",
    objectPosition: "center 58%",
  },
  {
    id: "laboratorio-gabinete",
    image: "/IMAGENES_PAGINA_WEB/section-unique/technology-cad-gis-workstation-hd.webp",
    alt: "Ingenieros procesando información geoespacial en estaciones de trabajo de gabinete",
    caption: "Laboratorio y Software de Gabinete",
    description: "Estaciones de trabajo de alto rendimiento para el procesamiento fotogramétrico, análisis geotécnico y modelado 3D.",
    objectPosition: "center 50%",
  },
]

export interface SectorImage {
  id: string
  image: string
  alt: string
  label: string
  description: string
}

export const sectors: SectorImage[] = [
  {
    id: "topografia",
    image: "/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png",
    alt: "Monumentación de puntos de referencia en un levantamiento topográfico",
    label: "Catastro, Territorio y Agricultura",
    description: "Habla directamente a empresas inmobiliarias, propietarios de terrenos, agrícolas y consultoras de saneamiento.",
  },
  {
    id: "geologia",
    image: "/IMAGENES_PAGINA_WEB/geology-rock-formations.jpg",
    alt: "Formaciones rocosas expuestas, relevantes para el análisis geológico del terreno",
    label: "Energía e Industria",
    description: "Abre la puerta a contratos de inspección y monitoreo técnico para empresas eléctricas, de hidrocarburos e industriales.",
  },
  {
    id: "mineria",
    image: "/IMAGENES_PAGINA_WEB/projects-open-pit-mine.jpg",
    alt: "Vista de una operación minera a tajo abierto",
    label: "Minería y Exploración",
    description: "Resalta su mayor diferenciador: ser un equipo de ingenieros geólogos con drones y geofísica.",
  },
  {
    id: "infraestructura",
    image: "/IMAGENES_PAGINA_WEB/projects-bridge-construction.jpg",
    alt: "Puente en construcción sobre un río de gran caudal",
    label: "Infraestructura y Obras Civiles",
    description: "Conecta directo con la garantía de la Norma E.050 y los manuales del MTC que se ha trabajado en la sección de Obras Civiles.",
  },
]

export interface CorporateValue {
  id: string
  name: string
  description: string
}

export const brandStory = {
  history:
    "SKYTECH SOLUTIONS nació en 2024 en Lima, Perú, de la mano de un equipo de ingenieros con una visión clara: transformar la manera en que la industria —minería, infraestructura, agricultura y gestión de recursos naturales— entiende y mide su entorno físico. Combinamos tecnología de drones de última generación con conocimiento especializado en topografía, geodesia y geociencias para ofrecer levantamientos de alta precisión, modelos 3D, inspección de infraestructuras críticas y estudios geológicos y geofísicos. Desde nuestros inicios, hemos apostado por la innovación constante, incorporando fotogrametría aérea, teledetección multiespectral y análisis de riesgos geológicos a nuestro portafolio de servicios. Hoy, SKYTECH SOLUTIONS acompaña a empresas del sector minero e industrial en sus proyectos más exigentes, entregando datos precisos y confiables que permiten decisiones más seguras e informadas.",
  about:
    "Somos una empresa fundada por ingenieros geólogos con amplia experiencia en los sectores minero, industrial, construcción e infraestructura. Unimos nuestro conocimiento de campo con tecnología RPAS de última generación para transformar la topografía y geodesia de precisión en el Perú.\n\nDesde 2024, en Skytech brindamos soluciones integrales en fotogrametría aérea, modelado 3D, estudios geotécnicos, catastro y exploración geológica, acompañando a nuestros clientes con datos confiables, entregables de calidad profesional y expedientes listos para la toma de decisiones.",
  mission:
    "Proveer soluciones integrales de geomática, ingeniería geológica, geotecnia y topografía de precisión mediante el uso de tecnología RPAS y herramientas de última generación. Nos comprometemos a entregar datos confiables y procesados bajo rigurosos estándares técnicos, facilitando la toma de decisiones estratégicas en los sectores minero, infraestructura y territorio, impulsando el desarrollo sostenible de cada proyecto.",
  vision:
    "Ser reconocidos en el Perú como la empresa líder y referente en servicios de geomática avanzada, geociencias e ingeniería base, destacando por nuestra excelencia técnica, innovación tecnológica con drones y rigor normativo. Aspiramos a ser el socio estratégico indispensable para las principales empresas de minería e infraestructura, impulsando proyectos seguros, eficientes y sostenibles.",
}

export const corporateValues: CorporateValue[] = [
  {
    id: "rigor-tecnico",
    name: "Rigor Técnico y Precisión",
    description:
      "Cada dato, mapa y ensayo de laboratorio está respaldado por el criterio de nuestros ingenieros geólogos y un estricto control de calidad, garantizando información fidedigna para decisiones críticas.",
  },
  {
    id: "innovacion-aeroespacial",
    name: "Innovación Aeroespacial",
    description:
      "Integración constante de tecnología RPAS, sensores avanzados y soluciones GIS para ofrecer entregables más rápidos, detallados y eficientes en campo.",
  },
  {
    id: "seguridad-operativa",
    name: "Seguridad Operativa",
    description:
      "Priorizamos la integridad de las personas en cada misión de campo, utilizando tecnología aérea para reducir riesgos y acceder a zonas complejas sin exponer vidas.",
  },
  {
    id: "integridad-etica",
    name: "Integridad y Ética Profesional",
    description:
      "Actuamos con transparencia y compromiso normativo en cada estudio, garantizando información imparcial que promueva el desarrollo sostenible de cada proyecto.",
  },
]

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
}

export interface Project {
  id: string
  name: string
  client: string
  location: string
  service: string
  images: string[]
  featured?: boolean
}

export interface Brochure {
  title: string
  href: string
  fileSizeLabel?: string
}

export const teamIntro =
  "SKYTECH SOLUTIONS está conformada por un equipo fundador de cuatro ingenieros geólogos, lo que nos permite integrar el conocimiento técnico de la geología con la tecnología de drones desde el diseño mismo de cada proyecto — no como un servicio externo, sino como parte de nuestro ADN profesional."

export const team: TeamMember[] = [
  {
    id: "paulo-rodriguez",
    name: "Paulo Rodríguez",
    role: "Ingeniero Geólogo Senior · Gerente General",
    bio: "Cuenta con 10 años de experiencia en el sector minero. Especialista en exploración geológica y manejo de software especializado, control de riesgos geológicos, además de experiencia como piloto de dron certificado.",
  },
  {
    id: "harold-navarro",
    name: "Harold Navarro",
    role: "Ingeniero Geólogo Senior · Sub Gerente",
    bio: "Cuenta con más de 10 años de experiencia en el sector minero. Especialista en exploración geológica y manejo de software especializado, con experiencia en el sector construcción, además de piloto de dron certificado.",
  },
  {
    id: "luis-alban",
    name: "Luis Alban",
    role: "Ingeniero Geólogo Senior · Socio Fundador",
    bio: "Amplia experiencia en el sector minero, con dirección de proyectos de exploración en etapa greenfield y brownfield, y gestión medioambiental.",
  },
  {
    id: "juan-ruiz",
    name: "Juan Carlos Ruiz",
    role: "Ingeniero Geólogo Project · Socio Fundador",
    bio: "Cuenta con 5 años de experiencia en el sector minero. Especialista en exploración geológica y manejo de software especializado, ensayos en mecánica de suelos, además de piloto de dron certificado.",
  },
]

export const projects: Project[] = [
  {
    id: "gesac-huarmey",
    name: "PROYECTO HUARMEY – ANCASH",
    client: "German Engineering & Cie. S.A.C",
    location: "Huarmey, Ancash",
    service: "Levantamiento Aerofotogramétrico",
    images: [
      "/projects/gesac/01.webp",
      "/projects/gesac/02.webp",
      "/projects/gesac/03.webp",
      "/projects/gesac/04.webp",
    ],
    featured: true,
  },
  {
    id: "lezard-huaral",
    name: "PROYECTO HUARAL – LIMA",
    client: "Black Swan Minerals S.A.C.",
    location: "Huaral, Lima",
    service: "Levantamiento Aerofotogramétrico",
    images: [
      "/projects/lezard/01.webp",
      "/projects/lezard/02.webp",
      "/projects/lezard/03.webp",
      "/projects/lezard/04.webp",
    ],
  },
  {
    id: "las-dunas-piura",
    name: "PROYECTO CASTILLA – PIURA",
    client: "Asociación Las Dunas Ecological",
    location: "Castilla, Piura",
    service: "Levantamiento Aerofotogramétrico",
    images: [
      "/projects/las-dunas/01.webp",
      "/projects/las-dunas/02.webp",
      "/projects/las-dunas/03.webp",
      "/projects/las-dunas/04.webp",
    ],
  },
]

export const differentiation = {
  advantage:
    "Skytech integra la experiencia de cuatro Ingenieros Geólogos con tecnología geoespacial de última generación, ofreciendo soluciones integrales para minería, infraestructura y gestión del territorio. No solo entregamos datos, sino análisis técnico y recomendaciones para la toma de decisiones.",
  message:
    "Skytech Solutions es un aliado estratégico que combina conocimiento geológico, ingeniería y tecnología de vanguardia para desarrollar soluciones confiables y de alta precisión para proyectos de minería, infraestructura y gestión del territorio.",
}

export const brochure: Brochure = {
  title: "Brochure SkyTech Solutions",
  href: "/brochures/skytech-solutions-brochure.pdf",
  fileSizeLabel: "PDF · 55 MB",
}
