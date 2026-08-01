import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const existing = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing.data) return Response.json({ orgId: existing.data.org_id });

  const body = (await request.json().catch(() => ({}))) as { organizationName?: unknown };
  const requestedName =
    typeof body.organizationName === "string" ? body.organizationName.trim() : "";
  const organizationName =
    requestedName.slice(0, 120) ||
    `${user.user_metadata.full_name ?? user.email ?? "DOC Manager"} workspace`;

  const admin = createAdminSupabaseClient();
  const { data: org, error: orgError } = await admin
    .from("orgs")
    .insert({ name: organizationName })
    .select("id")
    .single();
  if (orgError) return Response.json({ error: orgError.message }, { status: 500 });

  const { error: memberError } = await admin.from("org_members").insert({
    org_id: org.id,
    user_id: user.id,
    role: "owner",
  });
  if (memberError) {
    await admin.from("orgs").delete().eq("id", org.id);
    return Response.json({ error: memberError.message }, { status: 500 });
  }

  return Response.json({ orgId: org.id }, { status: 201 });
}
