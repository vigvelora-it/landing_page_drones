# Testing Patterns

**Analysis Date:** 2026-07-18

## Test Framework

**Status:** No formal test suite configured

**Current Setup:**
- No test runner installed (Jest, Vitest, etc.)
- No test configuration files (`jest.config.*`, `vitest.config.*`)
- No test dependencies in `package.json`
- No test scripts in package.json (only `lint` and `typecheck`)

**Installed Tools:**
- TypeScript: `^5.9.3` (type checking)
- ESLint: `^9.0.0` (code quality)
- Next.js: `^16.2.10` (includes built-in testing patterns)

**Run Commands:**
```bash
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler in check mode
```

## Test File Organization

**Current State:**
- No `.test.ts`, `.spec.ts`, or `__tests__` directories in project
- Only node_modules contain test files (from dependencies like Zod)

**Recommended Pattern (if tests are added):**
- Co-located: `component.tsx` → `component.test.tsx` (same directory)
- API routes: `api/contact/route.ts` → `api/contact/route.test.ts`
- Utils: `lib/contact-schema.ts` → `lib/contact-schema.test.ts`

**Naming Convention:**
- `.test.ts` suffix for unit tests
- Component tests follow component file names

## Test Structure

**No active test suite — no patterns to document**

**For future implementation, recommended patterns based on Next.js conventions:**

Unit Test Example (Zod Schema):
```typescript
import { contactSchema } from "@/lib/contact-schema"

describe("contactSchema", () => {
  it("validates a complete contact request", () => {
    const valid = {
      name: "Juan García",
      company: "Tech Corp",
      email: "juan@example.com",
      service: "Topografía",
      message: "Necesito un levantamiento en Lima",
    }
    const result = contactSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const invalid = {
      name: "Juan",
      email: "not-an-email",
      message: "Mensaje de prueba",
    }
    const result = contactSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})
```

Component Test Example (IntersectionObserver mock):
```typescript
import { render } from "@testing-library/react"
import { Experience } from "@/components/experience"

describe("Experience component", () => {
  it("renders header with menu toggle", () => {
    const { getByRole } = render(<Experience />)
    const toggleButton = getByRole("button", { name: /abrir menú/i })
    expect(toggleButton).toBeInTheDocument()
  })
})
```

