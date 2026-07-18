# Codebase Concerns

**Analysis Date:** 2026-07-18

## Tech Debt

### Legacy Files Ready for Removal

**Area:** Design iteration artifacts

- **Issue:** Three files from version 4 template remain in the codebase as "reference" copies but are not imported or used anywhere. They add maintenance overhead and confusion.
  - `landing-page-v4.html` (48.5 KB) — unused HTML template
  - `lib/v4-template.ts` (34 lines) — unused regex-based HTML parser for v4 template
  - `components/v4-interactions.tsx` (158 lines) — unused interactive component set

- **Files:** 
  - `landing-page-v4.html`
  - `lib/v4-template.ts`
  - `components/v4-interactions.tsx`

- **Impact:** 
  - Increases repo size and build context
  - Creates confusion about which components are active
  - Wastes developer attention during future maintenance
  - Documented in `README.md` line 44 as preserved "only for reference"

- **Fix approach:** Archive these files outside the main repository or remove entirely. Update documentation to reflect the removal. This should be done in a separate cleanup commit with clear messaging.

### Hardcoded Runtime Value

**Area:** Footer year rendering

- **Issue:** `app/page.tsx` line 278 calls `new Date().getFullYear()` at render time in the footer. While functional, this ties a presentational value to runtime evaluation instead of using a constant or build-time value.

- **Files:** `app/page.tsx:278`

- **Impact:** Minor runtime overhead; harder to reason about component behavior; could cause timezone-related inconsistencies if page rendering spans year boundary.

- **Fix approach:** Extract year to a constant in `lib/` or use Next.js metadata generation, or document the intentional runtime dependency for dynamic year updating.

---

## Performance Bottlenecks

### Large Video Asset

**Area:** Hero section video playback

- **Problem:** `public/video/drone-flight-close.mp4` is **9.37 MB**, making it one of the largest assets in the site. This significantly impacts:
  - Initial page load time (users downloading 9+ MB before first visual)
  - Mobile data usage (major impact for international users)
  - Time to First Contentful Paint (FCP)

- **Files:** `public/video/drone-flight-close.mp4`, loaded via `app/page.tsx:68-80`

- **Characteristics:**
  - Resolution: 1280 × 720
  - Duration: 24.15 seconds
  - Format: H.264 MP4 (not optimized for web streaming)
  - Loading: Currently `preload="metadata"` (good), but file still downloads on page load

- **Current mitigation:** 
  - `preload="metadata"` reduces initial load, but video still downloads when playing
  - `autoplay` is enabled, so video starts playing immediately (uses data)
  - Fallback poster image provided

- **Improvement path:**
  - **High priority:** Convert to VP9/AV1 WebM format (~40-60% smaller); provide MP4 fallback
  - Create multiple quality versions (720p, 480p, 360p) and select based on viewport/connection
  - Consider serving from CDN in production (not applicable for local-2, but critical for production)
  - Add `loading="lazy"` or intersection observer to defer video load until hero is visible
  - Use `fetchpriority="low"` on video element to allow other critical resources to load first
  - Consider replacing full-screen autoplay with a poster + play button to eliminate automatic data usage

### Unoptimized Image Assets

**Area:** Public image resources

- **Problem:** Multiple images stored as PNG format without modern compression or WebP alternatives:
  - `public/IMAGENES_PAGINA_WEB/dron.png` — 460 KB (could be ~200-250 KB as WebP)
  - `public/IMAGENES_PAGINA_WEB/equipos1.png` — 668 KB (could be ~300-350 KB as WebP)
  - `public/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png` — 716 KB (could be ~320-380 KB as WebP)
  - `public/IMAGENES_PAGINA_WEB/MUSEO ZEN L1.png` — 68 KB (acceptable)

- **Files:** 
  - `public/IMAGENES_PAGINA_WEB/dron.png`
  - `public/IMAGENES_PAGINA_WEB/equipos1.png`
  - `public/IMAGENES_PAGINA_WEB/monumentacion_puntos_referencia.png`
  - Loaded via `<Image>` components in `app/page.tsx`

- **Impact:** PNG format doesn't use modern compression; total ~1.8 MB could be reduced to ~0.9-1.1 MB with WebP conversion (~40-50% reduction)

- **Improvement path:**
  - Convert PNGs to WebP format (use `cwebp` or ImageMagick)
  - Use `next/image` with `unoptimized={false}` and configure format negotiation
  - Alternatively, add WebP variants and serve based on browser support
  - Consider responsive sizing: some images are served at full viewport width but could use smaller sizes for mobile

### Animation Frame Recalculation

**Area:** Scroll parallax system

- **Problem:** In `components/experience.tsx` (lines 35-46), parallax calculations for all elements with `[data-parallax]` are recalculated on every `requestAnimationFrame` call triggered by scroll. For pages with many animated elements, this can cause layout thrashing.

- **Files:** `components/experience.tsx:35-46`

