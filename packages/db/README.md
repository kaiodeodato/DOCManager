# @ac/db

Database contracts, RLS policy helpers, and Supabase `Database` types for DOC Manager.

## Layout

| Path | Role |
|------|------|
| `packages/db/src/database.types.ts` | `Database` placeholder / generated types |
| `packages/db/src/org-isolation.ts` | Pure-TS RLS membership simulation (E1.05) |
| `supabase/migrations/` | SQL source of truth (repo root) |

Schema ownership: **migrations are the source of truth**.

## Applying migrations

```bash
npx supabase start
npx supabase db reset
npx supabase db push
npx supabase migration new <descriptive_name>
```

## Generate types

```bash
npm run db:types
# → npx supabase gen types typescript --local > packages/db/src/database.types.ts
```

## Multi-tenant

All tenant tables include `org_id` + RLS. Workers may use service role only on the server — never in client bundles.

## Validation

```bash
npm run build -- --filter=@ac/db
npm run test -- --filter=@ac/db
```
