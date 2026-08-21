# Project conventions

## Commands

```bash
npm run dev
npm test
npm run lint
npm run build
npm run start
npm run migrate
npm run seed
```

- `npm run lint` runs ESLint for the repository.
- `npm test` runs the TypeScript and React suite once through Vitest.
- Vitest uses Node by default and jsdom only in React tests that opt in.
- `npm run build` performs the production Next.js build, including TypeScript validation.
- There is no separate typecheck script. Type errors surface during the build.
- `npm run migrate` applies Drizzle migrations using `drizzle.config.js` and `src/db/drizzle/schemas.ts`.
- `npm run seed` runs `tsx src/db/drizzle/seed.ts`.
- CI runs `npm ci`, tests, lint, `npx drizzle-kit push`, and the production
  build.

## Formatting and naming

- Follow `.prettierrc.json`: single quotes, semicolons, trailing commas, 80-column print width, and two-space indentation.
- Use kebab-case for ordinary files and PascalCase for React component files.
- Suffix server action functions with `Action`.
- Keep route groups parenthesized and kebab-case, such as `(admin)` and `(public)`.
- Use the `@/*` alias for imports rooted at `src/` when it improves clarity.

## React and Next.js

- Default to Server Components. Use client components only for browser APIs, local state, effects, or interactive handlers.
- Keep server actions under the owning feature and return structured form state, error messages, and success state where applicable.
- Validate external input with Zod and convert failures to user-friendly messages.
- Keep reusable primitives in `src/components/ui/` and feature-specific components in their feature module.

## Styling and data

- Prefer Tailwind utilities. Keep global tokens and unavoidable global rules in `src/app/globals.css`.
- Use `clsx` for conditional classes and `dark:` variants with `next-themes` for theming.
- Update Drizzle schema and migrations deliberately. Do not edit generated migration metadata by hand unless the migration tool requires a reviewed repair.
- `db.sqlite3`, `.env.local`, uploads, `.next`, and build output are local or generated state and must not be committed.

## Workflow artifacts

- Use stable kebab-case slugs under `docs/features/<slug>/`.
- Record approval state and source in `PRD.md` and `PLAN.md`.
- Use `TASK-001`, `TASK-002`, and subsequent IDs in `TASKS.md`.
- Record concise implementation and validation evidence in the applicable task.
- Keep selective task reviews in `reviews/TASK-<id>.md`. Use `REVIEW.md` for quick or standard final review and `reviews/FINAL.md` for complete final review.