- **Characteristics:**
  - `getBoundingClientRect()` is called for every parallax item on every frame (~60 FPS)
  - No debouncing or throttling
  - Full DOM traversal on each scroll event

- **Current behavior:**
  ```typescript
  parallaxItems.forEach((item) => {
    const rect = item.parentElement?.getBoundingClientRect(); // Called every frame
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
    const speed = Number(item.dataset.parallax ?? 0.1);
    item.style.setProperty("--parallax", `${rect.top * speed}px`);
  });
  ```

- **Impact:** Low on desktop; potential jank on lower-end mobile devices with many elements

- **Fix approach:**
  - Use Intersection Observer to skip off-screen elements (already done for other reveal effects)
  - Cache `getBoundingClientRect()` results more aggressively
  - Consider moving parallax to CSS transforms with CSS custom properties updated less frequently
  - Profile with DevTools Performance tab to confirm actual impact

---

## Accessibility Concerns

### Incomplete Reduced-Motion Handling

**Area:** Animation preferences

- **Issue:** While `prefers-reduced-motion: reduce` is detected (line 11 of `experience.tsx`) and CSS respects it (line 44 of `globals.css`), the JavaScript implementation has an unusual pattern:
  
  ```typescript
  if (reducedMotion) {
    heroVideo?.pause();
    reducedMotionTimer = window.setTimeout(() => setVideoPlaying(false), 0);
  }
  ```
  
  The `setTimeout(..., 0)` is a code smell—it schedules the state update asynchronously for no clear reason.

- **Files:** `components/experience.tsx:15-18`

- **Impact:** State update may not be synchronous; could cause brief UI flicker or inconsistent state if component re-renders before state is set

- **Fix approach:** 
  - Remove the `setTimeout` and update state directly: `setVideoPlaying(false)`
  - Verify that video pause happens immediately without timing issues

### Custom Cursor Accessibility

**Area:** Custom pointer interface

- **Issue:** Custom cursor is implemented with `pointer-events: none` and hidden on non-pointer devices, but the fallback text "Explorar" (line 187 of `page.tsx`) is a hardcoded default that doesn't adapt to context well.

- **Files:** 
  - `components/experience.tsx:54-73` (cursor setup)
  - `app/page.tsx:187` (cursor HTML)

- **Current behavior:** Cursor label defaults to "Explorar" and updates via `target.dataset.cursor`. Some interactive elements don't have a `data-cursor` attribute, so they show generic text.

- **Impact:** Screen readers see `aria-hidden="true"` on the cursor, so it's properly excluded; but on keyboard-only navigation, no visual indication of interactivity.

- **Fix approach:**
  - Verify all clickable elements have appropriate `data-cursor` attributes
  - Consider adding keyboard focus indicators that complement the custom cursor

---

## Fragile Areas

### Form Submission Bridge Pattern

**Area:** Contact form handling

- **Issue:** `components/experience.tsx` uses an unusual FormConnector component (lines 207-216) that adds an event listener to a form rendered by a different component (`app/page.tsx`). This creates a fragile DOM coupling.

- **Files:** 
  - `components/experience.tsx:207-216` (FormConnector)
  - `app/page.tsx:249-268` (contact form)

- **Pattern:**
  ```typescript
  // In Experience component:
  function FormConnector({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> }) {
    useEffect(() => {
      const form = document.querySelector<HTMLFormElement>("#contact-form");
      // ... attach listener
    }, [onSubmit]);
  }
  
  // Form is rendered elsewhere in page.tsx
  <form className="contact-form" id="contact-form" ...>
  ```

- **Why fragile:**
  - If form ID changes, FormConnector breaks silently
  - If form is rendered conditionally, listener may attach before form exists
  - No type safety between form location and event handler
  - Difficult to test in isolation

- **Safe modification:**
  - Move form submission logic into a hook or state management that owns both the form and its handler
  - Pass `onSubmit` directly to the `<form>` element instead of querying it
  - If cross-component communication is needed, use React Context or a proper state manager

- **Test coverage:** No unit tests found for form submission flow

### Direct DOM Manipulation at Scale

**Area:** Element selection and animation triggers

- **Issue:** Multiple `document.querySelectorAll()` calls in a single `useEffect` (lines 20-85 of `experience.tsx`) select the same elements multiple times. While it works, it's inefficient and couples the component tightly to DOM selectors.

- **Files:** `components/experience.tsx:20-85`

- **Selectors:**
  - `[data-reveal]` — selected twice (line 32 and implicitly by IntersectionObserver)
  - `[data-parallax]` — selected once (line 35)
  - `[data-cursor]` — selected once (line 62)

- **Impact:** Acceptable for current page size, but doesn't scale well if more interactive elements are added

- **Safe modification:**
  - Cache query results in refs
  - Consider using event delegation (e.g., `event.target.dataset.cursor`) instead of pre-querying all elements
  - Use data attributes with specific purposes to avoid conflicts

---

## Scaling Limits

