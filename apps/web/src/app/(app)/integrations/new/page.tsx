"use client";

import { useState } from "react";
import { Button, Card, CardHeader, Input, Select } from "@ac/ui";

const STEPS = ["Select", "Authenticate", "Map fields", "Confirm"];

export default function IntegrationWizardPage() {
  const [step, setStep] = useState(0);
  return (
    <Card className="mx-auto max-w-xl p-6">
      <CardHeader title="Connection wizard" description={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} />
      <ol className="mt-4 flex gap-2 text-xs font-semibold">
        {STEPS.map((s, i) => (
          <li key={s} className={`rounded-full px-3 py-1 ${i === step ? "bg-[var(--dm-color-accent)] text-white" : "bg-[var(--dm-color-accent-muted)] text-[var(--dm-color-accent)]"}`}>
            {s}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-col gap-4">
        {step === 0 ? (
          <Select
            label="Provider"
            options={[
              { value: "sap", label: "SAP S/4HANA" },
              { value: "sharepoint", label: "SharePoint" },
              { value: "twilio", label: "Twilio WhatsApp" },
              { value: "slack", label: "Slack" },
            ]}
          />
        ) : null}
        {step === 1 ? (
          <>
            <Input label="Client ID" />
            <Input label="Client secret" type="password" />
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Input label="External invoice field" defaultValue="Belnr" />
            <Input label="DOC Manager field" defaultValue="invoice_number" />
          </>
        ) : null}
        {step === 3 ? (
          <p className="text-sm text-[var(--dm-color-muted)]">Review and enable the connector for Acme Org.</p>
        ) : null}
      </div>
      <div className="mt-6 flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
        {step < STEPS.length - 1 ? (
          <Button variant="primary" onClick={() => setStep((s) => s + 1)}>Continue</Button>
        ) : (
          <a href="/integrations"><Button variant="primary">Finish</Button></a>
        )}
      </div>
    </Card>
  );
}
