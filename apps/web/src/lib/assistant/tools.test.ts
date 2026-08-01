import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getDocumentById,
  rememberDocument,
  resetDocumentStore,
  searchDocuments,
  sumByPeriod,
} from "../document-store.ts";
import { executeToolCalls, planAssistantToolCalls } from "./deepseek-stub.ts";
import { runAssistantTool } from "./tools.ts";

const ORG = "00000000-0000-4000-8000-000000000099";

describe("assistant tools (E12)", () => {
  it("searchDocuments / getDocumentById / sumByPeriod match store", async () => {
    resetDocumentStore();
    rememberDocument({
      id: "00000000-0000-4000-8000-000000000001",
      orgId: ORG,
      originalFilename: "invoice.pdf",
      status: "received",
      storagePath: `${ORG}/document/invoice.pdf`,
      documentDate: "2026-01-15",
      amount: 120.5,
    });
    const found = await runAssistantTool("searchDocuments", ORG, { query: "invoice" });
    assert.ok(Array.isArray(found) && found.length >= 1);

    const direct = searchDocuments({ orgId: ORG, query: "invoice" });
    assert.equal((found as unknown[]).length, direct.length);

    const doc = await runAssistantTool("getDocumentById", ORG, {
      documentId: "00000000-0000-4000-8000-000000000001",
    });
    assert.equal(
      (doc as { id: string }).id,
      getDocumentById("00000000-0000-4000-8000-000000000001", ORG)?.id,
    );

    const sum = await runAssistantTool("sumByPeriod", ORG, {
      from: "2026-01-01",
      to: "2026-01-31",
    });
    const expected = sumByPeriod({ orgId: ORG, from: "2026-01-01", to: "2026-01-31" });
    assert.deepEqual(sum, expected);
  });

  it("mock planner picks tools and executes", async () => {
    process.env.ASSISTANT_MOCK = "1";
    const calls = await planAssistantToolCalls({
      message: "soma do periodo",
      orgId: ORG,
    });
    assert.equal(calls[0]?.function.name, "sumByPeriod");
    const results = await executeToolCalls(ORG, calls);
    assert.equal(results[0]?.name, "sumByPeriod");
  });
});
