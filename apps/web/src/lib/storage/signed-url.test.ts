import assert from "node:assert/strict";
import { describe, it, after } from "node:test";
import { createSignedUrl } from "./signed-url.ts";

describe("createSignedUrl (E9.01)", () => {
  const prevUrl = process.env.SUPABASE_URL;
  const prevKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const prevPublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prevAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const prevAnonAlt = process.env.SUPABASE_ANON_KEY;

  after(() => {
    if (prevUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = prevUrl;
    if (prevKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = prevKey;
    if (prevPublicUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = prevPublicUrl;
    if (prevAnon === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = prevAnon;
    if (prevAnonAlt === undefined) delete process.env.SUPABASE_ANON_KEY;
    else process.env.SUPABASE_ANON_KEY = prevAnonAlt;
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

  it("returns supabase signed URL from storage API (mocked fetch)", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test-key";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_ANON_KEY;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          signedURL:
            "https://example.supabase.co/storage/v1/object/sign/documents/a/b.pdf?token=abc",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )) as typeof fetch;

    try {
      const result = await createSignedUrl({
        storagePath: "a/b.pdf",
        bucket: "documents",
      });
      assert.equal(result.mode, "supabase");
      assert.match(result.url, /example\.supabase\.co/);
      assert.match(result.url, /token=/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
