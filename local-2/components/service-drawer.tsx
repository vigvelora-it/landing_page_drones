"use client"

import { useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"

import { useScrollLock } from "@/hooks/use-scroll-lock"
import type { Service } from "@/lib/site-content"

// Must stay in sync with --motion-duration-base in globals.css.
const CLOSE_ANIMATION_MS = 450

interface ServiceDrawerProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function ServiceDrawer({ service, isOpen, onClose }: ServiceDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [isClosing, setIsClosing] = useState(false)
  const lenis = useLenis()

  useScrollLock(isOpen)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
  }, [isOpen])

  useEffect(() => () => clearTimeout(closeTimeoutRef.current), [])

  function requestClose() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      dialogRef.current?.close()
      return
    }
    setIsClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      dialogRef.current?.close()
    }, CLOSE_ANIMATION_MS)
  }

  function handleCtaClick() {
    requestClose()
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.setTimeout(() => lenis?.scrollTo("#contacto"), reduced ? 0 : CLOSE_ANIMATION_MS)
  }

  return (
    <dialog
      ref={dialogRef}
      className={`service-drawer ${isClosing ? "is-closing" : ""}`}
      aria-labelledby="service-drawer-title"
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClose={() => {
        setIsClosing(false)
        onClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose()
      }}
    >
      {service && (
        <div className="service-drawer-panel">
          <header className="service-drawer-header">
            <span className="mono-label">{service.number}</span>
            <h2 id="service-drawer-title">{service.title}</h2>
            <p>{service.tagline}</p>
            <button type="button" autoFocus className="service-drawer-close" onClick={requestClose}>
              <span>Cerrar</span>
            </button>
          </header>

          <div className="service-drawer-body" data-lenis-prevent>
            {service.groups.map((group, index) => (
              <div className="service-drawer-group" key={group.heading ?? index}>
                {group.heading && <p className="service-drawer-group-heading">{group.heading}</p>}
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {service.note && <p className="service-drawer-note">{service.note}</p>}
          </div>

          <footer className="service-drawer-footer">
            <button type="button" className="service-drawer-cta" onClick={handleCtaClick}>
              Cotizar este servicio
            </button>
          </footer>
        </div>
      )}
    </dialog>
  )
}
