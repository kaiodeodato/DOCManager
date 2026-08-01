import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DocumentStatus, EXTRACTION_CONFIDENCE_THRESHOLD } from "@ac/shared";
import { createDeepSeekClient, runClassifyJob } from "./deepseek.js";

const highConfidence = {
  documentType: "invoice",
  entities: {
    nif: "123456789",
    value: 10,
    date: "2026-08-01",
    supplier: "Acme",
  },
  confidence: 0.95,
};

describe("runClassifyJob", () => {
  it("returns classified for valid high-confidence mock response", async () => {
    const client = createDeepSeekClient({
      mockContent: JSON.stringify(highConfidence),
    });
    const result = await runClassifyJob({
      ocrText: "Fatura Acme",
      client,
    });
    assert.equal(result.decision.persist, true);
    assert.equal(result.decision.status, DocumentStatus.Classified);
  });

  it("does not persist invalid schema responses", async () => {
    const client = createDeepSeekClient({
      mockContent: JSON.stringify({ documentType: "invoice", confidence: 0.9 }),
    });
    const result = await runClassifyJob({ ocrText: "x", client });
    assert.equal(result.decision.persist, false);
    assert.equal(result.decision.status, DocumentStatus.NeedsReview);
    assert.equal(result.decision.result, null);
  });

  it("marks low confidence as needs_review while persisting", async () => {
    const client = createDeepSeekClient({
      mockContent: JSON.stringify({
        ...highConfidence,
        confidence: EXTRACTION_CONFIDENCE_THRESHOLD - 0.2,
      }),
    });
    const result = await runClassifyJob({ ocrText: "x", client });
    assert.equal(result.decision.persist, true);
    assert.equal(result.decision.status, DocumentStatus.NeedsReview);
  });

  it("injects custom taxonomy types into classify path", async () => {
    const client = createDeepSeekClient({
      mockContent: JSON.stringify({
        ...highConfidence,
        documentType: "nota_credito",
      }),
    });
    const result = await runClassifyJob({
      ocrText: "Nota de crédito",
      client,
      taxonomy: {
        documentTypes: [{ id: "nota_credito", label: "Nota de crédito", tags: [] }],
        costCenters: [],
        virtualFolders: [],
      },
    });
    assert.equal(result.decision.persist, true);
    assert.equal(result.decision.result?.documentType, "nota_credito");
  });
});
