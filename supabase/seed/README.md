# Seed notes — orgs / org_members (E1.01) + isolation (E1.05)

Local/dev seed templates for multi-tenant setup. **Do not** run against production without review.

## Preconditions

1. Apply migrations: `npx supabase db reset` (or `db push` on a linked project).
2. Create two Auth users (Dashboard → Authentication, or `auth.users` via service role / Admin API).
3. Capture their UUIDs as `USER_A` and `USER_B`.

## Minimal seed SQL

```sql
insert into public.orgs (id, name) values
  ('11111111-1111-1111-1111-111111111111', 'Acme Contabilidade'),
  ('22222222-2222-2222-2222-222222222222', 'Beta Escritorio')
on conflict (id) do nothing;

-- Replace USER_* with real auth.users ids
insert into public.org_members (org_id, user_id, role) values
  ('11111111-1111-1111-1111-111111111111', '<USER_A>', 'owner'),
  ('22222222-2222-2222-2222-222222222222', '<USER_B>', 'accountant')
on conflict (org_id, user_id) do nothing;

insert into public.documents (org_id, storage_path, original_filename, mime_type, status)
values
  ('11111111-1111-1111-1111-111111111111', 'org-a/doc.pdf', 'doc.pdf', 'application/pdf', 'received'),
  ('22222222-2222-2222-2222-222222222222', 'org-b/doc.pdf', 'doc.pdf', 'application/pdf', 'received');
```

## Roles allowed

`org_members.role` check constraint: `owner` | `accountant` | `viewer` (see `@ac/shared` `UserRole`).

## Isolation verification

- **CI / offline:** `packages/db` org-isolation unit tests simulate RLS membership checks.
- **With local Postgres:** `supabase/tests/tenant_isolation.sql` after seeding (see Doc/architecture/tenant-isolation.md).

## Security

Use the **service role** only in controlled seed scripts / workers — never ship service-role keys to the browser.
