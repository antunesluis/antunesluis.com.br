# Agent Guidelines for antunesluis.com.br

## Delivery workflow

- Read `docs/architecture.md` and `docs/conventions.md` before planning or changing code.
- Keep each work item persistently documented in `docs/features/<slug>/`.
- Use workflow skills only when explicitly invoked by the user. The main agent owns the conversation, approvals, artifact writes, and code changes.
- Never implement without an approved `PLAN.md`. For a complete flow, also require an approved `PRD.md`.
- Treat approval as valid only after an unambiguous user statement and record its source in the artifact. Never infer approval.
- A material product, scope, architecture, contract, migration, or risk change invalidates the applicable approval. Corrections already covered by the plan do not require a new approval.
- When present, `TASKS.md` is the only operational task ledger. In a quick flow, keep the single task in `PLAN.md`.
- Require a final review before recommending merge. Residual risks require an explicit user decision.
- The `reviewer` agent is read-only. It returns findings to the main agent and never writes code or reports.
- Do not create parallel status, implementation, test-plan, QA, audit, or merge-description artifacts.

## Project
Personal blog/portfolio using Next.js 16, React 19, TypeScript, Tailwind CSS v4, Drizzle ORM, and SQLite.

## Commands

```bash
npm run dev        # Dev server with Turbopack
npm test           # Node test suite executed through tsx
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint (also checks types via next/typescript)
npm run migrate    # Drizzle Kit migrations (schema: src/db/drizzle/schemas.ts)

# No separate typecheck. Type errors surface during the Next.js build.
```

For seeding: `npm run seed` runs `tsx src/db/drizzle/seed.ts`.

## Architecture

### Request flow (not obvious from filenames)

- `src/proxy.ts` is the auth middleware. It exports `proxy` (not `middleware`) and guards `/admin/*` routes using JWT from cookies. There is no `src/middleware.ts`.
- Server actions live under `features/*/actions/`, suffixed with `Action` (e.g. `create-post-action.ts`).
- Database access uses the repository pattern: `features/*/repositories/`. Do NOT call Drizzle queries directly outside repositories.

### Key directories

```
src/
├── app/                # Next.js App Router (route groups: (admin), (public))
├── components/
│   ├── layout/         # Header, Footer, Container
│   ├── seo/            # SEO metadata components
│   └── ui/             # Reusable UI primitives (Button, InputText, etc.)
├── config/             # App constants (constants.ts, navigation.ts)
├── db/drizzle/         # Drizzle config, schemas, migrations, seed
├── features/
│   ├── about/          # About page feature
│   ├── admin/          # Admin dashboard feature
│   ├── auth/           # Login action + components
│   ├── blog/           # Posts: actions, components, dto, lib, models, repositories
│   ├── projects/       # Projects: same structure as blog
│   └── upload/         # Image upload feature
├── lib/
│   ├── auth/           # JWT sign/verify, password hashing, session management
│   ├── metadata.ts     # Shared SEO/metadata helpers
│   └── utils/          # Zod error helpers, slug generation, etc.
└── proxy.ts            # Admin route guard (JWT cookie check)
```

## Conventions

### Formatting (Prettier, `.prettierrc.json`)
- Single quotes everywhere (JSX and regular)
- Semicolons: **yes** (`"semi": true`)
- Trailing commas: all
- Print width: 80, tab width: 2 spaces, `arrowParens: avoid`

### Naming
- Files: kebab-case (`create-post-action.ts`)
- Components: PascalCase (`Button.tsx`)
- Server actions: suffix with `Action` (`createPostAction`)
- Route groups: parenthesized kebab-case `(admin)`, `(public)`

### React/Next.js
- Default to Server Components; `'use client'` only when needed
- Server actions return `{ formState, errors[], success? }` shaped objects
- Validate inputs with Zod; catch errors and return user-friendly messages

### CSS
- Tailwind utilities only; no custom CSS files (except `globals.css` for tokens)
- Use `clsx` for conditional classes
- Dark mode via `dark:` variant, themes via `next-themes`

### Database
- Schemas: `src/db/drizzle/schemas.ts`
- Migrations: `src/db/drizzle/migrations/`
- SQLite file: `db.sqlite3` (git-ignored)

## Environment Variables
Copy `.env.local-example` to `.env.local`. Required authentication variables:
`JWT_SECRET_KEY`, `LOGIN_USER`, `LOGIN_PASS` (base64-encoded bcrypt hash),
`LOGIN_EXPIRATION_SECONDS`, `LOGIN_COOKIE_NAME`, and `ALLOW_LOGIN`. The example
also documents optional Giscus and image upload settings.

## Notes
- `drizzle-kit migrate` reads `drizzle.config.js` (not ts); dialect is `sqlite`, db URL is `./db.sqlite3`
- The image upload server action writes to the configured `uploads/` directory (git-ignored)
- GitHub Actions CI runs install, tests, lint, schema preparation, and
  production build from `.github/workflows/ci.yml`
