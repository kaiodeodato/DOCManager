# UAT — E8 workflow / ERP

## Objective

Invalid transitions rejected; export sandbox + export_failed retry.

## Steps

1. `npm run test -- --filter=@ac/shared` — transitions suite
2. `POST /api/documents/{id}/status` with `exported` → `received` → 409
3. Approve a doc, `POST .../export` with `forceFail: true` → `export_failed`
4. Retry export same `idempotencyKey` → success without duplicate external id

## Expected

- Explicit `invalid_document_transition` errors
- No half-exported state
- Idempotent retry (`duplicated: true` on second success)
