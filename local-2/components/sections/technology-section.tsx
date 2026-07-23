"use client"

import Image from "next/image"
import { type KeyboardEvent, useRef, useState } from "react"

import { EquipmentCarousel } from "@/components/equipment-carousel"
import { useGSAP } from "@/lib/gsap"

const technologyModes = [
  {
    id: "rtk",
    label: "RTK / PPK",
    description: "Levantamientos de alta precisión.",
    meta: "Posicionamiento / Precisión",
    image: "/IMAGENES_PAGINA_WEB/equipment-carousel/equipment-gnss-rtk-hd.png",
    alt: "Visual referencial de receptores GNSS RTK instalados en campo",
  },
  {
    id: "lidar",
    label: "LiDAR",
    description: "Nubes de puntos y modelos 3D.",
    meta: "Captura / Modelado",
    image: "/IMAGENES_PAGINA_WEB/equipment-carousel/equipment-drone-andes-hd.png",
    alt: "Visual referencial de un dron profesional equipado para captura geoespacial",
  },
  {
    id: "cad-gis",
    label: "CAD + GIS",
    description: "Entregables listos para ingeniería.",
    meta: "Procesamiento / Entrega",
    image: "/IMAGENES_PAGINA_WEB/process-engineers-plans.jpg",
    alt: "Ingenieros revisando información técnica y planos de un proyecto",
  },
] as const

export function TechnologySection() {
  const root = useRef<HTMLElement>(null)
  const [activeMode, setActiveMode] = useState(0)
  const selectedMode = technologyModes[activeMode]

  const selectAdjacentMode = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return

    event.preventDefault()
    const direction = event.key === "ArrowRight" ? 1 : -1
    const nextIndex = (index + direction + technologyModes.length) % technologyModes.length
    setActiveMode(nextIndex)
    root.current?.querySelector<HTMLButtonElement>(`#tech-tab-${technologyModes[nextIndex].id}`)?.focus()
  }

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
      <div className="site-shell tech-explorer">
        <div className="tech-explorer__content">
          <div className="section-kicker" data-reveal><span>03</span><span>Tecnología</span></div>
          <div className="tech-explorer__heading" data-reveal>
            <h2>Instrumentos para comprender lo que otros no ven.</h2>
            <p>Tecnología de captura y procesamiento aplicada a cada etapa del trabajo geomático.</p>
          </div>

          <div className="tech-mode-list" role="tablist" aria-label="Tecnologías" data-reveal>
            {technologyModes.map((mode, index) => (
              <button
                className={`tech-mode${index === activeMode ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={index === activeMode}
                aria-controls="tech-panel"
                id={`tech-tab-${mode.id}`}
                tabIndex={index === activeMode ? 0 : -1}
                key={mode.id}
                onClick={() => setActiveMode(index)}
                onKeyDown={(event) => selectAdjacentMode(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{mode.label}</strong>
                <small>{mode.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div
          className="tech-explorer__visual"
          id="tech-panel"
          role="tabpanel"
          aria-labelledby={`tech-tab-${selectedMode.id}`}
          data-reveal
        >
          <div className="topographic-lines" aria-hidden="true" />
          <div className="tech-visual-stack">
            {technologyModes.map((mode, index) => (
              <Image
                className={index === activeMode ? "is-active" : ""}
                src={mode.image}
                alt={index === activeMode ? mode.alt : ""}
                aria-hidden={index !== activeMode}
                fill
                sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1000px) calc(100vw - 40px), 58vw"
                key={mode.id}
              />
            ))}
          </div>
          <div className="tech-visual-meta">
            <span>{selectedMode.meta}</span>
            <strong>{String(activeMode + 1).padStart(2, "0")} / {String(technologyModes.length).padStart(2, "0")}</strong>
          </div>
        </div>
      </div>
      <EquipmentCarousel />
    </section>
  )
}
