# Project architecture

## System context

`antunesluis.com.br` is a personal blog and portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Drizzle ORM, and SQLite. It has public content pages and an authenticated administrative area for managing posts, projects, and uploaded images.

## Main boundaries

- `src/app/`: App Router pages, layouts, route groups, metadata endpoints, and error boundaries.
- `src/features/`: feature modules for about, admin, authentication, blog, projects, and uploads.
- `src/components/`: shared layout, SEO, and UI components.
- `src/lib/`: shared authentication, metadata, and utility code.
- `src/db/drizzle/`: database connection, schema, migrations, and seed entrypoint.
- `src/config/`: stable application constants and navigation configuration.
- `src/proxy.ts`: JWT cookie validation and protection for `/admin/*` routes.

## Request and data flow

- Public routes under `src/app/(public)/` use feature-level public queries and components.
- Administrative routes under `src/app/(admin)/` use authenticated layouts, server actions, and administrative queries.
- Server actions live under `src/features/*/actions/` and coordinate validation, repositories, cache invalidation, and user-facing results.
- Database access is isolated behind repository interfaces and their Drizzle or JSON implementations in `src/features/*/repositories/`.
- Models represent domain data, DTOs define cross-boundary shapes, and `lib/validation.ts` files hold feature-level Zod schemas.
- Shared authentication in `src/lib/auth/` handles password hashing, JWT sessions, login state, and cookies.

## External and public contracts

- Giscus provides blog comments through public repository and category identifiers.
- Image upload behavior depends on a configured local directory and public image server URL.
- SEO contracts include metadata, JSON-LD components, sitemap, and robots output.
- Environment variables are documented in `.env.local-example` and `README.md`.

## Evolution rules

- Preserve the feature-based architecture and repository boundary before introducing new abstractions.
- Do not call Drizzle directly outside repository implementations.
- Treat authentication, database schema, migrations, public URLs, metadata shapes, and environment variables as contract-bearing changes.
- Record a decision here when it becomes stable across multiple features. Keep feature-specific decisions in the corresponding `docs/features/<slug>/PLAN.md`.
- Keep operational commands and coding standards in `docs/conventions.md`.
