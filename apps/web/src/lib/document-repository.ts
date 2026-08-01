import "server-only";
import { createServerSupabaseClient } from "./supabase/server";

type DocumentDbRow = {
  id: string;
  org_id: string;
  original_filename: string;
  status: string;
  storage_path: string;
  document_type: string | null;
  cost_center: string | null;
  ocr_text: string | null;
  created_at: string;
};

export type PersistedDocument = {
  id: string;
  orgId: string;
  originalFilename: string;
  status: string;
  storagePath: string;
  documentType: string | null;
  costCenter: string | null;
  ocrText: string | null;
  createdAt: string;
};

export function mapDocumentRow(row: DocumentDbRow): PersistedDocument {
  return {
    id: row.id,
    orgId: row.org_id,
    originalFilename: row.original_filename,
    status: row.status,
    storagePath: row.storage_path,
    documentType: row.document_type,
    costCenter: row.cost_center,
    ocrText: row.ocr_text,
    createdAt: row.created_at,
  };
}

const DOCUMENT_COLUMNS =
  "id, org_id, original_filename, status, storage_path, document_type, cost_center, ocr_text, created_at";

export async function listPersistedDocuments(orgId: string): Promise<PersistedDocument[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select(DOCUMENT_COLUMNS)
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`documents_list_failed: ${error.message}`);
  return (data as DocumentDbRow[]).map(mapDocumentRow);
}

export async function getPersistedDocument(
  orgId: string,
  id: string,
): Promise<PersistedDocument | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select(DOCUMENT_COLUMNS)
    .eq("org_id", orgId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`document_get_failed: ${error.message}`);
  return data ? mapDocumentRow(data as DocumentDbRow) : null;
}

export async function searchPersistedDocuments(input: {
  orgId: string;
  query: string;
  page: number;
  pageSize: number;
}): Promise<{ items: PersistedDocument[]; page: number; pageSize: number }> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("documents_search", {
    p_org_id: input.orgId,
    p_query: input.query,
    p_limit: input.pageSize,
    p_offset: (input.page - 1) * input.pageSize,
  });
  if (error) throw new Error(`documents_search_failed: ${error.message}`);

  const ids = (data as { id: string }[]).map((row) => row.id);
  if (ids.length === 0) return { items: [], page: input.page, pageSize: input.pageSize };
  const { data: rows, error: rowsError } = await supabase
    .from("documents")
    .select(DOCUMENT_COLUMNS)
    .eq("org_id", input.orgId)
    .in("id", ids);
  if (rowsError) throw new Error(`documents_search_hydrate_failed: ${rowsError.message}`);
  const byId = new Map((rows as DocumentDbRow[]).map((row) => [row.id, mapDocumentRow(row)]));
  return {
    items: ids.flatMap((id) => {
      const row = byId.get(id);
      return row ? [row] : [];
    }),
    page: input.page,
    pageSize: input.pageSize,
  };
}
