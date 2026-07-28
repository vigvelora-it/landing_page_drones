"use client"

import { ReactNode, useState } from "react"
import { ReactLenis, useLenis } from "lenis/react"

import { useLegacyParallax } from "@/hooks/use-legacy-parallax"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { getLenisLerp, LENIS_LERP } from "@/lib/motion-preferences"

function LenisGsapBridge() {
  const lenis = useLenis(ScrollTrigger.update)

  useGSAP(
    () => {
      if (!lenis) return

      const update = (time: number) => lenis.raf(time * 1000)

      gsap.ticker.add(update)
      gsap.ticker.lagSmoothing(0)
      ScrollTrigger.refresh()

      return () => gsap.ticker.remove(update)
    },
    { dependencies: [lenis], revertOnUpdate: true },
  )

  return null
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useLegacyParallax()

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add("(prefers-reduced-motion: reduce)", () => {
      setReducedMotion(getLenisLerp() === LENIS_LERP.reduced)
      return () => setReducedMotion(false)
    })

    return () => media.revert()
  }, [])

  const mode = reducedMotion ? "reduced" : "normal"
  const lerp = reducedMotion ? LENIS_LERP.reduced : LENIS_LERP.normal

  return (
    <ReactLenis
      key={mode}
      root
      options={{ autoRaf: false, syncTouch: true, anchors: true, lerp }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  )
}
