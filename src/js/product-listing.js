// src/js/product-listing.js
// ------------------------------------------------------
// This script powers the /product_listing/index.html page.
// It reads ?category=<name> from the URL, fetches that category
// from the API via ProductData, and renders cards via ProductList.
// Also updates the page title to include the category.
// ------------------------------------------------------

import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, qs } from "./utils.mjs";

// Insert header/footer partials
loadHeaderFooter();

// Category from URL (default "tents" if missing)
const category = getParam("category") || "tents";

// Create data source + list, then render
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);
myList.init();

// Update title to "Top Products: X"
const title = qs("#listing-title");
if (title) {
  const pretty = category.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  title.textContent = `Top Products: ${pretty}`;
}