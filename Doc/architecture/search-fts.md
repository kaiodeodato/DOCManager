# Full-text search (E7)

## Goal

Postgres FTS only — `tsvector` + GIN + `pg_trgm`. No Elasticsearch.

## Migration

`supabase/migrations/20260301000500_search_fts.sql`

- `documents.ocr_text`
- Generated `documents.search_vector`
- GIN on `search_vector`
- `pg_trgm` GIN on filename / OCR text
- Helper `documents_search(org_id, query, limit, offset)`

## API

`GET /api/documents/search?orgId=&q=&documentType=&tag=&page=&pageSize=`

In-memory stand-in mirrors fuzzy substring matching until Supabase client is wired; latency returned as `latencyMs`.

## Perf notes (E7.04)

See [search-perf.md](./search-perf.md).
