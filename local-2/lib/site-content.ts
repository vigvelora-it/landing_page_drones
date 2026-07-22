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
    title: "Topografía y Tecnología con Drones",
    detail: "Captura de datos de precisión para todo tipo de proyecto",
    tagline: "Captura de datos de precisión para todo tipo de proyecto",
    groups: [
      {
        items: [
          "Levantamiento topográfico con drones RTK/PPK de alta precisión",
          "Fotogrametría aérea y generación de ortomosaicos",
          "Escaneo LiDAR y nubes de puntos 3D",
          "Cálculo de volúmenes de movimiento de tierras y stockpiles",
          "Monitoreo periódico de avance de obra",
          "Inspección aérea de infraestructura (líneas de transmisión, taludes, tajos)",
        ],
      },
    ],
    note: "Base tecnológica transversal que alimenta a los demás ejes de servicio.",
  },
  {
    id: "geotecnia-riesgos",
    number: "02",
    title: "Geotecnia y Riesgos Geológicos",
    detail: "Evaluación técnica del terreno para prevenir y decidir con seguridad",
    tagline: "Evaluación técnica del terreno para prevenir y decidir con seguridad",
    groups: [
      {
        items: [
          "Estudios de estabilidad de taludes en carreteras, canteras y plataformas mineras",
          "Zonificación de peligros geológicos (deslizamientos, huaycos, caída de rocas)",
          "Estudios de riesgo geológico para defensa civil y municipios",
        ],
      },
    ],
  },
  {
    id: "mineria-consultoria",
    number: "03",
    title: "Minería: Consultoría y Formalización",
    detail: "Acompañamiento técnico y normativo para el pequeño y mediano productor minero",
    tagline: "Acompañamiento técnico y normativo para el pequeño y mediano productor minero",
    groups: [
      {
        heading: "Consultoría para pequeños productores mineros:",
        items: [
          "Elaboración de IGAFOM / IGAC (instrumentos de gestión ambiental)",
          "Diseño de labores mineras y planeamiento de minado básico",
          "Estimación de recursos y reservas para PPM",
        ],
      },
      {
        heading: "Formalización de mineros artesanales (REINFO):",
        items: [
          "Trámites de saneamiento: concesión, uso de tierras, autorización de agua",
          "Elaboración de planes de trabajo y declaraciones juradas",
          "Acompañamiento ante DREM / MINEM",
        ],
      },
      {
        heading: "Exploración geológica:",
        items: [
          "Prospección y cartografiado geológico para empresas junior",
          "Muestreo geoquímico con apoyo de dron en zonas de difícil acceso",
        ],
      },
      {
        heading: "Estudios ambientales ligados a geología:",
        items: [
          "Líneas base geológicas para DIA / EIA",
          "Componente geológico-geotécnico de planes de cierre de minas",
        ],
      },
    ],
  },
  {
    id: "obras-civiles",
    number: "04",
    title: "Obras Civiles e Infraestructura Vial",
    detail: "Estudios técnicos de suelos y rocas para construcción segura",
    tagline: "Estudios técnicos de suelos y rocas para construcción segura",
    groups: [
      {
        heading: "Estudios técnicos de obras civiles:",
        items: [
          "Estudios geotécnicos para cimentaciones",
          "Mecánica de suelos y de rocas",
          "Estudios de mecánica de rocas para túneles y cortes en roca",
        ],
      },
      {
        heading: "Estudios de suelos para carreteras y puentes:",
        items: [
          "Ensayo CBR y clasificación SUCS / AASHTO",
          "Estudios de subrasante y afirmado",
          "Estudios de riesgo sísmico-geotécnico para obras de infraestructura",
        ],
      },
    ],
  },
  {
    id: "servicios-complementarios",
    number: "05",
    title: "Servicios Complementarios",
    detail: "Herramientas técnicas y de gestión que refuerzan los cuatro ejes anteriores",
    tagline: "Herramientas técnicas y de gestión que refuerzan los cuatro ejes anteriores",
    groups: [
      {
        heading: "Geofísica aplicada:",
        items: [
          "Tomografía de resistividad eléctrica (TRE) para exploración de agua y minerales",
          "Prospección geofísica para caracterización de subsuelo en proyectos viales y mineros",
          "Apoyo geofísico a estudios de estabilidad de taludes y detección de cavidades",
        ],
      },
      {
        heading: "Sistemas de Información Geográfica (SIG):",
        items: [
          "Elaboración de mapas temáticos y bases de datos espaciales de proyectos",
          "Integración de datos de campo, dron y satelitales en plataformas SIG (QGIS, ArcGIS)",
          "Visores web de proyecto para seguimiento remoto por el cliente",
        ],
      },
      {
        heading: "Auditorías y peritajes técnicos:",
        items: [
          "Auditorías geotécnicas independientes de taludes y depósitos de relaves",
          "Peritajes técnicos geológicos para procesos legales o seguros",
          "Revisión y validación de estudios de terceros (due diligence técnico)",
        ],
      },
      {
        heading: "Catastro y saneamiento físico legal:",
        items: [
          "Levantamiento y saneamiento de linderos para concesiones mineras",
          "Apoyo en trámites de catastro minero ante INGEMMET",
        ],
      },
      {
        heading: "Capacitación técnica y SSOMA:",
        items: [
          "Capacitación en seguridad y salud ocupacional minera (SSOMA) para personal de campo",
          "Talleres técnicos en uso de drones y herramientas SIG para equipos internos de clientes",
        ],
      },
    ],
    note: "Servicios pensados para generar ingresos recurrentes y fidelizar clientes entre proyectos puntuales.",
  },
]

