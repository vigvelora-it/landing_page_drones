"use client"

import { useEffect } from "react"

export function useLegacyParallax() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const root = document.documentElement
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"))
    let frame = 0

    const updateScroll = () => {
      frame = 0
      root.style.setProperty("--scroll-y", `${window.scrollY}px`)
      if (reducedMotion) return
      parallaxItems.forEach((item) => {
        const rect = item.parentElement?.getBoundingClientRect()
        if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return
        const speed = Number(item.dataset.parallax ?? 0.1)
        item.style.setProperty("--parallax", `${rect.top * speed}px`)
      })
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScroll)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
}
