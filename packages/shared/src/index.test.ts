import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PACKAGE_NAME } from "./index.js";

describe("@ac/shared scaffold", () => {
  it("exposes the canonical package name", () => {
    assert.equal(PACKAGE_NAME, "@ac/shared");
  });
});
