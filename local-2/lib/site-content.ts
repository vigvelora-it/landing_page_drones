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
    id: "captura-fotogrametrica",
    image: "/IMAGENES_PAGINA_WEB/equipos1.png",
    alt: "Equipo de captura fotogramétrica utilizado en campo",
    caption: "Equipo de captura fotogramétrica",
  },
  {
    id: "matrice-350-rtk",
    image: "/IMAGENES_PAGINA_WEB/dron.png",
    alt: "Drone Matrice 350 RTK, plataforma aérea de precisión",
    caption: "Matrice 350 RTK / Plataforma aérea",
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

export const brochure: Brochure = {
  title: "Brochure SkyTech Solutions",
  href: "/brochures/skytech-solutions-brochure.pdf",
}
