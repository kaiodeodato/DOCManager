# E1.03 — Supabase Auth + JWT org claims

## Goal

Signup/login JWTs carry `org_id` and `role` so RLS and the BFF can scope work to the active tenant.

## Package contracts

| Location | Role |
|----------|------|
| `@ac/shared` `JwtOrgClaims` / `AccessTokenClaims` / `readOrgClaims` | Typed claims + Zod parse |
| `apps/web/src/lib/auth/*` | Browser/server client stubs + claim helpers |
| `public.current_user_org_ids()` | SQL helper (membership table; migration E1.03 helpers) |

## Configure Custom Access Token Hook

1. In Supabase Dashboard → **Authentication → Hooks** (or Auth Hook via config), enable **Custom Access Token**.
2. Hook should load the user's primary `org_members` row and inject claims:

```json
{
  "org_id": "<uuid>",
  "role": "owner | accountant | viewer"
}
```

3. Prefer **top-level** custom claims on the access token. `app_metadata.org_id` / `app_metadata.role` is a supported fallback (`readOrgClaims`).
4. On membership change (invite, role update, org switch), refresh the session so the next JWT picks up new claims.

### Example Hook sketch (Edge Function)

```ts
// Pseudocode — deploy as Auth Hook; validate with JwtOrgClaimsSchema in tests
const membership = await getPrimaryMembership(user.id);
claims.org_id = membership.org_id;
claims.role = membership.role;
return claims;
```

## apps/web stubs

- `createBrowserSupabaseClient` / `createServerSupabaseClient` — placeholders until `@supabase/ssr` is wired.
- `getSessionClaims` / `requireOrgClaims` — parse claims via `@ac/shared`.

Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## RLS note

Current policies use `current_user_org_ids()` (membership table). Claims speed up app-layer checks; keep membership as source of truth for SQL until claim-based policies are intentionally adopted.
