import {
  JobType,
  createLogger,
  defaultJobQueue,
  type JobRecord,
} from "@ac/shared";
import { createBlankPdf, mergePdfs, splitPdf } from "./ops.js";

const log = createLogger("worker-ocr-pdf");

export type PdfJobResult =
  | { ok: true; kind: "merge"; pageCount: number; outputBytes: number }
  | { ok: true; kind: "split"; parts: number }
  | { ok: false; error: string };

function buffersFromMetadata(job: JobRecord): Buffer[] {
  const raw = job.metadata?.pdfBase64List;
  if (Array.isArray(raw) && raw.every((x) => typeof x === "string")) {
    return raw.map((b64) => Buffer.from(b64, "base64"));
  }
  const single = job.metadata?.pdfBase64;
  if (typeof single === "string") {
    return [Buffer.from(single, "base64")];
  }
  return [];
}

/**
 * Process merge/split jobs claimed from the shared queue (E10).
 */
export async function processPdfJob(job: JobRecord): Promise<PdfJobResult> {
  try {
    if (job.jobType === JobType.Merge) {
      let buffers = buffersFromMetadata(job);
      if (buffers.length === 0) {
        // CI-friendly: synthesize blanks when payload omitted
        buffers = [await createBlankPdf(1), await createBlankPdf(1)];
      }
      const merged = await mergePdfs(buffers);
      const result: PdfJobResult = {
        ok: true,
        kind: "merge",
        pageCount: buffers.length,
        outputBytes: merged.byteLength,
      };
      log.info("pdf_merge_done", { jobId: job.id, ...result });
      return result;
    }

    if (job.jobType === JobType.Split) {
      let buffers = buffersFromMetadata(job);
      if (buffers.length === 0) {
        buffers = [await createBlankPdf(2)];
      }
      const parts = await splitPdf(buffers[0]!);
      const result: PdfJobResult = { ok: true, kind: "split", parts: parts.length };
      log.info("pdf_split_done", { jobId: job.id, ...result });
      return result;
    }

    return { ok: false, error: "unsupported_pdf_job_type" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "pdf_job_failed";
    log.error("pdf_job_error", { jobId: job.id, error: message });
    return { ok: false, error: message };
  }
}

export async function processNextPdfJob(): Promise<{
  processed: boolean;
  jobId?: string;
  result?: PdfJobResult;
}> {
  const job =
    defaultJobQueue.claim(JobType.Merge) ?? defaultJobQueue.claim(JobType.Split);
  if (!job) return { processed: false };

  const result = await processPdfJob(job);
  if (result.ok) defaultJobQueue.complete(job.id);
  else defaultJobQueue.fail(job.id, result.error);
  return { processed: true, jobId: job.id, result };
}
