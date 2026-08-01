# UAT — E7 search

## Objective

FTS migration + search API under tenant filter.

## Steps

1. Review migration `20260301000500_search_fts.sql`
2. `GET /api/documents/search?orgId=…&q=Acme`
3. Confirm pagination params `page` / `pageSize`
4. Read `Doc/architecture/search-perf.md`

## Expected

- Only matching org docs returned
- Partial terms match (trgm / substring stand-in)
- `latencyMs` present in JSON
