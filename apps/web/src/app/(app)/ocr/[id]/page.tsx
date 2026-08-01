"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, CardHeader, Input, Textarea } from "@ac/ui";

type OcrDocument = {
  id: string;
  originalFilename: string;
  ocrText: string | null;
  status: string;
};

export default function OcrReviewPage() {
  const params = useParams<{ id: string }>();
  const [doc, setDoc] = useState<OcrDocument | null>(null);
  const [text, setText] = useState("");
  const [vendor, setVendor] = useState("");

  useEffect(() => {
    if (!params.id) return;
    void fetch(`/api/documents/${params.id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("document_load_failed");
        return response.json() as Promise<{ document: OcrDocument }>;
      })
      .then(({ document }) => {
        setDoc(document);
        setText(document.ocrText ?? "");
      })
      .catch(() => setDoc(null));
  }, [params.id]);

  if (!doc) {
    return <p className="text-[var(--dm-color-muted)]">Loading document…</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardHeader title="Source preview" description={doc.originalFilename} />
        <div className="mt-4 flex min-h-80 items-center justify-center rounded-xl border border-dashed border-[var(--dm-color-border)] bg-[var(--dm-color-accent-muted)] text-sm text-[var(--dm-color-muted)]">
          Page preview
        </div>
      </Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Review fields</h2>
          <span className="text-sm text-[var(--dm-color-muted)]">{doc.status}</span>
        </div>
        <Input label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
        <Textarea label="OCR text" value={text} onChange={(e) => setText(e.target.value)} rows={10} />
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Approve corrections</Button>
          <Button variant="outline">Reject & requeue</Button>
          <a href="/ocr/queue"><Button variant="ghost">Back to queue</Button></a>
          <a href="/ocr/review"><Button variant="ghost">Review list</Button></a>
        </div>
      </div>
    </div>
  );
}
