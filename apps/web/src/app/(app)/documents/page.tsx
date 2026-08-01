"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DocumentStatus } from "@ac/shared";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  UploadDropzone,
} from "@ac/ui";
import { Files } from "lucide-react";

type DocumentRow = {
  id: string;
  name: string;
  status: string;
  type: string;
  confidence: number;
  storagePath?: string;
};

export default function DocumentsListPage() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Failed to load documents");
      const data = (await response.json()) as {
        documents: {
          id: string;
          originalFilename: string;
          status: string;
          storagePath?: string;
        }[];
      };
      setDocuments(
        data.documents.map((d) => {
          const row: DocumentRow = {
            id: d.id,
            name: d.originalFilename,
            status: d.status,
            type: "Document",
            confidence: d.status === DocumentStatus.NeedsReview ? 0.7 : 0.95,
          };
          if (d.storagePath != null) row.storagePath = d.storagePath;
          return row;
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onFileSelected = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File exceeds 50MB limit");
    }
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/documents/upload", { method: "POST", body });
    if (!response.ok) {
      let detail = `Upload failed (${response.status})`;
      try {
        const payload = (await response.json()) as { error?: unknown };
        if (typeof payload.error === "string") detail = payload.error;
        else if (payload.error != null) detail = JSON.stringify(payload.error);
      } catch {
        /* keep status text */
      }
      throw new Error(detail);
    }
    await refresh();
  };

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const q = query.toLowerCase();
      const matchQ = !q || d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
      const matchS = status === "all" || d.status === status;
      const matchT = type === "all" || d.type === type;
      return matchQ && matchS && matchT;
    });
  }, [documents, query, status, type]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Documents</h2>
          <p className="text-sm text-[var(--dm-color-muted)]">Filter, search, and open details.</p>
        </div>
        <Button variant="secondary" onClick={() => setAdvancedOpen((v) => !v)}>
          {advancedOpen ? "Hide advanced" : "Advanced search"}
        </Button>
      </div>

      <Card className="flex flex-col gap-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or tag"
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "all", label: "All statuses" },
              { value: DocumentStatus.Received, label: "Received" },
              { value: DocumentStatus.OcrDone, label: "OCR complete" },
              { value: DocumentStatus.NeedsReview, label: "Needs review" },
              { value: DocumentStatus.Approved, label: "Approved" },
            ]}
          />
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: "all", label: "All types" },
              { value: "Invoice", label: "Invoice" },
              { value: "Contract", label: "Contract" },
              { value: "Receipt", label: "Receipt" },
              { value: "Policy", label: "Policy" },
              { value: "Document", label: "Document" },
            ]}
          />
        </div>
        {advancedOpen ? (
          <div className="grid gap-3 border-t border-[var(--dm-color-border)] pt-4 md:grid-cols-3">
            <Input label="Vendor contains" placeholder="ACME" />
            <Input label="Uploaded after" type="date" />
            <Input
              label="Min confidence"
              type="number"
              min={0}
              max={1}
              step={0.01}
              placeholder="0.8"
            />
          </div>
        ) : null}
      </Card>

      <UploadDropzone onFileSelected={onFileSelected} />

      {loading ? <LoadingState label="Loading documents…" /> : null}

      {!loading && error && documents.length === 0 ? (
        <ErrorState
          title="Could not load documents"
          description={error}
          actionLabel="Retry"
          onAction={() => void refresh()}
        />
      ) : null}

      {!loading && filtered.length === 0 ? (
        <EmptyState
          icon={Files}
          title="No documents match"
          description="Adjust filters or upload a new file."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery("");
            setStatus("all");
            setType("all");
          }}
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Confidence</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <a
                    href={`/documents/${doc.id}`}
                    className="font-medium text-[var(--dm-color-accent)]"
                  >
                    {doc.name}
                  </a>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>
                  <Badge>{doc.status}</Badge>
                </TableCell>
                <TableCell>{Math.round(doc.confidence * 100)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}
