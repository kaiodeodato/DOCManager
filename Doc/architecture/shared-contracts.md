# Domain contracts (@ac/shared) — E0.03 / E0.04

## Enums

- `DocumentStatus`, `DocumentType`, `JobType`, `UserRole`, `JobStatus`
- Const objects + derived union types
- Unit tests enforce uniqueness and no cross-enum collisions

## Zod schemas

- `DocumentUploadPayloadSchema`
- `DocumentJobPayloadSchema`
- `ExtractionResultSchema`
- `EXTRACTION_CONFIDENCE_THRESHOLD`

Import from `@ac/shared` only — never redefine in apps.
