import { ExtractionCorrectionSchema, DocumentStatus } from "@ac/shared";
import { getUserOrgContext } from "@/lib/auth/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** E5.06 — list corrections (optional ?documentId=). */
export async function GET(request: Request): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const documentId = url.searchParams.get("documentId") ?? undefined;
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("document_extractions_corrections")
    .select("*")
    .eq("org_id", context.orgId)
    .order("created_at", { ascending: false });
  if (documentId) query = query.eq("document_id", documentId);
  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ corrections: data });
}

/**
 * E5.05 / E5.06 — store human correction and leave needs_review.
 */
export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json();
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = ExtractionCorrectionSchema.safeParse({
    ...(body && typeof body === "object" ? body : {}),
    orgId: context.orgId,
    correctedBy: context.userId,
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("id")
    .eq("id", parsed.data.documentId)
    .eq("org_id", context.orgId)
    .maybeSingle();
  if (!doc) {
    return Response.json({ error: "document_not_found" }, { status: 404 });
  }

  const correctionRow: {
    org_id: string;
    document_id: string;
    corrected_by: string;
    original: Record<string, unknown>;
    corrected: Record<string, unknown>;
    extraction_id?: string;
  } = {
    org_id: context.orgId,
    document_id: parsed.data.documentId,
    corrected_by: context.userId,
    original: parsed.data.original,
    corrected: parsed.data.corrected,
  };
  if (parsed.data.extractionId) correctionRow.extraction_id = parsed.data.extractionId;
  const { data: correction, error: correctionError } = await supabase
    .from("document_extractions_corrections")
    .insert(correctionRow)
    .select("*")
    .single();
  if (correctionError) {
    return Response.json({ error: correctionError.message }, { status: 500 });
  }
  const { error: updateError } = await supabase
    .from("documents")
    .update({
      status: DocumentStatus.Classified,
      document_type: parsed.data.corrected.documentType,
    })
    .eq("id", parsed.data.documentId)
    .eq("org_id", context.orgId);
  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json({ correction, status: DocumentStatus.Classified }, { status: 201 });
}
