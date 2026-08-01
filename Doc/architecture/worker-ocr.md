# Worker OCR (`@ac/worker-ocr`)

Background worker for OCR jobs (E3 deploy + E4 Tesseract pipeline).

## Pipeline

1. **Preprocess** (`src/preprocess.ts`) — sharp: EXIF rotate, optional trim, resize, grayscale, normalize, sharpen. Deskew is a documented stub.
2. **OCR** (`src/ocr.ts`) — `tesseract.js` (injectable for unit tests).
3. **Persist** (`src/extractions.ts`) — Zod `ExtractionResultSchema` skeleton (`documentType=other`, null entities) in an in-memory store mirroring `document_extractions`.
4. **Status** — success → `ocr_done` + enqueue `classify`; failure → `ocr_failed` + `last_error` (never silent hang).
5. **Alerts** — `findStuckJobs` in `@ac/shared` (E3.05).

## Config

Env (see `src/config.ts` / `render.yaml`):

| Var | Default |
|-----|---------|
| `OCR_MAX_WIDTH` | `2000` |
| `OCR_GRAYSCALE` | on (`0` to disable) |
| `OCR_NORMALIZE` | on |
| `OCR_SHARPEN` | on |
| `OCR_TRIM_MARGINS` | off |
| `OCR_DESKEW` | off (stub) |

## Deploy

`render.yaml` defines Background Worker `doc-manager-worker-ocr`. Staging smoke still needs a live Render service + Postgres queue (E3.01 path).

## Calibration (E4.06)

See `apps/worker-ocr/calibration/README.md` and [ocr-calibration.md](./ocr-calibration.md).
