import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        x1: resolve(__dirname, "x1.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
