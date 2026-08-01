import {
  DocumentStatus,
  type ClassifyPersistDecision,
  type TaxonomyConfig,
} from "@ac/shared";
import { createDeepSeekClient, runClassifyJob } from "./deepseek.js";

export type { DeepSeekClient, DeepSeekClientOptions } from "./deepseek.js";
export { createDeepSeekClient, runClassifyJob } from "./deepseek.js";

/**
 * Classify OCR text via DeepSeek (E5.02–E5.04).
 * Prefer `mockContent` / `mockResponse` in tests — never hit the network.
 */
export async function classifyOcrText(
  ocrText: string,
  taxonomy?: TaxonomyConfig | string,
  options?: { apiKey?: string; mockResponse?: unknown; mockContent?: string },
): Promise<ClassifyPersistDecision> {
  const taxonomyConfig: TaxonomyConfig | undefined =
    typeof taxonomy === "string"
      ? {
          documentTypes: [{ id: taxonomy, label: taxonomy, tags: [] }],
          costCenters: [],
          virtualFolders: [],
        }
      : taxonomy;

  const clientOpts: Parameters<typeof createDeepSeekClient>[0] = {};
  if (options?.apiKey !== undefined) clientOpts.apiKey = options.apiKey;
  if (options?.mockContent !== undefined) {
    clientOpts.mockContent = options.mockContent;
  } else if (options?.mockResponse !== undefined) {
    clientOpts.mockContent = JSON.stringify(options.mockResponse);
  }

  const client = createDeepSeekClient(clientOpts);
  const jobInput: Parameters<typeof runClassifyJob>[0] = { ocrText, client };
  if (taxonomyConfig !== undefined) jobInput.taxonomy = taxonomyConfig;

  const { decision } = await runClassifyJob(jobInput);

  if (decision.status === DocumentStatus.NeedsReview || decision.persist) {
    return decision;
  }
  return decision;
}
