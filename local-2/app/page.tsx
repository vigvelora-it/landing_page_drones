import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Experience } from "@/components/experience";

export const dynamic = "force-static";

const services = [
  {
    number: "01",
    title: "Topografía con drones",
    detail: "Modelos de terreno y superficies con precisión centimétrica.",
  },
  {
    number: "02",
    title: "Fotogrametría aérea",
    detail: "Ortomosaicos y modelos 3D listos para decisiones de ingeniería.",
  },
  {
    number: "03",
    title: "Nubes de puntos LiDAR",
    detail: "Lectura precisa del territorio incluso bajo cobertura vegetal.",
  },
  {
    number: "04",
    title: "Teledetección multiespectral",
    detail: "Información invisible al ojo para agricultura y medio ambiente.",
  },
  {
    number: "05",
    title: "Inspección de infraestructura",
    detail: "Diagnóstico visual seguro, trazable y de alta resolución.",
  },
  {
    number: "06",
    title: "Consultoría geotécnica",
    detail: "Datos interpretados y entregables compatibles con CAD y GIS.",
  },
];

const process = [
  ["01", "Leemos el terreno", "Definimos alcance, precisión, sistema de coordenadas y condiciones de operación."],
  ["02", "Diseñamos la misión", "Planificamos rutas, puntos de control y sensores según el resultado que necesitas."],
  ["03", "Capturamos la realidad", "Volamos, verificamos la cobertura y controlamos la calidad desde campo."],
  ["04", "Convertimos datos", "Procesamos, validamos y entregamos información lista para tus equipos CAD y GIS."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <Experience />
      <main>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />

          <div className="hero-media parallax-media" data-parallax="0.16">
            <Image
              src="/IMAGENES_PAGINA_WEB/topografia-con-drones.jpg"
              alt="Drone realizando un levantamiento topográfico sobre un modelo de terreno"
              fill
              priority
              sizes="100vw"
            />
            <video
              className="hero-video"
              id="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/IMAGENES_PAGINA_WEB/topografia-con-drones.jpg"
              aria-hidden="true"
            >
              <source src="/video/drone-flight-close.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-gridlines" aria-hidden="true" />

          <div className="hero-copy site-shell">
            <p className="eyebrow hero-eyebrow" data-reveal>
              <span className="pulse-dot" /> Geomática avanzada · Perú
            </p>
            <h1 id="hero-title" className="hero-title" aria-label="El territorio habla. Nosotros lo convertimos en decisiones.">
              <span className="title-line" data-reveal><span>El territorio</span></span>
              <span className="title-line title-line-offset" data-reveal><span>habla.</span></span>
              <span className="title-line title-line-small" data-reveal><span>Nosotros lo convertimos</span></span>
              <span className="title-line title-line-accent" data-reveal><span>en decisiones.</span></span>
            </h1>

            <div className="hero-bottom" data-reveal>
              <p>
                Capturamos la realidad desde el aire y la transformamos en información precisa para minería,
                construcción y territorio.
              </p>
              <a className="circle-link magnetic" href="#capacidades" data-cursor="Explorar">
                <span>Explorar</span><Arrow />
              </a>
            </div>
          </div>

          <div className="hero-index" aria-hidden="true">14°04&apos;S<br />75°44&apos;W</div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
        </section>

        <section className="statement section-pad" id="nosotros">
          <div className="site-shell">
            <div className="section-kicker" data-reveal>
              <span>01</span><span>Una nueva perspectiva</span>
            </div>
            <p className="statement-copy" data-reveal>
              Donde otros ven superficie, <em>nosotros vemos información.</em> Medimos cada punto para que tus
              próximas decisiones no dependan de aproximaciones.
            </p>

            <div className="statement-grid">
              <div className="statement-visual media-frame" data-reveal data-cursor="Ver detalle">
                <Image
                  src="/IMAGENES_PAGINA_WEB/usar-drones-en-topografia.jpg"
                  alt="Especialista operando un drone topográfico en campo"
                  fill
                  sizes="(max-width: 800px) 100vw, 56vw"
                />
                <div className="frame-coordinates">OPERACIÓN / CAMPO / 01</div>
              </div>
              <div className="statement-aside" data-reveal>
                <p className="mono-label">Precisión que acelera</p>
                <p>
                  Reducimos semanas de levantamiento a horas de vuelo, cubriendo más superficie y eliminando
                  zonas ciegas sin comprometer la precisión.
                </p>
                <div className="metric"><strong data-count="2">±2</strong><span>cm<br />precisión GNSS</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="capabilities section-pad" id="capacidades">
          <div className="site-shell">
            <div className="section-kicker light" data-reveal>
              <span>02</span><span>Capacidades</span>
            </div>
            <div className="capabilities-heading">
              <h2 data-reveal>Del vuelo<br />al <em>dato.</em></h2>
              <p data-reveal>Tecnología aeroespacial aplicada a los sectores más exigentes del Perú.</p>
            </div>

            <div className="service-list">
              {services.map((service) => (
                <a className="service-row" href="#contacto" key={service.number} data-reveal data-cursor="Cotizar">
                  <span className="service-number">{service.number}</span>
                  <span className="service-title">{service.title}</span>
                  <span className="service-detail">{service.detail}</span>
                  <Arrow />
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="moving-band" aria-hidden="true">
          <div className="moving-band-track">
            <span>PRECISIÓN CENTIMÉTRICA</span><i>✳</i><span>DATOS QUE DECIDEN</span><i>✳</i>
            <span>PRECISIÓN CENTIMÉTRICA</span><i>✳</i><span>DATOS QUE DECIDEN</span><i>✳</i>
          </div>
        </div>

        <section className="technology" id="tecnologia">
          <div className="tech-sticky">
            <div className="tech-media parallax-media" data-parallax="0.1">
              <Image
                src="/IMAGENES_PAGINA_WEB/dron.png"
                alt="Drone profesional para levantamientos de alta precisión"
                fill
                sizes="100vw"
              />
            </div>
            <div className="tech-vignette" />
            <div className="site-shell tech-content">
              <div className="section-kicker light" data-reveal><span>03</span><span>Tecnología</span></div>
              <h2 data-reveal>Instrumentos<br />para ver lo<br /><em>invisible.</em></h2>
              <div className="tech-specs" data-reveal>
                <div><strong>RTK</strong><span>Posicionamiento<br />en tiempo real</span></div>
                <div><strong>240K</strong><span>Puntos LiDAR<br />por segundo</span></div>
                <div><strong>45MP</strong><span>Captura<br />fotogramétrica</span></div>
              </div>
            </div>
            <p className="tech-caption">Matrice 350 RTK / Plataforma aérea</p>
          </div>
        </section>

        <section className="process-section section-pad" id="proceso">
          <div className="site-shell">
            <div className="section-kicker" data-reveal><span>04</span><span>Cómo trabajamos</span></div>
            <div className="process-intro">
              <h2 data-reveal>De la pregunta<br />a la <em>certeza.</em></h2>
              <p data-reveal>Un proceso trazable en cada etapa, desde la planificación hasta el archivo final.</p>
            </div>
            <div className="process-list">
              {process.map(([number, title, copy]) => (
                <article className="process-step" key={number} data-reveal>
                  <span>{number}</span><h3>{title}</h3><p>{copy}</p><i aria-hidden="true" />
                </article>
              ))}
            </div>

            <div className="deliverable" data-reveal>
              <div className="deliverable-image media-frame">
                <Image
                  src="/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png"
                  alt="Equipo GNSS usado para puntos de control topográfico"
                  fill
                  sizes="(max-width: 800px) 100vw, 40vw"
                />
              </div>
              <div className="deliverable-copy">
                <span className="mono-label">El resultado</span>
                <h3>Información que entra directo a tu flujo.</h3>
                <p>Ortomosaicos, curvas de nivel, modelos digitales, nubes de puntos e informes compatibles con CAD y GIS.</p>
                <div className="file-types"><span>.DWG</span><span>.LAS</span><span>.TIFF</span><span>.SHP</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contacto">
          <div className="contact-backdrop">
            <Image
              src="/IMAGENES_PAGINA_WEB/equipos1.png"
              alt=""
              fill
              sizes="100vw"
            />
          </div>
          <div className="site-shell contact-grid">
            <div className="contact-copy">
              <div className="section-kicker light" data-reveal><span>05</span><span>Contacto</span></div>
              <h2 data-reveal>Tu próximo<br />proyecto empieza<br /><em>desde arriba.</em></h2>
              <p data-reveal>Cuéntanos qué necesitas medir. Nuestro equipo responderá con el enfoque técnico adecuado.</p>
              <a href="mailto:skytsperu@gmail.com" data-reveal>skytsperu@gmail.com <Arrow /></a>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="site-shell">
          <div className="footer-mark"><span className="brand-symbol">✳</span> SKY TECH</div>
          <div className="footer-bottom">
            <span>Geomática avanzada · Perú</span>
            <span>© {new Date().getFullYear()} Sky Tech Perú</span>
            <a href="#inicio">Volver arriba ↑</a>
          </div>
        </div>
      </footer>

      <div className="environment-badge" aria-label="Versión local de desarrollo">LOCAL · 2</div>
    </>
  );
}
