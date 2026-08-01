import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserRole } from "./enums.js";
import {
  assertCan,
  assertCapability,
  can,
  canManageMembers,
  canShareExternally,
  hasCapability,
  listCapabilities,
} from "./permissions.js";

describe("permissions", () => {
  it("allows owner to approve", () => {
    assert.equal(can(UserRole.Owner, "document:approve"), true);
    assert.equal(hasCapability(UserRole.Owner, "document:approve"), true);
  });

  it("blocks viewer approve (negative)", () => {
    assert.equal(can(UserRole.Viewer, "document:approve"), false);
    assert.throws(() => assertCan(UserRole.Viewer, "document:approve"));
    assert.throws(() => assertCapability(UserRole.Viewer, "document:approve"));
  });

  it("blocks viewer taxonomy write", () => {
    assert.equal(can(UserRole.Viewer, "taxonomy:write"), false);
  });

  it("owner can manage members and share externally", () => {
    assert.equal(canManageMembers(UserRole.Owner), true);
    assert.equal(canShareExternally(UserRole.Owner), true);
    assert.ok(listCapabilities(UserRole.Owner).length >= 5);
  });

  it("viewer cannot manage members (negative)", () => {
    assert.equal(canManageMembers(UserRole.Viewer), false);
    assert.equal(canShareExternally(UserRole.Viewer), false);
  });

  it("only owner can export GDPR", () => {
    assert.equal(can(UserRole.Owner, "gdpr:export"), true);
    assert.equal(can(UserRole.Accountant, "gdpr:export"), false);
    assert.equal(can(UserRole.Viewer, "gdpr:export"), false);
  });
});
