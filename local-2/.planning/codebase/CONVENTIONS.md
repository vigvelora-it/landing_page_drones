# Coding Conventions

**Analysis Date:** 2026-07-18

## Naming Patterns

**Files:**
- Component files: PascalCase (`components/experience.tsx`, `components/v4-interactions.tsx`)
- Utility/lib files: kebab-case (`lib/contact-schema.ts`, `lib/supabase-admin.ts`)
- API routes: kebab-case (`app/api/contact/route.ts`)
- Metadata files: camelCase (`app/robots.ts`, `app/sitemap.ts`)

**Functions:**
- camelCase for all functions and handlers (`toggleVideo`, `submitForm`, `updateScroll`, `closeMobileMenu`)
- Private handler functions: camelCase prefix (`enterCursor`, `leaveCursor`, `showPrevious`, `showNext`)
- Component functions: PascalCase (`Experience`, `FormConnector`, `V4Interactions`)

**Variables:**
- camelCase for all variables (`menuOpen`, `introDone`, `videoPlaying`, `revealObserver`)
- State variables: camelCase with descriptive names (`isVisible`, `isIntersecting`, `isOpen`)
- CSS custom properties: kebab-case with double dashes (`--ink`, `--orange`, `--scroll-y`, `--parallax`)

**Types:**
- Type interfaces/types: PascalCase (`ContactInput`, `ContactForm`)
- Exported schema types: PascalCase with `z.infer` pattern (`ContactInput = z.infer<typeof contactSchema>`)

**Constants:**
- camelCase for object constants (`services`, `process`)
- Array of objects with consistent structure for data (`services.map((service) => ...)`)
- Numeric strings for identifiers (`"01"`, `"02"`, etc. for section numbers)

## Code Style

**Formatting:**
- No Prettier configuration found — manual formatting follows consistent style
- 2-space indentation (inferred from code)
- No semicolons at end of statements (semicolon-less style)
- Line length appears to target ~100-120 characters
- Imports organized in blocks with blank lines between groups

**Linting:**
- ESLint configuration: `eslint.config.mjs`
- Presets:
  - `eslint-config-next/core-web-vitals` (Core Web Vitals rules)
  - `eslint-config-next/typescript` (TypeScript-specific rules)
- Global ignores: `.next/**`, `node_modules/**`, `next-env.d.ts`
- Run command: `npm run lint` → `eslint .`

**TypeScript:**
- Strict mode enabled (`"strict": true`)
- No implicit `any` (`"noImplicitAny"` implicitly true via strict mode)
- Module resolution: `bundler`
- Target: ES2017
- JSX: `react-jsx` (automatic JSX transform)
- Path aliases: `@/*` maps to project root

## Import Organization

**Order:**
1. Framework imports (React, Next.js)
2. Next.js-specific imports (`next/image`, `next/font/google`, `next/server`)
3. Type imports (`type { ... } from "next"`)
4. Project lib/component imports (from `@/lib`, `@/components`)
5. Inline types when needed (type definitions in same file)

**Examples:**
```typescript
// API route pattern
import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/contact-schema"
import { createSupabaseAdmin } from "@/lib/supabase-admin"

// Component pattern
import Image from "next/image"
import { Experience } from "@/components/experience"
import { FormEvent, useEffect, useState } from "react"

// Type imports
import type { Metadata } from "next"
import type { MetadataRoute } from "next"
```

**Path Aliases:**
- Use `@/*` for all local imports (required pattern, do not use relative paths)
- Example: `@/lib/contact-schema`, `@/components/experience`

## Error Handling

**API Routes:**
- Pattern: `try` → `JSON.parse/safeParse` → `try` → `db operation` → `catch`
- Error responses use `NextResponse.json()` with message object
- Status codes: 400 (bad request), 201 (created), 500 (server error), 503 (service unavailable)
- User-facing error messages: Spanish language, human-readable ("Ingresa tu nombre." "No pudimos enviar tu solicitud.")
- Server logs: use `console.error()` with context ("No se pudo registrar la solicitud:", error code, message)
- Example (`app/api/contact/route.ts`):
  ```typescript
  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Revisa los datos ingresados." },
      { status: 400 },
    )
  }
  ```

**Client-Side:**
- Pattern: `try` → `fetch` → `await response.json()` → `check !response.ok` → `throw Error` → `catch`
- Fallback messages when error type unknown: check `error instanceof Error` before accessing `.message`
- Example (`components/experience.tsx`):
  ```typescript
  try {
    const response = await fetch("/api/contact", { method: "POST", ... })
    const result = (await response.json()) as { message?: string }
    if (!response.ok) throw new Error(result.message ?? "No pudimos enviar tu solicitud.")
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Ocurrió un error. Inténtalo nuevamente."
  }
  ```

**Validation:**
- Use Zod schemas (located in `lib/`) for data validation
- Pattern: `z.object()` with `.trim()`, `.min()`, `.max()`, custom error messages
- Export inferred type: `export type ContactInput = z.infer<typeof contactSchema>`
- Use `safeParse()` to avoid throwing (check `.success` and access `.data` or `.error`)

## Logging

**Framework:** `console` (no structured logging library)

