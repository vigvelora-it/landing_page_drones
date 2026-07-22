"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@/lib/gsap"
import { process } from "@/lib/site-content"

export function ProcessSection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    root.current?.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => revealObserver.observe(element))
    return () => revealObserver.disconnect()
  }, { scope: root })

  return (
    <section ref={root} className="process-section section-pad" id="proceso">
      <div className="site-shell">
        <div className="section-kicker" data-reveal><span>05</span><span>Cómo trabajamos</span></div>
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

        <div className="process-visual" data-reveal>
          <div className="process-visual__frame media-frame">
            <Image
              src="/IMAGENES_PAGINA_WEB/process-engineers-plans.jpg"
              alt="Dos ingenieros revisando planos técnicos"
              fill
              sizes="100vw"
            />
          </div>
          <span className="process-visual__caption">Coordinación técnica en cada etapa del proyecto</span>
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
  )
}
