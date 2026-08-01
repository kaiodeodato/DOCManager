# Tenant taxonomy (E6)

## Goal

Per-org `tenant_taxonomy_config` drives classify prompts and virtual archive metadata. Storage objects are never moved.

## Surfaces

- Table: `tenant_taxonomy_config` (E1.02)
- API: `GET/PUT /api/taxonomy?orgId=`
- UI: `/settings/taxonomy`
- Prompt injection: `buildClassifyPrompt({ taxonomy })`
- Immutability helper: `assertTaxonomyChangeLeavesDocumentsIntact`

## Rule (E6.04)

Updating taxonomy **must not** rewrite existing documents' `documentType` / tags / cost center. Only future classify jobs see the new config.
