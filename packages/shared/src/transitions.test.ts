import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DocumentStatus } from "./enums.js";
import {
  InvalidDocumentTransitionError,
  assertDocumentTransition,
  canTransition,
  listAllowedTransitions,
} from "./transitions.js";

describe("document status transitions (E8)", () => {
  it("allows approved → exported", () => {
    assert.equal(canTransition(DocumentStatus.Approved, DocumentStatus.Exported), true);
    assertDocumentTransition(DocumentStatus.Approved, DocumentStatus.Exported);
  });

  it("allows approved → export_failed and retry export_failed → exported", () => {
    assert.equal(canTransition(DocumentStatus.Approved, DocumentStatus.ExportFailed), true);
    assert.equal(canTransition(DocumentStatus.ExportFailed, DocumentStatus.Exported), true);
  });

  it("rejects exported → received with explicit error", () => {
    assert.equal(canTransition(DocumentStatus.Exported, DocumentStatus.Received), false);
    assert.throws(
      () => assertDocumentTransition(DocumentStatus.Exported, DocumentStatus.Received),
      (err: unknown) => err instanceof InvalidDocumentTransitionError,
    );
  });

  it("covers every status with a transition table entry", () => {
    for (const status of Object.values(DocumentStatus)) {
      assert.ok(Array.isArray(listAllowedTransitions(status)));
    }
  });

  it("allows needs_review → classified", () => {
    assert.equal(canTransition(DocumentStatus.NeedsReview, DocumentStatus.Classified), true);
  });
});
