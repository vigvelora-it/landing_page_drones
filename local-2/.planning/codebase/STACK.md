# Technology Stack

**Analysis Date:** 2026-07-18

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (strict mode enabled)

## Runtime

**Environment:**
- Node.js (via Next.js server runtime)
- Browser (React client-side)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.2.10 - Full-stack React framework with server components, API routes, static generation
- React 19.2.7 - UI library
- React DOM 19.2.7 - DOM rendering

**Styling:**
- CSS (vanilla) - Global styles in `app/globals.css`
- Google Fonts - Inter and Space Grotesk fonts loaded via Next.js font optimization

**Testing:**
- Not detected in dependencies

**Build/Dev:**
- Next.js built-in build system (handles TypeScript compilation)
- ESLint 9.0.0 - Code linting (ESLint config 2024 format)
- eslint-config-next 16.2.10 - Next.js ESLint presets (includes core-web-vitals, TypeScript)

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.110.6 - Database and API client for Supabase integration
- zod 4.4.3 - Runtime type validation (used for contact form schema validation)

**Dev Dependencies:**
- @types/node 24.0.0 - Node.js type definitions
- @types/react 19.0.0 - React type definitions
- @types/react-dom 19.0.0 - React DOM type definitions

## Configuration

**Environment:**
- Configured via environment variables
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side database access (required)
- `NEXT_PUBLIC_SITE_URL` - Site URL for SEO metadata (defaults to https://skytechperu.com)

**Build:**
- `next.config.ts` - Minimal configuration, disables "X-Powered-By" header
- `tsconfig.json` - Strict TypeScript settings with path aliases (`@/*` → project root)
  - Target: ES2017
  - Module resolution: bundler (Next.js optimized)
  - JSX: react-jsx (automatic runtime)
  - Strict mode: enabled
  - Isolated modules: enabled

## Platform Requirements

**Development:**
- Node.js (version aligned with Next.js 16.2.10)
- npm for package management

**Production:**
- Deployment target: Vercel (configured via `vercel.json`)
- Server runtime: Node.js
- Build command: Blocked for `local-2` directory (deployment prevented via `scripts/block-vercel-deploy.mjs`)
- Static generation: Enabled for homepage (force-static directive in `app/page.tsx`)

## Scripts

```bash
npm run dev              # Start development server on port 4173
npm run build            # Build for production
npm run start            # Start production server on port 4173
npm run deploy           # Block Vercel deployment (intentional for this environment)
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking without emitting
```

---

*Stack analysis: 2026-07-18*
