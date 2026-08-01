import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MIGRATIONS_PATH, PACKAGE_NAME, type Database } from "./index.js";

describe("@ac/db scaffold", () => {
  it("exposes package name and migrations path", () => {
    assert.equal(PACKAGE_NAME, "@ac/db");
    assert.equal(MIGRATIONS_PATH, "supabase/migrations");
  });

  it("exports Database placeholder with orgs table", () => {
    const row: Database["public"]["Tables"]["orgs"]["Row"] = {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Acme",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    assert.equal(row.name, "Acme");
  });
});
