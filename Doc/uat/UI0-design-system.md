# UAT — UI0 Design System (`@ac/ui`)

## Objective

Verify DOC Manager design tokens, theme wiring, Icon wrapper, base/compound/analytics components render with the premium SaaS language (white, blue accents, soft shadows, large radius).

## Preconditions

- Monorepo installed (`npm install`)
- `@ac/web` can start (`npm run dev -- --filter=@ac/web`)
- `apps/web/src/app/globals.css` imports `@ac/ui/tokens.css` and `@ac/ui/components.css`

## Steps

1. Open the web app home page and confirm token preview swatches still render.
2. In a temporary playground (or Story-less page), render `Button` variants (`primary`, `secondary`, `ghost`, `danger`, `outline`) and confirm focus ring + hover.
3. Render `Search` with `shortcutHint="⌘K"` and confirm hint kbd is visible.
4. Open `Dialog` / `Drawer` via `open` prop; Escape / backdrop close fires `onClose`.
5. Toggle `<html class="dark">` and confirm surfaces invert via CSS variables.
6. Render `MetricCard` and `ChartCard`; chart shows SVG placeholder when no children.

## Expected results

- Components use token colors (accent `#2563eb` in light).
- No clipped focus outlines; interactive controls are keyboard reachable.
- Dark theme does not break layout; borders remain visible.
- Unit tests for Button + MetricCard pass (`npm run test -- --filter=@ac/ui`).

## Edge cases

- Disabled `Button` / form controls are non-interactive and dimmed.
- `Progress` clamps values outside `[0, max]`.
- `Pagination` disables prev on page 1 and next on last page.
- Empty `Select` `options` still renders without crash.
