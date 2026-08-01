import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DocumentStatus,
  assertTaxonomyChangeLeavesDocumentsIntact,
  canTransition,
} from "@ac/shared";
import { defaultMockErp } from "./connectors/mock-erp.js";
import {
  getDocument,
  rememberDocument,
  resetDocumentStore,
  searchDocumentsPaged,
  updateDocument,
} from "./document-store.js";
import { getTaxonomy, resetTaxonomyStore, setTaxonomy } from "./taxonomy-store.js";
import { rememberCorrection, resetCorrectionsStore } from "./corrections-store.js";

const ORG = "11111111-1111-4111-8111-111111111111";
const DOC = "22222222-2222-4222-8222-222222222222";

describe("taxonomy immutability (E6.04)", () => {
  it("does not change existing document metadata when taxonomy updates", () => {
    resetDocumentStore();
    resetTaxonomyStore();
    rememberDocument({
      id: DOC,
      orgId: ORG,
      originalFilename: "a.pdf",
      status: DocumentStatus.Classified,
      storagePath: "x",
      documentType: "invoice",
      costCenter: "ops",
      tags: ["finance"],
    });
    const before = [
      {
        id: DOC,
        documentType: getDocument(DOC)?.documentType ?? null,
        costCenter: getDocument(DOC)?.costCenter ?? null,
        tags: [...(getDocument(DOC)?.tags ?? [])],
      },
    ];
    setTaxonomy(ORG, {
      documentTypes: [{ id: "custom", label: "Custom", tags: [] }],
      costCenters: [],
      virtualFolders: [],
    });
    const after = [
      {
        id: DOC,
        documentType: getDocument(DOC)?.documentType ?? null,
        costCenter: getDocument(DOC)?.costCenter ?? null,
        tags: [...(getDocument(DOC)?.tags ?? [])],
      },
    ];
    assertTaxonomyChangeLeavesDocumentsIntact(before, after);
    assert.equal(getTaxonomy(ORG).documentTypes[0]?.id, "custom");
  });
});

describe("document search (E7)", () => {
  it("finds documents by fuzzy substring and paginates", () => {
    resetDocumentStore();
    rememberDocument({
      id: DOC,
      orgId: ORG,
      originalFilename: "fatura-acme.pdf",
      status: DocumentStatus.Classified,
      storagePath: "x",
      ocrText: "Fatura Acme Lda",
      searchText: "fatura-acme.pdf Fatura Acme Lda",
      documentType: "invoice",
      tags: ["finance"],
    });
    const result = searchDocumentsPaged({
      orgId: ORG,
      q: "Acme",
      page: 1,
      pageSize: 10,
    });
    assert.equal(result.total, 1);
    assert.equal(result.items[0]?.id, DOC);
  });
});

describe("mock ERP export (E8)", () => {
  it("marks failure as export_failed and retries idempotently", async () => {
    resetDocumentStore();
    defaultMockErp.reset();
    rememberDocument({
      id: DOC,
      orgId: ORG,
      originalFilename: "a.pdf",
      status: DocumentStatus.Approved,
      storagePath: "x",
      documentType: "invoice",
      extraction: {
        documentType: "invoice",
        entities: { nif: null, value: 1, date: null, supplier: "A" },
        confidence: 1,
      },
    });

    assert.equal(canTransition(DocumentStatus.Approved, DocumentStatus.ExportFailed), true);
    defaultMockErp.simulateFailureOnce();
    const fail = await defaultMockErp.export({
      orgId: ORG,
      documentId: DOC,
      documentType: "invoice",
      entities: {},
      idempotencyKey: `export:${DOC}`,
    });
    assert.equal(fail.ok, false);
    updateDocument(DOC, { status: DocumentStatus.ExportFailed });

    const ok1 = await defaultMockErp.export({
      orgId: ORG,
      documentId: DOC,
      documentType: "invoice",
      entities: {},
      idempotencyKey: `export:${DOC}`,
    });
    assert.equal(ok1.ok, true);
    if (ok1.ok) assert.equal(ok1.duplicated, false);

    const ok2 = await defaultMockErp.export({
      orgId: ORG,
      documentId: DOC,
      documentType: "invoice",
      entities: {},
      idempotencyKey: `export:${DOC}`,
    });
    assert.equal(ok2.ok, true);
    if (ok2.ok) assert.equal(ok2.duplicated, true);
  });
});

describe("corrections store (E5.06)", () => {
  it("stores a correction row", () => {
    resetCorrectionsStore();
    const row = rememberCorrection({
      orgId: ORG,
      documentId: DOC,
      original: {},
      corrected: {
        documentType: "invoice",
        entities: { nif: "1", value: null, date: null, supplier: null },
        confidence: 1,
      },
    });
    assert.ok(row.id);
  });
});
