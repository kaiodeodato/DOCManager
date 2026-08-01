import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright smoke config (E15.02).
 * Start the app separately or via webServer when running locally.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3035",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run start --workspace=@ac/web -- --port 3035",
        url: "http://127.0.0.1:3035",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
