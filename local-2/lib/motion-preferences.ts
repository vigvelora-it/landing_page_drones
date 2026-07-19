export const LENIS_LERP = {
  normal: 0.1,
  reduced: 0.15,
} as const

export function getLenisLerp() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? LENIS_LERP.reduced
    : LENIS_LERP.normal
}
