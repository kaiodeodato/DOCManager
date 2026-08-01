import { getUserOrgContext } from "@/lib/auth/server";
import { listPersistedDocuments } from "@/lib/document-repository";

export const runtime = "nodejs";

/** E5.05 — review queue for documents in needs_review. */
export async function GET(): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });
  const documents = (await listPersistedDocuments(context.orgId)).filter(
    (document) => document.status === "needs_review",
  );
  return Response.json({ documents });
}
