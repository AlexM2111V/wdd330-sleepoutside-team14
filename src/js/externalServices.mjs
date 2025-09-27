// src/js/ExternalServices.mjs
// ------------------------------------------------------
// Centralized API access (products + checkout).
// Includes robust convertToJson that preserves server errors.
// ------------------------------------------------------

const baseURL = import.meta.env.VITE_SERVER_URL; // e.g. https://wdd330-backend.onrender.com/

/** Convert a fetch Response into JSON, preserving server errors. */
async function convertToJson(res) {
  let json;
  try {
    // Try to parse body either way so we can pass useful details up
    json = await res.json();
  } catch (e) {
    // Body wasn't JSON; keep a best-effort string
    json = { message: await res.text().catch(() => "Bad Response") };
  }

  if (res.ok) return json;

  // Throw a custom error object the caller can inspect
  throw { name: "servicesError", message: json };
}

export default class ExternalServices {
  async getData(category) {
    const res = await fetch(`${baseURL}products/search/${encodeURIComponent(category)}`);
    const data = await convertToJson(res);
    return data.Result; // API returns { Result: [...] }
  }

  async findProductById(id) {
    const res = await fetch(`${baseURL}product/${encodeURIComponent(id)}`);
    const data = await convertToJson(res);
    return data.Result; // API returns { Result: {...} }
  }

  /** Submit the order to the backend. Expects a full order object. */
  async checkout(order) {
    const res = await fetch(`${baseURL}checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return convertToJson(res); // success JSON or { name:'servicesError', message: {...} } thrown
  }
}