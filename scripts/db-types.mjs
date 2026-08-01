#!/usr/bin/env node
/**
 * E1.06 — generate Supabase TypeScript types into @ac/db.
 *
 * Preferred (local stack running):
 *   npx supabase gen types typescript --local > packages/db/src/database.types.ts
 *
 * Linked remote project:
 *   npx supabase gen types typescript --project-id <PROJECT_REF> > packages/db/src/database.types.ts
 *
 * Until Supabase CLI + a running DB are available, packages/db/src/database.types.ts
 * ships a hand-maintained placeholder matching E1 migrations.
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "packages", "db", "src", "database.types.ts");
const preferLocal = !process.argv.includes("--linked");

const args = preferLocal
  ? ["supabase", "gen", "types", "typescript", "--local"]
  : [
      "supabase",
      "gen",
      "types",
      "typescript",
      "--project-id",
      process.env.SUPABASE_PROJECT_ID ?? "<PROJECT_REF>",
    ];

console.log(`[db:types] Attempting: npx ${args.join(" ")}`);
console.log(`[db:types] Output target: ${path.relative(root, outFile)}`);

const result = spawnSync("npx", args, {
  cwd: root,
  encoding: "utf8",
  shell: true,
});

if (result.status === 0 && result.stdout && result.stdout.includes("export type Database")) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(outFile, result.stdout, "utf8");
  console.log("[db:types] Wrote generated Database types.");
  process.exit(0);
}

console.warn("[db:types] Generation skipped or failed (Supabase CLI / local DB may be unavailable).");
if (result.stderr) {
  console.warn(result.stderr.trim().slice(0, 500));
}
if (existsSync(outFile)) {
  console.log(
    "[db:types] Keeping existing packages/db/src/database.types.ts placeholder. Re-run when `npx supabase start` is healthy.",
  );
  process.exit(0);
}

console.error("[db:types] No placeholder found — aborting.");
process.exit(1);
