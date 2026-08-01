import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const admin = createAdminSupabaseClient();
        const { data: membership } = await admin
          .from("org_members")
          .select("org_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();
        if (!membership) {
          const { data: org } = await admin
            .from("orgs")
            .insert({
              name: `${user.user_metadata.full_name ?? user.email ?? "DOC Manager"} workspace`,
            })
            .select("id")
            .single();
          if (org) {
            await admin.from("org_members").insert({
              org_id: org.id,
              user_id: user.id,
              role: "owner",
            });
          }
        }
      }
      return NextResponse.redirect(new URL(next?.startsWith("/") ? next : "/dashboard", url.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", url.origin));
}
