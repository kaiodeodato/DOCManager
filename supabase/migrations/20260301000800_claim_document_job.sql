-- Atomic worker claim. Only service_role may execute this exposed RPC.
create or replace function public.claim_document_job(p_types text[])
returns setof public.document_jobs
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  claimed_id uuid;
begin
  select id
    into claimed_id
  from public.document_jobs
  where status = 'pending'
    and type = any(p_types)
  order by created_at
  for update skip locked
  limit 1;

  if claimed_id is null then
    return;
  end if;

  return query
    update public.document_jobs
    set
      status = 'running',
      locked_at = now(),
      attempts = attempts + 1
    where id = claimed_id
    returning *;
end;
$$;

revoke all on function public.claim_document_job(text[]) from public, anon, authenticated;
grant execute on function public.claim_document_job(text[]) to service_role;
