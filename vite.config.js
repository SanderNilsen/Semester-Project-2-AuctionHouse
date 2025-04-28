import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    root: "public",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    define: {
      "import.meta.env.VITE_API_KEY": JSON.stringify(env.VITE_API_KEY),
    },
  };
});