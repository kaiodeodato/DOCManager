import { UserRole, assertCapability, canShareExternally } from "@ac/shared";
import { createSignedUrl } from "@/lib/storage/signed-url";
import { getDocumentById } from "@/lib/document-store";

export const runtime = "nodejs";

/**
 * External share via signed URL (E9.01) — gated by role capabilities.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const record = body as {
    orgId?: unknown;
    documentId?: unknown;
    role?: unknown;
    expiresInSeconds?: unknown;
  };

  const orgId = typeof record.orgId === "string" ? record.orgId : "";
  const documentId = typeof record.documentId === "string" ? record.documentId : "";
  const role =
    record.role === UserRole.Owner ||
    record.role === UserRole.Accountant ||
    record.role === UserRole.Viewer
      ? record.role
      : UserRole.Viewer;

  if (!orgId || !documentId) {
    return Response.json({ error: "orgId and documentId required" }, { status: 400 });
  }

  if (!canShareExternally(role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    assertCapability(role, "share:external");
  } catch {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const doc = getDocumentById(documentId, orgId);
  if (!doc) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const signed = await createSignedUrl({
    storagePath: doc.storagePath,
    expiresInSeconds:
      typeof record.expiresInSeconds === "number" ? record.expiresInSeconds : 3600,
  });

  return Response.json({ documentId, ...signed });
}
