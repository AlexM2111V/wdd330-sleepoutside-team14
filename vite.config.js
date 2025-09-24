// vite.config.js
// ---------------------------------------------
// Vite build configuration. We point Vite at our "src" root and
// list *every* HTML entry the app should build to production.
// IMPORTANT: Anytime you add/remove an HTML page, update rollupOptions.input!
// ---------------------------------------------

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // The site source lives under /src
  root: "src/",

  build: {
    // Build output goes to /dist (sibling of /src)
    outDir: "../dist",
    rollupOptions: {
      // List all top-level HTML entry points in the project
      input: {
        // Home page
        main: resolve(__dirname, "src/index.html"),
        // Cart page
        cart: resolve(__dirname, "src/cart/index.html"),
        // Checkout page
        checkout: resolve(__dirname, "src/checkout/index.html"),
        // Product detail page
        product: resolve(__dirname, "src/product_pages/index.html"),
        // NEW: Product listing (W03 individual)
        listing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
});