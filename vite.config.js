import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/indego-calendar-card.js",
      name: "IndegoCalendarCard",
      formats: ["es"],
      fileName: () => "indego-calendar-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
