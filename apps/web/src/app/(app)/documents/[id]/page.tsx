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
import { createSignedUrl } from "@/lib/storage/signed-url";

function isPdf(mimeType: string | null, filename: string): boolean {
  if (mimeType === "application/pdf") return true;
  return filename.toLowerCase().endsWith(".pdf");
}

function isImage(mimeType: string | null, filename: string): boolean {
  if (mimeType?.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|tiff?)$/i.test(filename);
}

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

  let previewUrl: string | null = null;
  let previewError: string | null = null;
  try {
    const signed = await createSignedUrl({
      storagePath: doc.storagePath,
      expiresInSeconds: 3600,
    });
    previewUrl = signed.mode === "fake" ? null : signed.url;
    if (signed.mode === "fake") {
      previewError = "Storage is not configured for preview.";
    }
  } catch (err) {
    previewError = err instanceof Error ? err.message : "Preview unavailable";
  }

  const pdf = isPdf(doc.mimeType, doc.originalFilename);
  const image = isImage(doc.mimeType, doc.originalFilename);

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
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">Open file</Button>
            </a>
          ) : null}
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
                <div className="mt-4 overflow-hidden rounded-xl border border-[var(--dm-color-border)] bg-[var(--dm-color-accent-muted)]">
                  {previewUrl && pdf ? (
                    <iframe
                      title={doc.originalFilename}
                      src={previewUrl}
                      className="h-[70vh] w-full bg-white"
                    />
                  ) : previewUrl && image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt={doc.originalFilename}
                      className="mx-auto max-h-[70vh] w-auto object-contain p-4"
                    />
                  ) : previewUrl ? (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-sm text-[var(--dm-color-muted)]">
                      <p>Inline preview is not available for this file type.</p>
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-[var(--dm-color-accent)] underline"
                      >
                        Open signed URL
                      </a>
                    </div>
                  ) : (
                    <div className="flex min-h-56 items-center justify-center p-6 text-sm text-[var(--dm-color-muted)]">
                      {previewError ?? "Preview unavailable"}
                    </div>
                  )}
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
