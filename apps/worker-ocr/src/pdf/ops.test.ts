import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DocumentJobPayloadSchema,
  JobType,
  defaultJobQueue,
} from "@ac/shared";
import { createBlankPdf, mergePdfs, splitPdf } from "./ops.js";
import { processNextPdfJob } from "./jobs.js";

describe("pdf ops (E10)", () => {
  it("merges and splits blank PDFs", async () => {
    const a = await createBlankPdf(1);
    const b = await createBlankPdf(2);
    const merged = await mergePdfs([a, b]);
    assert.ok(merged.byteLength > 0);
    const parts = await splitPdf(merged);
    assert.equal(parts.length, 3);
  });

  it("enqueue merge/split stays under 50ms (API responsive)", () => {
    const orgId = "00000000-0000-4000-8000-000000000010";
    const documentId = "00000000-0000-4000-8000-000000000011";
    const start = performance.now();
    for (let i = 0; i < 20; i += 1) {
      defaultJobQueue.enqueue(
        DocumentJobPayloadSchema.parse({
          orgId,
          documentId,
          jobType: i % 2 === 0 ? JobType.Merge : JobType.Split,
          metadata: { note: "large-file-stub" },
        }),
      );
    }
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 50, `enqueue took ${elapsed}ms`);
  });

  it("processes merge job from queue", async () => {
    const orgId = "00000000-0000-4000-8000-000000000012";
    const documentId = "00000000-0000-4000-8000-000000000013";
    const pdf = await createBlankPdf(1);
    defaultJobQueue.enqueue(
      DocumentJobPayloadSchema.parse({
        orgId,
        documentId,
        jobType: JobType.Merge,
        metadata: { pdfBase64List: [pdf.toString("base64"), pdf.toString("base64")] },
      }),
    );
    const outcome = await processNextPdfJob();
    assert.equal(outcome.processed, true);
    assert.equal(outcome.result?.ok, true);
  });
});
