import {
  DocumentStatus,
  assertTransition,
  can,
  type Permission,
} from "@ac/shared";

const STATUSES = new Set<string>(Object.values(DocumentStatus));

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as {
    from?: string;
    to?: string;
    role?: string;
  };
  if (!body.from || !body.to) {
    return Response.json({ error: "from/to required" }, { status: 400 });
  }
  if (!STATUSES.has(body.from) || !STATUSES.has(body.to)) {
    return Response.json({ error: "unknown_status" }, { status: 400 });
  }
  const role = body.role ?? "viewer";
  if (body.to === DocumentStatus.Approved && !can(role, "document:approve" as Permission)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    assertTransition(body.from as typeof DocumentStatus.Received, body.to as typeof DocumentStatus.Received);
    return Response.json({ ok: true, from: body.from, to: body.to });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "invalid_transition" },
      { status: 400 },
    );
  }
}
