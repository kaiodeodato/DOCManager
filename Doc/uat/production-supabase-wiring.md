# UAT — production Supabase wiring

## Objective
Verify real authentication, tenant-scoped uploads, Postgres job processing, and
empty states without seeded or mock document fallbacks.

## Preconditions
- Supabase migrations are applied.
- Web public keys and the server-only service-role key are configured.
- OCR worker has `WORKER_OCR_POLL=1`.

## Steps and expected results
1. Register and confirm a new account. A workspace is created and `/dashboard` opens.
2. Sign out and visit `/documents`. The browser redirects to `/login`.
3. Sign in and open Documents. A new workspace shows the empty state.
4. Upload a supported PDF/image. Storage contains
   `{orgId}/{documentId}/{filename}` and the UI lists a `received` document.
5. Confirm one pending `ocr` job exists, then start the OCR worker. The job moves
   `pending → running → succeeded`; OCR text/extraction is persisted and a classify
   job is enqueued.
6. Use a corrupt/unsupported file. The OCR job becomes `failed`, stores a clear
   `last_error`, and the document becomes `ocr_failed`.

## Edge cases
- Missing service-role key fails server admin/worker startup with a clear error.
- A user cannot list, search, upload into, or read another organization's documents.
- Concurrent workers claim distinct jobs; cancelled and failed jobs are not claimed.
