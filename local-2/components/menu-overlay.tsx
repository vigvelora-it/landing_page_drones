"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type TransitionEvent } from "react"

import { ContactForm } from "@/components/contact-form"
import { useHeaderScrollState } from "@/hooks/use-header-scroll-state"
import { useOverlayCoordination } from "@/hooks/use-overlay-coordination"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { brandStory, differentiation, equipment, process, projects, services } from "@/lib/site-content"

interface NavPanelItem {
  label: string
  href: string
}

interface NavItem {
  key: string
  label: string
  href: string
  panel?: NavPanelItem[]
  description?: string
  image?: { src: string; alt: string }
  showContactForm?: boolean
}

const navItems: NavItem[] = [
  {
    key: "nosotros",
    label: "Nosotros",
    href: "#nosotros",
    panel: [
      { label: "Historia", href: "#historia" },
      { label: "Equipo", href: "#equipo" },
      { label: "Valores", href: "#valores" },
      { label: "Sectores", href: "#sectores" },
    ],
    description: brandStory.about,
    image: {
      src: "/IMAGENES_PAGINA_WEB/geologo-campo-roca.jpg",
      alt: "Ingeniero geólogo examinando estratos rocosos en campo",
    },
  },
  {
    key: "capacidades",
    label: "Capacidades",
    href: "#capacidades",
    panel: services.map((service) => ({ label: service.title, href: "#capacidades" })),
    description: "Tecnología aeroespacial aplicada a los sectores más exigentes del Perú.",
    image: {
      src: "/IMAGENES_PAGINA_WEB/mineria-tajo-abierto.jpg",
      alt: "Operación minera a tajo abierto con maquinaria pesada",
    },
  },
  {
    key: "tecnologia",
    label: "Tecnología",
    href: "#tecnologia",
    panel: equipment.map((item) => ({ label: item.caption, href: "#tecnologia" })),
    description:
      "Equipos de captura aérea y fotogramétrica operados por el equipo técnico en cada proyecto.",
    image: {
      src: "/IMAGENES_PAGINA_WEB/dron.png",
      alt: "Drone profesional para levantamientos de alta precisión",
    },
  },
  {
    key: "proyectos",
    label: "Proyectos",
    href: "#proyectos",
    panel: projects.map((project) => ({ label: project.name, href: "#proyectos" })),
    description: differentiation.message,
    image: {
      src: "/IMAGENES_PAGINA_WEB/topografia-con-drones.jpg",
      alt: "Drone realizando un levantamiento topográfico sobre un modelo de terreno",
    },
  },
  {
    key: "proceso",
    label: "Proceso",
    href: "#proceso",
    panel: process.map(([, title]) => ({ label: title, href: "#proceso" })),
    description: "Un proceso trazable en cada etapa, desde la planificación hasta el archivo final.",
    image: {
      src: "/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png",
      alt: "Equipo GNSS usado para puntos de control topográfico",
    },
  },
  {
    key: "contacto",
    label: "Contacto",
    href: "#contacto",
    description: "Cuéntanos qué necesitas medir. Nuestro equipo responderá con el enfoque técnico adecuado.",
    showContactForm: true,
  },
]

