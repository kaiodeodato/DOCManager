"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Alert, Badge, Button, Card, CardHeader, EmptyState, Input, Timeline } from "@ac/ui";
import { Plug } from "lucide-react";

const CATALOG: Record<
  string,
  { name: string; description: string; status: "available" | "connected" | "error" }
> = {
  sap: {
    name: "SAP S/4HANA",
    description: "Push approved invoices and pull vendor master data.",
    status: "available",
  },
  sharepoint: {
    name: "SharePoint",
    description: "Archive finalized PDFs into site libraries.",
    status: "available",
  },
  twilio: {
    name: "Twilio WhatsApp",
    description: "Notify approvers on mobile via WhatsApp.",
    status: "available",
  },
  slack: {
    name: "Slack",
    description: "Channel alerts for needs_review documents.",
    status: "available",
  },
};

export default function IntegrationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const item = CATALOG[id];
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const steps = useMemo(() => ["Credentials", "Mapping", "Test sync", "Done"], []);

  if (!item) {
    return (
      <EmptyState
        icon={Plug}
        title="Integration not found"
        description="Choose a connector from the integrations list."
        actionLabel="Back"
        onAction={() => {
          window.location.href = "/integrations";
        }}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card className="p-6">
        <CardHeader
          title={item.name}
          description={item.description}
          action={<Badge>{item.status}</Badge>}
        />
      </Card>

      <Card className="p-6">
        <CardHeader
          title="Connect wizard"
          description="Credentials are stored only after a live connector is configured."
        />
        <div className="mt-4">
          <Timeline
            items={steps.map((title, i) => ({
              id: String(i),
              title,
              status: i < step ? "done" : i === step ? "current" : "upcoming",
            }))}
          />
        </div>

        {step === 0 ? (
          <div className="mt-4 flex flex-col gap-3">
            <Input
              label="API key / client secret"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Input label="Tenant / site URL" placeholder="https://…" />
          </div>
        ) : null}
        {step === 1 ? (
          <Alert variant="info" title="Mapping" className="mt-4">
            Field mapping will be saved to your org when ERP connectors are enabled.
          </Alert>
        ) : null}
        {step === 2 ? (
          <Alert variant="info" title="Dry run" className="mt-4">
            No external writes until a production connector credential is configured.
          </Alert>
        ) : null}
        {step === 3 ? (
          <Alert variant="success" title="Ready" className="mt-4">
            Wizard complete. Connect live credentials in Settings when available.
          </Alert>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-between gap-2">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          <Button
            variant="primary"
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={step === 0 && apiKey.trim().length === 0}
          >
            {step >= steps.length - 1 ? "Finish" : "Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
