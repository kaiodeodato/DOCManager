import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DocumentJobPayloadSchema,
  DocumentUploadPayloadSchema,
  ExtractionResultSchema,
} from "./schemas.js";

const ORG_ID = "11111111-1111-4111-8111-111111111111";
const DOC_ID = "22222222-2222-4222-8222-222222222222";

describe("DocumentUploadPayloadSchema", () => {
  const valid = {
    orgId: ORG_ID,
    fileName: "fatura.pdf",
    mimeType: "application/pdf",
    sizeBytes: 2048,
    storagePath: `${ORG_ID}/incoming/fatura.pdf`,
  };

  it("accepts a valid upload payload", () => {
    const parsed = DocumentUploadPayloadSchema.parse(valid);
    assert.equal(parsed.fileName, "fatura.pdf");
  });

  it("rejects invalid orgId", () => {
    assert.throws(() =>
      DocumentUploadPayloadSchema.parse({ ...valid, orgId: "not-a-uuid" }),
    );
  });

  it("rejects missing required field fileName", () => {
    const { fileName: _fileName, ...rest } = valid;
    assert.throws(() => DocumentUploadPayloadSchema.parse(rest));
  });
});

describe("DocumentJobPayloadSchema", () => {
  const valid = {
    orgId: ORG_ID,
    documentId: DOC_ID,
    jobType: "ocr",
  };

  it("accepts a valid job payload and applies defaults", () => {
    const parsed = DocumentJobPayloadSchema.parse(valid);
    assert.equal(parsed.jobType, "ocr");
    assert.equal(parsed.attempt, 1);
    assert.deepEqual(parsed.metadata, {});
  });

  it("rejects unknown jobType", () => {
    assert.throws(() =>
      DocumentJobPayloadSchema.parse({ ...valid, jobType: "warp" }),
    );
  });

  it("rejects missing documentId", () => {
    const { documentId: _documentId, ...rest } = valid;
    assert.throws(() => DocumentJobPayloadSchema.parse(rest));
  });
});

describe("ExtractionResultSchema", () => {
  const valid = {
    documentType: "invoice",
    entities: {
      nif: "123456789",
      value: 199.99,
      date: "2026-08-01",
      supplier: "Acme Lda",
    },
    confidence: 0.92,
  };

  it("accepts a valid extraction result", () => {
    const parsed = ExtractionResultSchema.parse(valid);
    assert.equal(parsed.documentType, "invoice");
    assert.equal(parsed.entities.supplier, "Acme Lda");
  });

  it("rejects confidence outside 0..1", () => {
    assert.throws(() =>
      ExtractionResultSchema.parse({ ...valid, confidence: 1.5 }),
    );
  });

  it("rejects missing entities", () => {
    const { entities: _entities, ...rest } = valid;
    assert.throws(() => ExtractionResultSchema.parse(rest));
  });
});
