import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DocumentType, ExtractionResultSchema } from "@ac/shared";
import {
  buildOcrExtractionResult,
  clearExtractions,
  getExtractionsByDocument,
  saveExtraction,
} from "./extractions.js";
import { runCalibration } from "./calibration/run.js";

describe("extractions", () => {
  it("builds a Zod-valid ExtractionResult from OCR text", () => {
    const result = buildOcrExtractionResult("hello world", 0.8);
    const parsed = ExtractionResultSchema.parse(result);
    assert.equal(parsed.documentType, DocumentType.Other);
    assert.equal(parsed.entities.nif, null);
    assert.equal(parsed.rawTextPreview, "hello world");
  });

  it("stores extraction rows by document id", () => {
    clearExtractions();
    const row = saveExtraction({
      orgId: "11111111-1111-4111-8111-111111111111",
      documentId: "22222222-2222-4222-8222-222222222222",
      rawText: "abc",
      confidence: 0.5,
    });
    assert.equal(getExtractionsByDocument(row.documentId).length, 1);
  });
});

describe("calibration harness", () => {
  it("scores filter combos on synthetic fixtures", async () => {
    const report = await runCalibration();
    assert.ok(report.rows.length >= 8);
    assert.ok(report.winner);
    assert.equal(typeof report.defaults.grayscale, "boolean");
  });
});
