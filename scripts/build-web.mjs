/**
 * Render-safe web build (no turbo native binary).
 * Ignores leftover --filter args from old Render build commands.
 */
import { spawnSync } from "node:child_process";

const workspaces = ["lucide-react", "@ac/shared", "@ac/ui", "@ac/web"];

for (const workspace of workspaces) {
  console.log(`\n==> building ${workspace}`);
  const result = spawnSync(
    "npm",
    ["run", "build", "-w", workspace],
    { stdio: "inherit", shell: true, env: process.env },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\n==> build:web complete");
