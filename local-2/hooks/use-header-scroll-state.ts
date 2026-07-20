"use client"

import { ScrollTrigger, useGSAP } from "@/lib/gsap"

const HEADER_SCROLL_THRESHOLD = 80

export function useHeaderScrollState() {
  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: `top -${HEADER_SCROLL_THRESHOLD}px`,
      end: "max",
      toggleClass: { targets: ".site-header", className: "is-scrolled" },
    })

    return () => trigger.kill()
  }, [])
}
