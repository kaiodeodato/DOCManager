import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseEnv } from "./env";

export function createAdminSupabaseClient() {
  const { url, serviceRoleKey } = getServerSupabaseEnv();
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
