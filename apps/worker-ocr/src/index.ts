import {
  DocumentStatus,
  JobType,
  defaultJobQueue,
  type TaxonomyConfig,
} from "@ac/shared";
import { createDeepSeekClient, runClassifyJob, type ClassifyJobResult } from "./deepseek.js";
import { buildOcrExtractionResult, saveExtraction } from "./extractions.js";
import { runOcr } from "./ocr.js";
import { processNextPdfJob, type PdfJobResult } from "./pdf/jobs.js";
import { preprocessImage } from "./preprocess.js";
import {
  claimNextJob,
  completeJob,
  createWorkerSupabaseClient,
  failJob,
} from "./supabase.js";

export type OcrJobOutcome =
  | { ok: true; text: string; confidence: number; status: typeof DocumentStatus.OcrDone }
  | { ok: false; error: string; status: typeof DocumentStatus.OcrFailed };

export type ClassifyJobOutcome = {
  ok: boolean;
  status: typeof DocumentStatus.Classified | typeof DocumentStatus.NeedsReview;
  persisted: boolean;
  result: ClassifyJobResult["decision"]["result"];
};

/**
 * E4 pipeline: preprocess → tesseract → explicit failure states.
 */
export async function processOcrBuffer(image: Buffer): Promise<OcrJobOutcome> {
  try {
    const prepared = await preprocessImage(image);
    const { text, confidence } = await runOcr(prepared);
    if (!text) {
      return { ok: false, error: "empty_ocr_text", status: DocumentStatus.OcrFailed };
    }
    return {
      ok: true,
      text,
      confidence,
      status: DocumentStatus.OcrDone,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "ocr_failed",
      status: DocumentStatus.OcrFailed,
    };
  }
}

export async function processClassifyFromOcrText(
  ocrText: string,
  options: {
    taxonomy?: TaxonomyConfig;
    mockContent?: string;
  } = {},
): Promise<ClassifyJobOutcome> {
  const clientOpts: Parameters<typeof createDeepSeekClient>[0] = {};
  if (options.mockContent !== undefined) clientOpts.mockContent = options.mockContent;
  const client = createDeepSeekClient(clientOpts);
  const jobInput: Parameters<typeof runClassifyJob>[0] = { ocrText, client };
  if (options.taxonomy !== undefined) jobInput.taxonomy = options.taxonomy;
  const { decision } = await runClassifyJob(jobInput);
  return {
    ok: decision.persist || decision.status === DocumentStatus.NeedsReview,
    status: decision.status,
    persisted: decision.persist,
    result: decision.result,
  };
}

export async function processNextJob(): Promise<{
  processed: boolean;
  jobId?: string;
  documentStatus?: string;
  outcome?: OcrJobOutcome | ClassifyJobOutcome | PdfJobResult;
}> {
  const pdf = await processNextPdfJob();
  if (pdf.processed) {
    const out: {
      processed: true;
      jobId?: string;
      outcome?: PdfJobResult;
    } = { processed: true };
    if (pdf.jobId !== undefined) out.jobId = pdf.jobId;
    if (pdf.result !== undefined) out.outcome = pdf.result;
    return out;
  }

  const job =
    defaultJobQueue.claim(JobType.Noop) ??
    defaultJobQueue.claim(JobType.Ocr) ??
    defaultJobQueue.claim(JobType.Classify);

  if (!job) return { processed: false };

  try {
    if (job.jobType === JobType.Noop) {
      defaultJobQueue.complete(job.id);
      return { processed: true, jobId: job.id };
    }

    if (job.jobType === JobType.Classify) {
      const ocrText =
        typeof job.metadata?.ocrText === "string" ? job.metadata.ocrText : "";
      const mockContent =
        typeof job.metadata?.mockDeepSeekContent === "string"
          ? job.metadata.mockDeepSeekContent
          : undefined;
      const taxonomy =
        job.metadata?.taxonomy && typeof job.metadata.taxonomy === "object"
          ? (job.metadata.taxonomy as TaxonomyConfig)
          : undefined;

      const classifyOpts: {
        taxonomy?: TaxonomyConfig;
        mockContent?: string;
      } = {};
      if (taxonomy !== undefined) classifyOpts.taxonomy = taxonomy;
      if (mockContent !== undefined) classifyOpts.mockContent = mockContent;

      const outcome = await processClassifyFromOcrText(ocrText, classifyOpts);
      defaultJobQueue.complete(job.id);
      return {
        processed: true,
        jobId: job.id,
        documentStatus: outcome.status,
        outcome,
      };
    }

    const fixture = job.metadata?.imageBase64;
    if (typeof fixture !== "string") {
      defaultJobQueue.fail(job.id, "missing_image_payload");
      return {
        processed: true,
        jobId: job.id,
        documentStatus: DocumentStatus.OcrFailed,
        outcome: { ok: false, error: "missing_image_payload", status: DocumentStatus.OcrFailed },
      };
    }

    const buffer = Buffer.from(fixture, "base64");
    const outcome = await processOcrBuffer(buffer);
    if (!outcome.ok) {
      defaultJobQueue.fail(job.id, outcome.error);
      return {
        processed: true,
        jobId: job.id,
        documentStatus: DocumentStatus.OcrFailed,
        outcome,
      };
    }

    saveExtraction({
      orgId: job.orgId,
      documentId: job.documentId,
      jobId: job.id,
      rawText: outcome.text,
      confidence: outcome.confidence,
    });
    defaultJobQueue.complete(job.id);
    defaultJobQueue.enqueue({
      orgId: job.orgId,
      documentId: job.documentId,
      jobType: JobType.Classify,
      metadata: { ocrText: outcome.text },
    });
    return {
      processed: true,
      jobId: job.id,
      documentStatus: DocumentStatus.OcrDone,
      outcome,
    };
  } catch (error) {
    defaultJobQueue.fail(job.id, error instanceof Error ? error.message : "unknown");
    return { processed: false, jobId: job.id };
  }
}

