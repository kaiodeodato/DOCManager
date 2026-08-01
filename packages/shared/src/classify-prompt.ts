import { DocumentType } from "./enums.js";
import type { TaxonomyConfig } from "./taxonomy.js";
import { EMPTY_TAXONOMY } from "./taxonomy.js";

const DEFAULT_TYPES = Object.values(DocumentType);

export type ClassifyPromptInput = {
  ocrText: string;
  taxonomy?: TaxonomyConfig;
  correctionsFewShot?: Array<{ original: unknown; corrected: unknown }>;
};

/**
 * Builds the DeepSeek classify + extract prompt (E5.01 / E6.03).
 * Taxonomy types are injected when present; otherwise default DocumentType set.
 */
export function buildClassifyPrompt(input: ClassifyPromptInput): string {
  const taxonomy = input.taxonomy ?? EMPTY_TAXONOMY;
  const customTypes = taxonomy.documentTypes.map((t) => t.id);
  const allowedTypes = customTypes.length > 0 ? customTypes : [...DEFAULT_TYPES];

  const typeLines =
    taxonomy.documentTypes.length > 0
      ? taxonomy.documentTypes.map((t) => `- ${t.id}: ${t.label}`).join("\n")
      : allowedTypes.map((t) => `- ${t}`).join("\n");

  const costCenters =
    taxonomy.costCenters.length > 0
      ? taxonomy.costCenters.map((c) => `- ${c.id}: ${c.label}`).join("\n")
      : "(none configured)";

  const fewShot =
    input.correctionsFewShot && input.correctionsFewShot.length > 0
      ? input.correctionsFewShot
          .slice(0, 5)
          .map(
            (c, i) =>
              `Example ${i + 1}:\noriginal=${JSON.stringify(c.original)}\ncorrected=${JSON.stringify(c.corrected)}`,
          )
          .join("\n\n")
      : "";

  return [
    "You are DOC Manager's document classifier.",
    "Return a single JSON object matching this shape:",
    '{"documentType":"<type>","entities":{"nif":string|null,"value":number|null,"date":"YYYY-MM-DD"|null,"supplier":string|null},"confidence":0..1,"rawTextPreview":string}',
    "",
    "Allowed documentType values:",
    typeLines,
    "",
    "Optional cost centers (metadata hint only):",
    costCenters,
    "",
    fewShot ? `Few-shot corrections:\n${fewShot}\n` : "",
    "OCR text:",
    "```",
    input.ocrText.slice(0, 12000),
    "```",
    "",
    "Rules:",
    "- Respond with JSON only (no markdown).",
    "- confidence must be between 0 and 1.",
    "- Use null for unknown entities.",
    `- documentType must be one of: ${allowedTypes.join(", ")}`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export const CLASSIFY_SYSTEM_PROMPT =
  "You extract structured fields from Portuguese business documents. Output valid JSON only.";