**Patterns:**
- Server-only logging in API routes using `console.error()`
- Include context with error logs: error code, database message, action taken
- Example: `console.error("No se pudo registrar la solicitud:", error.code, error.message)`
- No logging of sensitive data (passwords, auth tokens)

**When to log:**
- Database errors (code + message)
- Configuration errors (missing env vars)
- Unexpected catches (error object)
- Do NOT log successful operations (too verbose)

## Comments

**When to Comment:**
- Complex animation logic (scroll parallax, reveal timing)
- Non-obvious DOM selectors or data attributes
- Accessibility considerations (aria-labels, roles)
- Do NOT comment obvious code (`const x = 5 // set x to 5`)

**JSDoc/TSDoc:**
- Used sparingly
- Type annotations preferred over JSDoc comments
- Example: Function signatures with typed parameters are self-documenting

**Accessibility Comments:**
- Mark decorative elements with `aria-hidden="true"`
- Mark custom cursors and animations with `aria-hidden` to hide from screen readers

## Function Design

**Size:** 
- Small focused functions (20-50 lines typical)
- Event handlers stay concise by delegating to helper functions
- Example: `submitForm` (35 lines) delegates validation to Zod schema

**Parameters:**
- Destructure object parameters when multiple args
- Example: `{ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> }`
- Use optional chaining for nullable DOM queries: `cursor?.classList.add(...)`

**Return Values:**
- Async functions return `Promise<void>` (callbacks, form submissions)
- API handlers return `NextResponse` (never throw)
- Components return JSX fragments or null

**Cleanup Pattern:**
- useEffect cleanup functions return a function that removes listeners, clears timeouts
- Example:
  ```typescript
  return () => {
    window.clearTimeout(timer)
    window.removeEventListener("scroll", handler)
    observer.disconnect()
  }
  ```

## Module Design

**Exports:**
- Named exports for components (`export function Experience() { ... }`)
- Default export for page components (`export default function Home() { ... }`)
- Utilities exported as named exports (`export const contactSchema = ...`)
- Types exported with `export type` keyword

**"use client" Directive:**
- Required for all components that use hooks (useState, useEffect)
- Placed at the top of file before imports
- Example: `"use client"` in `components/experience.tsx`

**Server-Only Imports:**
- Utilities that access secrets use `import "server-only"` at top
- Example: `lib/supabase-admin.ts` starts with `import "server-only"`
- Prevents accidental import into client components

**Barrel Files:**
- No barrel files (index.ts) used in this project
- Import directly from component/util files

## CSS Conventions

**Custom Properties (CSS Variables):**
- Color system: `--ink`, `--soft`, `--paper`, `--orange`, `--hot`
- Fonts: `--display` (Space Grotesk), `--body` (Inter)
- Layout: `--shell` (max-width container)
- Dynamic: `--scroll-y`, `--parallax` (set via JS)
- Example: `background: var(--orange)` (uses CSS variable)

**Class Naming:**
- BEM-inspired naming: `.block__element--modifier`
- Example: `.menu-overlay.is-open`, `.service-row:hover`
- State classes: `.is-open`, `.is-visible`, `.is-pending`, `.is-success`, `.is-error`
- Semantic parent classes: `.site-header`, `.hero-copy`, `.contact-grid`

**Responsive Design:**
- Mobile-first: start with single-column, add grid/flex at breakpoints
- Breakpoints: 1000px (medium), 720px (small)
- Example: `@media(max-width:1000px) { ... }`
- Use CSS containment and will-change for performance

**Animation Conventions:**
- Keyframe animations: `@keyframes animationName { from { ... } to { ... } }`
- Transitions: 3-4 properties max per element
- Cubic easing: `cubic-bezier(.16,1,.3,1)` (ease-out-back)
- Durations: 0.35s–1.2s typical
- Parallax via CSS custom property: `transform: translateY(var(--parallax, 0))`
- Reveal animations: `opacity 0 → 1`, `translateY(44px) → 0`

## IntersectionObserver + requestAnimationFrame Patterns

**IntersectionObserver (Reveal Animation):**
```typescript
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
document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => revealObserver.observe(el))
```
- Use `[data-reveal]` attribute to mark elements
- CSS class `.is-visible` triggers transition
- Unobserve after intersection (one-time animation)

**requestAnimationFrame (Scroll/Parallax):**
```typescript
let frame = 0
const updateScroll = () => {
  frame = 0
  root.style.setProperty("--scroll-y", `${window.scrollY}px`)
  if (reducedMotion) return
  parallaxItems.forEach((item) => {
    // ... calculate parallax offset
    item.style.setProperty("--parallax", `${offset}px`)
  })
}
const onScroll = () => {
  if (!frame) frame = window.requestAnimationFrame(updateScroll)
}
window.addEventListener("scroll", onScroll, { passive: true })
```
- Use frame ID to debounce rAF calls
- Respect `prefers-reduced-motion` media query
- Passive event listeners for scroll performance

**Accessibility in Animations:**
```typescript
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
if (reducedMotion) {
  heroVideo?.pause()
  // skip animations
}
```
- Always check `prefers-reduced-motion` before heavy animations
- Provide fallback behavior (pause video, skip parallax)

---

*Convention analysis: 2026-07-18*