### Single Large Hero Video Blocks Development

**Area:** Video loading and mobile experience

- **Current capacity:** 9.37 MB asset serves to all users on first page load (if autoplay enabled)

- **Limit:** 
  - 3G users (1.5 Mbps): ~50 seconds to download
  - 4G users (10 Mbps): ~7.5 seconds to download
  - WiFi users (50+ Mbps): acceptable
  - Mobile data-saver mode: video will be blocked or deferred

- **Scaling path:**
  - Implement adaptive bitrate streaming (HLS/DASH) for production
  - Detect device capabilities and connection speed (via Network Information API) to serve appropriate quality
  - For local-2, consider splitting video into multiple codec versions

### CSS Bundle Size

**Area:** Global styles

- **Current:** `app/globals.css` is heavily minified (~5,800 bytes as shown in line 44 of the file). This is a single monolithic stylesheet with no code splitting.

- **Scaling concern:** As the site grows, CSS becomes harder to maintain and all styles load for every page. No `@media` query extraction or component-scoped styling.

- **Scaling path:** Consider CSS-in-JS or Tailwind for modularity and automatic code splitting (not recommended for current state; too small to justify overhead)

---

## Dependencies at Risk

### Outdated Supabase SDK

**Area:** Database integration

- **Package:** `@supabase/supabase-js@^2.110.6` (from `package.json` line 14)

- **Risk:** Version 2.110.6 is pinned with caret (`^`), allowing minor/patch updates automatically. If version 3.x is released with breaking changes, build could break.

- **Impact:** Form submissions would fail if Supabase SDK breaks compatibility

- **Migration plan:** Monitor Supabase releases; when v3 is ready, test thoroughly before updating. Consider pinning to exact version (`2.110.6`) rather than caret range for stability.

### React 19 Adoption

**Area:** Framework version

- **Package:** `react@^19.2.7`, `react-dom@^19.2.7` (new, released Sept 2024)

- **Risk:** React 19 introduced new features (Actions, use hook) that may have edge cases. No widely deployed production apps yet relying on these features.

- **Impact:** Unlikely to cause issues in this codebase (no use of React Actions or experimental features), but team should monitor React 19 stability

- **Mitigation:** Current usage is conservative (hooks, suspense boundaries handled gracefully). No risk identified at this time.

---

## Missing Critical Features

### No Error Tracking

**Area:** Production observability

- **Problem:** If form submission fails in production, only browser console and server logs will show errors. Users see the error message, but there's no aggregated error tracking.

- **Blocks:** Cannot identify patterns in form submission failures without manually checking logs

- **Recommendation:** Consider adding Sentry, LogRocket, or similar for error monitoring when deploying to production

### No Build Time Linting

**Area:** Code quality assurance

- **Problem:** `npm run lint` and `npm run typecheck` are available but not enforced in CI/CD pipeline. A developer could commit code that fails these checks.

- **Blocks:** Code quality drift over time

- **Recommendation:** Add pre-commit hook (husky + lint-staged) or enforce in CI pipeline before merging

### No Image Optimization at Build Time

**Area:** Asset pipeline

- **Problem:** Images are served as-is without build-time optimization. Next.js `<Image>` component doesn't have configuration to automatically convert to WebP.

- **Blocks:** Cannot achieve best-in-class performance without manual image preprocessing

- **Recommendation:** Configure next.config.ts to enable `images.formats: ["image/avif", "image/webp"]` for automatic format negotiation

---

## Test Coverage Gaps

### No Unit Tests

**Area:** Component and utility functions

- **What's not tested:** 
  - `components/experience.tsx` — all hooks (useEffect for parallax, animation, form submission)
  - `lib/contact-schema.ts` — Zod schema validation
  - `app/api/contact/route.ts` — API endpoint logic (especially error cases)

- **Files:** 
  - `components/experience.tsx`
  - `lib/contact-schema.ts`
  - `app/api/contact/route.ts`

- **Risk:** Changes to animation logic or form validation could introduce bugs undetected. Form submission failure modes unknown.

- **Priority:** High — Form submission is critical business logic and currently untested

### No E2E Tests

**Area:** User workflows

- **What's not tested:** 
  - Hero video autoplay and pause toggle
  - Scroll animations (parallax, reveals)
  - Menu open/close
  - Form submission to API
  - Mobile responsive behavior
  - Reduced-motion fallback

- **Priority:** Medium — Manual testing covers these, but could be automated

### No Performance Benchmarks

**Area:** Metrics tracking

- **What's not measured:**
  - Largest Contentful Paint (LCP) — critical for UX
  - Cumulative Layout Shift (CLS) — animation-related
  - First Input Delay (FID) / Interaction to Next Paint (INP) — interactivity
  - Time to Interactive (TTI)

- **Risk:** Performance regressions will go unnoticed during future updates

- **Recommendation:** Set up Lighthouse CI or similar to track metrics on every build

---

*Concerns audit: 2026-07-18*
