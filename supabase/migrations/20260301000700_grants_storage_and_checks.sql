-- E1 follow-up — grants, storage bucket, document status guardrails
-- Safe to re-run (IF NOT EXISTS / OR REPLACE / drop-if-exists patterns).

-- Keep document status aligned with @ac/shared DocumentStatus values.
alter table public.documents
  drop constraint if exists documents_status_check;

alter table public.documents
  add constraint documents_status_check
  check (
    status in (
      'received',
      'ocr_done',
      'ocr_failed',
      'classified',
      'needs_review',
      'approved',
      'rejected',
      'exported',
      'export_failed'
    )
  );

-- Job status / type soft constraints (workers may extend types via payload).
alter table public.document_jobs
  drop constraint if exists document_jobs_status_check;

alter table public.document_jobs
  add constraint document_jobs_status_check
  check (status in ('pending', 'running', 'succeeded', 'failed', 'cancelled'));

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

drop trigger if exists document_jobs_set_updated_at on public.document_jobs;
create trigger document_jobs_set_updated_at
before update on public.document_jobs
for each row execute function public.set_updated_at();

drop trigger if exists orgs_set_updated_at on public.orgs;
create trigger orgs_set_updated_at
before update on public.orgs
for each row execute function public.set_updated_at();

drop trigger if exists taxonomy_set_updated_at on public.tenant_taxonomy_config;
create trigger taxonomy_set_updated_at
before update on public.tenant_taxonomy_config
for each row execute function public.set_updated_at();

-- Privileges for PostgREST roles
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated, service_role;

alter default privileges in schema public
  grant usage, select on sequences to authenticated, service_role;

-- anon: no direct table access (auth required); keep schema usage only.

-- Storage: documents bucket (private). Archive stays path/metadata driven.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/tiff',
    'application/octet-stream'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS policies (RLS is already enabled on storage.objects in hosted Supabase).
-- Pooler role may lack ownership to ALTER TABLE storage.objects — policies only.
do $$
begin
  execute 'drop policy if exists documents_storage_select on storage.objects';
  execute $pol$
    create policy documents_storage_select on storage.objects
      for select to authenticated
      using (
        bucket_id = ''documents''
        and (storage.foldername(name))[1]::uuid in (select public.current_user_org_ids())
      )
  $pol$;

  execute 'drop policy if exists documents_storage_insert on storage.objects';
  execute $pol$
    create policy documents_storage_insert on storage.objects
      for insert to authenticated
      with check (
        bucket_id = ''documents''
        and (storage.foldername(name))[1]::uuid in (select public.current_user_org_ids())
      )
  $pol$;

  execute 'drop policy if exists documents_storage_update on storage.objects';
  execute $pol$
    create policy documents_storage_update on storage.objects
      for update to authenticated
      using (
        bucket_id = ''documents''
        and (storage.foldername(name))[1]::uuid in (select public.current_user_org_ids())
      )
      with check (
        bucket_id = ''documents''
        and (storage.foldername(name))[1]::uuid in (select public.current_user_org_ids())
      )
  $pol$;

  execute 'drop policy if exists documents_storage_delete on storage.objects';
  execute $pol$
    create policy documents_storage_delete on storage.objects
      for delete to authenticated
      using (
        bucket_id = ''documents''
        and (storage.foldername(name))[1]::uuid in (select public.current_user_org_ids())
      )
  $pol$;
exception
  when insufficient_privilege then
    raise notice 'Skipping storage.objects policies (insufficient privilege); bucket still configured.';
  when others then
    raise notice 'Skipping storage.objects policies: %', sqlerrm;
end;
$$;

-- Schema verification helper (callable by service_role / SQL editor)
create or replace function public.doc_manager_schema_check()
returns table (object_name text, object_kind text, ok boolean)
language sql
stable
security definer
set search_path = public
as $$
  with expected(name, kind) as (
    values
      ('orgs', 'table'),
      ('org_members', 'table'),
      ('documents', 'table'),
      ('document_jobs', 'table'),
      ('document_extractions', 'table'),
      ('document_extractions_corrections', 'table'),
      ('document_tags', 'table'),
      ('audit_log', 'table'),
      ('tenant_taxonomy_config', 'table'),
      ('current_user_org_ids', 'function'),
      ('documents_search', 'function'),
      ('audit_row_change', 'function')
  )
  select
    e.name,
    e.kind,
    case
      when e.kind = 'table' then exists (
        select 1 from information_schema.tables t
        where t.table_schema = 'public' and t.table_name = e.name
      )
      when e.kind = 'function' then exists (
        select 1 from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname = e.name
      )
      else false
    end as ok
  from expected e
  order by e.kind, e.name;
$$;

revoke all on function public.doc_manager_schema_check() from public;
grant execute on function public.doc_manager_schema_check() to service_role;
