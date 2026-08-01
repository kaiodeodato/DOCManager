-- E1.03 helper: current user's org memberships via JWT claim or org_members lookup
-- Prefer claim `org_id` when present; policies also allow membership table fallback.

create or replace function public.current_user_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select om.org_id
  from public.org_members om
  where om.user_id = auth.uid();
$$;

revoke all on function public.current_user_org_ids() from public;
grant execute on function public.current_user_org_ids() to authenticated;
