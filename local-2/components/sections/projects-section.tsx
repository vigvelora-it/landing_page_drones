"use client"

import { useRef } from "react"

import { useGSAP } from "@/lib/gsap"
import { brochure, projects, type Project } from "@/lib/site-content"

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

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project
  index: number
  featured?: boolean
}) {
  const displayIndex = String(index).padStart(2, "0")

  return (
    <article className={`project-card${featured ? " project-card--featured" : ""}`} data-reveal>
      <div className="project-card__visual" aria-hidden="true">
        <span>{project.location}</span>
        <strong>{displayIndex}</strong>
      </div>
      <div className="project-card__body">
        <span className="project-card__index">Proyecto real · {displayIndex}</span>
        <h3>{project.name}</h3>
        <ProjectFacts project={project} />
      </div>
    </article>
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
          <ProjectCard project={featuredProject} index={1} featured />

          <div className="project-supporting">
            {supportingProjects.map((project, index) => (
              <ProjectCard project={project} index={index + 2} key={project.id} />
            ))}
          </div>
        </div>

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
