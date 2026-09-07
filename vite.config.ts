import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // Reads the "@/*" -> "src/*" alias from tsconfig.json
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    // Builds the SSR/server bundle. Change preset if you deploy to
    // Cloudflare/Vercel/Netlify later, e.g. nitro({ preset: "cloudflare" }).
    nitro(),
  ],
  // Points Nitro's server build at our custom SSR entry (src/server.ts),
  // same as the "server: { entry: 'server' }" option the Lovable config used.
  environments: {
    ssr: {
      build: {
        rollupOptions: { input: "./src/server.ts" },
      },
    },
  },
  resolve: {
    // Avoid duplicate React/TanStack copies if any dependency bundles its own
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
});