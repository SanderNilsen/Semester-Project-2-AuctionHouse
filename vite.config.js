import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    root: "public",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
