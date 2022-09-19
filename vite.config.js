import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@icons": fileURLToPath(
        new URL("./src/components/icons", import.meta.url)
      ),
      // "@bootstrap": fileURLToPath(
      //   new URL("./node_modules/bootstrap", import.meta.url)
      // ),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/_functions.scss";
          @import "@/assets/scss/_variables.scss";
          @import "@/assets/scss/_maps.scss";
          @import "@/assets/scss/_mixins.scss";
          @import "@/assets/scss/_utilities.scss";
        `,
      },
    },
  },
});
