# Zod schemas — `@ac/shared` (E0.04)

## Goal

Validate cross-boundary payloads with Zod before persist / enqueue. Types come from `z.infer`.

## Dependency

`zod` is a runtime dependency of `@ac/shared`.

## Schemas

| Schema | Purpose |
|--------|---------|
| `DocumentUploadPayloadSchema` | Upload registration (`orgId`, file meta, `storagePath`) |
| `DocumentJobPayloadSchema` | Job envelope (`jobType`, `documentId`, attempt, metadata) |
| `ExtractionResultSchema` | Classifier output (type, NIF/value/date/supplier, confidence) |

Inferred types: `DocumentUploadPayload`, `DocumentJobPayload`, `ExtractionResult`.

## Rules

- DeepSeek / extraction responses **must** pass `ExtractionResultSchema` before write.
- Low confidence → document status `needs_review` (workflow in later etapas).
- Apps must import schemas from `@ac/shared` — do not redefine DTOs.

## Validation

```bash
npm run test -- --filter=@ac/shared
```

Each schema has ≥3 tests (valid, invalid, missing field).
