import {
  DocumentStatus,
  DocumentStatusTransitionSchema,
  assertDocumentTransition,
  canTransition,
  InvalidDocumentTransitionError,
  type DocumentStatus as DocumentStatusValue,
} from "@ac/shared";
import { getDocument, updateDocument } from "@/lib/document-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/** E8.02 — validate and apply a document status transition. */
export async function POST(request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const body: unknown = await request.json();
  const parsed = DocumentStatusTransitionSchema.safeParse({
    ...(typeof body === "object" && body !== null ? body : {}),
    documentId: id,
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const doc = getDocument(id);
  if (!doc) {
    return Response.json({ error: "document_not_found" }, { status: 404 });
  }

  const from = doc.status as DocumentStatusValue;
  const to = parsed.data.toStatus as DocumentStatusValue;

  try {
    assertDocumentTransition(from, to);
  } catch (err) {
    if (err instanceof InvalidDocumentTransitionError) {
      return Response.json(
        {
          error: err.message,
          from: err.from,
          to: err.to,
          allowed: Object.values(DocumentStatus).filter((s) => canTransition(from, s)),
        },
        { status: 409 },
      );
    }
    throw err;
  }

  const updated = updateDocument(id, { status: to });
  return Response.json({ document: updated });
}
