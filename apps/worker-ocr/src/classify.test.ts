import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DocumentStatus, DocumentType } from "@ac/shared";
import { classifyOcrText } from "./classify.js";

describe("classifyOcrText", () => {
  it("classifies mocked DeepSeek JSON", async () => {
    const decision = await classifyOcrText("Fatura PT500000000", undefined, {
      mockResponse: {
        documentType: DocumentType.Invoice,
        entities: { nif: "PT500000000", value: 12.3, date: "2026-03-01", supplier: "Loja" },
        confidence: 0.93,
      },
    });
    assert.equal(decision.status, DocumentStatus.Classified);
    assert.equal(decision.persist, true);
  });

  it("needs_review on invalid mock without persisting", async () => {
    const decision = await classifyOcrText("x", undefined, { mockResponse: { foo: 1 } });
    assert.equal(decision.status, DocumentStatus.NeedsReview);
    assert.equal(decision.persist, false);
  });
});
