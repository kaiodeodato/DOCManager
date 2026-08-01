# apps/web — Next.js 15 App Router (E0.02)

## Goal

Scaffold `@ac/web` with Next.js 15 (App Router), React 19, and Tailwind 4, consuming `@ac/shared` and `@ac/ui`.

## Structure

```
apps/web/
  src/app/layout.tsx   # Root layout + metadata
  src/app/page.tsx     # Health page proving workspace imports
  src/app/globals.css  # Tailwind 4 + premium SaaS tokens (white/blue)
  next.config.ts       # transpilePackages + outputFileTracingRoot
```

## Notes

- No Pages Router.
- `transpilePackages: ["@ac/shared", "@ac/ui"]`.
- Full UI design system arrives in UI0 / E0.05 — this ticket only proves the app boots.

## Validation

```bash
npm run build -- --filter=@ac/web
npm run lint -- --filter=@ac/web
npm run test -- --filter=@ac/web
npm run typecheck -- --filter=@ac/web
npm run dev -- --filter=@ac/web
```
