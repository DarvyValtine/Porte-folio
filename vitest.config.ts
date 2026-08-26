import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    testTimeout: 15000,
    setupFiles: ["tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "lib/slugify.ts",
        "lib/schemas.ts",
        "lib/utils.ts",
        "lib/site.ts",
        "lib/focus-icons.ts",
        "lib/paste-to-markdown.ts",
        "components/**/*.{ts,tsx}",
        "app/(admin)/admin/rdv/rdv-manager.tsx",
        "app/api/likes/route.ts",
        "app/api/comments/route.ts",
        "app/api/admin/comments/route.ts",
        "app/api/track-view/route.ts",
        "app/api/uploadthing/route.ts",
      ],
      exclude: [
        "components/ui/dropdown-menu.tsx",
        "components/ui/separator.tsx",
        "components/ui/sonner.tsx",
        "components/ui/skeleton.tsx",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(rootDir, "."),
    },
  },
})