API Route Test Example:
```typescript
import { POST } from "@/app/api/contact/route"

describe("POST /api/contact", () => {
  it("returns 400 for invalid JSON", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: "not json",
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

## Mocking

**Not currently in use** — no test framework configured

**Recommended approach for future tests:**

**Mock IntersectionObserver:**
```typescript
global.IntersectionObserver = class {
  constructor(callback) { this.callback = callback }
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

**Mock DOM APIs:**
```typescript
const mockQuerySelector = jest.fn()
const mockAdd = jest.fn()
Element.prototype.querySelector = mockQuerySelector
Element.prototype.classList.add = mockAdd
```

**Mock Fetch:**
```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({ message: "Success" }),
  })
)
```

**What to Mock:**
- IntersectionObserver (heavy setup, used in animations)
- Fetch calls (API routes, external services)
- DOM APIs (querySelector, classList, style mutations)
- Window methods (setTimeout, requestAnimationFrame)
- Environment variables (via jest.resetModules)

**What NOT to Mock:**
- Component rendering (use real React)
- Zod validation (test real schema logic)
- Next.js built-ins like Image, Link (Next.js test utilities handle these)
- User interaction handlers (test with fireEvent or userEvent)

## Fixtures and Factories

**Not currently in use** — no test data factories

**Recommended pattern for future tests:**

Contact Form Test Data Factory:
```typescript
// lib/test-fixtures.ts
export const validContactData = {
  name: "Test User",
  company: "Test Corp",
  email: "test@example.com",
  service: "Topografía con drones",
  message: "Necesito un levantamiento en la sierra",
}

export function createContactData(overrides = {}) {
  return { ...validContactData, ...overrides }
}
```

HTML Element Fixtures (for component tests):
```typescript
beforeEach(() => {
  document.body.innerHTML = `
    <div id="hero-video"></div>
    <div data-reveal></div>
    <form id="contact-form"></form>
  `
})
```

## Coverage

**Not enforced** — no coverage tooling configured

**Recommended baseline (if tests added):**
- Minimum 50% statement coverage for business logic
- 100% coverage for API routes (data validation critical)
- 80%+ coverage for form handlers (user-facing)
- Animation/DOM manipulation: test key interactions, not every pixel

**View Coverage (when framework added):**
```bash
npm run test -- --coverage
# or
npm run test:coverage
```

## Test Types

**No test types currently implemented**

**Recommended separation:**

**Unit Tests:**
- Scope: Single functions or utilities
- Examples: Zod schema validation, utility functions
- Framework: Jest/Vitest
- Approach: Fast, isolated, mock all dependencies

**Integration Tests:**
- Scope: Component + child components, or component + API
- Examples: Form submission with API call, IntersectionObserver triggers reveal
- Framework: Jest/Vitest + React Testing Library
- Approach: Render real components, mock only external services

**E2E Tests:**
- Scope: Full user flows (page load → form submit → success)
- Currently not used
- Framework: Playwright or Cypress (if added)
- Approach: Real browser, real API (staging environment)

## Common Patterns

**Async Testing (when framework added):**
```typescript
describe("submitForm", () => {
  it("sends data and shows success", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ message: "Success" }),
      })
    )
    
    const form = new FormData()
    form.append("name", "Juan")
    form.append("email", "juan@example.com")
    
    await submitForm(form)
    
    expect(fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    )
  })
})
```

**Error Testing:**
```typescript
it("handles fetch errors gracefully", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("Network error")))
  
  const result = await submitForm(formData)
  
  expect(result.error).toBe("Ocurrió un error. Inténtalo nuevamente.")
})
```

**DOM Event Testing:**
```typescript
it("toggles menu on button click", () => {
  const { getByRole } = render(<Experience />)
  const button = getByRole("button", { name: /menú/i })
  
  fireEvent.click(button)
  
  expect(button).toHaveClass("is-open")
})
```

**Animation Testing (IntersectionObserver):**
```typescript
it("adds is-visible class when element intersects", () => {
  const { container } = render(<Experience />)
  const element = container.querySelector("[data-reveal]")
  
  // Simulate intersection
  const observerCallback = IntersectionObserver.mock.calls[0][0]
  observerCallback([{ target: element, isIntersecting: true }])
  
  expect(element).toHaveClass("is-visible")
})
```

## Setup Configuration (When Adding Tests)

**Recommended next steps:**

1. Install test runner:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
# or
npm install --save-dev vitest @testing-library/react
```

2. Create `jest.config.ts` (or `vitest.config.ts`):
```typescript
import type { Config } from "jest"

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
} satisfies Config
```

3. Create `jest.setup.ts`:
```typescript
import "@testing-library/jest-dom"

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(callback) { this.callback = callback }
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

4. Add test scripts to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Current Quality Assurance Strategy

**Without tests, quality is maintained via:**
1. **TypeScript strict mode** (`"strict": true` in tsconfig.json)
   - Catches type errors at compile time
   - Required null/undefined checks

2. **ESLint rules** (Next.js core-web-vitals + TypeScript)
   - Enforces best practices
   - Run before commits with `npm run lint`

3. **Manual testing** (implied)
   - Form submission tested in browser
   - Animations visually verified
   - Accessibility checked with screen reader

4. **Code review** (implied)
   - Type signatures visible in PR diffs
   - Zod schemas enforce data contracts

**Recommendation:** Add Jest/Vitest + React Testing Library for critical paths:
- Contact form submission (API integration)
- Menu toggle state (interactive component)
- Reveal animations (IntersectionObserver logic)

---

*Testing analysis: 2026-07-18*
