export function tryGetPublicSupabaseEnv(): {
  url: string;
  anonKey: string;
} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getPublicSupabaseEnv(): {
  url: string;
  anonKey: string;
} {
  const env = tryGetPublicSupabaseEnv();
  if (!env) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return env;
}

export function getServerSupabaseEnv(): {
  url: string;
  serviceRoleKey: string;
} {
  if (typeof window !== "undefined") {
    throw new Error("The Supabase admin client is server-only");
  }

  const { url } = getPublicSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add the server-only key to .env.",
    );
  }

  return { url, serviceRoleKey };
}
