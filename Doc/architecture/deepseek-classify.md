# DeepSeek classify + review (E5)

## Goal

Classify OCR text with DeepSeek JSON mode, Zod-validate before persist, fall back to `needs_review`, and capture human corrections for few-shot.

## Architecture

| Piece | Location |
|-------|----------|
| Prompt builder | `@ac/shared` `buildClassifyPrompt` |
| Persist gate | `@ac/shared` `decideClassifyPersist` + `EXTRACTION_CONFIDENCE_THRESHOLD` |
| DeepSeek client | `apps/worker-ocr` `deepseek.ts` / `classify.ts` (mockable) |
| Review UI | `apps/web/src/app/ocr/review` |
| Corrections API | `POST /api/ocr/corrections` |

## Rules

- Invalid Zod → `needs_review`, **no** extraction result written.
- Confidence `< 0.72` → persist + `needs_review`.
- Valid high confidence → `classified`.
- Use `DEEPSEEK_API_KEY`; tests inject `mockContent` / `mockResponse`.