export async function processNextPersistentJob(): Promise<boolean> {
  const job = await claimNextJob([JobType.Ocr, JobType.Classify]);
  if (!job) return false;
  const client = createWorkerSupabaseClient();

  try {
    if (!job.documentId) throw new Error("missing_document_id");

    if (job.type === JobType.Classify) {
      const ocrText = typeof job.payload.ocrText === "string" ? job.payload.ocrText : "";
      if (!ocrText) throw new Error("missing_ocr_text");
      const outcome = await processClassifyFromOcrText(ocrText);
      if (!outcome.result) throw new Error("invalid_classification_result");
      const { error } = await client
        .from("documents")
        .update({
          status: outcome.status,
          document_type: outcome.result.documentType,
        })
        .eq("id", job.documentId)
        .eq("org_id", job.orgId);
      if (error) throw new Error(`document_classify_update_failed: ${error.message}`);
      await completeJob(job.id);
      return true;
    }

    const storagePath =
      typeof job.payload.storagePath === "string" ? job.payload.storagePath : "";
    if (!storagePath) throw new Error("missing_storage_path");
    const { data: object, error: downloadError } = await client.storage
      .from("documents")
      .download(storagePath);
    if (downloadError) throw new Error(`storage_download_failed: ${downloadError.message}`);

    const outcome = await processOcrBuffer(Buffer.from(await object.arrayBuffer()));
    if (!outcome.ok) {
      await client
        .from("documents")
        .update({ status: DocumentStatus.OcrFailed })
        .eq("id", job.documentId)
        .eq("org_id", job.orgId);
      await failJob(job.id, outcome.error);
      return true;
    }

    const extraction = buildOcrExtractionResult(outcome.text, outcome.confidence);
    const { error: extractionError } = await client.from("document_extractions").insert({
      org_id: job.orgId,
      document_id: job.documentId,
      job_id: job.id,
      raw_text: outcome.text,
      result: extraction,
      confidence: outcome.confidence,
    });
    if (extractionError) {
      throw new Error(`extraction_insert_failed: ${extractionError.message}`);
    }
    const { error: documentError } = await client
      .from("documents")
      .update({ status: DocumentStatus.OcrDone, ocr_text: outcome.text })
      .eq("id", job.documentId)
      .eq("org_id", job.orgId);
    if (documentError) throw new Error(`document_ocr_update_failed: ${documentError.message}`);
    const { error: enqueueError } = await client.from("document_jobs").insert({
      org_id: job.orgId,
      document_id: job.documentId,
      type: JobType.Classify,
      status: "pending",
      payload: { ocrText: outcome.text },
    });
    if (enqueueError) throw new Error(`classify_enqueue_failed: ${enqueueError.message}`);
    await completeJob(job.id);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (job.documentId && job.type === JobType.Ocr) {
      await client
        .from("documents")
        .update({ status: DocumentStatus.OcrFailed })
        .eq("id", job.documentId)
        .eq("org_id", job.orgId);
    }
    await failJob(job.id, message);
    return true;
  }
}

export function workerIdentity(): string {
  return "worker-ocr:@ac/shared";
}

async function main(): Promise<void> {
  console.log(`[worker-ocr] starting ${workerIdentity()}`);
  for (;;) {
    const processed = await processNextPersistentJob();
    if (!processed) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("index.js") || process.argv[1].endsWith("index.ts"));

if (isDirectRun && process.env.WORKER_OCR_POLL === "1") {
  void main();
}
