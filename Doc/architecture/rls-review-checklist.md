# E14.02 — RLS review checklist (post-features)

## Goal

Confirm tenant isolation still holds after E2–E14 features (share, GDPR, search, taxonomy, audit).

## Migration sources

- `supabase/migrations/20260301000300_auth_helpers.sql`
- `supabase/migrations/20260301000400_rls_policies.sql`
- `supabase/migrations/20260301000600_audit_triggers.sql`

## Checklist

- [x] RLS enabled on all tenant tables (`orgs`, `org_members`, `documents`, `document_jobs`, extractions, corrections, tags, `audit_log`, `tenant_taxonomy_config`)
- [x] `current_user_org_ids()` is `security definer` and granted to `authenticated` only
- [x] No `anon` policies on tenant tables
- [x] `audit_log` is select-only for members (writes via triggers / service role)
- [x] Share links use **signed URLs** (Storage), not RLS bypass from the browser
- [x] GDPR export/anonymize is **owner-gated** in BFF (`RoleCapability.ExportGdpr`) and still scoped by `org_id`
- [ ] Staging smoke: two users in different orgs cannot `select` each other’s documents
- [ ] Staging smoke: viewer JWT cannot insert into `documents`
- [ ] Confirm `service_role` key never ships in client bundles
- [ ] Confirm Realtime channels (if enabled) filter by `org_id`

## Out of scope

Cross-org platform admin, column-level ACLs, public anonymous browse.
