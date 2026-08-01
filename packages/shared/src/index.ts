/**
 * Shared domain contracts for DOC Manager.
 * Single source of truth for enums and Zod schemas used by web + workers.
 */
import { buildClassifyPrompt as buildClassifyPromptImpl } from "./classify-prompt.js";

export const PACKAGE_NAME = "@ac/shared" as const;

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export {
  DocumentStatus,
  DocumentType,
  DOMAIN_ENUMS,
  JobStatus,
  JobType,
  UserRole,
} from "./enums.js";
export type { DomainEnumName } from "./enums.js";

export {
  DocumentJobPayloadSchema,
  DocumentSearchQuerySchema,
  DocumentStatusTransitionSchema,
  DocumentUploadPayloadSchema,
  EXTRACTION_CONFIDENCE_THRESHOLD,
  ExtractionCorrectionSchema,
  ExtractionResultSchema,
} from "./schemas.js";
export type {
  DocumentJobPayload,
  DocumentSearchQuery,
  DocumentStatusTransition,
  DocumentUploadPayload,
  ExtractionCorrection,
  ExtractionResult,
} from "./schemas.js";

export {
  AccessTokenClaimsSchema,
  JwtOrgClaimsSchema,
  readOrgClaims,
} from "./claims.js";
export type { AccessTokenClaims, JwtOrgClaims } from "./claims.js";

export { DocumentJobQueue, defaultJobQueue } from "./queue.js";
export type { JobRecord } from "./queue.js";

export { findStuckJobs, formatStuckJobLog } from "./job-alerts.js";
export type { StuckJobAlert } from "./job-alerts.js";

export {
  CLASSIFY_SYSTEM_PROMPT,
  CLASSIFY_SYSTEM_PROMPT as DEEPSEEK_CLASSIFY_SYSTEM_PROMPT,
  buildClassifyPrompt,
} from "./classify-prompt.js";
export type { ClassifyPromptInput } from "./classify-prompt.js";

/** Adapter for workers that pass a single taxonomy type hint string. */
export function buildClassifyUserPrompt(
  ocrText: string,
  taxonomyHint?: string,
): string {
  if (taxonomyHint) {
    return buildClassifyPromptImpl({
      ocrText,
      taxonomy: {
        documentTypes: [{ id: taxonomyHint, label: taxonomyHint, tags: [] }],
        costCenters: [],
        virtualFolders: [],
      },
    });
  }
  return buildClassifyPromptImpl({ ocrText });
}

export {
  decideClassifyPersist,
  decideClassifyPersist as decideClassification,
  parseDeepSeekJsonContent,
} from "./classify.js";
export type {
  ClassifyPersistDecision,
  ClassifyPersistDecision as ClassifyDecision,
} from "./classify.js";

export {
  EMPTY_TAXONOMY,
  TaxonomyConfigSchema,
  TaxonomyCostCenterSchema,
  TaxonomyDocumentTypeSchema,
  TaxonomyVirtualFolderSchema,
  assertTaxonomyChangeLeavesDocumentsIntact,
  replaceTaxonomyConfig,
} from "./taxonomy.js";
export type {
  DocumentTaxonomySnapshot,
  TaxonomyConfig,
  TaxonomyDocumentType,
} from "./taxonomy.js";

export {
  DOCUMENT_STATUS_TRANSITIONS,
  InvalidDocumentTransitionError,
  assertDocumentTransition,
  assertDocumentTransition as assertTransition,
  canTransition,
  listAllowedTransitions,
} from "./transitions.js";

export {
  RoleCapability,
  assertCan,
  assertCapability,
  can,
  canManageMembers,
  canShareExternally,
  hasCapability,
  listCapabilities,
} from "./permissions.js";
export type { Permission, RoleCapabilityName } from "./permissions.js";

export { createLogger } from "./logger.js";
export type { LogFields, LogLevel, Logger, StructuredLog } from "./logger.js";
