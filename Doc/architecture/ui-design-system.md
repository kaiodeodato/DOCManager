# Design system — `@ac/ui` (UI0)

## Goal

Premium AI SaaS design system for DOC Manager: white surfaces, blue accents, large radius, soft shadows. Shared by `@ac/web` and future surfaces.

## Tickets

| Ticket | Scope |
|--------|--------|
| UI0.01 / DM-94 | Visual identity tokens (`tokens.ts` + `tokens.css` + `brand`) |
| UI0.02 / DM-95 | Tailwind 4 `@theme` bridge + dark prepared; wired in `apps/web` globals |
| UI0.03 / DM-96 | Lucide `Icon` wrapper (size / stroke / a11y) |
| UI0.04 / DM-97 | Base controls |
| UI0.05 / DM-98 | Compound patterns |
| UI0.06 / DM-99 | Analytics cards |

## Exports

| Export | Path |
|--------|------|
| Components + tokens JS | `@ac/ui` |
| CSS variables + Tailwind `@theme` | `@ac/ui/tokens.css` |
| Component styles (`.dm-*`) | `@ac/ui/components.css` |

## Web wiring

```css
@import "tailwindcss";
@import "@ac/ui/tokens.css";
@import "@ac/ui/components.css";
```

Dark mode: add `class="dark"` or `data-theme="dark"` on `<html>`.

## Usage

```tsx
import { Button, MetricCard, Icon, Search } from "@ac/ui";
import { FileText } from "lucide-react";

<Button variant="primary">Upload</Button>
<Icon icon={FileText} size="md" label="Document" />
<Search placeholder="Find documents" shortcutHint="⌘K" />
<MetricCard title="Processed" value="1,284" delta={{ value: "+12%", direction: "up" }} />
```

## Component inventory

**Base:** Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Avatar, Tooltip, Divider, Skeleton, Spinner, Progress

**Compound:** Card (+ Header/Footer), Dialog, Drawer, Tabs, Accordion, Dropdown, Popover, Alert, Toast (+ Viewport), Breadcrumb, Pagination, Table, Search, DatePicker

**Analytics:** MetricCard, ChartCard, ProgressCard, DocumentCard, FeatureCard, IntegrationCard, InsightCard, AnalyticsCard

## Architecture notes

- React 19 peer dependency; `lucide-react` is a package dependency.
- Styles are CSS-variable driven (`.dm-*`), not one-off hex in components.
- Dialog/Drawer use native `<dialog>`; Accordion/Dropdown/Popover use `<details>`.
- ChartCard ships an SVG placeholder slot until chart libs land.

## Validation

```bash
npm run test -- --filter=@ac/ui
npm run typecheck -- --filter=@ac/ui
npm run build -- --filter=@ac/web
```
