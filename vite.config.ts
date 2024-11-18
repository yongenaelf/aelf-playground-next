import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from '@mdx-js/rollup';
import { nodePolyfills } from "vite-plugin-node-polyfills";
import rehypePrettyCode from "rehype-pretty-code";
import { rehypeGithubAlerts } from "rehype-github-alerts";

export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        /* jsxImportSource: …, otherOptions… */
        rehypePlugins: [[rehypePrettyCode], [rehypeGithubAlerts]]
      }),
    },
    react(),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    proxy: {
      "/api/playground": "https://playground-next.test.aelf.dev",
      "/playground": "https://playground.aelf.com",
    }
  }
});