# Production Supabase wiring

Web authentication uses `@supabase/ssr`: browser clients use the anon key, server
clients propagate cookies, and middleware refreshes sessions before protecting app
routes. The service-role key is loaded only by server-only admin and worker modules.

Uploads resolve the authenticated user's first organization membership, write to the
private `documents` bucket at `{orgId}/{documentId}/{filename}`, insert the document,
and enqueue an OCR row in `document_jobs`. Production list/search endpoints query
Postgres under the user's RLS session.

Workers call the service-role-only `claim_document_job` RPC. The function atomically
claims one pending job with `FOR UPDATE SKIP LOCKED`; workers finish with `succeeded`
or `failed`. OCR downloads the Storage object, persists text/extraction data, and
enqueues classification.

Required deployment secrets: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY`.
Set `WORKER_OCR_POLL=1` or `WORKER_NOTIFY_POLL=1` only on the corresponding worker.
