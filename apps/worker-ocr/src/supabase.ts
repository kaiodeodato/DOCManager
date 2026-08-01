import { createClient } from "@supabase/supabase-js";
import { JobStatus, type JobType } from "@ac/shared";

export type PersistentJob = {
  id: string;
  orgId: string;
  documentId: string | null;
  type: JobType;
  status: string;
  payload: Record<string, unknown>;
  attempts: number;
};

type DocumentJobDbRow = {
  id: string;
  org_id: string;
  document_id: string | null;
  type: JobType;
  status: string;
  payload: Record<string, unknown> | null;
  attempts: number;
};

export function mapPersistentJob(row: DocumentJobDbRow): PersistentJob {
  return {
    id: row.id,
    orgId: row.org_id,
    documentId: row.document_id,
    type: row.type,
    status: row.status,
    payload: row.payload ?? {},
    attempts: row.attempts,
  };
}

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

export async function claimNextJob(types: JobType[]): Promise<PersistentJob | null> {
  const client = createWorkerSupabaseClient();
  const { data, error } = await client.rpc("claim_document_job", { p_types: types });
  if (error) throw new Error(`job_claim_failed: ${error.message}`);
  const row = (data as DocumentJobDbRow[] | null)?.[0];
  return row ? mapPersistentJob(row) : null;
}

export async function completeJob(id: string): Promise<void> {
  const { error } = await createWorkerSupabaseClient()
    .from("document_jobs")
    .update({ status: JobStatus.Succeeded, locked_at: null, last_error: null })
    .eq("id", id);
  if (error) throw new Error(`job_complete_failed: ${error.message}`);
}

export async function failJob(id: string, errorMessage: string): Promise<void> {
  const { error } = await createWorkerSupabaseClient()
    .from("document_jobs")
    .update({
      status: JobStatus.Failed,
      locked_at: null,
      last_error: errorMessage.slice(0, 4000),
    })
    .eq("id", id);
  if (error) throw new Error(`job_fail_failed: ${error.message}`);
}
