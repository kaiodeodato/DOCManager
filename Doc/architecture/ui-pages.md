# UI pages (UI1–UI14)

Composition layer in `apps/web` over `@ac/ui` layouts, navigation, marketing, analytics, workflow, and feedback primitives.

## Route groups

| Group | Layout | Routes |
| --- | --- | --- |
| `(public)` | `MarketingChrome` → `PublicLayout` | `/`, pricing, blog, contact, case-studies, industries |
| `(auth)` | Auth shell | `/login`, `/register`, `/forgot-password` |
| `(app)` | `AppShell` (`AppChrome` alias) → `DashboardLayout` | dashboard, documents, OCR, assistant, approvals, taxonomy, integrations, settings |

## App navigation (`AppShell`)

Dashboard · Documents · OCR Queue (`/ocr/queue`) · Review (`/ocr/review`) · Approvals · Assistant (Giulia) (`/assistant`) · Taxonomy · Integrations · Settings

Aliases: `/ocr` → `/ocr/queue`, `/giulia` → `/assistant`.

## Key compositions

- **Dashboard** — MetricCard, ChartCard, DocumentCard, InsightCard, Timeline; Loading/Empty/Error states
- **Documents** — filters, advanced search, table, UploadDropzone; API + mock fallback; Loading/Empty/Error
- **Document detail** — preview, OCR metadata, Timeline history
- **OCR review** — confidence badges/progress + correction form (`/api/ocr/*` when available)
- **Approvals** — StatusBadge + Timeline
- **Assistant** — chat, history, suggested actions, semantic search
- **Integrations** — IntegrationCard list + connect wizard at `/integrations/[id]` and `/integrations/new`
- **Taxonomy** — Tabs UI; JSON editor at `/settings/taxonomy`

## Motion (UI13)

`.dm-fade-in`, `.dm-hover-lift`, `.dm-counter` in `apps/web/src/app/globals.css` (mirrored in `@ac/ui` components.css).

## PWA

`public/manifest.webmanifest` via root layout metadata; `RegisterServiceWorker` for soft install.

## Data

Mocks: `apps/web/src/lib/mock-data.ts`. Existing `/api/*` Route Handlers remain unchanged.
