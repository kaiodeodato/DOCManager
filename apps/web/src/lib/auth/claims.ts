import {
  AccessTokenClaimsSchema,
  readOrgClaims,
  type AccessTokenClaims,
  type JwtOrgClaims,
} from "@ac/shared";

/**
 * Parse unknown JWT payload into DOC Manager access-token claims.
 */
export function parseAccessTokenClaims(
  payload: unknown,
): AccessTokenClaims | null {
  const parsed = AccessTokenClaimsSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

/**
 * Read org_id + role from a decoded session / JWT payload.
 */
export function getSessionClaims(payload: unknown): JwtOrgClaims | null {
  const claims = parseAccessTokenClaims(payload);
  if (!claims) {
    return null;
  }
  return readOrgClaims(claims);
}

/**
 * Require org claims or throw (BFF / RSC guard stub).
 */
export function requireOrgClaims(payload: unknown): JwtOrgClaims {
  const org = getSessionClaims(payload);
  if (!org) {
    throw new Error(
      "Missing org_id/role JWT claims — configure Custom Access Token Hook (see Doc/architecture/auth-jwt-claims.md)",
    );
  }
  return org;
}
