import { createClient } from "@supabase/supabase-js";
import { JobStatus } from "@ac/shared";

export type NotifyJob = {
  id: string;
  payload: Record<string, unknown>;
};

export function createWorkerSupabaseClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Worker requires SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function claimNextNotifyJob(): Promise<NotifyJob | null> {
  const client = createWorkerSupabaseClient();
  const { data, error } = await client.rpc("claim_document_job", {
    p_types: ["notify"],
  });
  if (error) throw new Error(`job_claim_failed: ${error.message}`);
  const row = (
    data as { id: string; payload: Record<string, unknown> | null }[] | null
  )?.[0];
  return row ? { id: row.id, payload: row.payload ?? {} } : null;
}

export async function finishNotifyJob(
  id: string,
  result: { ok: true } | { ok: false; error: string },
): Promise<void> {
  const update = result.ok
    ? { status: JobStatus.Succeeded, locked_at: null, last_error: null }
    : {
        status: JobStatus.Failed,
        locked_at: null,
        last_error: result.error.slice(0, 4000),
      };
  const { error } = await createWorkerSupabaseClient()
    .from("document_jobs")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(`notify_job_update_failed: ${error.message}`);
}
