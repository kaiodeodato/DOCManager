import { createAdminSupabaseClient } from "../supabase/admin";
import { createServerSupabaseClient } from "../supabase/server";

export type UserOrgContext = {
  userId: string;
  orgId: string;
  role: "owner" | "accountant" | "viewer";
};

export { createServerSupabaseClient };

export async function getUser() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

function asRole(role: string): UserOrgContext["role"] | null {
  if (role === "owner" || role === "accountant" || role === "viewer") return role;
  return null;
}

function toContext(
  userId: string,
  membership: { org_id: string; role: string } | null,
): UserOrgContext | null {
  if (!membership) return null;
  const role = asRole(membership.role);
  if (!role) return null;
  return { userId, orgId: membership.org_id, role };
}

export async function getUserOrgContext(): Promise<UserOrgContext | null> {
  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", authData.user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  const fromRls = toContext(authData.user.id, membership);
  if (fromRls) return fromRls;

  // RLS / JWT quirks can hide membership; service role still resolves it.
  const admin = createAdminSupabaseClient();
  const { data: adminMembership } = await admin
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", authData.user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  return toContext(authData.user.id, adminMembership);
}

/** Like getUserOrgContext, but creates an org+membership if the user has none. */
export async function ensureUserOrgContext(): Promise<UserOrgContext | null> {
  const existing = await getUserOrgContext();
  if (existing) return existing;

  const user = await getUser();
  if (!user) return null;

  const admin = createAdminSupabaseClient();
  const organizationName = `${user.user_metadata.full_name ?? user.email ?? "DOC Manager"} workspace`;
  const { data: org, error: orgError } = await admin
    .from("orgs")
    .insert({ name: organizationName })
    .select("id")
    .single();
  if (orgError || !org) return null;

  const { error: memberError } = await admin.from("org_members").insert({
    org_id: org.id,
    user_id: user.id,
    role: "owner",
  });
  if (memberError) {
    await admin.from("orgs").delete().eq("id", org.id);
    return null;
  }

  return { userId: user.id, orgId: org.id, role: "owner" };
}
