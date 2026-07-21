"use client"

import Image from "next/image"
import { useRef } from "react"
import { Arrow } from "@/components/arrow"
import { ContactForm } from "@/components/contact-form"
import { useGSAP } from "@/lib/gsap"

export function ContactSection() {
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
    <section ref={root} className="contact-section" id="contacto">
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
          <div className="section-kicker light" data-reveal><span>06</span><span>Contacto</span></div>
          <h2 data-reveal>Tu próximo<br />proyecto empieza<br /><em>desde arriba.</em></h2>
          <p data-reveal>Cuéntanos qué necesitas medir. Nuestro equipo responderá con el enfoque técnico adecuado.</p>
          <a href="mailto:skytsperu@gmail.com" data-reveal>skytsperu@gmail.com <Arrow /></a>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
