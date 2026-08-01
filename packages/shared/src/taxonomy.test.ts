import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertTaxonomyChangeLeavesDocumentsIntact,
  replaceTaxonomyConfig,
  type DocumentTaxonomySnapshot,
} from "./taxonomy.js";

describe("taxonomy immutability (E6.04)", () => {
  it("replaceTaxonomyConfig parses next config", () => {
    const next = replaceTaxonomyConfig(
      { documentTypes: [], costCenters: [], virtualFolders: [] },
      {
        documentTypes: [{ id: "custom", label: "Custom", tags: ["x"] }],
        costCenters: [],
        virtualFolders: [],
      },
    );
    assert.equal(next.documentTypes[0]?.id, "custom");
  });

  it("changing taxonomy does not alter existing document snapshots", () => {
    const docs: DocumentTaxonomySnapshot[] = [
      {
        id: "22222222-2222-4222-8222-222222222222",
        documentType: "invoice",
        costCenter: "ops",
        tags: ["finance"],
      },
    ];
    const before = docs.map((d) => ({ ...d, tags: [...d.tags] }));
    replaceTaxonomyConfig(
      { documentTypes: [], costCenters: [], virtualFolders: [] },
      {
        documentTypes: [{ id: "receipt", label: "Receipt", tags: [] }],
        costCenters: [],
        virtualFolders: [],
      },
    );
    // Documents are intentionally untouched — only config changed.
    const after = docs.map((d) => ({ ...d, tags: [...d.tags] }));
    assertTaxonomyChangeLeavesDocumentsIntact(before, after);
  });

  it("detects illegal mutation of historical documents", () => {
    const before: DocumentTaxonomySnapshot[] = [
      {
        id: "22222222-2222-4222-8222-222222222222",
        documentType: "invoice",
        costCenter: null,
        tags: [],
      },
    ];
    const after: DocumentTaxonomySnapshot[] = [
      {
        id: "22222222-2222-4222-8222-222222222222",
        documentType: "receipt",
        costCenter: null,
        tags: [],
      },
    ];
    assert.throws(() => assertTaxonomyChangeLeavesDocumentsIntact(before, after));
  });
});
