/**
 * Signed URL helper for document preview and external sharing (E9.01).
 * Uses SUPABASE_* env when present; otherwise returns a deterministic fake URL for tests/CI.
 */

import { createClient } from "@supabase/supabase-js";

export type SignedUrlOptions = {
  storagePath: string;
  expiresInSeconds?: number;
  /** Override bucket; defaults to documents */
  bucket?: string;
};

export type SignedUrlResult = {
  url: string;
  expiresAt: string;
  mode: "supabase" | "fake";
};

function readSupabaseConfig(): { url: string; key: string } | null {
  const url =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_PROJECT_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

/**
 * Create a time-limited signed URL for a storage object.
 * When Supabase env is missing, returns `https://signed.local/...` for tests.
 */
export async function createSignedUrl(
  options: SignedUrlOptions,
): Promise<SignedUrlResult> {
  const expiresIn = options.expiresInSeconds ?? 3600;
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  const bucket = options.bucket ?? "documents";
  const cfg = readSupabaseConfig();

  if (!cfg) {
    const token = Buffer.from(`${bucket}:${options.storagePath}:${expiresAt}`).toString(
      "base64url",
    );
    return {
      url: `https://signed.local/${bucket}/${encodeURIComponent(options.storagePath)}?token=${token}&exp=${expiresAt}`,
      expiresAt,
      mode: "fake",
    };
  }

  const supabase = createClient(cfg.url, cfg.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(options.storagePath, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "signed_url_failed");
  }

  return {
    url: data.signedUrl,
    expiresAt,
    mode: "supabase",
  };
}
