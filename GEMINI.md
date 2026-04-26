# MUSYNC Project — Antigravity Configuration

## Project Identity
MUSYNC is a **music networking SaaS platform** (the "Digital Backstage") built with:
- **Frontend**: Next.js 14 App Router + TypeScript + Vanilla CSS (Nocturne Pro design system)
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Auth**: JWT-based (upgrading to Clerk)
- **Design**: Nocturne Pro / Studio Obsidian design system (Stitch-sourced tokens)
- **Dev server**: `npm run dev` (frontend on :3000), `npm start` (backend on :5000)

---

## Mandatory Skills — Always Apply

These skills MUST be read and applied on **every** coding task in this project:

### Frontend Tasks
- **`@nextjs-best-practices`** — App Router, Server Components, data fetching patterns
- **`@react-patterns`** — Modern hooks, composition, memoization, TypeScript
- **`@frontend-design`** — Premium UI design decisions, not just layout generation
- **`@design-spells`** — Micro-interactions, hover effects, animation polish
- **`@react-component-performance`** — Diagnose slow renders before shipping

### Design & Styling
- **`@ui-skills`** — Opinionated design constraints for all UI work
- **`@animejs-animation`** — For any animation or transition work
- **`@mobile-design`** — Mobile-first, touch-first for all responsive work

### Backend Tasks
- **`@backend-architect`** — Scalable API design, route structure, middleware
- **`@api-patterns`** — REST patterns, response formats, error handling
- **`@database-design`** — MongoDB schema design, indexing strategy

### Debugging
- **`@systematic-debugging`** — Always use BEFORE proposing any fix
- **`@debugger`** — For errors, test failures, unexpected behavior

### Code Quality
- **`@code-reviewer`** — Apply code review standards to all changes
- **`@vibe-code-auditor`** — Catch fragility and production risks in generated code

---

## Design System Rules (Non-Negotiable)

1. **Never use plain/generic colors** — always use Nocturne Pro tokens from `src/design-system/tokens/colors.ts`
2. **Typography**: Use Inter (primary), Outfit (display) — already loaded via Google Fonts in `layout.tsx`
3. **No TailwindCSS** — Vanilla CSS only, using design token CSS variables
4. **Dark mode first** — Background `#0A0A0F` (space-black), surfaces `#12121A`
5. **Glassmorphism** — `backdrop-filter: blur(20px)` on cards, modals, overlays
6. **Animations** — All interactive elements need hover transitions (`transition: all 0.2s ease`)
7. **Border radius**: `8px` (small), `12px` (medium), `16px` (large), `24px` (card)

---

## Architecture Rules

### File Structure
```
frontend/src/
  app/              ← Next.js App Router pages (Server Components by default)
  components/
    ui/             ← Primitive components (Button, Badge, Input, etc.)
    layout/         ← Layout components (Topbar, Sidebar, etc.)
  design-system/
    components/     ← Design system components (ArtistCard, StatBlock, etc.)
    tokens/         ← Design tokens (colors, typography, spacing)
  context/          ← React Context providers
  lib/              ← Utility functions, API clients
```

### Component Rules
- Use `'use client'` directive ONLY when needed (interactivity, hooks, browser APIs)
- Default to Server Components for data fetching
- All components must be TypeScript with explicit prop interfaces
- Export components as named exports (not default)

### API Rules
- Backend base URL: `process.env.NEXT_PUBLIC_API_URL` (never hardcode localhost)
- All API calls go through `src/lib/api.ts`
- Always handle loading, error, and empty states

---

## Aesthetic Standards (Premium SaaS)

Every UI must pass this checklist before being considered done:
- [ ] Uses Nocturne Pro color tokens (no raw hex unless it's a token value)
- [ ] Has hover/focus states on all interactive elements
- [ ] Has smooth CSS transitions (min 200ms)
- [ ] Is responsive (mobile breakpoint: 768px, tablet: 1024px)
- [ ] Has loading skeleton or spinner for async data
- [ ] Has empty state UI when no data
- [ ] Has error state UI for failed requests
- [ ] Glassmorphism applied to cards/modals (not just flat backgrounds)
- [ ] Typography hierarchy is clear (H1 > H2 > body > caption)

---

## Workflow Rules

1. **Research before coding** — check existing components in `src/design-system/` and `src/components/` before creating new ones
2. **Never duplicate components** — reuse existing design system components
3. **Run dev servers first** — assume `npm run dev` (:3000) and `npm start` (:5000) are running
4. **Plan complex changes** — use implementation plan for multi-file refactors
5. **Test in browser** — use browser subagent to verify UI changes visually

---

## Skill Activation Triggers

| When the user asks about... | Auto-activate skill |
|---|---|
| Any UI component or page | `@frontend-design` + `@react-patterns` |
| Animation, transition, motion | `@animejs-animation` + `@design-spells` |
| API endpoint or backend logic | `@backend-architect` + `@api-patterns` |
| Database schema or queries | `@database-design` |
| A bug or unexpected behavior | `@systematic-debugging` |
| Performance issues | `@react-component-performance` + `@performance-profiling` |
| Auth flows | `@clerk-auth` |
| Deployment | `@vercel-deployment` |
| Code review | `@code-reviewer` + `@vibe-code-auditor` |
| Design system tokens | `@design-md` + `@ui-tokens` |
