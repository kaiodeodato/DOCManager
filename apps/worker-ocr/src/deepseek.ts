import {
  CLASSIFY_SYSTEM_PROMPT,
  buildClassifyPrompt,
  decideClassifyPersist,
  parseDeepSeekJsonContent,
  type ClassifyPersistDecision,
  type TaxonomyConfig,
} from "@ac/shared";

export type DeepSeekChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type DeepSeekClientOptions = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
  /** Injected for tests — skip network. */
  mockContent?: string | (() => string | Promise<string>);
  fetchImpl?: typeof fetch;
};

export type DeepSeekClient = {
  complete(messages: DeepSeekChatMessage[]): Promise<string>;
};

/**
 * DeepSeek-v4-flash JSON classify client (E5.02).
 * Uses DEEPSEEK_API_KEY; mockable via `mockContent` for unit tests.
 */
export function createDeepSeekClient(options: DeepSeekClientOptions = {}): DeepSeekClient {
  const apiKey = options.apiKey ?? process.env.DEEPSEEK_API_KEY ?? "";
  const baseUrl = options.baseUrl ?? "https://api.deepseek.com";
  const model = options.model ?? "deepseek-chat";
  const timeoutMs = options.timeoutMs ?? 30_000;
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async complete(messages) {
      if (options.mockContent !== undefined) {
        return typeof options.mockContent === "function"
          ? await options.mockContent()
          : options.mockContent;
      }
      if (!apiKey) {
        throw new Error("missing_DEEPSEEK_API_KEY");
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(`${baseUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            response_format: { type: "json_object" },
            temperature: 0,
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`deepseek_http_${response.status}`);
        }
        const body = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const content = body.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error("deepseek_empty_content");
        }
        return content;
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

export type ClassifyJobInput = {
  ocrText: string;
  taxonomy?: TaxonomyConfig;
  correctionsFewShot?: Array<{ original: unknown; corrected: unknown }>;
  client?: DeepSeekClient;
};

export type ClassifyJobResult = {
  decision: ClassifyPersistDecision;
  rawContent: string;
};

/**
 * Classify job: prompt → DeepSeek → Zod gate → persist decision (E5.02–E5.04).
 */
export async function runClassifyJob(input: ClassifyJobInput): Promise<ClassifyJobResult> {
  const client = input.client ?? createDeepSeekClient();
  const promptInput: Parameters<typeof buildClassifyPrompt>[0] = {
    ocrText: input.ocrText,
  };
  if (input.taxonomy !== undefined) promptInput.taxonomy = input.taxonomy;
  if (input.correctionsFewShot !== undefined) {
    promptInput.correctionsFewShot = input.correctionsFewShot;
  }
  const prompt = buildClassifyPrompt(promptInput);

  let rawContent: string;
  try {
    rawContent = await client.complete([
      { role: "system", content: CLASSIFY_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ]);
  } catch {
    return {
      rawContent: "",
      decision: decideClassifyPersist(null),
    };
  }

  try {
    const parsed = parseDeepSeekJsonContent(rawContent);
    return { rawContent, decision: decideClassifyPersist(parsed) };
  } catch {
    return {
      rawContent,
      decision: decideClassifyPersist({ invalid: true }),
    };
  }
}
