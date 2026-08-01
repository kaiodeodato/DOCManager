# Document workflow + ERP (E8)

## Status machine

`DOCUMENT_STATUS_TRANSITIONS` in `@ac/shared` — server rejects anything else via `assertDocumentTransition` / `assertTransition`.

Notable paths:

- `needs_review` → `classified` | `approved` | `rejected`
- `approved` → `exported` | `export_failed`
- `export_failed` → `exported` | `approved` (retry)

## APIs

- `POST /api/documents/[id]/status` — validated transition
- `POST /api/documents/transition` — role-aware transition check
- `POST /api/documents/[id]/export` — mock ERP (`forceFail`, `idempotencyKey`)

## Mock ERP

`apps/web/src/lib/connectors/mock-erp.ts` — sandbox adapter; idempotent by `idempotencyKey`; failures set `export_failed` without half-exported state.
