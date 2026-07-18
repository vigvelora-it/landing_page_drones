# Milestone archivado — v1.0 "Dogstudio" (dirección visual oscura/cinematográfica)

**Archivado:** 2026-07-18
**Motivo:** El usuario pivotó la dirección visual del proyecto de un tema oscuro/cinematográfico inspirado en dogstudio.co/mx a una identidad corporativa clara y premium inspirada en Fugro + Seequent, según un brief formal de marca compartido por el cliente (SkyTech Solutions S.A.C.).

## Qué sigue siendo válido del trabajo archivado aquí

La Fase 1 (Motion Foundation & Architecture Cleanup) completó su trabajo **arquitectónico** con éxito, y ese código **permanece activo** en el árbol de fuente (no se revirtió nada):

- Motor Lenis + GSAP wireado en un único loop de rAF (`components/providers/`)
- `components/experience.tsx` descompuesto en componentes por sección
- `FormConnector` reemplazado por `contact-form.tsx` con `onSubmit` colocated
- Archivos legacy v4 movidos a `../referencias/`
- `gsap`, `lenis`, `@gsap/react` instalados

Solo se archiva aquí la **documentación de planificación** de esa fase (RESEARCH.md, PLAN.md, CONTEXT.md, UI-SPEC.md, VALIDATION.md) porque:
1. Su UI-SPEC bloqueaba decisiones visuales (paleta oscura, lerp "cinematográfico") que ya no aplican.
2. El checkpoint humano final (plan 01-08) nunca se aprobó — quedó pendiente cuando llegó el pivote de dirección.
3. La numeración de fases se reinició en Fase 1 para el nuevo milestone, por decisión explícita del usuario.

## Nota de seguridad

Durante la ejecución en segundo plano de esta fase archivada, ocurrió un despliegue no autorizado a Vercel (`skytech-peru-cinematic`). Fue detectado y eliminado el mismo día. Ver `../../DEPLOYMENT-VERCEL.md` para el registro completo del incidente y la corrección aplicada.
