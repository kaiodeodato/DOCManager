"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardHeader, Input, LoadingState } from "@ac/ui";

export default function OrgSettingsPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/org")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load organization");
        const data = (await res.json()) as { name: string };
        setName(data.name);
      })
      .catch((err: unknown) => {
        setMessage(err instanceof Error ? err.message : "error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading organization…" />;

  return (
    <Card className="max-w-xl p-6">
      <CardHeader title="Organization" description="Tenant profile from Postgres `orgs`." />
      <form
        className="mt-4 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setMessage("Organization rename API not enabled yet — name shown is live from the database.");
        }}
      >
        <Input label="Organization name" value={name} onChange={(e) => setName(e.target.value)} />
        {message ? <p className="text-sm text-[var(--dm-color-muted)]">{message}</p> : null}
        <Button type="submit" variant="primary">
          Save
        </Button>
      </form>
    </Card>
  );
}
