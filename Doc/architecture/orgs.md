# E1.01 — orgs and org_members

## Goal

Multi-tenant foundation: every tenant is an `orgs` row; users join via `org_members` with a role.

## Migration

`supabase/migrations/20260301000100_orgs_and_members.sql`

| Table | Purpose |
|-------|---------|
| `orgs` | Tenant organizations (`id`, `name`, timestamps) |
| `org_members` | `(org_id, user_id)` unique membership + `role` |

Roles: `owner` | `accountant` | `viewer` (aligned with `@ac/shared` `UserRole`).

## Seed

See [supabase/seed/README.md](../../supabase/seed/README.md) for local two-org seed notes used by isolation tests.

## Apply

```bash
npx supabase db reset   # local
npx supabase db push    # linked remote
```

## Validation

- Migration applies without error.
- Indexes `org_members_user_id_idx` / `org_members_org_id_idx` exist.
