"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ListOrdered,
  ClipboardCheck,
  CheckCircle2,
  Bot,
  Tags,
  Plug,
  Settings,
} from "lucide-react";
import {
  AppSidebar,
  AppTopbar,
  DashboardLayout,
  GlobalSearch,
  Notifications,
  ProfileMenu,
  type NavSection,
} from "@ac/ui";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const NAV_ITEMS: {
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  section: "main" | "admin";
}[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "main" },
  { id: "documents", label: "Documents", href: "/documents", icon: FileText, section: "main" },
  { id: "ocr-queue", label: "OCR Queue", href: "/ocr/queue", icon: ListOrdered, section: "main" },
  { id: "ocr-review", label: "Review", href: "/ocr/review", icon: ClipboardCheck, section: "main" },
  { id: "approvals", label: "Approvals", href: "/approvals", icon: CheckCircle2, section: "main" },
  { id: "assistant", label: "Assistant (Giulia)", href: "/assistant", icon: Bot, section: "main" },
  { id: "taxonomy", label: "Taxonomy", href: "/taxonomy", icon: Tags, section: "admin" },
  { id: "integrations", label: "Integrations", href: "/integrations", icon: Plug, section: "admin" },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings, section: "admin" },
];

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/settings") return pathname.startsWith("/settings");
  if (href === "/ocr/queue") return pathname === "/ocr" || pathname.startsWith("/ocr/queue");
  if (href === "/assistant") {
    return pathname.startsWith("/assistant") || pathname.startsWith("/giulia");
  }
  return pathname.startsWith(`${href}/`);
}

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const [orgName, setOrgName] = useState("Organization");
  const [profile, setProfile] = useState({ name: "User", email: "" });

  useEffect(() => {
    void (async () => {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user) {
        setProfile({
          name:
            (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
            user.email?.split("@")[0] ||
            "User",
          email: user.email ?? "",
        });
      }
      try {
        const res = await fetch("/api/org");
        if (res.ok) {
          const body = (await res.json()) as { name?: string };
          if (body.name) setOrgName(body.name);
        }
      } catch {
        /* empty */
      }
    })();
  }, []);

  const sections: NavSection[] = [
    {
      id: "main",
      label: "Workspace",
      items: NAV_ITEMS.filter((i) => i.section === "main").map((item) => ({
        ...item,
        active: isActive(pathname, item.href),
      })),
    },
    {
      id: "admin",
      label: "Admin",
      items: NAV_ITEMS.filter((i) => i.section === "admin").map((item) => ({
        ...item,
        active: isActive(pathname, item.href),
      })),
    },
  ];

  const resolvedTitle =
    title ?? NAV_ITEMS.find((i) => isActive(pathname, i.href))?.label ?? "DOC Manager";

  return (
    <DashboardLayout
      sidebar={
        <AppSidebar
          brand={<a href="/dashboard">DOC Manager</a>}
          sections={sections}
          footer={<p className="text-xs text-[var(--dm-color-muted)]">{orgName}</p>}
        />
      }
      topbar={
        <AppTopbar
          title={resolvedTitle}
          search={
            <GlobalSearch
              results={[
                { id: "documents", label: "Documents", href: "/documents", group: "Page" },
                { id: "ocr", label: "OCR queue", href: "/ocr/queue", group: "Page" },
                { id: "assistant", label: "Giulia assistant", href: "/assistant", group: "AI" },
              ]}
            />
          }
          actions={
            <>
              <Notifications items={[]} />
              <ProfileMenu
                name={profile.name}
                {...(profile.email ? { email: profile.email } : {})}
                items={[
                  {
                    id: "org",
                    label: "Organization",
                    onSelect: () => {
                      window.location.href = "/settings/organization";
                    },
                  },
                  {
                    id: "logout",
                    label: "Sign out",
                    onSelect: () => {
                      void createBrowserSupabaseClient()
                        .auth.signOut()
                        .then(() => {
                          window.location.href = "/login";
                        });
                    },
                  },
                ]}
              />
            </>
          }
        />
      }
      footer={<span>DOC Manager · {new Date().getFullYear()}</span>}
    >
      <div className="dm-page-enter dm-fade-in">{children}</div>
    </DashboardLayout>
  );
}
