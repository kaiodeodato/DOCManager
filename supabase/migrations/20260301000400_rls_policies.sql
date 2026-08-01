-- E1.04 — RLS policies by org_id
alter table public.orgs enable row level security;
alter table public.org_members enable row level security;
alter table public.documents enable row level security;
alter table public.document_jobs enable row level security;
alter table public.document_extractions enable row level security;
alter table public.document_extractions_corrections enable row level security;
alter table public.document_tags enable row level security;
alter table public.audit_log enable row level security;
alter table public.tenant_taxonomy_config enable row level security;

-- orgs: members can select their orgs
create policy orgs_select_member on public.orgs
  for select to authenticated
  using (id in (select public.current_user_org_ids()));

create policy orgs_update_owner on public.orgs
  for update to authenticated
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = orgs.id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

-- org_members
create policy org_members_select on public.org_members
  for select to authenticated
  using (org_id in (select public.current_user_org_ids()));

create policy org_members_manage_owner on public.org_members
  for all to authenticated
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_members.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  )
  with check (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_members.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

-- generic org-scoped tables
create policy documents_org_isolation on public.documents
  for all to authenticated
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create policy document_jobs_org_isolation on public.document_jobs
  for all to authenticated
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create policy document_extractions_org_isolation on public.document_extractions
  for all to authenticated
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create policy document_extractions_corrections_org_isolation on public.document_extractions_corrections
  for all to authenticated
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create policy document_tags_org_isolation on public.document_tags
  for all to authenticated
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create policy audit_log_org_select on public.audit_log
  for select to authenticated
  using (org_id in (select public.current_user_org_ids()));

create policy taxonomy_org_isolation on public.tenant_taxonomy_config
  for all to authenticated
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));
