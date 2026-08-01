import {
  EMPTY_TAXONOMY,
  TaxonomyConfigSchema,
  type TaxonomyConfig,
} from "@ac/shared";

const byOrg = new Map<string, TaxonomyConfig>();

export function getTaxonomy(orgId: string): TaxonomyConfig {
  return byOrg.get(orgId) ?? { ...EMPTY_TAXONOMY };
}

export function setTaxonomy(orgId: string, config: unknown): TaxonomyConfig {
  const parsed = TaxonomyConfigSchema.parse(config);
  byOrg.set(orgId, parsed);
  return parsed;
}

export function resetTaxonomyStore(): void {
  byOrg.clear();
}
