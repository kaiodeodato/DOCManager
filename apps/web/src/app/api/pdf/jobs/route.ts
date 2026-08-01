import {
  DocumentJobPayloadSchema,
  JobType,
  defaultJobQueue,
} from "@ac/shared";

export const runtime = "nodejs";

/**
 * Fast enqueue for PDF merge/split (E10.04) — must return before worker finishes.
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
    jobType?: unknown;
    metadata?: unknown;
  };

  const jobType =
    record.jobType === JobType.Split ? JobType.Split : JobType.Merge;

  const parsed = DocumentJobPayloadSchema.safeParse({
    orgId: record.orgId,
    documentId: record.documentId,
    jobType,
    metadata:
      record.metadata && typeof record.metadata === "object"
        ? record.metadata
        : {},
  });

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const started = performance.now();
  const job = defaultJobQueue.enqueue(parsed.data);
  const enqueueMs = performance.now() - started;

  return Response.json(
    {
      job: { id: job.id, type: job.jobType, status: job.status },
      enqueueMs,
    },
    { status: 202 },
  );
}
