# E1.04 — RLS by org_id checklist

## Goal

Authenticated queries only see / mutate rows for orgs the user belongs to.

## Migration

`supabase/migrations/20260301000400_rls_policies.sql` (+ helper `20260301000300_auth_helpers.sql`).

## Checklist

- [x] RLS enabled on `orgs`, `org_members`, `documents`, `document_jobs`, `document_extractions`, `document_extractions_corrections`, `document_tags`, `audit_log`, `tenant_taxonomy_config`
- [x] Helper `public.current_user_org_ids()` `security definer`, execute granted to `authenticated`
- [x] `orgs`: select for members; update for `owner`
- [x] `org_members`: select for members; manage (`all`) for `owner`
- [x] Org-scoped tables: `using` + `with check` via `org_id in (select current_user_org_ids())`
- [x] `audit_log`: select-only for members (no client insert policy — workers/service role write)
- [ ] Manual smoke with two seeded users (see E1.05) when local Supabase is up
- [ ] Confirm no policy grants to `anon` on tenant tables
- [ ] Confirm service role bypass is never used from browser bundles

## Policy inventory

| Table | Policies |
|-------|----------|
| orgs | `orgs_select_member`, `orgs_update_owner` |
| org_members | `org_members_select`, `org_members_manage_owner` |
| documents | `documents_org_isolation` |
| document_jobs | `document_jobs_org_isolation` |
| document_extractions | `document_extractions_org_isolation` |
| document_extractions_corrections | `document_extractions_corrections_org_isolation` |
| document_tags | `document_tags_org_isolation` |
| audit_log | `audit_log_org_select` |
| tenant_taxonomy_config | `taxonomy_org_isolation` |

## Out of scope

Fine-grained column ACLs, share-links (later etapa), cross-org admin superuser.
