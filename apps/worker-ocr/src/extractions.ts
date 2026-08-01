import {
  DocumentType,
  ExtractionResultSchema,
  type ExtractionResult,
} from "@ac/shared";

/**
 * In-memory stand-in for `document_extractions` until the worker persists via Supabase (E4.03).
 * Shape mirrors the DB row + Zod-validated `result`.
 */
export type StoredExtraction = {
  id: string;
  orgId: string;
  documentId: string;
  jobId: string | null;
  rawText: string;
  result: ExtractionResult;
  confidence: number;
  createdAt: string;
};

const store = new Map<string, StoredExtraction>();

/** Build a Zod-valid ExtractionResult from raw OCR (classification arrives in E5). */
export function buildOcrExtractionResult(
  rawText: string,
  confidence: number,
): ExtractionResult {
  const preview = rawText.slice(0, 4000);
  const base = {
    documentType: DocumentType.Other,
    entities: {
      nif: null,
      value: null,
      date: null,
      supplier: null,
    },
    confidence,
  };
  return ExtractionResultSchema.parse(
    preview.length > 0 ? { ...base, rawTextPreview: preview } : base,
  );
}

export function saveExtraction(input: {
  orgId: string;
  documentId: string;
  jobId?: string | null;
  rawText: string;
  confidence: number;
}): StoredExtraction {
  const result = buildOcrExtractionResult(input.rawText, input.confidence);
  const row: StoredExtraction = {
    id: crypto.randomUUID(),
    orgId: input.orgId,
    documentId: input.documentId,
    jobId: input.jobId ?? null,
    rawText: input.rawText,
    result,
    confidence: input.confidence,
    createdAt: new Date().toISOString(),
  };
  store.set(row.id, row);
  return row;
}

export function getExtractionsByDocument(documentId: string): StoredExtraction[] {
  return [...store.values()].filter((row) => row.documentId === documentId);
}

export function clearExtractions(): void {
  store.clear();
}
