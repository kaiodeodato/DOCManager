import "server-only";
import { EMPTY_TAXONOMY, type TaxonomyConfig } from "@ac/shared";
import { createAdminSupabaseClient } from "./supabase/admin";
import { createServerSupabaseClient } from "./supabase/server";

export async function getTaxonomyConfig(orgId: string): Promise<TaxonomyConfig> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tenant_taxonomy_config")
    .select("config")
    .eq("org_id", orgId)
    .maybeSingle();
  if (error) throw new Error(`taxonomy_get_failed: ${error.message}`);
  if (!data?.config || typeof data.config !== "object") return EMPTY_TAXONOMY;
  return data.config as TaxonomyConfig;
}

export async function upsertTaxonomyConfig(
  orgId: string,
  config: TaxonomyConfig,
): Promise<TaxonomyConfig> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("tenant_taxonomy_config")
    .upsert({ org_id: orgId, config, updated_at: new Date().toISOString() })
    .select("config")
    .single();
  if (error) throw new Error(`taxonomy_upsert_failed: ${error.message}`);
  return (data.config as TaxonomyConfig) ?? config;
}
