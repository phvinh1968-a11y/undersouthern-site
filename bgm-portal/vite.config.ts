import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/bgm-portal/",
  build: {
    outDir: "docs",     // 👈 RẤT QUAN TRỌNG
    emptyOutDir: false  // 👈 KHÔNG XOÁ FILE CŨ
  },
  plugins: [react()],
});
