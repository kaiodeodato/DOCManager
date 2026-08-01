# E1.02 — domain tables

## Goal

Core document domain schema, every tenant table carrying `org_id` for RLS.

## Migration

`supabase/migrations/20260301000200_domain_tables.sql`

| Table | Notes |
|-------|--------|
| `documents` | Storage path, mime, status, type, cost center |
| `document_jobs` | Postgres queue rows (`type`, `status`, `payload`, attempts) |
| `document_extractions` | OCR / AI result + confidence |
| `document_extractions_corrections` | Human correction trail |
| `document_tags` | Unique `(document_id, tag)` |
| `audit_log` | Optional `org_id`; append-oriented |
| `tenant_taxonomy_config` | Per-org JSON taxonomy (`org_id` PK) |

## Architecture notes

- Queue stays in Postgres (`document_jobs`) — no Kafka.
- Archive is metadata-driven — do not reorganize Storage objects by path alone.
- Workers use service role server-side only.

## Validation

Indexes on `documents(org_id)`, jobs pending lookup, extractions by document, tags, audit_log.
