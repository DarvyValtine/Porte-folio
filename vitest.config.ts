import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
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
        "components/article-markdown.tsx",
        "components/rdv-form.tsx",
        "app/(admin)/admin/rdv/rdv-manager.tsx",
        "components/admin/article-content-editor.tsx",
        "components/admin/article-form.tsx",
        "components/admin/data-table.tsx",
        "components/admin/delete-button.tsx",
        "components/admin/gallery-form.tsx",
        "components/admin/insert-image-dialog.tsx",
        "components/admin/press-form.tsx",
        "components/admin/status-select.tsx",
        "components/admin/uploadthing-upload.tsx",
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