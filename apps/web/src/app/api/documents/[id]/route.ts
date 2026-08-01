import { getUserOrgContext } from "@/lib/auth/server";
import { getPersistedDocument } from "@/lib/document-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const document = await getPersistedDocument(context.orgId, id);
  if (!document) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ document });
}
