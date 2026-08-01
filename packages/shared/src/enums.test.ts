import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DocumentStatus,
  DocumentType,
  DOMAIN_ENUMS,
  JobType,
  UserRole,
} from "./enums.js";

function valuesOf(enumObject: Record<string, string>): string[] {
  return Object.values(enumObject);
}

describe("domain enums", () => {
  it("exposes the expected DocumentStatus values", () => {
    assert.deepEqual(valuesOf(DocumentStatus).sort(), [
      "approved",
      "classified",
      "export_failed",
      "exported",
      "needs_review",
      "ocr_done",
      "ocr_failed",
      "received",
      "rejected",
    ]);
  });

  it("keeps unique values within each enum", () => {
    for (const [name, enumObject] of Object.entries(DOMAIN_ENUMS)) {
      const values = valuesOf(enumObject);
      assert.equal(
        new Set(values).size,
        values.length,
        `${name} has duplicate values`,
      );
    }
  });

  it("does not collide values across enums", () => {
    const seen = new Map<string, string>();
    for (const [name, enumObject] of Object.entries(DOMAIN_ENUMS)) {
      for (const value of valuesOf(enumObject)) {
        const owner = seen.get(value);
        assert.equal(
          owner,
          undefined,
          `value "${value}" collides between ${owner} and ${name}`,
        );
        seen.set(value, name);
      }
    }
  });

  it("covers DocumentType, JobType, and UserRole members", () => {
    assert.ok(valuesOf(DocumentType).includes("invoice"));
    assert.ok(valuesOf(JobType).includes("ocr"));
    assert.ok(valuesOf(UserRole).includes("owner"));
  });
});
