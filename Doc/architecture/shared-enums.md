# Domain enums — `@ac/shared` (E0.03)

## Goal

Publish stable string domain enums consumed by web, BFF, and workers — no duplicated literal unions in apps.

## Location

- `packages/shared/src/enums.ts` — const objects + union types
- Re-exported from `packages/shared/src/index.ts`

## Enums

| Enum | Values |
|------|--------|
| `DocumentStatus` | `received`, `ocr_done`, `ocr_failed`, `classified`, `needs_review`, `approved`, `rejected`, `exported`, `export_failed` |
| `DocumentType` | `invoice`, `receipt`, `contract`, `identity`, `other` |
| `JobType` | `ocr`, `classify`, `index`, `merge`, `split`, `notify`, `noop` |
| `UserRole` | `owner`, `accountant`, `viewer` |

## Usage

```ts
import { DocumentStatus, type DocumentStatus as DocumentStatusValue } from "@ac/shared";

const status: DocumentStatusValue = DocumentStatus.NeedsReview;
```

Values must remain unique **within and across** enums (enforced by unit tests) so logs/metrics tags stay unambiguous.

## Validation

```bash
npm run test -- --filter=@ac/shared
npm run typecheck -- --filter=@ac/shared
```
