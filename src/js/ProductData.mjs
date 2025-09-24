// src/js/ProductData.mjs
// ------------------------------------------------------
// Data access object for products using the backend API.
// Reads the base URL from Vite env (src/.env and Netlify env).
// We inline the convertToJson helper to avoid extra imports.
// ------------------------------------------------------

// Base URL pulled from Vite env; must be prefixed with VITE_
const baseURL = import.meta.env.VITE_SERVER_URL; // e.g., "https://wdd330-backend.onrender.com/"

/**
 * Convert a Fetch Response to JSON and throw on HTTP errors.
 * Using inline helper so we don't need externalServices.mjs.
 */
async function convertToJson(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const msg = `HTTP ${response.status} ${response.statusText}${
      text ? ` — ${text.slice(0, 200)}` : ""
    }`;
    throw new Error(msg);
  }
  return response.json();
}

export default class ProductData {
  constructor() {
    // No params needed; category is passed when fetching
  }

  /**
   * Fetch products for a given category from the API.
   * @param {string} category - "tents" | "backpacks" | "sleeping-bags" | "hammocks"
   * @returns {Promise<Array>} array of product objects (data.Result)
   */
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // API returns { Result: [...] }
  }

  /**
   * Fetch a single product by ID from the API.
   * @param {string|number} id - product ID
   * @returns {Promise<Object>} product object (data.Result)
   */
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; // API returns { Result: {...} }
  }
}