"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@/lib/gsap"

export function ManifestoSection() {
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
    <section ref={root} className="statement section-pad" id="nosotros">
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
  )
}
