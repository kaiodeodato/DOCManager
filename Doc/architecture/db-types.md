# E1.06 — Generated Database types (`@ac/db`)

## Goal

TypeScript `Database` interface for Supabase clients, owned by `@ac/db`.

## Files

| Path | Role |
|------|------|
| `packages/db/src/database.types.ts` | Placeholder (matches E1 migrations) until CLI gen |
| `packages/db/src/index.ts` | Re-exports `Database`, `Json`, `Tables` |
| Root `npm run db:types` | Runs `scripts/db-types.mjs` |

## Generate

```bash
# Local stack
npx supabase start
npm run db:types

# Equivalent manual command
npx supabase gen types typescript --local > packages/db/src/database.types.ts

# Linked remote
npx supabase gen types typescript --project-id <PROJECT_REF> > packages/db/src/database.types.ts
# or: npm run db:types -- --linked   (requires SUPABASE_PROJECT_ID)
```

If CLI/DB is unavailable, `db:types` exits 0 and keeps the placeholder so CI remains unblocked.

## Note on ticket wording

Jira E1.06 mentions `@ac/shared`; generated Supabase schema types live in **`@ac/db`**. Domain enums/Zod stay in `@ac/shared`.
