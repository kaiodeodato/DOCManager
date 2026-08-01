import {
  EXTRACTION_CONFIDENCE_THRESHOLD,
  ExtractionResultSchema,
  type ExtractionResult,
} from "./schemas.js";
import { DocumentStatus } from "./enums.js";

export type ClassifyPersistDecision =
  | {
      persist: true;
      result: ExtractionResult;
      status: typeof DocumentStatus.Classified | typeof DocumentStatus.NeedsReview;
    }
  | {
      persist: false;
      result: null;
      status: typeof DocumentStatus.NeedsReview;
      reason: "invalid_schema" | "empty_response";
      issues?: string;
    };

/**
 * Zod-validate DeepSeek JSON before any persist (E5.03 / E5.04).
 * Invalid → needs_review, no result written.
 * Low confidence → persist + needs_review.
 * Otherwise → persist + classified.
 */
export function decideClassifyPersist(raw: unknown): ClassifyPersistDecision {
  if (raw === null || raw === undefined || raw === "") {
    return {
      persist: false,
      result: null,
      status: DocumentStatus.NeedsReview,
      reason: "empty_response",
    };
  }

  const parsed = ExtractionResultSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      persist: false,
      result: null,
      status: DocumentStatus.NeedsReview,
      reason: "invalid_schema",
      issues: parsed.error.message,
    };
  }

  const result = parsed.data;
  if (result.confidence < EXTRACTION_CONFIDENCE_THRESHOLD) {
    return {
      persist: true,
      result,
      status: DocumentStatus.NeedsReview,
    };
  }

  return {
    persist: true,
    result,
    status: DocumentStatus.Classified,
  };
}

export function parseDeepSeekJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  const jsonText = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(jsonText) as unknown;
}
