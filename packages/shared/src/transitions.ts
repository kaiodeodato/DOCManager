import { DocumentStatus, type DocumentStatus as DocumentStatusValue } from "./enums.js";

/**
 * Allowed document.status transitions (E8.01).
 * Server must reject anything not listed here.
 */
export const DOCUMENT_STATUS_TRANSITIONS: Record<
  DocumentStatusValue,
  readonly DocumentStatusValue[]
> = {
  [DocumentStatus.Received]: [DocumentStatus.OcrDone, DocumentStatus.OcrFailed],
  [DocumentStatus.OcrDone]: [DocumentStatus.Classified, DocumentStatus.NeedsReview],
  [DocumentStatus.OcrFailed]: [DocumentStatus.Received],
  [DocumentStatus.Classified]: [
    DocumentStatus.Approved,
    DocumentStatus.Rejected,
    DocumentStatus.NeedsReview,
  ],
  [DocumentStatus.NeedsReview]: [
    DocumentStatus.Classified,
    DocumentStatus.Approved,
    DocumentStatus.Rejected,
  ],
  [DocumentStatus.Approved]: [DocumentStatus.Exported, DocumentStatus.ExportFailed],
  [DocumentStatus.Rejected]: [],
  [DocumentStatus.Exported]: [],
  [DocumentStatus.ExportFailed]: [DocumentStatus.Exported, DocumentStatus.Approved],
};

export function canTransition(
  from: DocumentStatusValue,
  to: DocumentStatusValue,
): boolean {
  const allowed = DOCUMENT_STATUS_TRANSITIONS[from];
  return allowed.includes(to);
}

export class InvalidDocumentTransitionError extends Error {
  readonly from: DocumentStatusValue;
  readonly to: DocumentStatusValue;

  constructor(from: DocumentStatusValue, to: DocumentStatusValue) {
    super(`invalid_document_transition:${from}->${to}`);
    this.name = "InvalidDocumentTransitionError";
    this.from = from;
    this.to = to;
  }
}

export function assertDocumentTransition(
  from: DocumentStatusValue,
  to: DocumentStatusValue,
): void {
  if (!canTransition(from, to)) {
    throw new InvalidDocumentTransitionError(from, to);
  }
}

export function listAllowedTransitions(
  from: DocumentStatusValue,
): readonly DocumentStatusValue[] {
  return DOCUMENT_STATUS_TRANSITIONS[from];
}
