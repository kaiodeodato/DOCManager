# UAT — E5 DeepSeek classify + review

## Objective

Validate classify Zod gate, needs_review fallback, review UI, and corrections.

## Preconditions

- `@ac/shared` + `@ac/worker-ocr` built
- `DEEPSEEK_API_KEY` optional (tests mock)

## Steps

1. `npm run test -- --filter=@ac/shared` — classify / schema suites
2. `npm run test -- --filter=@ac/worker-ocr` — classify + deepseek mocks
3. Open `/ocr/review`, correct a needs_review doc, save
4. `GET /api/ocr/corrections?documentId=` shows a row

## Expected

- Invalid JSON → no persist, `needs_review`
- Low confidence → persist + `needs_review`
- Correction → `classified` + corrections store row

## Edge cases

- Empty DeepSeek content → needs_review
- Missing API key without mock → treated as classify failure → needs_review
