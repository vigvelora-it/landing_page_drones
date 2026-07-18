<!-- GSD:project-start source:PROJECT.md -->

## Project

**Sky Tech Perú — local-2 (rediseño visual cinematográfico)**

Segundo ambiente local (`local-2/`) de la web de Sky Tech Perú (empresa de topografía con drones), construido en Next.js. Ya tiene una primera versión funcional con dirección oscura/editorial y animaciones básicas en CSS vanilla. Este trabajo eleva esa experiencia a un nivel de pulido visual y de movimiento comparable a estudios creativos premium como Dogstudio (dogstudio.co/mx), sin copiar su diseño literal.

**Core Value:** La experiencia debe sentirse tan fluida, animada y pulida como un sitio de estudio creativo de alto nivel — scroll físico suave, transiciones elaboradas, micro-interacciones cuidadas — mientras conserva la identidad de marca de Sky Tech Perú y el formulario de contacto funcional.

### Constraints

- **Aislamiento**: Trabajar únicamente dentro de `local-2/` — nunca modificar `../local/` ni `../produccion/`.
- **Despliegue**: `npm run deploy` permanece bloqueado; no se despliega a Vercel ni a ningún servicio externo durante este trabajo.
- **Formulario**: Debe conservar la integración con `/api/contact` y Supabase (cuando hay credenciales locales) sin romper el flujo actual.
- **Recursos**: Solo assets locales en `public/IMAGENES_PAGINA_WEB/` y `public/video/` — sin dependencias de imágenes remotas.
- **Dependencias nuevas**: GSAP + Lenis aprobadas explícitamente por el usuario (estándar de la industria para este tipo de experiencia). No se introducen otras librerías pesadas sin aprobación.
- **Git**: El repo está anidado (`.git` vive en `F:\ClaudeCode\Pagina_Web_Mayra`, no en `local-2/`) — los commits de planning se registran contra ese repo externo.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 5.9.3 - All application code (strict mode enabled)

## Runtime

- Node.js (via Next.js server runtime)
- Browser (React client-side)
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

- Next.js 16.2.10 - Full-stack React framework with server components, API routes, static generation
- React 19.2.7 - UI library
- React DOM 19.2.7 - DOM rendering
- CSS (vanilla) - Global styles in `app/globals.css`
- Google Fonts - Inter and Space Grotesk fonts loaded via Next.js font optimization
- Not detected in dependencies
- Next.js built-in build system (handles TypeScript compilation)
- ESLint 9.0.0 - Code linting (ESLint config 2024 format)
- eslint-config-next 16.2.10 - Next.js ESLint presets (includes core-web-vitals, TypeScript)

## Key Dependencies

- @supabase/supabase-js 2.110.6 - Database and API client for Supabase integration
- zod 4.4.3 - Runtime type validation (used for contact form schema validation)
- @types/node 24.0.0 - Node.js type definitions
- @types/react 19.0.0 - React type definitions
- @types/react-dom 19.0.0 - React DOM type definitions

## Configuration

