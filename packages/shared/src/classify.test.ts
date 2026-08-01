import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideClassifyPersist,
  parseDeepSeekJsonContent,
} from "./classify.js";
import { DocumentStatus } from "./enums.js";
import { buildClassifyPrompt } from "./classify-prompt.js";
import { EXTRACTION_CONFIDENCE_THRESHOLD } from "./schemas.js";

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

describe("decideClassifyPersist", () => {
  it("persists high-confidence valid results as classified", () => {
    const decision = decideClassifyPersist(valid);
    assert.equal(decision.persist, true);
    assert.equal(decision.status, DocumentStatus.Classified);
    assert.ok(decision.result);
  });

  it("persists low-confidence results as needs_review", () => {
    const decision = decideClassifyPersist({
      ...valid,
      confidence: EXTRACTION_CONFIDENCE_THRESHOLD - 0.01,
    });
    assert.equal(decision.persist, true);
    assert.equal(decision.status, DocumentStatus.NeedsReview);
  });

  it("rejects invalid schema with no persist", () => {
    const decision = decideClassifyPersist({ documentType: "invoice", confidence: 0.9 });
    assert.equal(decision.persist, false);
    assert.equal(decision.status, DocumentStatus.NeedsReview);
    assert.equal(decision.result, null);
  });

  it("parses fenced JSON from DeepSeek content", () => {
    const raw = parseDeepSeekJsonContent(`\`\`\`json\n${JSON.stringify(valid)}\n\`\`\``);
    assert.deepEqual(raw, valid);
  });
});

describe("buildClassifyPrompt", () => {
  it("injects taxonomy document types into the prompt", () => {
    const prompt = buildClassifyPrompt({
      ocrText: "Fatura 123",
      taxonomy: {
        documentTypes: [{ id: "nota_credito", label: "Nota de crédito", tags: ["finance"] }],
        costCenters: [{ id: "ops", label: "Operations" }],
        virtualFolders: [],
      },
    });
    assert.match(prompt, /nota_credito/);
    assert.match(prompt, /Operations/);
    assert.match(prompt, /Fatura 123/);
  });
});
