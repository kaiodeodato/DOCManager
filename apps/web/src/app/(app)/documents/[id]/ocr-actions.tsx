"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@ac/ui";

export function DocumentOcrActions({
  documentId,
  canRetry,
}: {
  documentId: string;
  canRetry: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canRetry) return null;

  const onRun = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/ocr/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });
      const payload = (await response.json()) as { error?: string; processed?: boolean };
      if (!response.ok) throw new Error(payload.error ?? "OCR failed");
      if (!payload.processed) throw new Error("No pending OCR job");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OCR failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <Button variant="secondary" onClick={() => void onRun()} disabled={busy}>
        {busy ? "Running OCR…" : "Run OCR"}
      </Button>
      {error ? <span className="text-red-600">{error}</span> : null}
    </span>
  );
}
