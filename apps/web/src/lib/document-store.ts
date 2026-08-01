import { DocumentStatus, type ExtractionResult } from "@ac/shared";

export type DocumentRow = {
  id: string;
  orgId: string;
  originalFilename: string;
  status: string;
  storagePath: string;
  /** ISO date for period aggregations (assistant) */
  documentDate?: string;
  amount?: number | null;
  supplier?: string | null;
  documentType?: string | null;
  costCenter?: string | null;
  tags?: string[];
  ocrText?: string;
  extraction?: ExtractionResult | null;
  searchText?: string;
};

const documents: DocumentRow[] = [];

export function listDocuments(orgId?: string): DocumentRow[] {
  const all = [...documents];
  if (!orgId) return all;
  return all.filter((d) => d.orgId === orgId);
}

export function getDocumentById(id: string, orgId?: string): DocumentRow | undefined {
  return documents.find((d) => d.id === id && (!orgId || d.orgId === orgId));
}

/** Alias used by E5/E8 routes. */
export function getDocument(id: string): DocumentRow | undefined {
  return getDocumentById(id);
}

export function updateDocument(
  id: string,
  patch: Partial<DocumentRow>,
): DocumentRow | undefined {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx < 0) return undefined;
  const next = { ...documents[idx]!, ...patch };
  documents[idx] = next;
  return next;
}

export function listNeedsReview(orgId?: string): DocumentRow[] {
  return documents.filter(
    (d) =>
      d.status === DocumentStatus.NeedsReview && (!orgId || d.orgId === orgId),
  );
}

/** Assistant / Giulia search (E12). */
export function searchDocuments(input: {
  orgId: string;
  query?: string;
  limit?: number;
}): DocumentRow[] {
  const q = (input.query ?? "").trim().toLowerCase();
  let rows = documents.filter((d) => d.orgId === input.orgId);
  if (q) {
    rows = rows.filter(
      (d) =>
        d.originalFilename.toLowerCase().includes(q) ||
        (d.supplier?.toLowerCase().includes(q) ?? false) ||
        d.status.toLowerCase().includes(q) ||
        (d.searchText?.toLowerCase().includes(q) ?? false) ||
        (d.ocrText?.toLowerCase().includes(q) ?? false),
    );
  }
  return rows.slice(0, input.limit ?? 20);
}

/** E7.03 paginated search API stand-in (pg_trgm / tsvector later). */
export function searchDocumentsPaged(input: {
  orgId: string;
  q: string;
  documentType?: string;
  tag?: string;
  page: number;
  pageSize: number;
}): { items: DocumentRow[]; total: number; page: number; pageSize: number } {
  const needle = input.q.toLowerCase();
  const filtered = documents.filter((d) => {
    if (d.orgId !== input.orgId) return false;
    if (input.documentType && d.documentType !== input.documentType) return false;
    if (input.tag && !(d.tags ?? []).includes(input.tag)) return false;
    const hay = (
      d.searchText ??
      `${d.originalFilename} ${d.ocrText ?? ""} ${d.supplier ?? ""}`
    ).toLowerCase();
    return (
      hay.includes(needle) ||
      needle.split(/\s+/).some((t) => t.length > 2 && hay.includes(t))
    );
  });
  const start = (input.page - 1) * input.pageSize;
  return {
    items: filtered.slice(start, start + input.pageSize),
    total: filtered.length,
    page: input.page,
    pageSize: input.pageSize,
  };
}

export function sumByPeriod(input: {
  orgId: string;
  from: string;
  to: string;
}): { total: number; count: number; from: string; to: string } {
  const rows = documents.filter((d) => {
    if (d.orgId !== input.orgId) return false;
    const date = d.documentDate ?? "";
    return date >= input.from && date <= input.to;
  });
  const total = rows.reduce((acc, d) => acc + (d.amount ?? 0), 0);
  return { total, count: rows.length, from: input.from, to: input.to };
}

export function rememberDocument(row: DocumentRow): void {
  documents.unshift(row);
}

export function resetDocumentStore(): void {
  documents.length = 0;
}

export function anonymizeDocumentsForUser(input: {
  orgId: string;
  userId: string;
}): { anonymized: number } {
  let count = 0;
  for (const d of documents) {
    if (d.orgId !== input.orgId) continue;
    d.originalFilename = `anonymized-${d.id}.bin`;
    d.supplier = null;
    d.amount = null;
    count += 1;
  }
  void input.userId;
  return { anonymized: count };
}

export function exportDocumentsForGdpr(input: {
  orgId: string;
  userId?: string;
}): { exportedAt: string; documents: DocumentRow[] } {
  void input.userId;
  return {
    exportedAt: new Date().toISOString(),
    documents: documents.filter((d) => d.orgId === input.orgId).map((d) => ({ ...d })),
  };
}
