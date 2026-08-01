# UAT — UI1–UI14 (web pages)

## Objective

Verify marketing, auth, and app pages compose `@ac/ui` correctly with DOC Manager blue SaaS chrome.

## Preconditions

- `npm run build -- --filter=@ac/ui --filter=@ac/web` succeeds
- `npm run dev -- --filter=@ac/web` (or turbo equivalent) running
- Optional: mock org APIs available for documents / OCR / taxonomy

## Steps & expected results

| # | Steps | Expected |
| --- | --- | --- |
| 1 | Open `/` | Landing: hero, trust, stats, card sections, workflow, pricing, FAQ, final CTA inside public chrome |
| 2 | Visit `/pricing`, `/blog`, `/blog/ocr-accuracy-playbook`, `/contact`, `/case-studies`, `/industries` | Each page renders with public nav/footer |
| 3 | `/login` → submit | AuthLayout form; navigates to `/dashboard` |
| 4 | `/register`, `/forgot-password` | Auth forms render |
| 5 | `/dashboard` | Brief loading, then metrics/charts/recent docs/insights |
| 6 | `/documents` | Filters, advanced search, table; empty state when filters match nothing |
| 7 | `/documents/doc-001` | Preview + OCR metadata + timeline |
| 8 | `/ocr/queue` | Queue table with confidence progress |
| 9 | `/ocr/review` | List + correction panel with confidence badge |
| 10 | `/assistant` | Chat, suggestions, semantic search sidebar |
| 11 | `/approvals` | StatusBadge + Timeline + approve actions |
| 12 | `/taxonomy` | Tabs for categories/tags/types/fields |
| 13 | `/integrations` → open connector | Cards; wizard steps on detail |
| 14 | `/settings` and subpages | Org/users/roles/security/notifications/taxonomy links work |
| 15 | Hover cards / landing stats | Soft lift / fade motion (respects reduced-motion) |
| 16 | Installability | `manifest.webmanifest` linked in document head |

## Edge cases

- Documents API failure: page falls back to mock rows (or ErrorState if none)
- OCR review API empty: mock needs_review docs appear
- `/giulia` and `/ocr` redirect to `/assistant` and `/ocr/queue`
- Clear document filters restores full table
