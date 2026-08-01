"use client";

import { Badge, Card, CardHeader, EmptyState } from "@ac/ui";
import { Plug } from "lucide-react";

const CATALOG = [
  {
    id: "sap",
    name: "SAP S/4HANA",
    description: "Push approved invoices and pull vendor master data.",
    status: "available" as const,
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    description: "Archive finalized PDFs into site libraries.",
    status: "available" as const,
  },
  {
    id: "twilio",
    name: "Twilio WhatsApp",
    description: "Notify approvers on mobile via WhatsApp.",
    status: "available" as const,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Channel alerts for needs_review documents.",
    status: "available" as const,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="mt-1 text-sm text-[var(--dm-color-muted)]">
          Available connectors. No fake connected tenants are pre-seeded.
        </p>
      </header>
      {CATALOG.length === 0 ? (
        <EmptyState icon={Plug} title="No integrations" description="Connectors will appear here." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {CATALOG.map((item) => (
            <li key={item.id}>
              <a href={`/integrations/${item.id}`} className="block dm-hover-lift">
                <Card className="p-5">
                  <CardHeader
                    title={item.name}
                    description={item.description}
                    action={<Badge>{item.status}</Badge>}
                  />
                </Card>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
