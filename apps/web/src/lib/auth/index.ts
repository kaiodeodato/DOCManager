/**
 * Auth helpers for apps/web (E1.03 stubs).
 *
 * Wire `@supabase/ssr` + `@supabase/supabase-js` when env is configured.
 * JWT `org_id` / `role` claims are typed in `@ac/shared` — see Doc/architecture/auth-jwt-claims.md.
 */

export {
  getSessionClaims,
  parseAccessTokenClaims,
  requireOrgClaims,
} from "./claims.js";
export { createBrowserSupabaseClient } from "./client.js";
export { createServerSupabaseClient } from "./server.js";
