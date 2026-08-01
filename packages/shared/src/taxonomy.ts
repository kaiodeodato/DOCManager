import { z } from "zod";

/**
 * Per-tenant taxonomy (E6) — types, tags, virtual folders.
 * Archive is metadata-driven; Storage objects are never moved.
 */
export const TaxonomyDocumentTypeSchema = z.object({
  id: z.string().min(1).max(64),
  label: z.string().min(1).max(128),
  tags: z.array(z.string().min(1).max(64)).default([]),
});

export const TaxonomyCostCenterSchema = z.object({
  id: z.string().min(1).max(64),
  label: z.string().min(1).max(128),
});

export const TaxonomyVirtualFolderSchema = z.object({
  id: z.string().min(1).max(64),
  label: z.string().min(1).max(128),
  tag: z.string().min(1).max(64).optional(),
});

export const TaxonomyConfigSchema = z.object({
  documentTypes: z.array(TaxonomyDocumentTypeSchema).default([]),
  costCenters: z.array(TaxonomyCostCenterSchema).default([]),
  virtualFolders: z.array(TaxonomyVirtualFolderSchema).default([]),
});

export type TaxonomyConfig = z.infer<typeof TaxonomyConfigSchema>;
export type TaxonomyDocumentType = z.infer<typeof TaxonomyDocumentTypeSchema>;

export const EMPTY_TAXONOMY: TaxonomyConfig = {
  documentTypes: [],
  costCenters: [],
  virtualFolders: [],
};

/** Snapshot of document fields that taxonomy changes must not mutate (E6.04). */
export type DocumentTaxonomySnapshot = {
  id: string;
  documentType: string | null;
  costCenter: string | null;
  tags: readonly string[];
};

/**
 * Updating taxonomy config never rewrites existing document metadata.
 * Returns a deep clone of prior snapshots for regression assertions.
 */
export function assertTaxonomyChangeLeavesDocumentsIntact(
  before: readonly DocumentTaxonomySnapshot[],
  after: readonly DocumentTaxonomySnapshot[],
): void {
  if (before.length !== after.length) {
    throw new Error("taxonomy_change_must_not_add_or_remove_documents");
  }
  for (let i = 0; i < before.length; i += 1) {
    const a = before[i]!;
    const b = after[i]!;
    if (a.id !== b.id) {
      throw new Error("taxonomy_change_reordered_or_replaced_documents");
    }
    if (
      a.documentType !== b.documentType ||
      a.costCenter !== b.costCenter ||
      a.tags.length !== b.tags.length ||
      a.tags.some((t, idx) => t !== b.tags[idx])
    ) {
      throw new Error(`taxonomy_change_mutated_document:${a.id}`);
    }
  }
}

/** Pure helper: apply new config without touching documents (E6.04). */
export function replaceTaxonomyConfig(
  _previous: TaxonomyConfig,
  next: unknown,
): TaxonomyConfig {
  return TaxonomyConfigSchema.parse(next);
}
