import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin SVGR pour inliner les SVG comme composants React
    svgr(),
  ],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@store": path.resolve(__dirname, "./src/stores"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    // Optimisation des chunks pour réduire la chaîne de dépendances
    rollupOptions: {
      output: {
        // Fonction manualChunks pour rolldown-vite
        manualChunks(id) {
          // Séparer React dans son propre chunk (mis en cache longtemps)
          if (id.includes("node_modules/react-dom")) {
            return "vendor-react-dom";
          }
          if (id.includes("node_modules/react-router-dom")) {
            return "vendor-react-router";
          }
          if (id.includes("node_modules/react")) {
            return "vendor-react";
          }
          // Séparer Zustand
          if (id.includes("node_modules/zustand")) {
            return "vendor-zustand";
          }
          // Séparer Lottie (chargé en lazy)
          if (id.includes("node_modules/lottie-react") || id.includes("node_modules/lottie-web")) {
            return "vendor-lottie";
          }
        },
      },
    },
    // Compression des chunks
    chunkSizeWarningLimit: 500,
  },
  // Optimiser les dépendances pour le dev
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "zustand"],
    // Exclure lottie du pré-bundling pour le lazy loading
    exclude: ["lottie-react"],
  },
});
