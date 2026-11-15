import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  server: {
    port: 8080,
  },
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    ...(command === "build"
      ? [
          nitro({
            defaultPreset: process.env["VERCEL"] ? "vercel" : "node-server",
          }),
        ]
      : []),
  ],
}));
