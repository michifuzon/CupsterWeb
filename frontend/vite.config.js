import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages sirve el repo bajo /CupsterWeb/, no en la raíz del dominio.
  base: mode === "ghpages" ? "/CupsterWeb/" : "/",
  server: {
    host: true
  }
}));
