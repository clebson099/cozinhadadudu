import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "logo.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Cozinha da Dudu",
        short_name: "Cozinha da Dudu",
        description: "Gestao de pratos, cardapios e listas de compras para cozinheiras e buffets.",
        theme_color: "#A8B8A0",
        background_color: "#F9F6F1",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: { globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"] },
    }),
  ],
});
