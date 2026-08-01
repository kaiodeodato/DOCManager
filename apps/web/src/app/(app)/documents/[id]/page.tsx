import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Tabs,
  Timeline,
} from "@ac/ui";
import { getUserOrgContext } from "@/lib/auth/server";
import { getPersistedDocument } from "@/lib/document-repository";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const context = await getUserOrgContext();
  if (!context) notFound();
  const { id } = await params;
  const doc = await getPersistedDocument(context.orgId, id);
  if (!doc) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--dm-color-muted)]">Documents / {doc.id}</p>
          <h2 className="text-xl font-semibold tracking-tight">{doc.originalFilename}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{doc.status}</Badge>
            <Badge variant="neutral">{doc.documentType ?? "Document"}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="/ocr/review"><Button variant="secondary">Open OCR review</Button></a>
          <a href="/approvals"><Button variant="primary">Send to approval</Button></a>
        </div>
      </div>

      <Tabs
        items={[
          {
            id: "preview",
            label: "Preview",
            content: (
              <Card className="min-h-72 p-6">
                <CardHeader title="Document preview" description={doc.originalFilename} />
                <div className="mt-4 flex min-h-56 items-center justify-center rounded-xl border border-dashed border-[var(--dm-color-border)] bg-[var(--dm-color-accent-muted)] text-sm text-[var(--dm-color-muted)]">
                  Preview is available through a signed Storage URL.
                </div>
              </Card>
            ),
          },
          {
            id: "ocr",
            label: "OCR metadata",
            content: (
              <Card className="p-6">
                <CardHeader title="OCR metadata" description={doc.status} />
                <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
                  {doc.ocrText ?? "OCR pending…"}
                </pre>
              </Card>
            ),
          },
          {
            id: "history",
            label: "History",
            content: (
              <Card className="p-6">
                <CardHeader title="History" />
                <Timeline
                  items={[
                    { id: "h1", title: "Uploaded", time: doc.createdAt, status: "done" },
                    {
                      id: "h2",
                      title: "Current status",
                      description: doc.status,
                      status: "current",
                    },
                  ]}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
