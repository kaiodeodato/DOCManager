"use client";

import { useEffect, useState } from "react";
import {
  ChartCard,
  DocumentCard,
  EmptyState,
  ErrorState,
  InsightCard,
  LoadingState,
  MetricCard,
  Timeline,
} from "@ac/ui";
import { FileText } from "lucide-react";

type ViewState = "loading" | "error" | "empty" | "ready";
type DashboardDocument = {
  id: string;
  originalFilename: string;
  documentType: string | null;
  status: string;
};

export default function DashboardPage() {
  const [state, setState] = useState<ViewState>("loading");
  const [documents, setDocuments] = useState<DashboardDocument[]>([]);

  useEffect(() => {
    void fetch("/api/documents")
      .then(async (response) => {
        if (!response.ok) throw new Error("documents_failed");
        const data = (await response.json()) as { documents: DashboardDocument[] };
        setDocuments(data.documents);
        setState(data.documents.length === 0 ? "empty" : "ready");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading") {
    return <LoadingState label="Loading dashboard…" />;
  }

  if (state === "error") {
    return (
      <ErrorState
        title="Could not load dashboard"
        description="Try again in a moment."
        actionLabel="Retry"
        onAction={() => {
          setState("loading");
          window.location.reload();
        }}
      />
    );
  }

  if (state === "empty") {
    return (
      <EmptyState
        icon={FileText}
        title="No documents yet"
        description="Upload your first file to see metrics."
        actionLabel="Go to documents"
        onAction={() => {
          window.location.href = "/documents";
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Documents", value: String(documents.length), delta: { value: "Current workspace" } },
          {
            title: "Needs review",
            value: String(documents.filter((document) => document.status === "needs_review").length),
            delta: { value: "Requires attention" },
          },
          {
            title: "Approved",
            value: String(documents.filter((document) => document.status === "approved").length),
            delta: { value: "Completed" },
          },
          {
            title: "OCR failed",
            value: String(documents.filter((document) => document.status === "ocr_failed").length),
            delta: { value: "Retry required" },
          },
        ].map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            delta={m.delta}
            className="dm-hover-lift dm-counter"
          />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <ChartCard
          title="Throughput (7 days)"
          description="Documents processed"
          className="lg:col-span-3 dm-chart-animate"
        />
        <div className="flex flex-col gap-4 lg:col-span-2">
          <InsightCard
            title="Giulia insight"
            insight="37 documents need review — most are contracts under 80% confidence."
            source="Last 24h"
          />
          <InsightCard
            title="Next action"
            insight="Ask Giulia to triage the OCR queue and draft approval summaries."
            source={<a href="/assistant">Open Giulia →</a>}
          />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--dm-color-muted)]">
            Recent documents
          </h2>
          <ul className="grid gap-3">
            {documents.slice(0, 3).map((doc) => (
              <li key={doc.id}>
                <a href={`/documents/${doc.id}`} className="no-underline">
                  <DocumentCard
                    title={doc.originalFilename}
                    meta={doc.documentType ?? "Document"}
                    status={doc.status}
                    className="dm-hover-lift"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--dm-color-muted)]">Activity</h2>
          <Timeline
            items={[
              {
                id: "1",
                title: "Invoice approved",
                description: "Ana Silva",
                time: "10m",
                status: "done",
              },
              {
                id: "2",
                title: "OCR review",
                description: "Contract-Renewal-Q3",
                time: "25m",
                status: "current",
              },
              {
                id: "3",
                title: "Upload received",
                description: "Receipt-Travel-Berlin",
                time: "1h",
                status: "upcoming",
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
