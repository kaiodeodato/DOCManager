import { DocumentStatus, assertDocumentTransition } from "@ac/shared";
import { defaultMockErp } from "@/lib/connectors/mock-erp";
import { getDocument, updateDocument } from "@/lib/document-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * E8.03 / E8.04 — export approved document via mock ERP.
 * Failures land in export_failed; retries are idempotent.
 */
export async function POST(request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    forceFail?: boolean;
    idempotencyKey?: string;
  };

  const doc = getDocument(id);
  if (!doc) {
    return Response.json({ error: "document_not_found" }, { status: 404 });
  }

  const from =
    doc.status === DocumentStatus.ExportFailed
      ? DocumentStatus.ExportFailed
      : DocumentStatus.Approved;

  if (doc.status !== DocumentStatus.Approved && doc.status !== DocumentStatus.ExportFailed) {
    return Response.json(
      { error: `export_requires_approved_or_export_failed:got_${doc.status}` },
      { status: 409 },
    );
  }

  const idempotencyKey = body.idempotencyKey ?? `export:${id}`;

  if (body.forceFail) {
    defaultMockErp.simulateFailureOnce();
  }

  const result = await defaultMockErp.export({
    orgId: doc.orgId ?? "",
    documentId: id,
    documentType: doc.documentType ?? null,
    entities: (doc.extraction?.entities as Record<string, unknown>) ?? {},
    idempotencyKey,
  });

  if (!result.ok) {
    assertDocumentTransition(from, DocumentStatus.ExportFailed);
    const updated = updateDocument(id, { status: DocumentStatus.ExportFailed });
    return Response.json(
      { document: updated, export: result },
      { status: 502 },
    );
  }

  assertDocumentTransition(
    doc.status === DocumentStatus.ExportFailed
      ? DocumentStatus.ExportFailed
      : DocumentStatus.Approved,
    DocumentStatus.Exported,
  );
  const updated = updateDocument(id, { status: DocumentStatus.Exported });
  return Response.json({ document: updated, export: result });
}
