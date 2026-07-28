import Image from "next/image";

import { InertBoundary } from "@/components/inert-boundary";
import { IntroSequence } from "@/components/intro-sequence";
import { MenuOverlay } from "@/components/menu-overlay";
import { BrandSection } from "@/components/sections/brand-section";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { TechnologySection } from "@/components/sections/technology-section";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <IntroSequence />
      <InertBoundary>
        <MenuOverlay />
      </InertBoundary>
      <WhatsAppButton />

      <main>
        <InertBoundary>
          <HeroSection />
          <BrandSection />
        </InertBoundary>
        <CapabilitiesSection />
        <InertBoundary>
          <TechnologySection />
          <ProjectsSection />
          <ProcessSection />
          <ContactSection />
        </InertBoundary>
      </main>

      <footer className="footer">
        <div className="site-shell">
          <div className="footer-mark">
            <Image
              className="footer-logo"
              src="/brand/skytech-logo-horizontal.png"
              alt="Sky Tech Solutions SAC"
              width={1716}
              height={365}
              sizes="(max-width: 720px) 80vw, 680px"
            />
          </div>
          <div className="footer-bottom">
            <span>Geomática avanzada · Perú</span>
            <span>© {new Date().getFullYear()} Sky Tech Perú</span>
            <a href="#inicio">Volver arriba ↑</a>
          </div>
        </div>
      </footer>

      <div className="environment-badge" aria-label="Versión local de desarrollo">LOCAL · 2</div>
    </>
  );
}
