"use client"

import { useState } from "react"

import { useHeaderScrollState } from "@/hooks/use-header-scroll-state"
import { useOverlayCoordination } from "@/hooks/use-overlay-coordination"
import { useScrollLock } from "@/hooks/use-scroll-lock"

export function MenuOverlay() {
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerOpen = useOverlayCoordination("menu", menuOpen)

  useScrollLock(menuOpen)
  useHeaderScrollState()

  const navigate = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Sky Tech Perú — inicio" onClick={navigate}>
          <span className="brand-symbol">✳</span><span>SKY TECH</span><small>PERÚ</small>
        </a>
        <div className="header-center" aria-hidden="true">PRECISIÓN AÉREA / DATOS REALES</div>
        <button
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
          <a href="#nosotros" onClick={navigate}><span>01</span>Nosotros</a>
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
