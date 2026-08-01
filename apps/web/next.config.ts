import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
loadEnvConfig(monorepoRoot);

const lucideStub = path.join(monorepoRoot, "packages/lucide-react/dist/index.js");

const nextConfig: NextConfig = {
  transpilePackages: ["@ac/shared", "@ac/ui", "lucide-react"],
  reactStrictMode: true,
  outputFileTracingRoot: monorepoRoot,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "lucide-react": lucideStub,
    };
    return config;
  },
};

export default nextConfig;
