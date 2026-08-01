import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createMemoryDocumentStatusChannel,
  subscribeDocumentStatus,
} from "./document-status.ts";

describe("document status realtime stub (E9.04)", () => {
  it("no-op when channel is missing", () => {
    const unsub = subscribeDocumentStatus(null, () => {
      throw new Error("should not fire");
    });
    unsub();
  });

  it("delivers published events", () => {
    const channel = createMemoryDocumentStatusChannel();
    const seen: string[] = [];
    const unsub = subscribeDocumentStatus(channel, (e) => seen.push(e.status));
    channel.publish({
      documentId: "d1",
      status: "ocr_done",
      updatedAt: new Date().toISOString(),
    });
    assert.deepEqual(seen, ["ocr_done"]);
    unsub();
    channel.publish({
      documentId: "d1",
      status: "classified",
      updatedAt: new Date().toISOString(),
    });
    assert.deepEqual(seen, ["ocr_done"]);
  });
});
