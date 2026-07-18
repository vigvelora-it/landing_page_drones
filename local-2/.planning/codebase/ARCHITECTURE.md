<!-- refreshed: 2026-07-18 -->
# Architecture

**Analysis Date:** 2026-07-18

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                   Presentation Layer (SSG)                  │
│           `app/page.tsx` (Server Component)                 │
│        - Static export: force-static                        │
│        - Narrative landing page structure                   │
│        - SEO metadata & Open Graph                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Interaction Layer (Client Component)           │
│         `components/experience.tsx` (Use Client)            │
│  - Menu + navigation state management                       │
│  - Scroll tracking & parallax parallax calculations         │
│  - Reveal animations (IntersectionObserver)                 │
│  - Custom cursor behavior                                   │
│  - Form submission handler                                  │
│  - Reduced motion accessibility                            │
└──┬──────────────────────┬──────────────────┬────────────────┘
   │                      │                  │
   ▼                      ▼                  ▼
[DOM]           [Event Listeners]     [Form Submit]
   │                                       │
   │                                       ▼
   │                    ┌──────────────────────────────────┐
   │                    │     Validation Layer             │
   │                    │  `lib/contact-schema.ts` (Zod)   │
   │                    │  - Client-side parse (safeParse) │
   │                    │  - Server-side parse (safeParse) │
   │                    └──────────────┬───────────────────┘
   │                                    │
   │                                    ▼
   │                    ┌──────────────────────────────────┐
   │                    │       API Layer (Edge Runtime)   │
   │                    │  `app/api/contact/route.ts`      │
   │                    │  - POST handler                  │
   │                    │  - Schema validation             │
   │                    │  - Request/Response processing   │
   │                    └──────────────┬───────────────────┘
   │                                    │
   │                                    ▼
   │                    ┌──────────────────────────────────┐
   │                    │       Data Layer                 │
   │                    │  `lib/supabase-admin.ts`         │
   │                    │  - Supabase client initialization│
   │                    │  - Insert into contact_requests  │
   │                    │  - Error handling                │
   │                    └──────────────┬───────────────────┘
   │                                    │
   │                                    ▼
   │                           [Supabase Database]
   │
   └─────────────────► [Stylesheet]
                   `app/globals.css`
                   (All styling for page)
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

**Overall:** Static Site Generation (SSG) with selective client interactivity

**Key Characteristics:**
- Page is fully static at build time (`force-static` in `page.tsx`)
- Single client component hydrates for interactive features (menu, form, scroll effects)
- Form submission is the only dynamic route (`/api/contact`)
- All styling is co-located in a single CSS file
- Supabase is used exclusively for contact form persistence
- Tailwind CSS is NOT used; all styling is vanilla CSS with CSS variables

## Layers

**Presentation Layer (SSG):**
- Purpose: Define page structure, content, and static metadata
- Location: `app/page.tsx`, `app/layout.tsx`
- Contains: Hero section, services list, process steps, contact form markup, images, video
- Depends on: React (for JSX), Next.js Image component
- Used by: Browser (renders static HTML)

**Interaction Layer (Client):**
- Purpose: Handle all user interactions, animations, and DOM state
- Location: `components/experience.tsx`
- Contains: Menu toggle state, scroll listeners, reveal animations, cursor tracking, form submission
- Depends on: React (hooks, events), DOM APIs (IntersectionObserver, requestAnimationFrame)
- Used by: Presentation Layer (imported at top level)

**Validation Layer:**
- Purpose: Define and validate contact form structure
- Location: `lib/contact-schema.ts`
- Contains: Zod schema with field rules (name, email, company, service, message, honeypot)
- Depends on: Zod
- Used by: Interaction Layer (client-side), API Layer (server-side)

**API Layer (Route Handler):**
- Purpose: Accept form submissions and persist to database
- Location: `app/api/contact/route.ts`
- Contains: POST handler, payload validation, Supabase insert logic, error responses
- Depends on: Next.js NextResponse, Zod validation, Supabase client
- Used by: Interaction Layer (fetch from browser)

**Data Layer:**
- Purpose: Initialize authenticated database client
- Location: `lib/supabase-admin.ts`
- Contains: Supabase client factory with service role key
- Depends on: Supabase JS client, environment variables
- Used by: API Layer

**Styling Layer:**
- Purpose: Define all visual presentation
- Location: `app/globals.css`
- Contains: CSS variables, responsive grid, animations (orbit, parallax, reveal, menu), media queries
- Depends on: CSS custom properties, Grid, Flexbox, media queries
- Used by: All components (global stylesheet)

## Data Flow

### Primary Request Path (Form Submission)

