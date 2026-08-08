"use client"

import Image from "next/image"
import { type KeyboardEvent, useRef, useState } from "react"
import { useGSAP } from "@/lib/gsap"
import { process } from "@/lib/site-content"

const processVisuals = [
  {
    image: "/skytech-real/general/07.webp",
    alt: "Vista panorámica del territorio levantado por Skytech",
    caption: "Diagnóstico y definición técnica",
    objectPosition: "center 54%",
  },
  {
    image: "/skytech-real/general/01.webp",
    alt: "Base GNSS de Skytech instalada y señalizada antes del levantamiento",
    caption: "Diseño de misión y prospección",
    objectPosition: "center 56%",
  },
  {
    image: "/skytech-real/general/05.webp",
    alt: "Piloto de Skytech controlando un dron durante la captura de campo",
    caption: "Ejecución en campo y control de calidad",
    objectPosition: "center 42%",
  },
  {
    image: "/skytech-real/general/04.webp",
    alt: "Equipo de Skytech verificando puntos de control GNSS en campo",
    caption: "Gabinete, ensayos e integración GIS",
    objectPosition: "center 58%",
  },
] as const

export function ProcessSection() {
  const root = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const activeVisual = processVisuals[activeStep]

  const selectStep = (index: number) => {
    setActiveStep(index)
  }

  const selectAdjacentStep = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowRight") return

    event.preventDefault()
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1
    const nextIndex = (index + direction + process.length) % process.length
    selectStep(nextIndex)
    root.current?.querySelector<HTMLButtonElement>(`#process-tab-${process[nextIndex][0]}`)?.focus()
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

      return () => {
        revealObserver.disconnect()
      }
  }, { scope: root })

  return (
    <section ref={root} className="process-section section-pad" id="proceso">
      <div className="site-shell">
        <div className="section-kicker" data-reveal><span>05</span><span>Cómo trabajamos</span></div>
        <div className="process-intro">
          <h2 data-reveal>Metodología de ingeniería<br />de principio a <em>fin.</em></h2>
          <p data-reveal>Un proceso estructurado y multidisciplinario que garantiza trazabilidad, control de calidad y rigor normativo en cada etapa del proyecto.</p>
        </div>
        <div className="process-workflow">
          <div className="process-list" role="tablist" aria-label="Etapas del proceso">
            {process.map(([number, title, copy], index) => (
              <button
                className={`process-step${index === activeStep ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={index === activeStep}
                aria-controls="process-panel"
                id={`process-tab-${number}`}
                tabIndex={index === activeStep ? 0 : -1}
                data-process-index={index}
                key={number}
                onClick={() => selectStep(index)}
                onFocus={() => selectStep(index)}
                onKeyDown={(event) => selectAdjacentStep(event, index)}
              >
                <span>{number}</span>
                <span className="process-step__copy">
                  <strong>{title}</strong>
                  <small>{copy}</small>
                </span>
                <i aria-hidden="true" />
              </button>
            ))}
          </div>

          <div
            className="process-stage"
            id="process-panel"
            role="tabpanel"
            aria-labelledby={`process-tab-${process[activeStep][0]}`}
            data-reveal
          >
            <div className="process-stage__visual">
              <div className="topographic-lines" aria-hidden="true" />
              {processVisuals.map((visual, index) => (
                <Image
                  className={index === activeStep ? "is-active" : ""}
                  src={visual.image}
                  alt={index === activeStep ? visual.alt : ""}
                  aria-hidden={index !== activeStep}
                  fill
                  style={{ objectPosition: visual.objectPosition }}
                  sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1000px) calc(100vw - 40px), 54vw"
                  key={visual.image}
                />
              ))}
              <div className="process-stage__meta">
                <span>{activeVisual.caption}</span>
                <strong>{String(activeStep + 1).padStart(2, "0")} / {String(process.length).padStart(2, "0")}</strong>
              </div>
            </div>

            <div className="process-result">
              <div>
                <span className="mono-label">El resultado</span>
                <h3>Información lista para la toma de decisiones.</h3>
                <p>Entregamos informes geotécnicos con sello profesional, expedientes de formalización minera, modelos digitales de terreno (MDT) y bases de datos GIS unificadas.</p>
              </div>
              <div className="file-types" aria-label="Formatos de entrega">
                <span>.DWG</span><span>.LAS</span><span>.TIFF</span><span>.SHP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
