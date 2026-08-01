import { Card, CardHeader } from "@ac/ui";

const LINKS = [
  { href: "/settings/organization", title: "Organization", description: "Name, locale, branding" },
  { href: "/settings/users", title: "Users", description: "Invite and manage members" },
  { href: "/settings/roles", title: "Roles", description: "Permissions matrix" },
  { href: "/settings/security", title: "Security", description: "SSO, sessions, MFA" },
  { href: "/settings/notifications", title: "Notifications", description: "Email & WhatsApp preferences" },
  { href: "/settings/taxonomy", title: "Taxonomy JSON", description: "Document types & folders API" },
  { href: "/taxonomy", title: "Taxonomy UI", description: "Categories, tags, custom fields" },
];

export default function SettingsIndexPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {LINKS.map((l) => (
        <a key={l.href} href={l.href} className="no-underline">
          <Card className="dm-hover-lift h-full p-2">
            <CardHeader title={l.title} description={l.description} />
          </Card>
        </a>
      ))}
    </div>
  );
}
