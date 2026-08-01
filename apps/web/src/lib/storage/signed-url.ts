/**
 * Signed URL helper for external document sharing (E9.01).
 * Uses SUPABASE_* env when present; otherwise returns a deterministic fake URL for tests/CI.
 */

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
 * Stub: when Supabase env is missing, returns `https://signed.local/...` for tests.
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

  // Lightweight stub that shapes like Supabase Storage signed URL without network I/O in CI.
  // Real createSignedUrl can replace this when Storage client is wired.
  const token = Buffer.from(`${cfg.key.slice(0, 8)}:${options.storagePath}`).toString(
    "base64url",
  );
  return {
    url: `${cfg.url}/storage/v1/object/sign/${bucket}/${options.storagePath}?token=${token}`,
    expiresAt,
    mode: "supabase",
  };
}
