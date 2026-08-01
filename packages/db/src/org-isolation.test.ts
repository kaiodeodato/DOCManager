import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserRole } from "@ac/shared";
import {
  canAccessOrgRow,
  canManageOrgAsOwner,
  evaluateOrgIsolationPolicy,
  resolveAccessibleOrgIds,
  type OrgMembership,
} from "./org-isolation.js";

const ORG_A = "11111111-1111-1111-1111-111111111111";
const ORG_B = "22222222-2222-2222-2222-222222222222";
const USER_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const USER_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const memberships: OrgMembership[] = [
  { org_id: ORG_A, user_id: USER_A, role: UserRole.Owner },
  { org_id: ORG_B, user_id: USER_B, role: UserRole.Accountant },
];

describe("tenant isolation policy simulation (E1.05)", () => {
  it("resolves only membership org ids for a user", () => {
    assert.deepEqual(resolveAccessibleOrgIds(memberships, USER_A), [ORG_A]);
    assert.deepEqual(resolveAccessibleOrgIds(memberships, USER_B), [ORG_B]);
  });

  it("blocks cross-tenant row access (A cannot read B)", () => {
    const accessible = resolveAccessibleOrgIds(memberships, USER_A);
    assert.equal(canAccessOrgRow(ORG_A, accessible), true);
    assert.equal(canAccessOrgRow(ORG_B, accessible), false);
  });

  it("blocks cross-tenant writes via WITH CHECK simulation", () => {
    const accessible = resolveAccessibleOrgIds(memberships, USER_A);
    assert.equal(
      evaluateOrgIsolationPolicy({
        action: "insert",
        rowOrgId: ORG_B,
        accessibleOrgIds: accessible,
      }),
      false,
    );
    assert.equal(
      evaluateOrgIsolationPolicy({
        action: "insert",
        rowOrgId: ORG_A,
        accessibleOrgIds: accessible,
      }),
      true,
    );
  });

  it("allows owner manage only within own org", () => {
    assert.equal(canManageOrgAsOwner(memberships, USER_A, ORG_A), true);
    assert.equal(canManageOrgAsOwner(memberships, USER_A, ORG_B), false);
    assert.equal(canManageOrgAsOwner(memberships, USER_B, ORG_B), false);
  });
});
