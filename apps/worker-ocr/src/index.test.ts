import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, it } from "node:test";
import sharp from "sharp";
import {
  DocumentStatus,
  DocumentType,
  JobType,
  defaultJobQueue,
} from "@ac/shared";
import { clearExtractions, getExtractionsByDocument } from "./extractions.js";
import { processNextJob, processOcrBuffer, workerIdentity } from "./index.js";
import { resetOcrEngine, setOcrEngine } from "./ocr.js";
import { mapPersistentJob } from "./supabase.js";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../fixtures");

async function loadFixture(name: string): Promise<Buffer> {
  return readFile(path.join(fixturesDir, name));
}

afterEach(() => {
  resetOcrEngine();
  clearExtractions();
});

describe("@ac/worker-ocr", () => {
  it("resolves shared package identity", () => {
    assert.match(workerIdentity(), /^worker-ocr:@ac\/shared$/);
  });

  it("maps snake_case Postgres jobs to worker records", () => {
    const job = mapPersistentJob({
      id: "00000000-0000-4000-8000-000000000010",
      org_id: "00000000-0000-4000-8000-000000000020",
      document_id: "00000000-0000-4000-8000-000000000030",
      type: JobType.Ocr,
      status: "running",
      payload: { storagePath: "org/document/file.pdf" },
      attempts: 1,
    });
    assert.equal(job.orgId, "00000000-0000-4000-8000-000000000020");
    assert.equal(job.payload.storagePath, "org/document/file.pdf");
  });

  it("processes a noop job from the shared queue", async () => {
    defaultJobQueue.enqueue({
      orgId: "11111111-1111-4111-8111-111111111111",
      documentId: "22222222-2222-4222-8222-222222222222",
      jobType: JobType.Noop,
    });
    const result = await processNextJob();
    assert.equal(result.processed, true);
    assert.ok(result.jobId);
  });

  it("fails OCR jobs without image payload explicitly (ocr_failed)", async () => {
    defaultJobQueue.enqueue({
      orgId: "11111111-1111-4111-8111-111111111111",
      documentId: "22222222-2222-4222-8222-222222222222",
      jobType: JobType.Ocr,
      metadata: {},
    });
    const result = await processNextJob();
    assert.equal(result.processed, true);
    assert.equal(result.documentStatus, DocumentStatus.OcrFailed);
    assert.equal(result.outcome && "ok" in result.outcome && result.outcome.ok, false);
    assert.ok(
      result.outcome &&
        "status" in result.outcome &&
        result.outcome.status === DocumentStatus.OcrFailed,
    );
  });

  it("marks empty OCR text as ocr_failed", async () => {
    setOcrEngine(async () => ({ text: "", confidence: 0 }));
    const png = await sharp({
      create: { width: 8, height: 8, channels: 3, background: { r: 255, g: 255, b: 255 } },
    })
      .png()
      .toBuffer();
    const outcome = await processOcrBuffer(png);
    assert.equal(outcome.ok, false);
    assert.equal(outcome.status, DocumentStatus.OcrFailed);
  });

  it("saves ExtractionResult and enqueues classify for invoice fixture", async () => {
    setOcrEngine(async () => ({ text: "Fatura NIF 123456789 Total 10.00", confidence: 0.91 }));
    const image = await loadFixture("invoice.png");
    const documentId = "33333333-3333-4333-8333-333333333333";
    defaultJobQueue.enqueue({
      orgId: "11111111-1111-4111-8111-111111111111",
      documentId,
      jobType: JobType.Ocr,
      metadata: { imageBase64: image.toString("base64") },
    });

    const result = await processNextJob();
    assert.equal(result.processed, true);
    assert.equal(result.documentStatus, DocumentStatus.OcrDone);
    assert.equal(result.outcome?.ok, true);

    const saved = getExtractionsByDocument(documentId);
    assert.equal(saved.length, 1);
    assert.equal(saved[0]?.result.documentType, DocumentType.Other);
    assert.match(saved[0]?.rawText ?? "", /Fatura/);

    const classify = defaultJobQueue.claim(JobType.Classify);
    assert.ok(classify);
    assert.equal(classify.documentId, documentId);
  });

  it("handles rotated and low-quality fixtures with mocked OCR", async () => {
    setOcrEngine(async () => ({ text: "recibo mock", confidence: 0.55 }));
    for (const name of ["rotated.png", "low-quality.png"] as const) {
      const outcome = await processOcrBuffer(await loadFixture(name));
      assert.equal(outcome.ok, true);
      if (outcome.ok) assert.match(outcome.text, /recibo/);
    }
  });
});
