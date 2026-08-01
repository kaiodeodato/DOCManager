# UAT — E10–E15 batch

## E10 PDF

1. `POST /api/pdf/jobs` with merge payload → 202, low `enqueueMs`
2. Worker processes merge/split offline with blank PDFs
3. `GET /api/reports` returns `application/pdf`

## E11 Notify

1. Enqueue `jobType=notify` with idempotencyKey
2. Worker completes once; second send with same key returns `duplicate: true`
3. No SMTP/Twilio network in CI

## E12 Assistant

1. `POST /api/assistant` `{ message, orgId }` → toolCalls + toolResults
2. Sum query matches `sumByPeriod` store result

## E13 PWA

1. `/manifest.webmanifest` loads
2. SW registers in supporting browsers
3. PhotoCapture opens file input / camera when permitted

## E14 GDPR

1. Owner `POST /api/gdpr` export → JSON
2. Viewer → 403
3. Anonymize masks filenames

## E15 Release

1. `npm test` / typecheck on touched packages
2. Playwright smoke (optional if browsers installed)
3. Docs: runbook-render + go-live-checklist present
