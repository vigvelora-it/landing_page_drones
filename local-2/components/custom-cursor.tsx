"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorLabel = cursor?.querySelector<HTMLElement>("span")
    const supportsPointer = window.matchMedia("(pointer: fine)").matches

    const onPointerMove = (event: PointerEvent) => {
      if (!cursor || !supportsPointer) return
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      cursor.classList.add("cursor-ready")
    }

    const cursorTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"))
    const enterCursor = (event: Event) => {
      const target = event.currentTarget as HTMLElement
      if (cursorLabel) cursorLabel.textContent = target.dataset.cursor ?? "Abrir"
      cursor?.classList.add("cursor-active")
    }
    const leaveCursor = () => cursor?.classList.remove("cursor-active")

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    cursorTargets.forEach((target) => {
      target.addEventListener("pointerenter", enterCursor)
      target.addEventListener("pointerleave", leaveCursor)
    })

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      cursorTargets.forEach((target) => {
        target.removeEventListener("pointerenter", enterCursor)
        target.removeEventListener("pointerleave", leaveCursor)
      })
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span>Explorar</span></div>
}
