/**
 * Domain enums — single source of truth for web + workers.
 * Values are stable string literals persisted in Postgres / job payloads.
 */

export const DocumentStatus = {
  Received: "received",
  OcrDone: "ocr_done",
  OcrFailed: "ocr_failed",
  Classified: "classified",
  NeedsReview: "needs_review",
  Approved: "approved",
  Rejected: "rejected",
  Exported: "exported",
  ExportFailed: "export_failed",
} as const;

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const DocumentType = {
  Invoice: "invoice",
  Receipt: "receipt",
  Contract: "contract",
  Identity: "identity",
  Other: "other",
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const JobType = {
  Ocr: "ocr",
  Classify: "classify",
  Index: "index",
  Merge: "merge",
  Split: "split",
  Notify: "notify",
  Noop: "noop",
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export const UserRole = {
  Owner: "owner",
  Accountant: "accountant",
  Viewer: "viewer",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const JobStatus = {
  Pending: "pending",
  Running: "running",
  Succeeded: "succeeded",
  Failed: "failed",
  Cancelled: "cancelled",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

/** All domain enum const objects (for cross-enum uniqueness checks). */
export const DOMAIN_ENUMS = {
  DocumentStatus,
  DocumentType,
  JobType,
  UserRole,
  JobStatus,
} as const;

export type DomainEnumName = keyof typeof DOMAIN_ENUMS;
