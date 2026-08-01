import {
  ASSISTANT_TOOL_DEFINITIONS,
  runAssistantTool,
  type AssistantToolName,
} from "./tools";

export type AssistantMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
};

export type DeepSeekToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

/**
 * DeepSeek function-calling stub/mock (E12.02).
 * When DEEPSEEK_API_KEY is unset or ASSISTANT_MOCK=1, chooses a tool heuristically.
 */
export async function planAssistantToolCalls(input: {
  message: string;
  orgId: string;
}): Promise<DeepSeekToolCall[]> {
  const useMock =
    process.env.ASSISTANT_MOCK === "1" ||
    !process.env.DEEPSEEK_API_KEY ||
    process.env.NODE_ENV === "test";

  if (!useMock && process.env.DEEPSEEK_API_KEY) {
    // Live path reserved; CI prefers mock. Avoid network by default.
    void ASSISTANT_TOOL_DEFINITIONS;
  }

  const text = input.message.toLowerCase();
  if (text.includes("sum") || text.includes("total") || text.includes("soma")) {
    return [
      {
        id: "call_sum",
        type: "function",
        function: {
          name: "sumByPeriod",
          arguments: JSON.stringify({ from: "2026-01-01", to: "2026-12-31" }),
        },
      },
    ];
  }
  if (text.includes("id:") || /[0-9a-f-]{36}/i.test(input.message)) {
    const match = input.message.match(/[0-9a-f-]{36}/i);
    return [
      {
        id: "call_get",
        type: "function",
        function: {
          name: "getDocumentById",
          arguments: JSON.stringify({
            documentId: match?.[0] ?? "00000000-0000-4000-8000-000000000001",
          }),
        },
      },
    ];
  }
  return [
    {
      id: "call_search",
      type: "function",
      function: {
        name: "searchDocuments",
        arguments: JSON.stringify({ query: input.message, limit: 10 }),
      },
    },
  ];
}

export async function executeToolCalls(
  orgId: string,
  calls: DeepSeekToolCall[],
): Promise<{ name: string; result: unknown }[]> {
  const out: { name: string; result: unknown }[] = [];
  for (const call of calls) {
    const name = call.function.name as AssistantToolName;
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(call.function.arguments) as Record<string, unknown>;
    } catch {
      args = {};
    }
    const result = await runAssistantTool(name, orgId, args);
    out.push({ name, result });
  }
  return out;
}
