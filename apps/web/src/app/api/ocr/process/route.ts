import { ensureUserOrgContext } from "@/lib/auth/server";
import { processOneOcrJob } from "@/lib/ocr/run-pending";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Process one pending OCR job for the current org (web fallback for worker-ocr). */
export async function POST(request: Request): Promise<Response> {
  const context = await ensureUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });

  let documentId: string | undefined;
  try {
    const body = (await request.json()) as { documentId?: unknown };
    if (typeof body.documentId === "string") documentId = body.documentId;
  } catch {
    /* empty body is fine */
  }

  try {
    const result = await processOneOcrJob({
      orgId: context.orgId,
      ...(documentId ? { documentId } : {}),
    });
    return Response.json(result);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "ocr_process_failed" },
      { status: 500 },
    );
  }
}
