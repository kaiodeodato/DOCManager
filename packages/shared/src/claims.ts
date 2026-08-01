import { z } from "zod";
import { UserRole } from "./enums.js";

const userRoleSchema = z.enum([
  UserRole.Owner,
  UserRole.Accountant,
  UserRole.Viewer,
]);

/**
 * Custom claims injected into the Supabase access token (Custom Access Token Hook).
 * Used by RLS helpers and apps/web auth stubs — keep in sync with Auth Hook docs.
 */
export const JwtOrgClaimsSchema = z.object({
  org_id: z.string().uuid(),
  role: userRoleSchema,
});

export type JwtOrgClaims = z.infer<typeof JwtOrgClaimsSchema>;

/**
 * Subset of Supabase JWT payload fields DOC Manager relies on.
 * `app_metadata` may also carry org_id/role depending on hook configuration.
 */
export const AccessTokenClaimsSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email().optional(),
  org_id: z.string().uuid().optional(),
  role: userRoleSchema.optional(),
  app_metadata: z
    .object({
      org_id: z.string().uuid().optional(),
      role: userRoleSchema.optional(),
    })
    .passthrough()
    .optional(),
  user_metadata: z.record(z.unknown()).optional(),
});

export type AccessTokenClaims = z.infer<typeof AccessTokenClaimsSchema>;

/**
 * Resolve effective org_id / role from a decoded access token.
 * Prefer top-level custom claims; fall back to app_metadata.
 */
export function readOrgClaims(
  claims: AccessTokenClaims,
): JwtOrgClaims | null {
  const orgId = claims.org_id ?? claims.app_metadata?.org_id;
  const role = claims.role ?? claims.app_metadata?.role;
  if (!orgId || !role) {
    return null;
  }
  const parsed = JwtOrgClaimsSchema.safeParse({ org_id: orgId, role });
  return parsed.success ? parsed.data : null;
}
