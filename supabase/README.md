# Supabase

SQL migrations for DOC Manager live in `migrations/`.

See `packages/db/README.md` and `Doc/architecture/` for apply instructions, RLS, and types.

## Layout

| Path | Role |
|------|------|
| `migrations/` | E1+ SQL (orgs, domain, auth helpers, RLS, FTS, audit, grants/storage) |
| `config.toml` | Local Supabase CLI config |
| `seed/README.md` | Local multi-tenant seed notes |
| `tests/tenant_isolation.sql` | Optional full DB isolation script |

## Expected public tables

`orgs`, `org_members`, `documents`, `document_jobs`, `document_extractions`, `document_extractions_corrections`, `document_tags`, `audit_log`, `tenant_taxonomy_config`

Plus: `documents.search_vector` (FTS), `storage.buckets` id `documents`, RLS on all tenant tables.

## Apply to remote project

1. Put credentials in `.env` (never commit):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=postgresql://postgres.YOUR_REF:PASSWORD@HOST:6543/postgres?sslmode=require
```

Or set `SUPABASE_DB_PASSWORD` (+ optional `SUPABASE_DB_HOST` if the default pooler host is wrong).

2. Install driver and apply:

```bash
pip install "psycopg[binary]"
python scripts/supabase_apply_migrations.py
python scripts/supabase_apply_migrations.py --verify-only
```

## Local

```bash
npx supabase start
npx supabase db reset
```
