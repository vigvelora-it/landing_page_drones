"use client"

import Image from "next/image"
import { useRef } from "react"

import { EquipmentCarousel } from "@/components/equipment-carousel"
import { useGSAP } from "@/lib/gsap"

export function TechnologySection() {
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
    <section ref={root} className="technology" id="tecnologia">
      <div className="technology-stage">
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
      </div>
      <EquipmentCarousel />
    </section>
  )
}
