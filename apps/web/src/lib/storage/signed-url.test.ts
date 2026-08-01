import assert from "node:assert/strict";
import { describe, it, after } from "node:test";
import { createSignedUrl } from "./signed-url.ts";

describe("createSignedUrl (E9.01)", () => {
  const prevUrl = process.env.SUPABASE_URL;
  const prevKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  after(() => {
    if (prevUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = prevUrl;
    if (prevKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = prevKey;
  });

  it("returns fake signed URL when Supabase env is absent", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const result = await createSignedUrl({
      storagePath: "documents/org/doc/file.pdf",
      expiresInSeconds: 60,
    });
    assert.equal(result.mode, "fake");
    assert.match(result.url, /^https:\/\/signed\.local\//);
    assert.ok(Date.parse(result.expiresAt) > Date.now());
  });

  it("shapes supabase URL when env is set (no network)", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test-key";

    const result = await createSignedUrl({
      storagePath: "a/b.pdf",
      bucket: "documents",
    });
    assert.equal(result.mode, "supabase");
    assert.match(result.url, /^https:\/\/example\.supabase\.co\/storage\/v1\/object\/sign\//);
  });
});
