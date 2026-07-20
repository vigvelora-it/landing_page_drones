import { CustomCursor } from "@/components/custom-cursor";
import { InertBoundary } from "@/components/inert-boundary";
import { IntroSequence } from "@/components/intro-sequence";
import { MenuOverlay } from "@/components/menu-overlay";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { ProcessSection } from "@/components/sections/process-section";
import { TechnologySection } from "@/components/sections/technology-section";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <IntroSequence />
      <InertBoundary>
        <MenuOverlay />
      </InertBoundary>
      <CustomCursor />

      <main>
        <InertBoundary>
          <HeroSection />
          <ManifestoSection />
        </InertBoundary>
        <CapabilitiesSection />
        <InertBoundary>
          <TechnologySection />
          <ProcessSection />
          <ContactSection />
        </InertBoundary>
      </main>

      <footer className="footer">
        <div className="site-shell">
          <div className="footer-mark"><span className="brand-symbol">✳</span> SKY TECH</div>
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
