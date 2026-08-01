# Search performance notes (E7.04)

## SLO (PME volume)

| Dataset | Target p95 |
|---------|------------|
| ~1k docs / org | < 50 ms (API stand-in) |
| ~10k docs / org (Postgres + GIN) | < 150 ms |

## How to measure

1. Apply `20260301000500_search_fts.sql`.
2. Seed representative OCR text + filenames.
3. Run `SELECT * FROM documents_search($org, 'fatura acme', 20, 0);` with `EXPLAIN ANALYZE`.
4. Web stand-in: `GET /api/documents/search` returns `latencyMs`.

Unit coverage: `apps/web/src/lib/e5-e8.test.ts` (substring / pagination).
