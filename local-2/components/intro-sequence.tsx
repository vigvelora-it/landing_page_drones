"use client"

import { useEffect, useState } from "react"

export function IntroSequence() {
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const introTimer = window.setTimeout(() => setIntroDone(true), reducedMotion ? 100 : 1450)

    return () => window.clearTimeout(introTimer)
  }, [])

  return (
    <div className={`intro ${introDone ? "intro-done" : ""}`} aria-hidden="true">
      <div className="intro-brand"><span>✳</span><strong>SKY TECH</strong></div>
      <div className="intro-line"><i /></div>
      <span className="intro-coordinate">PERÚ / 14°04&apos;S</span>
    </div>
  )
}
