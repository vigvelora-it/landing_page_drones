import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://skytechperu.com"),
  title: "Sky Tech Perú — Topografía · Fotogrametría · LiDAR",
  description:
    "Levantamientos geodésicos, nubes de puntos LiDAR y fotogrametría aérea con precisión centimétrica para minería, construcción y planificación territorial en Perú.",
  openGraph: {
    title: "Sky Tech Perú — Precisión aérea para tus proyectos",
    description:
      "Topografía, fotogrametría y LiDAR con tecnología de drones en Perú.",
    locale: "es_PE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