1. **User submits form** → form element in `app/page.tsx` (#contact-form)
2. **Interaction handler triggers** → `Experience.submitForm()` in `components/experience.tsx` (line 112-146)
3. **Validation happens** → Contact schema validated with Zod safeParse (client-side check before send)
4. **POST to /api/contact** → `fetch("/api/contact")` with JSON body
5. **Server-side validation** → `contactSchema.safeParse()` in `app/api/contact/route.ts` (line 16)
6. **Database insert** → `supabase.from("contact_requests").insert()` in `app/api/contact/route.ts` (line 26)
7. **Response sent** → NextResponse with status 201 or error (line 43)
8. **Status message updates** → form-status element updated in `components/experience.tsx` (line 135-142)

### Secondary Flow: Interaction Effects

1. **Scroll event** → `updateScroll()` sets `--scroll-y` CSS variable (line 37-51)
2. **Parallax calculation** → Each `[data-parallax]` element gets computed offset
3. **Reveal animations** → IntersectionObserver detects `[data-reveal]` elements entering viewport, adds `is-visible` class (line 20-32)
4. **Custom cursor** → `pointermove` event updates cursor position, `[data-cursor]` targets trigger active state (line 54-73)

**State Management:**
- Menu open state: `menuOpen` (useState in Experience component)
- Intro animation done: `introDone` (useState, 1450ms timer in useEffect)
- Video playing state: `videoPlaying` (useState)
- All other state is DOM class manipulation (`.is-visible`, `.menu-open`, `.cursor-active`)
- No global state management library (Redux, Zustand) — kept minimal

## Key Abstractions

**FormConnector Component:**
- Purpose: Bridge gap between server form element and client event handler
- Location: `components/experience.tsx` (lines 207-216)
- Pattern: Finds form by ID after hydration, attaches listener for submit event
- Why: Server form element can't call client handler directly; this attaches listener after mount

**Reveal Animation Pattern:**
- Purpose: Fade-in and slide-up elements as they enter viewport
- Selector: `[data-reveal]` attribute
- Pattern: IntersectionObserver detects intersection, adds `.is-visible` class
- CSS: Transition from `opacity: 0; transform: translateY(44px)` to `opacity: 1; transform: none`

**Parallax Media Pattern:**
- Purpose: Create depth effect on scroll for images/videos
- Selector: `[data-parallax]` attribute with speed value (e.g., `data-parallax="0.16"`)
- Pattern: Calculated as `element.parentElement.getBoundingClientRect().top * speed`
- CSS: Applied via `--parallax` custom property on `translateY(var(--parallax,0))`

**Custom Cursor Pattern:**
- Purpose: Replace default cursor with branded dot + label for interactive elements
- Selector: `[data-cursor]` attribute on interactive links
- Pattern: pointermove updates cursor position, pointerenter/leave toggle active state
- CSS: Grows from 10px to 86px with flex layout for label text

## Entry Points

**Browser Entry Point:**
- Location: `app/page.tsx`
- Triggers: User navigates to domain root
- Responsibilities: Render static HTML with all content, images, video sources, form

**Client Interactivity Entry Point:**
- Location: `components/experience.tsx`
- Triggers: React hydration after page load
- Responsibilities: Initialize all event listeners, timers, observers

**Form Submission Entry Point:**
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

**What happens:** Files `lib/v4-template.ts`, `components/v4-interactions.tsx`, and the HTML file they reference (`landing-page-v4.html`) exist but are never imported.

**Why it's wrong:** These are leftover from a previous iteration where the landing page was delivered as a static HTML file that needed to be parsed and adapted. Now the page is built with React/Next.js directly. Keeping these files creates confusion and increases codebase surface area.

**Do this instead:** Delete `lib/v4-template.ts`, `components/v4-interactions.tsx`, and `landing-page-v4.html` in a cleanup commit. If historical reference is needed, preserve them in git history or documentation, not in the working directory.

### No Separatate Response Errors

**What happens:** API error responses in `app/api/contact/route.ts` return custom messages but don't distinguish between validation errors, database errors, and configuration errors with different response codes (all mapped to generic 400/500).

**Why it's wrong:** Client code can't distinguish error types to provide different UX (e.g., form validation hint vs. server-down message). All errors look the same.

**Do this instead:** Differentiate response codes: 400 for validation errors, 503 for service unavailable, 500 for database errors. Add an `error_code` field to JSON response for client-side classification.

## Error Handling

**Strategy:** Fail gracefully with user-facing error messages

**Patterns:**
- Form validation errors caught in `Experience.submitForm()` try/catch (line 125-142)
- Status element (`#form-status`) displays error message from API
- Honeypot field (`website` input) detects spam (Zod schema line 9 requires empty)
- Database errors logged to console and returned as 500 with fallback message
- Supabase initialization errors thrown (server-only, caught by Next.js error boundary)

## Cross-Cutting Concerns

**Logging:** console.error() for development debugging (API errors on line 36 and 45 of route.ts). No production logging service integrated.

**Validation:** Zod schema applied on both client (informational) and server (authoritative). Server-side is the source of truth; client-side is UX enhancement.

**Authentication:** Form submissions are public (no auth). Database writes use Supabase service role key (server-only, not exposed to browser).

---

*Architecture analysis: 2026-07-18*
