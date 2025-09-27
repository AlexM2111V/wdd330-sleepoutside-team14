// vite.config.js
// -------------------------------------------------------------
// Vite build configuration for the SleepOutside project.
// Notes:
// - Source lives under /src, so we set root: "src/"
// - Static assets (css/images/json/partials) live under /src/public
//   and are served at the site root (e.g., /css/style.css, /images/...)
// - Anytime you add/remove an HTML page, update rollupOptions.input
// - The production build goes to /dist
// -------------------------------------------------------------

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // All source files (HTML/JS/CSS) live beneath /src
  root: "src/",

  // Optional: Vite dev server tweaks (you can omit if you like)
  server: {
    open: true, // open browser on `npm run start`
  },

  build: {
    // Output directory for `npm run build`
    outDir: "../dist",
    emptyOutDir: true, // clean dist before build

    rollupOptions: {
      // List EVERY top-level HTML entry that should be built
      input: {
        // Home page
        main: resolve(__dirname, "src/index.html"),

        // Cart page
        cart: resolve(__dirname, "src/cart/index.html"),

        // Checkout page (W04)
        checkout: resolve(__dirname, "src/checkout/index.html"),

        // Product detail page (single template that reads ?product=)
        product: resolve(__dirname, "src/product_pages/index.html"),

        // Product listing page (W03 individual: reads ?category=)
        product_listing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
});