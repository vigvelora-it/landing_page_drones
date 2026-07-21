"use client"

import { useEffect, useRef, useState } from "react"

import { useHeaderScrollState } from "@/hooks/use-header-scroll-state"
import { useOverlayCoordination } from "@/hooks/use-overlay-coordination"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { equipment, projects, services } from "@/lib/site-content"

interface NavPanelItem {
  label: string
  href: string
}

interface NavItem {
  key: string
  label: string
  href: string
  panel?: NavPanelItem[]
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
  },
  {
    key: "capacidades",
    label: "Capacidades",
    href: "#capacidades",
    panel: services.map((service) => ({ label: service.title, href: "#capacidades" })),
  },
  {
    key: "tecnologia",
    label: "Tecnología",
    href: "#tecnologia",
    panel: equipment.map((item) => ({ label: item.caption, href: "#tecnologia" })),
  },
  {
    key: "proyectos",
    label: "Proyectos",
    href: "#proyectos",
    panel: projects.map((project) => ({ label: project.name, href: "#proyectos" })),
  },
  { key: "proceso", label: "Proceso", href: "#proceso", panel: undefined },
  { key: "contacto", label: "Contacto", href: "#contacto", panel: undefined },
]

export function MenuOverlay() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const drawerOpen = useOverlayCoordination("menu", menuOpen)

  const [openKey, setOpenKey] = useState<string | null>(null)
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

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Sky Tech Perú — inicio" onClick={navigate}>
          <span className="brand-symbol">✳</span><span>SKY TECH</span><small>PERÚ</small>
        </a>

        <nav className="site-nav" aria-label="Navegación principal">
          <ul>
            {navItems.map((item) =>
              item.panel ? (
                <li
                  key={item.key}
                  className="nav-item"
                  data-open={openKey === item.key || undefined}
                  onMouseEnter={() => openPanel(item.key)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => openPanel(item.key)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                      scheduleClose()
                    }
                  }}
                >
                  <a
                    ref={(el) => {
                      triggerRefs.current[item.key] = el
                    }}
                    href={item.href}
                    aria-haspopup="true"
                    aria-expanded={openKey === item.key}
                    aria-controls={`mega-${item.key}`}
                    onClick={() => setOpenKey(null)}
                  >
                    {item.label}
                  </a>
                  <div className="mega-panel" id={`mega-${item.key}`}>
                    <ul>
                      {item.panel.map((sub) => (
                        <li key={sub.label}>
                          <a href={sub.href} onClick={() => setOpenKey(null)}>
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.key} className="nav-item">
                  <a href={item.href}>{item.label}</a>
                </li>
              ),
            )}
          </ul>
        </nav>

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
