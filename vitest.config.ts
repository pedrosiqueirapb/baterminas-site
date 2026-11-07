import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  css: { postcss: { plugins: [] } },
  // O tsconfig usa jsx: "preserve" (Next compila); nos testes o JSX dos componentes é transformado aqui.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", include: ["src/tests/**/*.test.ts"] },
});