- Configured via environment variables
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side database access (required)
- `NEXT_PUBLIC_SITE_URL` - Site URL for SEO metadata (defaults to https://skytechperu.com)
- `next.config.ts` - Minimal configuration, disables "X-Powered-By" header
- `tsconfig.json` - Strict TypeScript settings with path aliases (`@/*` → project root)

## Platform Requirements

- Node.js (version aligned with Next.js 16.2.10)
- npm for package management
- Deployment target: Vercel (configured via `vercel.json`)
- Server runtime: Node.js
- Build command: Blocked for `local-2` directory (deployment prevented via `scripts/block-vercel-deploy.mjs`)
- Static generation: Enabled for homepage (force-static directive in `app/page.tsx`)

## Scripts

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Component files: PascalCase (`components/experience.tsx`, `components/v4-interactions.tsx`)
- Utility/lib files: kebab-case (`lib/contact-schema.ts`, `lib/supabase-admin.ts`)
- API routes: kebab-case (`app/api/contact/route.ts`)
- Metadata files: camelCase (`app/robots.ts`, `app/sitemap.ts`)
- camelCase for all functions and handlers (`toggleVideo`, `submitForm`, `updateScroll`, `closeMobileMenu`)
- Private handler functions: camelCase prefix (`enterCursor`, `leaveCursor`, `showPrevious`, `showNext`)
- Component functions: PascalCase (`Experience`, `FormConnector`, `V4Interactions`)
- camelCase for all variables (`menuOpen`, `introDone`, `videoPlaying`, `revealObserver`)
- State variables: camelCase with descriptive names (`isVisible`, `isIntersecting`, `isOpen`)
- CSS custom properties: kebab-case with double dashes (`--ink`, `--orange`, `--scroll-y`, `--parallax`)
- Type interfaces/types: PascalCase (`ContactInput`, `ContactForm`)
- Exported schema types: PascalCase with `z.infer` pattern (`ContactInput = z.infer<typeof contactSchema>`)
- camelCase for object constants (`services`, `process`)
- Array of objects with consistent structure for data (`services.map((service) => ...)`)
- Numeric strings for identifiers (`"01"`, `"02"`, etc. for section numbers)

## Code Style

- No Prettier configuration found — manual formatting follows consistent style
- 2-space indentation (inferred from code)
- No semicolons at end of statements (semicolon-less style)
- Line length appears to target ~100-120 characters
- Imports organized in blocks with blank lines between groups
- ESLint configuration: `eslint.config.mjs`
- Presets:
- Global ignores: `.next/**`, `node_modules/**`, `next-env.d.ts`
- Run command: `npm run lint` → `eslint .`
- Strict mode enabled (`"strict": true`)
- No implicit `any` (`"noImplicitAny"` implicitly true via strict mode)
- Module resolution: `bundler`
- Target: ES2017
- JSX: `react-jsx` (automatic JSX transform)
- Path aliases: `@/*` maps to project root

## Import Organization

- Use `@/*` for all local imports (required pattern, do not use relative paths)
- Example: `@/lib/contact-schema`, `@/components/experience`

## Error Handling

- Pattern: `try` → `JSON.parse/safeParse` → `try` → `db operation` → `catch`
- Error responses use `NextResponse.json()` with message object
- Status codes: 400 (bad request), 201 (created), 500 (server error), 503 (service unavailable)
- User-facing error messages: Spanish language, human-readable ("Ingresa tu nombre." "No pudimos enviar tu solicitud.")
- Server logs: use `console.error()` with context ("No se pudo registrar la solicitud:", error code, message)
- Example (`app/api/contact/route.ts`):
- Pattern: `try` → `fetch` → `await response.json()` → `check !response.ok` → `throw Error` → `catch`
- Fallback messages when error type unknown: check `error instanceof Error` before accessing `.message`
- Example (`components/experience.tsx`):
- Use Zod schemas (located in `lib/`) for data validation
- Pattern: `z.object()` with `.trim()`, `.min()`, `.max()`, custom error messages
- Export inferred type: `export type ContactInput = z.infer<typeof contactSchema>`
- Use `safeParse()` to avoid throwing (check `.success` and access `.data` or `.error`)

## Logging

- Server-only logging in API routes using `console.error()`
- Include context with error logs: error code, database message, action taken
- Example: `console.error("No se pudo registrar la solicitud:", error.code, error.message)`
- No logging of sensitive data (passwords, auth tokens)
- Database errors (code + message)
- Configuration errors (missing env vars)
- Unexpected catches (error object)
- Do NOT log successful operations (too verbose)

## Comments

- Complex animation logic (scroll parallax, reveal timing)
- Non-obvious DOM selectors or data attributes
- Accessibility considerations (aria-labels, roles)
- Do NOT comment obvious code (`const x = 5 // set x to 5`)
- Used sparingly
- Type annotations preferred over JSDoc comments
- Example: Function signatures with typed parameters are self-documenting
- Mark decorative elements with `aria-hidden="true"`
- Mark custom cursors and animations with `aria-hidden` to hide from screen readers

## Function Design

- Small focused functions (20-50 lines typical)
- Event handlers stay concise by delegating to helper functions
- Example: `submitForm` (35 lines) delegates validation to Zod schema
- Destructure object parameters when multiple args
- Example: `{ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> }`
- Use optional chaining for nullable DOM queries: `cursor?.classList.add(...)`
- Async functions return `Promise<void>` (callbacks, form submissions)
- API handlers return `NextResponse` (never throw)
- Components return JSX fragments or null
- useEffect cleanup functions return a function that removes listeners, clears timeouts
- Example:

## Module Design

- Named exports for components (`export function Experience() { ... }`)
- Default export for page components (`export default function Home() { ... }`)
- Utilities exported as named exports (`export const contactSchema = ...`)
- Types exported with `export type` keyword
- Required for all components that use hooks (useState, useEffect)
- Placed at the top of file before imports
- Example: `"use client"` in `components/experience.tsx`
- Utilities that access secrets use `import "server-only"` at top
- Example: `lib/supabase-admin.ts` starts with `import "server-only"`
- Prevents accidental import into client components
- No barrel files (index.ts) used in this project
- Import directly from component/util files

## CSS Conventions

- Color system: `--ink`, `--soft`, `--paper`, `--orange`, `--hot`
- Fonts: `--display` (Space Grotesk), `--body` (Inter)
- Layout: `--shell` (max-width container)
- Dynamic: `--scroll-y`, `--parallax` (set via JS)
- Example: `background: var(--orange)` (uses CSS variable)
- BEM-inspired naming: `.block__element--modifier`
- Example: `.menu-overlay.is-open`, `.service-row:hover`
- State classes: `.is-open`, `.is-visible`, `.is-pending`, `.is-success`, `.is-error`
- Semantic parent classes: `.site-header`, `.hero-copy`, `.contact-grid`
- Mobile-first: start with single-column, add grid/flex at breakpoints
- Breakpoints: 1000px (medium), 720px (small)
- Example: `@media(max-width:1000px) { ... }`
- Use CSS containment and will-change for performance
- Keyframe animations: `@keyframes animationName { from { ... } to { ... } }`
- Transitions: 3-4 properties max per element
- Cubic easing: `cubic-bezier(.16,1,.3,1)` (ease-out-back)
- Durations: 0.35s–1.2s typical
- Parallax via CSS custom property: `transform: translateY(var(--parallax, 0))`
- Reveal animations: `opacity 0 → 1`, `translateY(44px) → 0`

## IntersectionObserver + requestAnimationFrame Patterns

- Use `[data-reveal]` attribute to mark elements
- CSS class `.is-visible` triggers transition
- Unobserve after intersection (one-time animation)
- Use frame ID to debounce rAF calls
- Respect `prefers-reduced-motion` media query
- Passive event listeners for scroll performance
- Always check `prefers-reduced-motion` before heavy animations
- Provide fallback behavior (pause video, skip parallax)

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Page Root | Render static landing page with all content sections, metadata, SEO | `app/page.tsx` |
| Experience | Manage menu state, scroll effects, parallax, reveals, cursor, form submission | `components/experience.tsx` |
| FormConnector | Bridge server form (#contact-form) with client submit handler | `components/experience.tsx` (nested) |
| Contact API | Validate and persist form submissions to database | `app/api/contact/route.ts` |
| Contact Schema | Zod schema for form validation (reusable across client/server) | `lib/contact-schema.ts` |
| Supabase Admin | Create authenticated Supabase client with service role credentials | `lib/supabase-admin.ts` |
| Layout | Root HTML layout with fonts, metadata, body wrapper | `app/layout.tsx` |

## Pattern Overview

- Page is fully static at build time (`force-static` in `page.tsx`)
- Single client component hydrates for interactive features (menu, form, scroll effects)
- Form submission is the only dynamic route (`/api/contact`)
- All styling is co-located in a single CSS file
- Supabase is used exclusively for contact form persistence
- Tailwind CSS is NOT used; all styling is vanilla CSS with CSS variables

## Layers

- Purpose: Define page structure, content, and static metadata
- Location: `app/page.tsx`, `app/layout.tsx`
- Contains: Hero section, services list, process steps, contact form markup, images, video
- Depends on: React (for JSX), Next.js Image component
- Used by: Browser (renders static HTML)
- Purpose: Handle all user interactions, animations, and DOM state
- Location: `components/experience.tsx`
- Contains: Menu toggle state, scroll listeners, reveal animations, cursor tracking, form submission
- Depends on: React (hooks, events), DOM APIs (IntersectionObserver, requestAnimationFrame)
- Used by: Presentation Layer (imported at top level)
- Purpose: Define and validate contact form structure
- Location: `lib/contact-schema.ts`
- Contains: Zod schema with field rules (name, email, company, service, message, honeypot)
- Depends on: Zod
- Used by: Interaction Layer (client-side), API Layer (server-side)
- Purpose: Accept form submissions and persist to database
- Location: `app/api/contact/route.ts`
- Contains: POST handler, payload validation, Supabase insert logic, error responses
- Depends on: Next.js NextResponse, Zod validation, Supabase client
- Used by: Interaction Layer (fetch from browser)
- Purpose: Initialize authenticated database client
- Location: `lib/supabase-admin.ts`
- Contains: Supabase client factory with service role key
- Depends on: Supabase JS client, environment variables
- Used by: API Layer
- Purpose: Define all visual presentation
- Location: `app/globals.css`
- Contains: CSS variables, responsive grid, animations (orbit, parallax, reveal, menu), media queries
- Depends on: CSS custom properties, Grid, Flexbox, media queries
- Used by: All components (global stylesheet)

## Data Flow

### Primary Request Path (Form Submission)

### Secondary Flow: Interaction Effects

- Menu open state: `menuOpen` (useState in Experience component)
- Intro animation done: `introDone` (useState, 1450ms timer in useEffect)
- Video playing state: `videoPlaying` (useState)
- All other state is DOM class manipulation (`.is-visible`, `.menu-open`, `.cursor-active`)
- No global state management library (Redux, Zustand) — kept minimal

## Key Abstractions

- Purpose: Bridge gap between server form element and client event handler
- Location: `components/experience.tsx` (lines 207-216)
- Pattern: Finds form by ID after hydration, attaches listener for submit event
- Why: Server form element can't call client handler directly; this attaches listener after mount
- Purpose: Fade-in and slide-up elements as they enter viewport
- Selector: `[data-reveal]` attribute
- Pattern: IntersectionObserver detects intersection, adds `.is-visible` class
- CSS: Transition from `opacity: 0; transform: translateY(44px)` to `opacity: 1; transform: none`
- Purpose: Create depth effect on scroll for images/videos
- Selector: `[data-parallax]` attribute with speed value (e.g., `data-parallax="0.16"`)
- Pattern: Calculated as `element.parentElement.getBoundingClientRect().top * speed`
- CSS: Applied via `--parallax` custom property on `translateY(var(--parallax,0))`
- Purpose: Replace default cursor with branded dot + label for interactive elements
- Selector: `[data-cursor]` attribute on interactive links
- Pattern: pointermove updates cursor position, pointerenter/leave toggle active state
- CSS: Grows from 10px to 86px with flex layout for label text

## Entry Points

- Location: `app/page.tsx`
- Triggers: User navigates to domain root
- Responsibilities: Render static HTML with all content, images, video sources, form
- Location: `components/experience.tsx`
- Triggers: React hydration after page load
- Responsibilities: Initialize all event listeners, timers, observers
- Location: `app/api/contact/route.ts`
- Triggers: POST request from browser with form data
- Responsibilities: Validate, persist to database, respond with status

## Architectural Constraints

- **Threading:** Single-threaded event loop (browser/Node.js). All async operations (database, fetch) use Promise-based handling.
- **Global state:** Minimal—mostly class-based DOM state. Only three useState hooks in Experience component (menuOpen, introDone, videoPlaying). No global singletons.
- **Circular imports:** None detected. Dependencies flow: page → experience → supabase-admin; schema is standalone.
- **Build-time export:** Page is statically generated at build time with `force-static`. Zero runtime overhead per request.
- **Environment variables:** NEXT_PUBLIC_SUPABASE_URL (public), SUPABASE_SERVICE_ROLE_KEY (secret, server-only), NEXT_PUBLIC_SITE_URL (optional, metadata only).

## Anti-Patterns

### Legacy Template System

### No Separatate Response Errors

## Error Handling

- Form validation errors caught in `Experience.submitForm()` try/catch (line 125-142)
- Status element (`#form-status`) displays error message from API
- Honeypot field (`website` input) detects spam (Zod schema line 9 requires empty)
- Database errors logged to console and returned as 500 with fallback message
- Supabase initialization errors thrown (server-only, caught by Next.js error boundary)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
