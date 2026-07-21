"use client"

import { useRef } from "react"

import { useGSAP } from "@/lib/gsap"
import { brochure, differentiation, projects, team, type Project } from "@/lib/site-content"

function ProjectFacts({ project }: { project: Project }) {
  return (
    <dl className="project-facts">
      <div>
        <dt>Cliente</dt>
        <dd>{project.client}</dd>
      </div>
      <div>
        <dt>Ubicación</dt>
        <dd>{project.location}</dd>
      </div>
      <div>
        <dt>Servicio realizado</dt>
        <dd>{project.service}</dd>
      </div>
    </dl>
  )
}

export function ProjectsSection() {
  const root = useRef<HTMLElement>(null)
  const featuredProjects = projects.filter((project) => project.featured)
  const featuredProject = featuredProjects[0]
  const supportingProjects = projects.filter((project) => !project.featured)

  if (process.env.NODE_ENV !== "production" && featuredProjects.length !== 1) {
    throw new Error("ProjectsSection requiere exactamente un proyecto destacado")
  }

  useGSAP(
    () => {
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

      root.current
        ?.querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((element) => revealObserver.observe(element))

      return () => revealObserver.disconnect()
    },
    { scope: root },
  )

  if (!featuredProject) return null

  return (
    <section ref={root} id="proyectos" className="projects-section section-pad">
      <div className="site-shell">
        <div className="section-kicker" data-reveal>
          <span>04</span>
          <span>Proyectos</span>
        </div>

        <header className="projects-heading" data-reveal>
          <h2>Proyectos</h2>
        </header>

        <div className="projects-layout">
          <article className="project-card project-card--featured" data-reveal>
            <span className="project-card__index" aria-hidden="true">01</span>
            <h3>{featuredProject.name}</h3>
            <ProjectFacts project={featuredProject} />
          </article>

          <div className="project-supporting">
            {supportingProjects.map((project, index) => (
              <article className="project-card" data-reveal key={project.id}>
                <span className="project-card__index" aria-hidden="true">
                  {String(index + 2).padStart(2, "0")}
                </span>
                <h3>{project.name}</h3>
                <ProjectFacts project={project} />
              </article>
            ))}
          </div>
        </div>

        <section className="differentiation-band" aria-labelledby="differentiation-heading">
          <div className="differentiation-heading" data-reveal>
            <p className="mono-label">Evidencia técnica</p>
            <h3 id="differentiation-heading">Diferenciación</h3>
            <p>{differentiation.advantage}</p>
          </div>

          <div className="evidence-grid">
            <div className="evidence-cell" data-reveal>
              <strong>{team.length}</strong>
              <span>Ingenieros Geólogos</span>
            </div>
            <div className="evidence-cell" data-reveal>
              <strong>{projects.length}</strong>
              <span>Proyectos reales</span>
            </div>
            <div className="evidence-cell" data-reveal>
              <strong>2024</strong>
              <span>Fundación</span>
            </div>
            <div className="evidence-cell evidence-cell--locations" data-reveal>
              <strong>Huarmey · Huaral · Castilla</strong>
              <span>Ancash · Lima · Piura</span>
            </div>
          </div>

          <p className="differentiation-message" data-reveal>{differentiation.message}</p>
        </section>

        <section className="brochure-block" aria-labelledby="brochure-heading" data-reveal>
          <div>
            <p className="mono-label">Material descargable</p>
            <h3 id="brochure-heading">{brochure.title}</h3>
          </div>
          <a
            className="brochure-cta"
            href={brochure.href}
            download
            type="application/pdf"
            data-cursor="Descargar"
          >
            <span>Descargar brochure</span>
            {brochure.fileSizeLabel ? <span className="brochure-cta__meta">{brochure.fileSizeLabel}</span> : null}
          </a>
        </section>
      </div>
    </section>
  )
}
