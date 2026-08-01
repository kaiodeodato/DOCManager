-- E1.05 — full DB tenant isolation check (run when Supabase local is up)
-- Usage:
--   npx supabase start
--   npx supabase db reset
--   psql "$DATABASE_URL" -f supabase/tests/tenant_isolation.sql
--
-- This script is intentionally documentation-first: replace USER_A / USER_B
-- with real auth.users ids from your seed before expecting assertions to pass.

-- Preconditions: two orgs + memberships (see supabase/seed/README.md)

-- Example assertions (uncomment after seeding auth.users + org_members):
--
-- set local role authenticated;
-- set local request.jwt.claim.sub = '<USER_A_UUID>';
-- select count(*) = 0 as ok_a_cannot_see_b_docs
-- from public.documents
-- where org_id = '22222222-2222-2222-2222-222222222222';
--
-- set local request.jwt.claim.sub = '<USER_B_UUID>';
-- select count(*) = 0 as ok_b_cannot_see_a_docs
-- from public.documents
-- where org_id = '11111111-1111-1111-1111-111111111111';

select 'tenant_isolation.sql ready — enable assertions after seed auth.users exist' as status;
