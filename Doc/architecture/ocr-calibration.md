# OCR calibration (E4.06)

## Decision

**Default chain:** grayscale → normalize → sharpen (optional max-width 2000).

Chosen as the global winner for synthetic contrast/variance scoring on invoice / angled / low-light / shadow stand-ins. Parameters live in env (`OCR_*`), not hardcoded call sites.

## How to re-run

```bash
npm run build -- --filter=@ac/worker-ocr
npm run calibrate --workspace=@ac/worker-ocr
# report: apps/worker-ocr/calibration/report.json
```

## Filter matrix (harness)

- baseline, gray, gray-normalize, gray-normalize-sharpen
- normalize-sharpen, sharpen-only
- trim-gray-normalize-sharpen
- upscale-proxy (`maxWidth=4000`)

## Scenarios

| Scenario | Fixture set | Notes |
|----------|-------------|-------|
| Good light | `fixtures/photos/good-light.png` | synthetic stand-in |
| Low light | `fixtures/photos/low-light.png` | synthetic |
| Angle | `fixtures/photos/angle.png` | rotate stub |
| Shadow | `fixtures/photos/shadow.png` | synthetic |

Replace files under `fixtures/photos/` with real phone captures when available; harness accepts custom buffers.

## Out of scope

- Browser-side filters
- ML deskew models
- DeepSeek classification (E5)
