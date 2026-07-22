"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { Arrow } from "@/components/arrow"
import { ServiceDrawer } from "@/components/service-drawer"
import { useOverlayCoordination } from "@/hooks/use-overlay-coordination"
import { useGSAP } from "@/lib/gsap"
import { services, type Service } from "@/lib/site-content"

export function CapabilitiesSection() {
  const root = useRef<HTMLElement>(null)
  const [activeService, setActiveService] = useState<Service | null>(null)
  const menuIsOpen = useOverlayCoordination("drawer", !!activeService)

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
            {services.map((service) => {
              const isSelected = activeService?.id === service.id
              return (
                <button
                  type="button"
                  className="service-row"
                  key={service.id}
                  data-reveal
                  data-cursor="Ver detalle"
                  aria-disabled={menuIsOpen}
                  onClick={() => {
                    if (menuIsOpen) return
                    setActiveService(service)
                  }}
                >
                  <span className="service-number">{service.number}</span>
                  <span className="service-title">{service.title}</span>
                  <span className="service-detail">{service.detail}</span>
                  <Arrow />
                  {isSelected && <span className="service-row-selected-indicator" aria-hidden="true" />}
                </button>
              )
            })}
          </div>

          <div className="capabilities-visual" data-reveal>
            <div className="capabilities-visual__frame capabilities-visual__frame--primary">
              <Image
                src="/IMAGENES_PAGINA_WEB/capabilities-total-station.jpg"
                alt="Topógrafo operando una estación total en campo abierto"
                fill
                sizes="(max-width: 720px) 100vw, 45vw"
              />
            </div>
            <div className="capabilities-visual__frame">
              <Image
                src="/IMAGENES_PAGINA_WEB/technology-rtk-quarry.jpg"
                alt="Equipo de posicionamiento satelital RTK instalado en una cantera"
                fill
                sizes="(max-width: 720px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="moving-band" aria-hidden="true">
        <div className="moving-band-track">
          <span>PRECISIÓN CENTIMÉTRICA</span><i>✳</i><span>DATOS QUE DECIDEN</span><i>✳</i>
          <span>PRECISIÓN CENTIMÉTRICA</span><i>✳</i><span>DATOS QUE DECIDEN</span><i>✳</i>
        </div>
      </div>

      <ServiceDrawer
        service={activeService}
        isOpen={!!activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  )
}
