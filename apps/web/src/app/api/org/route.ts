import { getUserOrgContext } from "@/lib/auth/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orgs")
    .select("id, name, created_at")
    .eq("id", context.orgId)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return Response.json({ error: "org_not_found" }, { status: 404 });
  return Response.json({ id: data.id, name: data.name, createdAt: data.created_at });
}