export function MenuOverlay() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const drawerOpen = useOverlayCoordination("menu", menuOpen)

  const [openKey, setOpenKey] = useState<string | null>(null)
  const [displayedKey, setDisplayedKey] = useState<string | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const pendingKeyRef = useRef<string | null>(null)
  const swapFallbackRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const triggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useScrollLock(menuOpen)
  useHeaderScrollState()

  const navigate = () => setMenuOpen(false)

  function openPanel(key: string) {
    clearTimeout(closeTimerRef.current)
    setOpenKey(key)
  }

  function scheduleClose() {
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setOpenKey(null), 250)
  }

  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  function finishSwap() {
    clearTimeout(swapFallbackRef.current)
    if (pendingKeyRef.current) setDisplayedKey(pendingKeyRef.current)
    pendingKeyRef.current = null
    setIsSwapping(false)
  }

  function handleContentTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "opacity" || event.target !== event.currentTarget) return
    if (isSwapping) finishSwap()
  }

  useEffect(() => {
    if (openKey === null) {
      // Panel is fully closing: cancel any in-flight swap so a stale pending key can't
      // resurface on the next open (isSwapping would otherwise block that open's own
      // swap from being scheduled). displayedKey is left as-is — it's hidden anyway,
      // and the next open naturally re-diffs it against the new openKey.
      if (isSwapping) {
        clearTimeout(swapFallbackRef.current)
        pendingKeyRef.current = null
        // eslint-disable-next-line react-hooks/set-state-in-effect -- cancels an in-flight swap on close, not a cascading render
        setIsSwapping(false)
      }
      return
    }
    if (displayedKey === null) {
      // Cold-open sync (panel goes from fully closed to open): assigns content directly,
      // no crossfade needed since the container itself fades in. Fires once per open, not
      // a cascading update — the swap branch below is what drives content transitions.
      setDisplayedKey(openKey)
      return
    }
    if (displayedKey === openKey || isSwapping) return
    pendingKeyRef.current = openKey
    setIsSwapping(true)
    clearTimeout(swapFallbackRef.current)
    swapFallbackRef.current = setTimeout(finishSwap, 400)
  }, [openKey, displayedKey, isSwapping])

  useEffect(() => () => clearTimeout(swapFallbackRef.current), [])

  useEffect(() => {
    if (!menuOpen) return

    firstLinkRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  useEffect(() => {
    if (!openKey) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      const key = openKey
      triggerRefs.current[key]?.focus()
      setOpenKey(null)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [openKey])

  const displayedItem = navItems.find((item) => item.key === displayedKey) ?? null

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Sky Tech Perú — inicio" onClick={navigate}>
          <span className="brand-symbol">✳</span><span>SKY TECH</span><small>PERÚ</small>
        </a>

        <div
          className="nav-region"
          onMouseLeave={scheduleClose}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              scheduleClose()
            }
          }}
        >
          <nav className="site-nav" aria-label="Navegación principal">
            <ul>
              {navItems.map((item) => (
                <li
                  key={item.key}
                  className="nav-item"
                  onMouseEnter={() => openPanel(item.key)}
                  onFocus={() => openPanel(item.key)}
                >
                  <a
                    ref={(el) => {
                      triggerRefs.current[item.key] = el
                    }}
                    href={item.href}
                    aria-haspopup="true"
                    aria-expanded={openKey === item.key}
                    aria-controls="mega-panel-shared"
                    onClick={() => setOpenKey(null)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mega-panel" id="mega-panel-shared" data-open={openKey !== null || undefined}>
            {displayedItem && (
              <div
                className={`mega-panel-grid${displayedItem.showContactForm ? " mega-panel-grid--contact" : ""}`}
                data-swapping={isSwapping || undefined}
                onTransitionEnd={handleContentTransitionEnd}
              >
                <div className="mega-panel-intro">
                  <p className="mono-label">{displayedItem.label}</p>
                  {displayedItem.description && <p>{displayedItem.description}</p>}
                  {displayedItem.panel && (
                    <a href={displayedItem.href} onClick={() => setOpenKey(null)}>
                      Ver overview
                    </a>
                  )}
                </div>
                {displayedItem.showContactForm ? (
                  <ContactForm reveal={false} />
                ) : (
                  <>
                    {displayedItem.panel && (
                      <ul className="mega-panel-links">
                        {displayedItem.panel.map((sub) => (
                          <li key={sub.label}>
                            <a href={sub.href} onClick={() => setOpenKey(null)}>
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {displayedItem.image && (
                      <div className="mega-panel-visual">
                        <Image
                          src={displayedItem.image.src}
                          alt={displayedItem.image.alt}
                          fill
                          sizes="(max-width: 1000px) 100vw, 33vw"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="header-center" aria-hidden="true">PRECISIÓN AÉREA / DATOS REALES</div>

        <a className="nav-cta" href="#contacto" onClick={() => setOpenKey(null)}>
          Contáctanos
        </a>

        <button
          ref={toggleRef}
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-disabled={drawerOpen}
          onClick={() => {
            if (drawerOpen) return
            setMenuOpen((open) => !open)
          }}
        >
          <span>{menuOpen ? "Cerrar" : "Menú"}</span><i /><i />
        </button>
      </header>

      <div
        className="mega-panel-backdrop"
        data-open={openKey !== null || undefined}
        aria-hidden="true"
        onClick={() => {
          clearTimeout(closeTimerRef.current)
          setOpenKey(null)
        }}
      />

      <div className={`menu-overlay ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="menu-index">NAVEGACIÓN / 2026</div>
        <nav aria-label="Navegación principal">
          <a ref={firstLinkRef} href="#nosotros" onClick={navigate}><span>01</span>Nosotros</a>
          <a href="#capacidades" onClick={navigate}><span>02</span>Capacidades</a>
          <a href="#tecnologia" onClick={navigate}><span>03</span>Tecnología</a>
          <a href="#proyectos" onClick={navigate}><span>04</span>Proyectos</a>
          <a href="#proceso" onClick={navigate}><span>05</span>Proceso</a>
          <a href="#contacto" onClick={navigate}><span>06</span>Contacto</a>
        </nav>
        <div className="menu-meta">
          <a href="mailto:skytsperu@gmail.com">skytsperu@gmail.com</a>
          <span>Lima · Perú</span>
        </div>
      </div>
    </>
  )
}
