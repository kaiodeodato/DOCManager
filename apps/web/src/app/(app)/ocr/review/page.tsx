"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Card, CardHeader, Input, Progress } from "@ac/ui";

type ReviewDoc = {
  id: string;
  originalFilename: string;
  status: string;
  extraction?: {
    documentType: string;
    entities: {
      nif: string | null;
      value: number | null;
      date: string | null;
      supplier: string | null;
    };
    confidence: number;
  } | null;
};

function confidenceVariant(c: number): "success" | "warning" | "danger" {
  if (c >= 0.9) return "success";
  if (c >= 0.75) return "warning";
  return "danger";
}

export default function OcrReviewListPage() {
  const [docs, setDocs] = useState<ReviewDoc[]>([]);
  const [selected, setSelected] = useState<ReviewDoc | null>(null);
  const [documentType, setDocumentType] = useState("invoice");
  const [nif, setNif] = useState("");
  const [supplier, setSupplier] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/ocr/review");
      if (!res.ok) throw new Error("review_queue_failed");
      const data = (await res.json()) as { documents: ReviewDoc[] };
      setDocs(data.documents);
    } catch {
      setDocs([]);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const select = (doc: ReviewDoc) => {
    setSelected(doc);
    setDocumentType(doc.extraction?.documentType ?? "invoice");
    setNif(doc.extraction?.entities.nif ?? "");
    setSupplier(doc.extraction?.entities.supplier ?? "");
    setValue(
      doc.extraction?.entities.value != null ? String(doc.extraction.entities.value) : "",
    );
    setDate(doc.extraction?.entities.date ?? "");
    setMessage(null);
  };

  const submitCorrection = async () => {
    if (!selected) return;
    const corrected = {
      documentType,
      entities: {
        nif: nif || null,
        value: value ? Number(value) : null,
        date: date || null,
        supplier: supplier || null,
      },
      confidence: 1,
    };
    const res = await fetch("/api/ocr/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId: selected.id,
        original: selected.extraction ?? {},
        corrected,
      }),
    });
    if (!res.ok) {
      setMessage("Could not save correction");
      return;
    }
    setMessage("Saved — document classified");
    setSelected(null);
    await refresh();
  };

  const confidence = selected?.extraction?.confidence ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-lg font-semibold tracking-tight">OCR review</h2>
        <p className="text-sm text-[var(--dm-color-muted)]">
          Correct low-confidence extractions with confidence indicators.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <ul className="divide-y divide-[var(--dm-color-border)] rounded-2xl border border-[var(--dm-color-border)] bg-white">
          {docs.length === 0 ? (
            <li className="p-6 text-[var(--dm-color-muted)]">No documents in review.</li>
          ) : (
            docs.map((doc) => {
              const c = doc.extraction?.confidence ?? 0;
              return (
                <li key={doc.id} className="flex items-center justify-between gap-4 p-4">
                  <button type="button" className="text-left" onClick={() => select(doc)}>
                    <p className="font-medium">{doc.originalFilename}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={Math.round(c * 100)} className="w-28" />
                      <Badge variant={confidenceVariant(c)}>{Math.round(c * 100)}%</Badge>
                    </div>
                  </button>
                  <Badge variant="warning">{doc.status}</Badge>
                </li>
              );
            })
          )}
        </ul>

        <Card className="p-6">
          {selected ? (
            <>
              <CardHeader
                title={`Correct ${selected.originalFilename}`}
                description={
                  <span className="inline-flex items-center gap-2">
                    Model confidence
                    <Badge variant={confidenceVariant(confidence)}>
                      {Math.round(confidence * 100)}%
                    </Badge>
                  </span>
                }
              />
              <div className="mt-4 flex flex-col gap-3">
                <Input
                  label="Document type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                />
                <Input label="NIF" value={nif} onChange={(e) => setNif(e.target.value)} />
                <Input
                  label="Supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                />
                <Input label="Value" value={value} onChange={(e) => setValue(e.target.value)} />
                <Input
                  label="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => void submitCorrection()}>Save correction</Button>
                  <a href={`/ocr/${selected.id}`}>
                    <Button variant="outline">Open detail review</Button>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[var(--dm-color-muted)]">Select a document to correct.</p>
          )}
          {message ? <p className="mt-3 text-sm text-[var(--dm-color-accent)]">{message}</p> : null}
        </Card>
      </div>
    </div>
  );
}
