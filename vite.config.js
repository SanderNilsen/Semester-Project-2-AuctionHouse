import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    root: "public",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "public/index.html"),
          listings: resolve(__dirname, "public/listings.html"),
          item: resolve(__dirname, "public/item.html"),
          register: resolve(__dirname, "public/register.html"),  
          profile: resolve(__dirname, "public/profile.html"),        },
      },
    },
    define: {
      "import.meta.env.VITE_API_KEY": JSON.stringify(env.VITE_API_KEY),
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});