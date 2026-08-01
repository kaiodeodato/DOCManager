import { executeToolCalls, planAssistantToolCalls } from "@/lib/assistant/deepseek-stub";

export const runtime = "nodejs";

/**
 * Giulia assistant BFF (E12.02) — DeepSeek function-calling via stub/mock in CI.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const record = body as { message?: unknown; orgId?: unknown };
  const message = typeof record.message === "string" ? record.message.trim() : "";
  const orgId = typeof record.orgId === "string" ? record.orgId : "";

  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }
  if (!orgId) {
    return Response.json({ error: "orgId is required" }, { status: 400 });
  }

  const toolCalls = await planAssistantToolCalls({ message, orgId });
  const toolResults = await executeToolCalls(orgId, toolCalls);

  return Response.json({
    message,
    orgId,
    toolCalls,
    toolResults,
    reply: summarize(toolResults),
  });
}

function summarize(results: { name: string; result: unknown }[]): string {
  if (results.length === 0) return "Sem resultados.";
  const first = results[0]!;
  return `Tool ${first.name} executada com sucesso.`;
}
