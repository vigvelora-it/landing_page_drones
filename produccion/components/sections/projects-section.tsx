"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { useScrollLock } from "@/hooks/use-scroll-lock"
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
  onOpen,
}: {
  project: Project
  index: number
  featured?: boolean
  onOpen: (project: Project) => void
}) {
  const displayIndex = String(index).padStart(2, "0")

  return (
    <article className={`project-card${featured ? " project-card--featured" : ""}`} data-reveal>
      <button
        type="button"
        className="project-card__visual"
        aria-label={`Abrir galería de ${project.name}`}
        onClick={() => onOpen(project)}
      >
        <Image
          src={project.images[0]}
          alt=""
          fill
          sizes={featured ? "(max-width: 1000px) 100vw, 58vw" : "(max-width: 1000px) 100vw, 38vw"}
        />
        <span className="project-card__shade" aria-hidden="true" />
        <span className="project-card__location">{project.location}</span>
        <span className="project-card__gallery-cue">
          <i aria-hidden="true">+</i>
          Ver fotos · {project.images.length}
        </span>
        <strong aria-hidden="true">{displayIndex}</strong>
      </button>
      <div className="project-card__body">
        <span className="project-card__index">Proyecto real · {displayIndex}</span>
        <h3>{project.name}</h3>
        <ProjectFacts project={project} />
      </div>
    </article>
  )
}

function ProjectGallery({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [activeImage, setActiveImage] = useState(0)

  useScrollLock(!!project)

  useEffect(() => {
    const dialog = dialogRef.current
    if (project && dialog && !dialog.open) {
      setActiveImage(0)
      dialog.showModal()
    }
  }, [project])

  function closeGallery() {
    dialogRef.current?.close()
  }

  function step(direction: -1 | 1) {
    if (!project) return
    setActiveImage((current) => (current + direction + project.images.length) % project.images.length)
  }

  return (
    <dialog
      ref={dialogRef}
      className="project-gallery"
      aria-labelledby="project-gallery-title"
      onCancel={(event) => {
        event.preventDefault()
        closeGallery()
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeGallery()
      }}
    >
      {project ? (
        <div className="project-gallery__panel" data-lenis-prevent>
          <header className="project-gallery__header">
            <div>
              <span className="mono-label">Registro de campo</span>
              <h2 id="project-gallery-title">{project.name}</h2>
            </div>
            <button type="button" className="project-gallery__close" onClick={closeGallery}>
              <span>Cerrar</span>
              <i aria-hidden="true">×</i>
            </button>
          </header>

          <div className="project-gallery__stage">
            <Image
              src={project.images[activeImage]}
              alt={`${project.name}, fotografía ${activeImage + 1} de ${project.images.length}`}
              fill
              priority
              sizes="(max-width: 720px) 100vw, 88vw"
            />
            <button type="button" className="project-gallery__arrow project-gallery__arrow--prev" onClick={() => step(-1)} aria-label="Fotografía anterior">
              ←
            </button>
            <button type="button" className="project-gallery__arrow project-gallery__arrow--next" onClick={() => step(1)} aria-label="Fotografía siguiente">
              →
            </button>
            <span className="project-gallery__counter">
              {String(activeImage + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
            </span>
          </div>

          <div className="project-gallery__thumbs" aria-label="Seleccionar fotografía">
            {project.images.map((image, index) => (
              <button
                type="button"
                className={index === activeImage ? "is-active" : ""}
                aria-label={`Ver fotografía ${index + 1}`}
                aria-current={index === activeImage ? "true" : undefined}
                onClick={() => setActiveImage(index)}
                key={image}
              >
                <Image src={image} alt="" fill sizes="120px" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </dialog>
  )
}

export function ProjectsSection() {
  const root = useRef<HTMLElement>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
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
    <>
      <section ref={root} id="proyectos" className="projects-section section-pad">
        <div className="site-shell">
          <div className="section-kicker" data-reveal>
            <span>04</span>
            <span>Proyectos</span>
          </div>

          <header className="projects-heading" data-reveal>
            <h2>Proyectos</h2>
            <p>Registros reales de nuestras operaciones en campo. Selecciona un proyecto para explorar sus fotografías.</p>
          </header>

          <div className="projects-layout">
            <ProjectCard project={featuredProject} index={1} featured onOpen={setActiveProject} />

            <div className="project-supporting">
              {supportingProjects.map((project, index) => (
                <ProjectCard project={project} index={index + 2} key={project.id} onOpen={setActiveProject} />
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

      <ProjectGallery project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
