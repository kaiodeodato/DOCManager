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

export async function getUserOrgContext(): Promise<UserOrgContext | null> {
  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  const { data: membership, error: membershipError } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", authData.user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) return null;
  if (
    membership.role !== "owner" &&
    membership.role !== "accountant" &&
    membership.role !== "viewer"
  ) {
    return null;
  }

  return {
    userId: authData.user.id,
    orgId: membership.org_id,
    role: membership.role,
  };
}
