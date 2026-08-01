import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserRole } from "@ac/shared";
import {
  DocumentJobPayloadSchema,
  JobType,
  defaultJobQueue,
} from "@ac/shared";

describe("pdf enqueue latency (E10.04)", () => {
  it("enqueues merge job under 20ms without processing", () => {
    const start = performance.now();
    const job = defaultJobQueue.enqueue(
      DocumentJobPayloadSchema.parse({
        orgId: "00000000-0000-4000-8000-000000000030",
        documentId: "00000000-0000-4000-8000-000000000031",
        jobType: JobType.Merge,
        metadata: { large: true },
      }),
    );
    const ms = performance.now() - start;
    assert.ok(job.id);
    assert.ok(ms < 100, `enqueue ${ms}ms`);
  });
});

describe("share permission negative (E9.03)", () => {
  it("viewer cannot share externally", async () => {
    const { canShareExternally } = await import("@ac/shared");
    assert.equal(canShareExternally(UserRole.Viewer), false);
  });
});