export const process = [
  ["01", "Leemos el terreno", "Definimos alcance, precisión, sistema de coordenadas y condiciones de operación."],
  ["02", "Diseñamos la misión", "Planificamos rutas, puntos de control y sensores según el resultado que necesitas."],
  ["03", "Capturamos la realidad", "Volamos, verificamos la cobertura y controlamos la calidad desde campo."],
  ["04", "Convertimos datos", "Procesamos, validamos y entregamos información lista para tus equipos CAD y GIS."],
]

export interface EquipmentItem {
  id: string
  image: string
  alt: string
  caption: string
}

export const equipment: EquipmentItem[] = [
  {
    id: "drone-mapeo-andes",
    image: "/IMAGENES_PAGINA_WEB/equipment-carousel/equipment-drone-andes-hd.png",
    alt: "Visual referencial de un dron profesional preparado para mapeo en terreno andino",
    caption: "Dron de mapeo / Visual referencial",
  },
  {
    id: "gnss-rtk-campo",
    image: "/IMAGENES_PAGINA_WEB/equipment-carousel/equipment-gnss-rtk-hd.png",
    alt: "Visual referencial de receptores GNSS RTK instalados en un levantamiento de campo",
    caption: "Posicionamiento GNSS RTK / Visual referencial",
  },
  {
    id: "estacion-total-infraestructura",
    image: "/IMAGENES_PAGINA_WEB/equipment-carousel/equipment-total-station-hd.png",
    alt: "Visual referencial de una estación total frente a una obra de infraestructura",
    caption: "Estación total / Visual referencial",
  },
  {
    id: "fotogrametria-mineria",
    image: "/IMAGENES_PAGINA_WEB/equipment-carousel/equipment-aerial-survey-hd.png",
    alt: "Visual referencial de una operación de fotogrametría aérea sobre un entorno minero",
    caption: "Fotogrametría aérea / Visual referencial",
  },
]

export interface SectorImage {
  id: string
  image: string
  alt: string
  label: string
}

