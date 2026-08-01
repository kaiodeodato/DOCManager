import { z } from "zod";
import { DocumentType, JobType } from "./enums.js";

const documentTypeSchema = z.enum([
  DocumentType.Invoice,
  DocumentType.Receipt,
  DocumentType.Contract,
  DocumentType.Identity,
  DocumentType.Other,
]);

const jobTypeSchema = z.enum([
  JobType.Ocr,
  JobType.Classify,
  JobType.Index,
  JobType.Merge,
  JobType.Split,
  JobType.Notify,
  JobType.Noop,
]);

/**
 * Payload accepted when enqueueing / registering an upload (BFF → Storage + jobs).
 */
export const DocumentUploadPayloadSchema = z.object({
  orgId: z.string().uuid(),
  fileName: z.string().min(1).max(512),
  mimeType: z.string().min(1).max(255),
  sizeBytes: z.number().int().nonnegative(),
  storagePath: z.string().min(1).max(1024),
  checksumSha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
});

export type DocumentUploadPayload = z.infer<typeof DocumentUploadPayloadSchema>;

/**
 * Job envelope shared by web enqueue path and workers (pg-boss / document_jobs).
 */
export const DocumentJobPayloadSchema = z.object({
  orgId: z.string().uuid(),
  documentId: z.string().uuid(),
  jobType: jobTypeSchema,
  attempt: z.number().int().positive().default(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type DocumentJobPayload = z.infer<typeof DocumentJobPayloadSchema>;

const extractionEntitiesSchema = z.object({
  nif: z.string().min(1).max(32).nullable(),
  value: z.number().finite().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  supplier: z.string().min(1).max(512).nullable(),
});

/**
 * DeepSeek / classifier extraction result — must pass Zod before persist.
 * `documentType` accepts built-in DocumentType values and tenant custom ids (E6).
 */
export const ExtractionResultSchema = z.object({
  documentType: z.string().min(1).max(64),
  entities: extractionEntitiesSchema,
  confidence: z.number().min(0).max(1),
  rawTextPreview: z.string().max(4000).optional(),
});

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

/** Confidence below this threshold should mark documents as needs_review (E5). */
export const EXTRACTION_CONFIDENCE_THRESHOLD = 0.72 as const;

/**
 * Human correction payload persisted to document_extractions_corrections (E5.06).
 */
export const ExtractionCorrectionSchema = z.object({
  orgId: z.string().uuid(),
  documentId: z.string().uuid(),
  extractionId: z.string().uuid().optional(),
  correctedBy: z.string().uuid().optional(),
  original: z.record(z.string(), z.unknown()),
  corrected: ExtractionResultSchema,
});

export type ExtractionCorrection = z.infer<typeof ExtractionCorrectionSchema>;

/** Status transition request body (E8.02). */
export const DocumentStatusTransitionSchema = z.object({
  documentId: z.string().uuid(),
  toStatus: z.enum([
    "received",
    "ocr_done",
    "ocr_failed",
    "classified",
    "needs_review",
    "approved",
    "rejected",
    "exported",
    "export_failed",
  ]),
});

export type DocumentStatusTransition = z.infer<typeof DocumentStatusTransitionSchema>;

/** Search query (E7.03) — filters + pagination. */
export const DocumentSearchQuerySchema = z.object({
  orgId: z.string().uuid(),
  q: z.string().min(1).max(512),
  documentType: documentTypeSchema.optional(),
  tag: z.string().min(1).max(64).optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

export type DocumentSearchQuery = z.infer<typeof DocumentSearchQuerySchema>;
