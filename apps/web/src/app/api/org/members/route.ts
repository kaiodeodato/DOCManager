import { getUserOrgContext } from "@/lib/auth/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("org_members")
    .select("id, role, user_id")
    .eq("org_id", context.orgId)
    .order("created_at");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ members: data ?? [] });
}
