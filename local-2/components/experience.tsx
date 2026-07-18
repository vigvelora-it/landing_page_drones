"use client";

import { useEffect, useState } from "react";

export function Experience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introTimer = window.setTimeout(() => setIntroDone(true), reducedMotion ? 100 : 1450);
    const heroVideo = document.querySelector<HTMLVideoElement>("#hero-video");
    let reducedMotionTimer = 0;
    if (reducedMotion) {
      heroVideo?.pause();
      reducedMotionTimer = window.setTimeout(() => setVideoPlaying(false), 0);
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => revealObserver.observe(element));

    const root = document.documentElement;
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;
    const updateScroll = () => {
      frame = 0;
      root.style.setProperty("--scroll-y", `${window.scrollY}px`);
      if (reducedMotion) return;
      parallaxItems.forEach((item) => {
        const rect = item.parentElement?.getBoundingClientRect();
        if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
        const speed = Number(item.dataset.parallax ?? 0.1);
        item.style.setProperty("--parallax", `${rect.top * speed}px`);
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    const cursor = document.querySelector<HTMLElement>(".custom-cursor");
    const cursorLabel = cursor?.querySelector<HTMLElement>("span");
    const supportsPointer = window.matchMedia("(pointer: fine)").matches;
    const onPointerMove = (event: PointerEvent) => {
      if (!cursor || !supportsPointer) return;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("cursor-ready");
    };
    const cursorTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"));
    const enterCursor = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      if (cursorLabel) cursorLabel.textContent = target.dataset.cursor ?? "Abrir";
      cursor?.classList.add("cursor-active");
    };
    const leaveCursor = () => cursor?.classList.remove("cursor-active");
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    cursorTargets.forEach((target) => {
      target.addEventListener("pointerenter", enterCursor);
      target.addEventListener("pointerleave", leaveCursor);
    });

    return () => {
      window.clearTimeout(introTimer);
      window.clearTimeout(reducedMotionTimer);
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
      cursorTargets.forEach((target) => {
        target.removeEventListener("pointerenter", enterCursor);
        target.removeEventListener("pointerleave", leaveCursor);
      });
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const navigate = () => setMenuOpen(false);

  const toggleVideo = async () => {
    const video = document.querySelector<HTMLVideoElement>("#hero-video");
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setVideoPlaying(true);
      } catch {
        setVideoPlaying(false);
      }
    } else {
      video.pause();
      setVideoPlaying(false);
    }
  };

  return (
    <>
      <div className={`intro ${introDone ? "intro-done" : ""}`} aria-hidden="true">
        <div className="intro-brand"><span>✳</span><strong>SKY TECH</strong></div>
        <div className="intro-line"><i /></div>
        <span className="intro-coordinate">PERÚ / 14°04&apos;S</span>
      </div>

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
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Cerrar" : "Menú"}</span><i /><i />
        </button>
      </header>

      <div className={`menu-overlay ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="menu-index">NAVEGACIÓN / 2026</div>
        <nav aria-label="Navegación principal">
          <a href="#nosotros" onClick={navigate}><span>01</span>Perspectiva</a>
          <a href="#capacidades" onClick={navigate}><span>02</span>Capacidades</a>
          <a href="#tecnologia" onClick={navigate}><span>03</span>Tecnología</a>
          <a href="#proceso" onClick={navigate}><span>04</span>Proceso</a>
          <a href="#contacto" onClick={navigate}><span>05</span>Contacto</a>
        </nav>
        <div className="menu-meta">
          <a href="mailto:skytsperu@gmail.com">skytsperu@gmail.com</a>
          <span>Lima · Perú</span>
        </div>
      </div>

      <div className="custom-cursor" aria-hidden="true"><span>Explorar</span></div>

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
  );
}
