# Accessibility notes — DOC Manager UI (UI14.01)

## Principles

- Native controls where possible (`<dialog>`, `<details>`, buttons, links).
- Focus rings via `.dm-btn:focus-visible` and search `focus-within` ring tokens.
- Icons: decorative by default (`aria-hidden`); pass `label` on `Icon` when meaningful.
- Mobile nav drawer: titled dialog; menu button has `aria-label`.
- Notifications: unread count exposed in button accessible name.
- Global search: `combobox` + `listbox` roles; Escape closes; ⌘/Ctrl+K opens.
- Status / empty / error: `role="status"` / `role="alert"` as appropriate.
- Motion: `prefers-reduced-motion` disables fades/hovers.

## Checklist for new screens

1. One `h1` (topbar title or page heading).
2. Interactive elements keyboard reachable.
3. Color not the only status signal (badge text + variant).
4. Form fields use `label` prop on `@ac/ui` inputs.
5. Loading: `aria-busy` / `role="status"`.
