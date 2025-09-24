// src/js/product.js
// ------------------------------------------------------
// Product detail page logic (W03 API version)
// - reads ?product=<id>
// - fetches product by ID from API via ProductData
// - displays brand, name, price, description, image
// - WIRES UP "Add to Cart" button to store a normalized item in localStorage ("so-cart")
//   compatible with your cart.js rendering (Price, Image, Brand, Name, Id, quantity)
// ------------------------------------------------------

import { getParam, qs, getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

/** Normalize API image URLs: convert //example.com/... to https://example.com/... */
function normalizeImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("//")) return "https:" + url;
  return url;
}

/** Normalize brand string */
function getBrand(product) {
  return typeof product?.Brand === "string"
    ? product.Brand
    : product?.Brand?.Name ?? "";
}

/** Prefer Name with fallback */
function getName(product) {
  return product?.Name ?? product?.NameWithoutBrand ?? "";
}

/** Choose the best price */
function getPrice(product) {
  const n =
    product?.FinalPrice ??
    product?.ListPrice ??
    product?.SuggestedRetailPrice ??
    0;
  return Number(n).toFixed(2);
}

/** Prefer a large image for the details page; broaden fallbacks; normalize URL */
function getLargeImage(product) {
  const raw =
    product?.Images?.PrimaryLarge ??
    product?.Images?.PrimaryMedium ??
    product?.Images?.PrimarySmall ??
    product?.Image ??
    "";
  const normalized = normalizeImageUrl(raw);
  return normalized || "/images/noun_Tent_2517.svg";
}

/** Prefer a small/medium image for cart thumbnails; normalize URL */
function getCartImage(product) {
  const raw =
    product?.Images?.PrimarySmall ??
    product?.Images?.PrimaryMedium ??
    product?.Images?.PrimaryLarge ??
    product?.Image ??
    "";
  const normalized = normalizeImageUrl(raw);
  return normalized || "/images/noun_Tent_2517.svg";
}

/**
 * Add the product to localStorage in the format your cart expects.
 * - Key: "so-cart"
 * - If the item already exists (same Id), increment quantity
 * - Otherwise push a new normalized object
 */
function addToCart(product) {
  // Read current cart or start empty
  const cart = getLocalStorage("so-cart") ?? [];

  // Normalize what we save so cart.js can render it nicely
  const normalized = {
    Id: product?.Id,
    Brand: getBrand(product),
    Name: getName(product),
    Price: Number(getPrice(product)), // store as number
    Image: getCartImage(product),
    quantity: 1,
  };

  // See if item exists already
  const index = cart.findIndex((i) => String(i.Id) === String(normalized.Id));
  if (index > -1) {
    cart[index].quantity = (cart[index].quantity ?? 1) + 1;
  } else {
    cart.push(normalized);
  }

  // Persist
  setLocalStorage("so-cart", cart);

  // Optional: tiny UX feedback
  const btn = qs("#addToCart");
  if (btn) {
    const original = btn.textContent;
    btn.textContent = "Added!";
    setTimeout(() => (btn.textContent = original), 800);
  }
}

async function renderProduct() {
  const id = getParam("product");
  if (!id) return;

  const ds = new ProductData();
  const product = await ds.findProductById(id);
  if (!product) return;

  // Extract values
  const brand = getBrand(product);
  const name = getName(product);
  const price = getPrice(product);

  // Populate image with fallback
  const imgEl = qs(".product__image");
  if (imgEl) {
    imgEl.src = getLargeImage(product);
    imgEl.alt = `Product image`;
    imgEl.onerror = () => {
      imgEl.onerror = null;
      imgEl.src = "/images/noun_Tent_2517.svg";
      imgEl.style.objectFit = "contain";
    };
  }

  // Populate text fields
  const brandEl = qs(".product__brand");
  const nameEl = qs(".product__name");
  const priceEl = qs(".product__price");
  const descEl = qs(".product__desc");

  if (brandEl) brandEl.textContent = brand;
  if (nameEl) nameEl.textContent = name;
  if (priceEl) priceEl.textContent = `$${price}`;
  // API includes HTML-safe description here:
  if (descEl) descEl.innerHTML = product.DescriptionHtmlSimple ?? "";

  // Wire up Add to Cart
  const addBtn = qs("#addToCart");
  if (addBtn) {
    addBtn.addEventListener("click", () => addToCart(product));
  }
}

// Kick things off
renderProduct();