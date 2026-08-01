import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserRole } from "@ac/shared";
import {
  createBrowserSupabaseClient,
  getSessionClaims,
  parseAccessTokenClaims,
  requireOrgClaims,
} from "./auth/index";

describe("apps/web auth stubs (E1.03)", () => {
  it("parses JWT claims via shared schemas", () => {
    const claims = parseAccessTokenClaims({
      sub: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      org_id: "11111111-1111-1111-1111-111111111111",
      role: UserRole.Accountant,
    });
    assert.ok(claims);
    assert.deepEqual(getSessionClaims(claims), {
      org_id: "11111111-1111-1111-1111-111111111111",
      role: UserRole.Accountant,
    });
  });

  it("requireOrgClaims throws when claims missing", () => {
    assert.throws(
      () =>
        requireOrgClaims({
          sub: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        }),
      /Missing org_id\/role JWT claims/,
    );
  });

  it("requires public Supabase configuration", () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    assert.throws(() => createBrowserSupabaseClient(), /Missing NEXT_PUBLIC_SUPABASE/);
    if (url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    if (key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = key;
  });
});
