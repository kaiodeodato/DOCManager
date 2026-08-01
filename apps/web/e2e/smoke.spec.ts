import { expect, test } from "@playwright/test";

test.describe("DOC Manager smoke (E15.02)", () => {
  test("home page responds", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBeLessThan(500);
    const html = await res.text();
    expect(html.length).toBeGreaterThan(0);
  });

  test("manifest is served", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("DOC");
    const json = JSON.parse(text) as { name?: string };
    expect(json.name).toMatch(/DOC/i);
  });
});
