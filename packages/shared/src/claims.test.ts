import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserRole } from "./enums.js";
import {
  AccessTokenClaimsSchema,
  JwtOrgClaimsSchema,
  readOrgClaims,
} from "./claims.js";

describe("JWT org claims", () => {
  it("parses top-level org_id and role", () => {
    const claims = AccessTokenClaimsSchema.parse({
      sub: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      org_id: "11111111-1111-1111-1111-111111111111",
      role: UserRole.Owner,
    });
    assert.deepEqual(readOrgClaims(claims), {
      org_id: "11111111-1111-1111-1111-111111111111",
      role: UserRole.Owner,
    });
  });

  it("falls back to app_metadata when top-level claims missing", () => {
    const claims = AccessTokenClaimsSchema.parse({
      sub: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      app_metadata: {
        org_id: "22222222-2222-2222-2222-222222222222",
        role: UserRole.Viewer,
      },
    });
    assert.deepEqual(readOrgClaims(claims), {
      org_id: "22222222-2222-2222-2222-222222222222",
      role: UserRole.Viewer,
    });
  });

  it("returns null when org claims incomplete", () => {
    const claims = AccessTokenClaimsSchema.parse({
      sub: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      org_id: "33333333-3333-3333-3333-333333333333",
    });
    assert.equal(readOrgClaims(claims), null);
  });

  it("rejects invalid JwtOrgClaims", () => {
    assert.equal(
      JwtOrgClaimsSchema.safeParse({
        org_id: "not-a-uuid",
        role: UserRole.Accountant,
      }).success,
      false,
    );
  });
});
