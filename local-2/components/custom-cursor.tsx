"use client"

import { useEffect, useRef } from "react"

// Enter/leave pointer events don't bubble, so delegating from document
// requires the bubbling over/out pair instead — but those also fire on
// child-element boundary crossings inside a [data-cursor] target, hence the
// closest()-based same-target guard below to avoid cursor-active flicker.
function closestCursorTarget(node: EventTarget | null): HTMLElement | null {
  return node instanceof Element ? node.closest<HTMLElement>("[data-cursor]") : null
}

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

    const onPointerOver = (event: PointerEvent) => {
      const target = closestCursorTarget(event.target)
      if (!target) return
      if (closestCursorTarget(event.relatedTarget) === target) return
      if (cursorLabel) cursorLabel.textContent = target.dataset.cursor ?? "Abrir"
      cursor?.classList.add("cursor-active")
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = closestCursorTarget(event.target)
      if (!target) return
      if (closestCursorTarget(event.relatedTarget) === target) return
      cursor?.classList.remove("cursor-active")
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerover", onPointerOver)
    document.addEventListener("pointerout", onPointerOut)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerover", onPointerOver)
      document.removeEventListener("pointerout", onPointerOut)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span>Explorar</span></div>
}
