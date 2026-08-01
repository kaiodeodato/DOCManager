# Database package + migrations (E0.06)

## Goal

Scaffold `@ac/db` documentation and the `supabase/migrations` folder so E1 SQL can land without restructuring.

## Layout

```
packages/db/
  README.md          # how to apply migrations
  src/index.ts       # PACKAGE_NAME export
supabase/
  README.md
  migrations/        # empty scaffold (.gitkeep) until E1
```

## Applying migrations

Documented in `packages/db/README.md`:

- Local: `npx supabase start` → `npx supabase db reset`
- Remote: `npx supabase db push`
- New file: `npx supabase migration new <name>`

## Notes

- Queue and search stay in Postgres (no Kafka / Elasticsearch).
- Multi-tenant via `org_id` + RLS (E1).
- `PACKAGE_NAME` (`@ac/db`) remains exportable for workspace smoke tests.

## Validation

```bash
npm run build -- --filter=@ac/db
npm run test -- --filter=@ac/db
```
