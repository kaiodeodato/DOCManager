import { UserRole, assertCapability } from "@ac/shared";
import {
  anonymizeDocumentsForUser,
  exportDocumentsForGdpr,
} from "@/lib/document-store";

export const runtime = "nodejs";

/**
 * GDPR export / anonymize API (E14.03).
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const record = body as {
    action?: unknown;
    orgId?: unknown;
    userId?: unknown;
    role?: unknown;
  };

  const orgId = typeof record.orgId === "string" ? record.orgId : "";
  const userId = typeof record.userId === "string" ? record.userId : "";
  const action = record.action === "anonymize" ? "anonymize" : "export";
  const role =
    record.role === UserRole.Owner ||
    record.role === UserRole.Accountant ||
    record.role === UserRole.Viewer
      ? record.role
      : UserRole.Viewer;

  if (!orgId || !userId) {
    return Response.json({ error: "orgId and userId required" }, { status: 400 });
  }

  try {
    assertCapability(role, "gdpr:export");
  } catch {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  if (action === "export") {
    const payload = exportDocumentsForGdpr({ orgId, userId });
    return Response.json(payload);
  }

  const result = anonymizeDocumentsForUser({ orgId, userId });
  return Response.json(result);
}
