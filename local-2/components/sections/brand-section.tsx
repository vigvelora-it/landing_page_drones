"use client";

import Image from "next/image";
import { useRef } from "react";

import { brandStory, corporateValues, sectors, team, teamIntro } from "@/lib/site-content";
import { useGSAP } from "@/lib/gsap";

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 1).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function BrandSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
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

      root.current
        ?.querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((element) => revealObserver.observe(element));

      return () => revealObserver.disconnect();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="brand-section section-pad" id="nosotros">
      <div className="site-shell">
        <div className="section-kicker" data-reveal>
          <span>01</span>
          <span>Nosotros</span>
        </div>

        <header className="brand-heading" data-reveal>
          <h2>Nosotros</h2>
        </header>

        <div className="brand-story-grid">
          <article className="brand-copy brand-copy--history" id="historia" data-reveal>
            <p className="mono-label">Historia breve</p>
            <h3>Historia breve</h3>
            <p>{brandStory.history}</p>
          </article>

          <article className="brand-copy brand-copy--about" data-reveal>
            <p className="mono-label">Quiénes somos</p>
            <h3>¿Quiénes somos?</h3>
            <p>{brandStory.about}</p>
          </article>
        </div>

        <div className="purpose-grid">
          <article className="purpose-card" data-reveal>
            <p className="mono-label">Propósito</p>
            <h3>Misión</h3>
            <p>{brandStory.mission}</p>
          </article>

          <article className="purpose-card" data-reveal>
            <p className="mono-label">Dirección</p>
            <h3>Visión</h3>
            <p>{brandStory.vision}</p>
          </article>
        </div>

        <section className="sectors-region" id="sectores" aria-labelledby="sectors-heading">
          <div className="brand-region-heading" data-reveal>
            <p className="mono-label">Dónde trabajamos</p>
            <h3 id="sectors-heading">Sectores que atendemos</h3>
          </div>

          <div className="sectors-grid">
            {sectors.map((sector) => (
              <article className="sector-card" data-reveal key={sector.id}>
                <div className="sector-card__frame">
                  <Image
                    src={sector.image}
                    alt={sector.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1000px) 50vw, 25vw"
                  />
                </div>
                <p>{sector.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="values-region" id="valores" aria-labelledby="values-heading">
          <div className="brand-region-heading" data-reveal>
            <p className="mono-label">Principios</p>
            <h3 id="values-heading">Valores corporativos</h3>
          </div>

          <div className="values-grid">
            {corporateValues.map((value, index) => (
              <article className="value-card" data-reveal key={value.id}>
                <span className="value-card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4>{value.name}</h4>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="team-region" id="equipo" aria-labelledby="team-heading">
          <div className="brand-region-heading" data-reveal>
            <p className="mono-label">Fundadores</p>
            <h3 id="team-heading">Equipo técnico</h3>
            <p className="team-intro">{teamIntro}</p>
          </div>

          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" data-reveal key={member.id}>
                <div className="team-card__portrait">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`Retrato de ${member.name}`}
                      fill
                      sizes="(max-width: 720px) 100vw, 50vw"
                    />
                  ) : (
                    <span className="team-card__initials" aria-hidden="true">
                      {getInitials(member.name)}
                    </span>
                  )}
                </div>
                <div className="team-card__copy">
                  <h4>{member.name}</h4>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__bio">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
