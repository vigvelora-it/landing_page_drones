# External Integrations

**Analysis Date:** 2026-07-18

## APIs & External Services

**None detected** - This is a static marketing website with database integration only.

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Project ID: "Pagina_Web_Mayra"
  - Connection: Authenticated via `NEXT_PUBLIC_SUPABASE_URL` (project URL) and `SUPABASE_SERVICE_ROLE_KEY` (server-side access)
  - Client: `@supabase/supabase-js` SDK (v2.110.6)
  - Schema file: `supabase/schema.sql`
  - Local dev config: `supabase/config.toml` (PostgreSQL 17, API on port 54321, database on port 54322)

**Tables:**
- `public.contact_requests` - Stores contact form submissions
  - Fields: id, name, company, email, service, message, source, status, created_at
  - Row-level security: Enabled (no public policies - access only via service role key)
  - Index: `contact_requests_created_at_idx` on created_at column (descending)

**File Storage:**
- Local filesystem only (static assets in `public/` directory)
  - Images: `public/IMAGENES_PAGINA_WEB/`
  - Videos: `public/video/`
  - Next.js Image optimization used for images (via `next/image` component)

**Caching:**
- Not explicitly configured (Next.js default caching applies)

## Authentication & Identity

**Auth Provider:**
- None - Public website with no user authentication
- Database access: Service role key used for server-side contact form submission only

**Implementation:**
- Contact form validation happens server-side via Zod schema
- Supabase admin client created with service role key in `lib/supabase-admin.ts`
- Marked as "server-only" to prevent accidental client-side import

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- console.error() used for Supabase errors in `app/api/contact/route.ts`
- No external logging service integrated

## CI/CD & Deployment

**Hosting:**
- Vercel (configured in `vercel.json`)
- Deployment **blocked** for `local-2` directory via `scripts/block-vercel-deploy.mjs`
- This environment is for local/staging development only

**CI Pipeline:**
- Not detected - Vercel build command is overridden to block deployment

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public, safe to expose)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret, used server-side only)
- `NEXT_PUBLIC_SITE_URL` (optional) - Site canonical URL for metadata (defaults to https://skytechperu.com)

**Secrets location:**
- `.env.local` or `.env.production.local` (not in repository)
- Example template: `.env.example` (protected - contains no actual secrets)

## Webhooks & Callbacks

**Incoming:**
- POST `/api/contact` - Contact form submission endpoint
  - Accepts JSON payload with: name, company (optional), email, service (optional), message, website (honeypot field)
  - Validates input with Zod schema from `lib/contact-schema.ts`
  - Returns 201 on success, 400/500 on error with user-friendly Spanish error messages
  - Inserts submission into `contact_requests` table with source="website"

**Outgoing:**
- None detected

## Data Validation

**Validation Layer:**
- Zod schema in `lib/contact-schema.ts` (`contactSchema`)
  - name: 2-100 characters (required)
  - company: 0-150 characters (optional)
  - email: valid email format, max 254 characters (required)
  - service: 0-120 characters (optional)
  - message: 10-3000 characters (required)
  - website: must be empty (honeypot to catch bot submissions)
- Server-side validation only - all checks happen on POST to `/api/contact`

## Data Privacy

**Database Security:**
- Row-level security enabled on `contact_requests` table
- No public read/write access policies
- Access controlled exclusively via service role key (server-side only)
- Contact requests not accessible from client browser

---

*Integration audit: 2026-07-18*
