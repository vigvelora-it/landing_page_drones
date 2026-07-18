"use client"

import { useRef } from "react"
import { Arrow } from "@/components/arrow"
import { useGSAP } from "@/lib/gsap"
import { services } from "@/lib/site-content"

export function CapabilitiesSection() {
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
    <>
      <section ref={root} className="capabilities section-pad" id="capacidades">
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
    </>
  )
}
