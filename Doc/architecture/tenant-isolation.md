# E1.05 — Tenant isolation tests

## Goal

Prove tenant A never reads/writes tenant B data.

## Layers

| Layer | When | Where |
|-------|------|--------|
| **Policy unit tests (CI)** | Always | `@ac/db` `org-isolation` — simulates `current_user_org_ids()` + USING/WITH CHECK |
| **SQL script** | Local Supabase up | `supabase/tests/tenant_isolation.sql` |
| **Seed** | Local/dev | `supabase/seed/README.md` |

## Unit test coverage

- User A accessible orgs = `[ORG_A]` only
- `canAccessOrgRow(ORG_B)` false for A
- Insert WITH CHECK to foreign org denied
- Owner manage limited to own org

```bash
npm run test -- --filter=@ac/db
```

## Full DB isolation (optional)

```bash
npx supabase start
npx supabase db reset
# seed auth.users + org_members + documents (seed README)
psql "$DATABASE_URL" -f supabase/tests/tenant_isolation.sql
```

Documented blocker if Docker/Supabase CLI unavailable: CI still green via TS policy simulation.
