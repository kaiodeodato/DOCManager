import { getUserOrgContext } from "@/lib/auth/server";
import { listPersistedDocuments } from "@/lib/document-repository";

export async function GET(): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });

  try {
    return Response.json({
      documents: await listPersistedDocuments(context.orgId),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "documents_list_failed" },
      { status: 500 },
    );
  }
}
