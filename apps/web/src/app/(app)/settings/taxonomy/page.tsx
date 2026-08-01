"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Input, Textarea } from "@ac/ui";

const ORG_ID = "11111111-1111-4111-8111-111111111111";

export default function TaxonomySettingsPage() {
  const [json, setJson] = useState(
    JSON.stringify(
      {
        documentTypes: [{ id: "invoice", label: "Invoice", tags: ["finance"] }],
        costCenters: [{ id: "ops", label: "Operations" }],
        virtualFolders: [{ id: "inbox", label: "Inbox", tag: "inbox" }],
      },
      null,
      2,
    ),
  );
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/taxonomy?orgId=${ORG_ID}`);
    const data = (await res.json()) as { config: unknown };
    setJson(JSON.stringify(data.config, null, 2));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setMessage(null);
    let config: unknown;
    try {
      config = JSON.parse(json) as unknown;
    } catch {
      setMessage("Invalid JSON");
      return;
    }
    const res = await fetch("/api/taxonomy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId: ORG_ID, config }),
    });
    if (!res.ok) {
      setMessage("Save failed — check schema");
      return;
    }
    setMessage("Taxonomy saved. Existing documents are unchanged.");
    await load();
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header>
        <h2 className="text-lg font-semibold tracking-tight">Taxonomy JSON</h2>
        <p className="text-sm text-[var(--dm-color-muted)]">
          Owner config for types and folders.{" "}
          <a href="/taxonomy" className="text-[var(--dm-color-accent)]">
            Open taxonomy UI
          </a>
        </p>
      </header>
      <Input label="Organization" value={ORG_ID} readOnly />
      <Textarea
        label="Taxonomy JSON"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={16}
      />
      <Button onClick={() => void save()}>Save taxonomy</Button>
      {message ? <p className="text-sm text-[var(--dm-color-accent)]">{message}</p> : null}
    </div>
  );
}
