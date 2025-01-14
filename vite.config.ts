import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "url";
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dts({
    rollupTypes: true,
    tsconfigPath: resolve(__dirname, "tsconfig.json")
  })],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "chainlit-vue-client",
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ["vue", "pinia"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
