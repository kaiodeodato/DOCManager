import { DocumentSearchQuerySchema } from "@ac/shared";
import { getUserOrgContext } from "@/lib/auth/server";
import { searchPersistedDocuments } from "@/lib/document-repository";

export const runtime = "nodejs";

/**
 * E7.03 — tenant-scoped Postgres tsvector + pg_trgm search.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });
  const raw: Record<string, unknown> = {
    orgId: context.orgId,
    q: url.searchParams.get("q") ?? "",
    page: Number(url.searchParams.get("page") ?? "1"),
    pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
  };
  const documentType = url.searchParams.get("documentType");
  const tag = url.searchParams.get("tag");
  if (documentType) raw.documentType = documentType;
  if (tag) raw.tag = tag;

  const parsed = DocumentSearchQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const started = performance.now();
  const data = parsed.data;
  const query: {
    orgId: string;
    q: string;
    page: number;
    pageSize: number;
    documentType?: string;
    tag?: string;
  } = {
    orgId: data.orgId,
    q: data.q,
    page: data.page,
    pageSize: data.pageSize,
  };
  if (data.documentType != null) query.documentType = data.documentType;
  if (data.tag != null) query.tag = data.tag;

  const result = await searchPersistedDocuments({
    orgId: context.orgId,
    query: query.q,
    page: query.page,
    pageSize: query.pageSize,
  });
  const latencyMs = Math.round(performance.now() - started);

  return Response.json({
    ...result,
    total: result.items.length,
    latencyMs,
  });
}
