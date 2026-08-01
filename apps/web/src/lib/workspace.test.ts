import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DocumentStatus, PACKAGE_NAME as sharedPackage } from "@ac/shared";

describe("@ac/web workspace imports", () => {
  it("resolves @ac/shared", () => {
    assert.equal(sharedPackage, "@ac/shared");
  });

  it("consumes shared enums", () => {
    assert.equal(DocumentStatus.NeedsReview, "needs_review");
  });
});
