"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState, useSyncExternalStore } from "react"

import { equipment } from "@/lib/site-content"
import { prefersReducedMotion } from "@/lib/motion-preferences"

const AUTO_ADVANCE_MS = 6500
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY)
  media.addEventListener("change", onStoreChange)
  return () => media.removeEventListener("change", onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getReducedMotionServerSnapshot() {
  return true
}

export function EquipmentCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [autoplayCycle, setAutoplayCycle] = useState(0)
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )

  const restartAutoplay = useCallback(() => {
    setAutoplayCycle((cycle) => cycle + 1)
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    // from Embla (an external, already-initialized library instance), matching Embla's
    // own documented React integration pattern; not a React state/prop-derived value.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync external Embla state
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || equipment.length < 2 || !isAutoPlaying || reducedMotion) {
      return
    }

    const timeout = window.setTimeout(() => {
      emblaApi.scrollNext(false)
    }, AUTO_ADVANCE_MS)

    return () => window.clearTimeout(timeout)
  }, [autoplayCycle, emblaApi, isAutoPlaying, reducedMotion, selectedIndex])

  // Only click/dot-triggered transitions are gated by reduced-motion (jump = instant).
  // Drag-gesture physics are left at Embla's default regardless (user-initiated, not decorative).
  const scrollPrev = useCallback(() => {
    restartAutoplay()
    emblaApi?.scrollPrev(prefersReducedMotion())
  }, [emblaApi, restartAutoplay])
  const scrollNext = useCallback(() => {
    restartAutoplay()
    emblaApi?.scrollNext(prefersReducedMotion())
  }, [emblaApi, restartAutoplay])
  const scrollToIndex = useCallback(
    (index: number) => {
      restartAutoplay()
      emblaApi?.scrollTo(index, prefersReducedMotion())
    },
    [emblaApi, restartAutoplay],
  )

  const toggleAutoplay = () => {
    setIsAutoPlaying((playing) => !playing)
    restartAutoplay()
  }

  const onViewportKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    }
    if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }

  return (
    <div className="equipment-showcase" data-reveal>
      <div className="site-shell">
        <div className="equipment-showcase__heading">
          <div>
            <span className="mono-label">Equipo en campo</span>
            <h3>Instrumentos para capturar el territorio.</h3>
            <p>Equipos reales de captura aérea y fotogramétrica del portafolio técnico de SkyTech.</p>
          </div>
          <p className="equipment-count" aria-hidden="true">
            <strong>{String(selectedIndex + 1).padStart(2, "0")}</strong>
            <span>/ {String(equipment.length).padStart(2, "0")}</span>
          </p>
        </div>
      </div>
      <div
        className="embla"
        aria-roledescription="carousel"
        aria-label="Equipo técnico"
        onPointerDown={restartAutoplay}
      >
        <div
          className="embla__viewport"
          ref={emblaRef}
          tabIndex={0}
          onKeyDown={onViewportKeyDown}
        >
          <div className="embla__container" data-lenis-prevent>
            {equipment.map((item, index) => (
              <div
                key={item.id}
                className="embla__slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${equipment.length}`}
              >
                <div className="media-frame embla__frame">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1000px) calc(100vw - 40px), min(1440px, calc(100vw - 64px))"
                  />
                </div>
                <p className="tech-caption">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          className="circle-link embla__prev"
          type="button"
          aria-label="Equipo anterior"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
        >
          ←
        </button>
        <button
          className="circle-link embla__next"
          type="button"
          aria-label="Equipo siguiente"
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          →
        </button>
        <div className="embla__dots" role="tablist" aria-label="Seleccionar equipo">
          {equipment.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-label={`Ir al equipo ${index + 1}`}
              aria-selected={index === selectedIndex}
              className={index === selectedIndex ? "is-active" : ""}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
        <div className="embla__progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${(selectedIndex + 1) / equipment.length})` }} />
        </div>
        <button
          className="embla__autoplay"
          type="button"
          onClick={toggleAutoplay}
          disabled={reducedMotion}
          aria-label={isAutoPlaying ? "Pausar cambio automático" : "Reanudar cambio automático"}
        >
          {reducedMotion ? "Auto desactivado" : isAutoPlaying ? "Pausar" : "Reproducir"}
        </button>
        <p className="sr-only" aria-live="polite">
          Equipo {selectedIndex + 1} de {equipment.length}
        </p>
      </div>
    </div>
  )
}
