import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

const testDbPath = path.resolve(__dirname, "prisma/test.db");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    globalSetup: ["./tests/globalSetup.ts"],
    setupFiles: ["./tests/setup.ts"],
    // Test files share one SQLite file and reset its tables in beforeEach,
    // so files must run one at a time rather than racing each other.
    fileParallelism: false,
    env: {
      DATABASE_URL: `file:${testDbPath}`,
    },
  },
});
