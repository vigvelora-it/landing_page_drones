"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Arrow } from "@/components/arrow"
import { useGSAP } from "@/lib/gsap"

export function HeroSection() {
  const root = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause()
      const reducedMotionTimer = window.setTimeout(() => setVideoPlaying(false), 0)
      return () => window.clearTimeout(reducedMotionTimer)
    }
  }, [])

  useGSAP(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    root.current?.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => revealObserver.observe(element))
    return () => revealObserver.disconnect()
  }, { scope: root })

  const toggleVideo = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
        setVideoPlaying(true)
      } catch {
        setVideoPlaying(false)
      }
    } else {
      video.pause()
      setVideoPlaying(false)
    }
  }

  return (
    <>
      <section ref={root} className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />

        <div className="hero-media parallax-media" data-parallax="0.16">
          <Image
            src="/IMAGENES_PAGINA_WEB/topografia-con-drones.jpg"
            alt="Drone realizando un levantamiento topográfico sobre un modelo de terreno"
            fill
            priority
            sizes="100vw"
          />
          <video
            ref={videoRef}
            className="hero-video"
            id="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/IMAGENES_PAGINA_WEB/topografia-con-drones.jpg"
            aria-hidden="true"
          >
            <source src="/video/hero-drone-in-flight.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-gridlines" aria-hidden="true" />

        <div className="hero-copy site-shell">
          <p className="eyebrow hero-eyebrow" data-reveal>
            <span className="pulse-dot" /> Geomática avanzada · Perú
          </p>
          <h1 id="hero-title" className="hero-title" aria-label="El territorio habla. Nosotros lo convertimos en decisiones.">
            <span className="title-line" data-reveal><span>El territorio</span></span>
            <span className="title-line title-line-offset" data-reveal><span>habla.</span></span>
            <span className="title-line title-line-small" data-reveal><span>Nosotros lo convertimos</span></span>
            <span className="title-line title-line-accent" data-reveal><span>en decisiones.</span></span>
          </h1>

          <div className="hero-bottom" data-reveal>
            <p>
              Capturamos la realidad desde el aire y la transformamos en información precisa para minería,
              construcción y territorio.
            </p>
            <a className="circle-link magnetic" href="#capacidades" data-cursor="Explorar">
              <span>Explorar</span><Arrow />
            </a>
          </div>
        </div>

        <div className="hero-index" aria-hidden="true">14°04&apos;S<br />75°44&apos;W</div>
        <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </section>

      <button
        className="video-toggle"
        type="button"
        onClick={toggleVideo}
        aria-label={videoPlaying ? "Pausar video de fondo" : "Reproducir video de fondo"}
      >
        <i className={videoPlaying ? "pause-icon" : "play-icon"} aria-hidden="true" />
        <span>{videoPlaying ? "Pausar" : "Reproducir"}</span>
      </button>
    </>
  )
}
