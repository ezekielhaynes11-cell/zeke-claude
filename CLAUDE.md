# CLAUDE.md

## Project Overview

**Forthner's Body Shop** — a Next.js 16 marketing website for a collision repair business in Heidelberg, Mississippi. Single-page landing site with service showcase, company heritage, and a contact form for customer lead capture.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19.2.3
- **Styling:** Tailwind CSS 4 with PostCSS
- **Fonts:** Inter (body), Oswald (display) via Google Fonts
- **Package Manager:** npm
- **Node:** ^20

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (metadata, fonts, global styles)
│   ├── page.tsx            # Home page — composes all sections
│   ├── globals.css         # Tailwind imports, CSS variables, custom styles
│   └── favicon.ico
└── components/
    ├── Navbar.tsx           # Fixed nav with mobile menu toggle ("use client")
    ├── Hero.tsx             # Full-screen hero with stats and CTAs
    ├── ServiceGrid.tsx      # 3-column service cards with expandable details
    ├── HeritageBox.tsx      # Company history and credentials
    ├── LegacyRecoveryAudit.tsx  # Status display for resolved issues
    ├── DigitalDispatch.tsx  # Contact form with 6 fields ("use client")
    └── Footer.tsx           # 4-column footer
public/                      # Static assets (SVGs)
```

## Commands

```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Run ESLint (Next.js core-web-vitals + TypeScript rules)
```

## Path Aliases

`@/*` maps to `./src/*` — use `@/components/Foo` for imports.

## Architecture Conventions

- **App Router only** — no Pages Router. All routes live under `src/app/`.
- **Server components by default** — only add `"use client"` when the component needs hooks or browser APIs.
- **Component files:** PascalCase `.tsx` files in `src/components/`.
- **No external UI libraries** — components are built from scratch with Tailwind utility classes.
- **Functional components only** — no class components.
- **Data-driven rendering** — components like `ServiceGrid` map over inline data arrays.

## Styling

- Tailwind CSS 4 utility classes for all styling.
- Custom CSS variables defined in `globals.css`:
  - `--gunmetal: #2C3E50` (primary)
  - `--safety-red: #E74C3C` (accent)
  - `--deep-ebony: #1a1a1a` (background)
  - `--silver: #bdc3c7` (text)
  - `--slate: #34495e`, `--charcoal: #2d2d2d` (secondary)
- Dark theme throughout — white/silver text on dark backgrounds.
- Mobile-first responsive design using Tailwind breakpoints (`sm:`, `md:`, `lg:`).

## Linting

- ESLint 9 with flat config (`eslint.config.mjs`).
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Ignored paths: `.next/`, `out/`, `build/`, `next-env.d.ts`.
- No Prettier configured.

## TypeScript

- Strict mode enabled.
- Target: ES2017.
- Module resolution: `bundler`.
- Incremental compilation enabled.

## Current Limitations

- **No testing framework** — no Jest, Vitest, or other test setup exists.
- **No CI/CD** — no GitHub Actions or other pipelines.
- **No backend** — form submissions log to console only (no API integration).
- **No environment variables** — all config is hardcoded.
- **No database** — static frontend only.

## Key Patterns for AI Assistants

1. Always run `npm run lint` after changes to catch issues.
2. Run `npm run build` to verify the production build succeeds.
3. Use `@/` path alias for all imports from `src/`.
4. Keep components in `src/components/` with PascalCase naming.
5. Default to server components; only use `"use client"` when state or browser APIs are needed.
6. Follow the existing Tailwind-only styling approach — no inline styles or CSS modules.
7. Maintain the dark theme color palette defined in `globals.css`.
