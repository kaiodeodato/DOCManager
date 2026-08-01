import "server-only";
import {
  DocumentStatus,
  DocumentType,
  ExtractionResultSchema,
  JobType,
} from "@ac/shared";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type JobRow = {
  id: string;
  org_id: string;
  document_id: string | null;
  type: string;
  payload: Record<string, unknown> | null;
  attempts: number;
};

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const parts: string[] = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
      .filter(Boolean)
      .join(" ");
    if (line.trim()) parts.push(line.trim());
  }
  return parts.join("\n").trim();
}

async function extractImageText(buffer: Buffer): Promise<{ text: string; confidence: number }> {
  const Tesseract = await import("tesseract.js");
  const result = await Tesseract.recognize(buffer, "por+eng", {
    logger: () => undefined,
  });
  return {
    text: (result.data.text ?? "").trim(),
    confidence: Math.min(1, Math.max(0, (result.data.confidence ?? 0) / 100)),
  };
}

function isPdf(payload: Record<string, unknown>, storagePath: string): boolean {
  const mime = typeof payload.mimeType === "string" ? payload.mimeType : "";
  return mime === "application/pdf" || storagePath.toLowerCase().endsWith(".pdf");
}

async function lockPendingJob(
  admin: ReturnType<typeof createAdminSupabaseClient>,
  options?: { orgId?: string; documentId?: string },
): Promise<JobRow | null> {
  let query = admin
    .from("document_jobs")
    .select("id, org_id, document_id, type, payload, attempts")
    .eq("type", JobType.Ocr)
    .order("created_at")
    .limit(1);

  if (options?.documentId) {
    // Allow retry of failed jobs for a specific document.
    query = query.eq("document_id", options.documentId).in("status", ["pending", "failed"]);
  } else {
    query = query.eq("status", "pending");
  }
  if (options?.orgId) query = query.eq("org_id", options.orgId);

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`job_lookup_failed: ${error.message}`);
  if (!data) return null;

  const job = data as JobRow;
  const { data: locked, error: lockError } = await admin
    .from("document_jobs")
    .update({
      status: "running",
      locked_at: new Date().toISOString(),
      attempts: (job.attempts ?? 0) + 1,
      last_error: null,
    })
    .eq("id", job.id)
    .in("status", ["pending", "failed"])
    .select("id, org_id, document_id, type, payload, attempts")
    .maybeSingle();
  if (lockError) throw new Error(`job_lock_failed: ${lockError.message}`);
  return (locked as JobRow | null) ?? null;
}

/**
 * Claim and process one pending OCR job (web fallback when worker-ocr is not running).
 */
export async function processOneOcrJob(options?: {
  orgId?: string;
  documentId?: string;
}): Promise<{
  processed: boolean;
  documentId?: string;
  status?: string;
  error?: string;
  textPreview?: string;
}> {
  const admin = createAdminSupabaseClient();
  const job = await lockPendingJob(admin, options);
  if (!job?.document_id) return { processed: false };

  const payload = job.payload ?? {};
  const storagePath = typeof payload.storagePath === "string" ? payload.storagePath : "";
  if (!storagePath) {
    await failJob(admin, job.id, job.document_id, job.org_id, "missing_storage_path");
    return {
      processed: true,
      documentId: job.document_id,
      status: DocumentStatus.OcrFailed,
      error: "missing_storage_path",
    };
  }

  try {
    const { data: object, error: downloadError } = await admin.storage
      .from("documents")
      .download(storagePath);
    if (downloadError) throw new Error(`storage_download_failed: ${downloadError.message}`);

    const buffer = Buffer.from(await object.arrayBuffer());
    let text = "";
    let confidence = 0.5;

    if (isPdf(payload, storagePath)) {
      text = await extractPdfText(buffer);
      confidence = text ? 0.85 : 0;
    } else {
      const ocr = await extractImageText(buffer);
      text = ocr.text;
      confidence = ocr.confidence;
    }

    if (!text) {
      await failJob(admin, job.id, job.document_id, job.org_id, "empty_ocr_text");
      return {
        processed: true,
        documentId: job.document_id,
        status: DocumentStatus.OcrFailed,
        error: "empty_ocr_text",
      };
    }

    const extraction = ExtractionResultSchema.parse({
      documentType: DocumentType.Other,
      entities: { nif: null, value: null, date: null, supplier: null },
      confidence,
      rawTextPreview: text.slice(0, 4000),
    });

    await admin.from("document_extractions").insert({
      org_id: job.org_id,
      document_id: job.document_id,
      job_id: job.id,
      raw_text: text,
      result: extraction,
      confidence,
    });

    const { error: documentError } = await admin
      .from("documents")
      .update({ status: DocumentStatus.OcrDone, ocr_text: text })
      .eq("id", job.document_id)
      .eq("org_id", job.org_id);
    if (documentError) throw new Error(`document_ocr_update_failed: ${documentError.message}`);

    await admin.from("document_jobs").insert({
      org_id: job.org_id,
      document_id: job.document_id,
      type: JobType.Classify,
      status: "pending",
      payload: { ocrText: text },
    });

    await admin
      .from("document_jobs")
      .update({ status: "succeeded", locked_at: null, last_error: null })
      .eq("id", job.id);

    return {
      processed: true,
      documentId: job.document_id,
      status: DocumentStatus.OcrDone,
      textPreview: text.slice(0, 200),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "ocr_failed";
    await failJob(admin, job.id, job.document_id, job.org_id, message);
    return {
      processed: true,
      documentId: job.document_id,
      status: DocumentStatus.OcrFailed,
      error: message,
    };
  }
}

async function failJob(
  admin: ReturnType<typeof createAdminSupabaseClient>,
  jobId: string,
  documentId: string,
  orgId: string,
  message: string,
): Promise<void> {
  await admin
    .from("documents")
    .update({ status: DocumentStatus.OcrFailed })
    .eq("id", documentId)
    .eq("org_id", orgId);
  await admin
    .from("document_jobs")
    .update({
      status: "failed",
      locked_at: null,
      last_error: message.slice(0, 4000),
    })
    .eq("id", jobId);
}

export async function getLatestOcrJob(orgId: string, documentId: string) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("document_jobs")
    .select("id, type, status, last_error, created_at")
    .eq("org_id", orgId)
    .eq("document_id", documentId)
    .eq("type", JobType.Ocr)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`ocr_job_lookup_failed: ${error.message}`);
  return data as {
    id: string;
    type: string;
    status: string;
    last_error: string | null;
    created_at: string;
  } | null;
}
