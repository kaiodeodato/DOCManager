# Monorepo scaffolding (E0.01)

## Goal

Establish a Turborepo + npm workspaces monorepo so all apps and packages share TypeScript, ESLint, and Prettier configuration.

## Layout

```
apps/
  web/              # @ac/web — Next.js arrives in E0.02 (stub today)
  worker-ocr/       # @ac/worker-ocr — OCR/classify jobs (E3+)
  worker-notify/    # @ac/worker-notify — email/WhatsApp (E11)
packages/
  shared/           # @ac/shared — domain enums + Zod schemas (E0.03 / E0.04)
  ui/               # @ac/ui — design tokens (E0.05); primitives in UI0+
  db/               # @ac/db — package stub; SQL in supabase/migrations (E0.06 / E1)
supabase/
  migrations/       # Postgres migrations (Supabase CLI)
```

## Pipelines

Root scripts (via Turbo): `build`, `dev`, `lint`, `test`, `typecheck`.

Shared config:

- `tsconfig.base.json` — strict TS (`noUncheckedIndexedAccess`, etc.)
- `eslint.config.mjs` — flat ESLint + typescript-eslint
- `.prettierrc.json`

## Contracts

All domain enums and Zod schemas must live in `@ac/shared`. Apps must not redefine them.

## Validation

```bash
npm install
npm run build
npm run lint
npm run test
npm run typecheck
```
