import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type V4Template = {
  css: string;
  body: string;
};

export function getV4Template(): V4Template {
  const source = readFileSync(join(process.cwd(), "landing-page-v4.html"), "utf8");
  const rawCss = source.match(/<style>([\s\S]*?)<\/style>/i)?.[1];
  const body = source.match(/<body>([\s\S]*?)<script>/i)?.[1];

  if (!rawCss || !body) {
    throw new Error("No se pudo leer la plantilla aprobada landing-page-v4.html");
  }

  const css = rawCss
    .replaceAll("'Inter',sans-serif", "var(--font-inter),sans-serif")
    .replaceAll("'Space Grotesk',sans-serif", "var(--font-space-grotesk),sans-serif")
    // Paleta corporativa tomada del BROCHURE SKYTECH.pdf.
    .replaceAll("#101010", "#2B3141")
    .replaceAll("#1B1B1B", "#353C4F")
    .replaceAll("#F4F4F1", "#F6F2F0")
    .replaceAll("#CBFF3D", "#D26B4C")
    .replaceAll("#B8ED1F", "#BC573D")
    .replaceAll("#5C5C5C", "#5F6675")
    .replaceAll("#9A9A9A", "#969BA7")
    .replaceAll("rgba(203,255,61", "rgba(210,107,76")
    .replaceAll("rgba(16,16,16", "rgba(43,49,65");

  return { css, body };
}
