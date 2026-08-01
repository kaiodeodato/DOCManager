# UI layouts & navigation (UI1–UI2)

## Goal

Shared chrome for marketing, auth, and app shells using `@ac/ui`, composed by Next.js route groups.

## Layouts (`@ac/ui`)

| Component | Role | Responsive notes |
|-----------|------|------------------|
| `PublicLayout` | Header / main / footer | Nav wraps under brand; sticky blurred header |
| `AuthLayout` | Centered form + brand aside | Aside from `lg`; single column mobile |
| `DashboardLayout` | Sidebar + topbar + content | Sidebar hidden `<lg`; hamburger opens left `Drawer` |

## Navigation (`@ac/ui`)

`AppSidebar`, `AppTopbar`, `GlobalSearch` (⌘/Ctrl+K), `Notifications`, `ProfileMenu`.

DOC Manager nav (wired in `apps/web` `AppChrome`): Dashboard, Documents, OCR Review, Giulia, Approvals, Taxonomy, Integrations, Settings.

## App Router groups

```
apps/web/src/app/(public)/   # MarketingChrome + PublicLayout
apps/web/src/app/(auth)/     # AuthLayout pages
apps/web/src/app/(app)/      # AppChrome + DashboardLayout
```

## Validation

```bash
npm run build -- --filter=@ac/ui --filter=@ac/web
```
