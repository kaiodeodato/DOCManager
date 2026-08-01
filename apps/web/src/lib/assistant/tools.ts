import {
  getDocumentById as storeGetById,
  searchDocuments as storeSearch,
  sumByPeriod as storeSum,
  type DocumentRow,
} from "../document-store";

/**
 * Giulia assistant internal tools (E12.01).
 * Pure functions over the in-memory document store (swap for Postgres later).
 */

export async function searchDocuments(input: {
  orgId: string;
  query?: string;
  limit?: number;
}): Promise<DocumentRow[]> {
  return storeSearch(input);
}

export async function sumByPeriod(input: {
  orgId: string;
  from: string;
  to: string;
}): Promise<{ total: number; count: number; from: string; to: string }> {
  return storeSum(input);
}

export async function getDocumentById(input: {
  orgId: string;
  documentId: string;
}): Promise<DocumentRow | null> {
  return storeGetById(input.documentId, input.orgId) ?? null;
}

export const ASSISTANT_TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "searchDocuments",
      description: "Search documents by filename, supplier, or status within the org.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "number" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "sumByPeriod",
      description: "Sum document amounts between ISO dates (inclusive).",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string" },
          to: { type: "string" },
        },
        required: ["from", "to"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getDocumentById",
      description: "Fetch a single document by id for the current org.",
      parameters: {
        type: "object",
        properties: {
          documentId: { type: "string" },
        },
        required: ["documentId"],
      },
    },
  },
] as const;

export type AssistantToolName =
  | "searchDocuments"
  | "sumByPeriod"
  | "getDocumentById";

export async function runAssistantTool(
  name: AssistantToolName,
  orgId: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "searchDocuments": {
      const input: { orgId: string; query?: string; limit?: number } = { orgId };
      if (typeof args.query === "string") input.query = args.query;
      if (typeof args.limit === "number") input.limit = args.limit;
      return searchDocuments(input);
    }
    case "sumByPeriod":
      return sumByPeriod({
        orgId,
        from: String(args.from ?? ""),
        to: String(args.to ?? ""),
      });
    case "getDocumentById":
      return getDocumentById({
        orgId,
        documentId: String(args.documentId ?? ""),
      });
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}
