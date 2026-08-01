-- E1.01 — orgs and org_members (multi-tenant foundation)
create extension if not exists "pgcrypto";

create table if not exists public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'accountant', 'viewer')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create index if not exists org_members_user_id_idx on public.org_members (user_id);
create index if not exists org_members_org_id_idx on public.org_members (org_id);

comment on table public.orgs is 'Tenant organizations';
comment on table public.org_members is 'Membership and role per user within an org';