export const sectors: SectorImage[] = [
  {
    id: "topografia",
    image: "/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png",
    alt: "Monumentación de puntos de referencia en un levantamiento topográfico",
    label: "Topografía",
  },
  {
    id: "geologia",
    image: "/IMAGENES_PAGINA_WEB/geology-rock-formations.jpg",
    alt: "Formaciones rocosas expuestas, relevantes para el análisis geológico del terreno",
    label: "Geología",
  },
  {
    id: "mineria",
    image: "/IMAGENES_PAGINA_WEB/projects-open-pit-mine.jpg",
    alt: "Vista de una operación minera a tajo abierto",
    label: "Minería",
  },
  {
    id: "infraestructura",
    image: "/IMAGENES_PAGINA_WEB/projects-bridge-construction.jpg",
    alt: "Puente en construcción sobre un río de gran caudal",
    label: "Infraestructura e ingeniería civil",
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
    "Somos una empresa peruana especializada en topografía, geodesia e inspección aérea con drones. Desde 2024, brindamos servicios de alta precisión para los sectores minero, industrial y agrícola: levantamientos geodésicos, fotogrametría aérea, modelos 3D de infraestructuras y estudios geológicos, uniendo tecnología de punta con experiencia técnica especializada para ayudar a nuestros clientes a tomar mejores decisiones sobre sus proyectos.",
  mission:
    "Somos una empresa especializada en servicios geológicos-geotécnicos, dedicada a brindar soluciones integrales y de alta precisión mediante el uso de tecnologías avanzadas como drones, fotogrametría y teledetección. Nuestro compromiso es apoyar a nuestros clientes en la obtención de datos de precisión en levantamientos topográficos, la identificación de recursos naturales, la evaluación de riesgos geológicos y la planificación territorial, contribuyendo al éxito de sus proyectos y al desarrollo sostenible.",
  vision:
    "Ser líderes en el rubro de la topografía y geología-geotecnia, reconocidos por nuestra excelencia técnica, innovación tecnológica y compromiso con el desarrollo sostenible. Aspiramos a ser el socio estratégico preferido de empresas e instituciones, contribuyendo al éxito de proyectos que impulsen el crecimiento económico y la gestión responsable de los recursos naturales.",
}

export const corporateValues: CorporateValue[] = [
  {
    id: "precision",
    name: "Precisión",
    description:
      "Cada dato que entregamos está respaldado por rigor técnico y control de calidad, porque en geología y topografía los detalles marcan la diferencia entre un buen proyecto y uno excelente.",
  },
  {
    id: "innovacion",
    name: "Innovación",
    description:
      "Incorporamos constantemente tecnología de punta —drones, sensores multiespectrales, fotogrametría e inteligencia geoespacial— para ofrecer soluciones más rápidas, seguras y confiables.",
  },
  {
    id: "integridad",
    name: "Integridad",
    description:
      "Actuamos con transparencia y ética profesional en cada proyecto, construyendo relaciones de largo plazo basadas en la confianza de nuestros clientes.",
  },
  {
    id: "seguridad",
    name: "Compromiso con la seguridad",
    description:
      "Priorizamos la seguridad de nuestro equipo y de las operaciones en campo, reduciendo riesgos mediante el uso de tecnología aérea no tripulada en zonas de difícil acceso.",
  },
  {
    id: "sostenibilidad",
    name: "Sostenibilidad",
    description:
      "Promovemos una gestión responsable de los recursos naturales, generando información que contribuye a decisiones más sostenibles para nuestros clientes y el entorno.",
  },
  {
    id: "trabajo-equipo",
    name: "Trabajo en equipo",
    description:
      "Combinamos la experiencia técnica de cada integrante de nuestro equipo para entregar soluciones integrales, eficientes y de alta calidad.",
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
    name: "Paulo Alfredo Rodríguez Coronado",
    role: "Ingeniero Geólogo Senior · Gerente General",
    bio: "Cuenta con 10 años de experiencia en el sector minero. Especialista en exploración geológica y manejo de software especializado, control de riesgos geológicos, además de experiencia como piloto de dron certificado.",
  },
  {
    id: "harold-navarro",
    name: "Harold Jesús Navarro Saavedra",
    role: "Ingeniero Geólogo Senior · Sub Gerente",
    bio: "Cuenta con más de 10 años de experiencia en el sector minero. Especialista en exploración geológica y manejo de software especializado, con experiencia en el sector construcción, además de piloto de dron certificado.",
  },
  {
    id: "luis-alban",
    name: "Luis Alberto Alban Zapata",
    role: "Ingeniero Geólogo Senior · Socio Fundador",
    bio: "Amplia experiencia en el sector minero, con dirección de proyectos de exploración en etapa greenfield y brownfield, y gestión medioambiental.",
  },
  {
    id: "juan-ruiz",
    name: "Juan Carlos Ruiz Gonzales",
    role: "Ingeniero Geólogo Project · Socio Fundador",
    bio: "Cuenta con 5 años de experiencia en el sector minero. Especialista en exploración geológica y manejo de software especializado, ensayos en mecánica de suelos, además de piloto de dron certificado.",
  },
]

export const projects: Project[] = [
  {
    id: "gesac-huarmey",
    name: "Proyecto GESAC",
    client: "German Engineering & Cie. S.A.C",
    location: "Huarmey, Ancash",
    service: "Levantamiento Aerofotogramétrico",
    featured: true,
  },
  {
    id: "lezard-huaral",
    name: "Proyecto Lezard",
    client: "Black Swan Minerals S.A.C.",
    location: "Huaral, Lima",
    service: "Levantamiento Aerofotogramétrico",
  },
  {
    id: "las-dunas-piura",
    name: "Proyecto Las Dunas",
    client: "Asociación Las Dunas Ecological",
    location: "Castilla, Piura",
    service: "Levantamiento Aerofotogramétrico",
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
