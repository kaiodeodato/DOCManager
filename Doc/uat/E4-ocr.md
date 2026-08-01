# UAT — E4 OCR pipeline (E4.01–E4.06)

## Objective

Validate preprocess → OCR → extraction → failure handling → calibration offline.

## Preconditions

- `npm install` completed
- Fixtures generated: `npm run fixtures --workspace=@ac/worker-ocr` (after build)

## Steps

1. `npm run build -- --filter=@ac/shared --filter=@ac/worker-ocr`
2. `npm run test -- --filter=@ac/worker-ocr`
3. `npm run calibrate --workspace=@ac/worker-ocr`
4. Confirm `apps/worker-ocr/calibration/report.json` exists with a `winner`.

## Expected results

- ≥3 fixtures (`invoice`, `rotated`, `low-quality`) process in CI without network OCR (mocked engine).
- Missing image payload → `ocr_failed`.
- Successful OCR stores Zod `ExtractionResult` and enqueues `classify`.
- Calibration scores ≥8 combo rows.

## Edge cases

- Empty OCR text → `ocr_failed` / `empty_ocr_text`.
- Corrupt buffers should surface via sharp/tesseract into `ocr_failed` (not hang).
- Real Postgres `document_extractions` write is deferred to service-role wiring (in-memory store in worker for now).
