-- E1.02 — core domain tables (all with org_id for RLS)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  status text not null default 'received',
  document_type text,
  cost_center text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  document_id uuid references public.documents (id) on delete cascade,
  type text not null,
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  attempts int not null default 0,
  last_error text,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_extractions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  document_id uuid not null references public.documents (id) on delete cascade,
  job_id uuid references public.document_jobs (id) on delete set null,
  raw_text text,
  result jsonb not null default '{}'::jsonb,
  confidence numeric(5,4),
  created_at timestamptz not null default now()
);

create table if not exists public.document_extractions_corrections (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  document_id uuid not null references public.documents (id) on delete cascade,
  extraction_id uuid references public.document_extractions (id) on delete set null,
  corrected_by uuid references auth.users (id),
  original jsonb not null default '{}'::jsonb,
  corrected jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.document_tags (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  document_id uuid not null references public.documents (id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  unique (document_id, tag)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid,
  actor_id uuid,
  table_name text not null,
  record_id uuid,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_taxonomy_config (
  org_id uuid primary key references public.orgs (id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists documents_org_id_idx on public.documents (org_id);
create index if not exists documents_status_idx on public.documents (org_id, status);
create index if not exists document_jobs_pending_idx on public.document_jobs (status, type, created_at);
create index if not exists document_extractions_document_id_idx on public.document_extractions (document_id);
create index if not exists document_tags_org_id_idx on public.document_tags (org_id);
create index if not exists audit_log_org_id_idx on public.audit_log (org_id, created_at desc);
