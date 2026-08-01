# UAT — UI1–UI14 (layouts through polish)

## Objective

Validate marketing, auth, and app chrome with mock data using `@ac/ui`.

## Preconditions

- `npm run build -- --filter=@ac/ui --filter=@ac/web` succeeds
- `npm run dev -- --filter=@ac/web` (or turbo equivalent)

## Steps & expected

1. Open `/` — landing sections Hero → Final CTA; public nav/footer.
2. `/pricing`, `/blog`, `/blog/ocr-accuracy-playbook`, `/case-studies`, `/industries`, `/contact` — PublicLayout.
3. `/login`, `/register`, `/forgot-password` — AuthLayout; login submits to `/dashboard`.
4. `/dashboard` — metrics, chart, recent docs, timeline; sidebar + topbar; mobile hamburger opens drawer.
5. `/documents` — filters + advanced search; open `/documents/doc-001` tabs preview/OCR/history.
6. `/ocr` queue → `/ocr/doc-002` review with confidence + corrections.
7. `/giulia` — chat, suggestions, history, semantic search field.
8. `/approvals` — StatusBadge + timeline actions.
9. `/taxonomy` — categories/tags/types/fields tabs.
10. `/integrations` → detail → `/integrations/new` wizard.
11. `/settings/*` — org/users/roles/security/notifications.
12. ⌘/Ctrl+K focuses global search; notifications panel opens.

## Edge cases

- Documents filters → empty → EmptyState clear.
- Narrow viewport → sidebar hidden, drawer works.
- `prefers-reduced-motion` → no fade/lift animations.
