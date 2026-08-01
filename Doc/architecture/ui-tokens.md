# Design tokens — `@ac/ui` (E0.05)



## Goal



Premium AI SaaS tokens (white surfaces, blue accents, large radius, soft shadows) shared by `@ac/web` and future UI packages.



## Exports



| Export | Path |

|--------|------|

| JS tokens + `TOKEN_SWATCHES` / `TokenSwatch` | `@ac/ui` |

| CSS variables + Tailwind 4 `@theme` | `@ac/ui/tokens.css` |



## CSS usage in `@ac/web`



```css

@import "tailwindcss";

@import "@ac/ui/tokens.css";

```



Theme utilities available after import: `bg-background`, `text-foreground`, `text-accent`, `border-border`, `rounded-xl`, `shadow-md`, etc.



## Token preview



The home page (`apps/web`) renders color `TOKEN_SWATCHES` for a quick visual check. Full component library: see [ui-design-system.md](./ui-design-system.md) (UI0).



## Validation



```bash

npm run test -- --filter=@ac/ui

npm run build -- --filter=@ac/web

```

