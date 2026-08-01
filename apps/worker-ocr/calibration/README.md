# OCR calibration harness (E4.06)

Runs preprocess filter combinations against fixtures and writes `report.json`.

```bash
# from repo root
npm run build -- --filter=@ac/worker-ocr
npm run calibrate --workspace=@ac/worker-ocr

# or
node apps/worker-ocr/calibration/run.mjs
```

Default production chain (env-overridable): grayscale + normalize + sharpen (`OCR_*` vars in `src/config.ts`).

Real photographic fixtures can be dropped under `fixtures/photos/`; the harness falls back to synthetic scenes when absent.
