// src/js/product.js
// ------------------------------------------------------
// Product detail page controller.
// Uses ProductData.findProductById(id) to load a product,
// renders the details, and adds "Add to Cart" behavior.
// Cart helpers are inlined to avoid extra imports.
// ------------------------------------------------------

import { qs, getParam, getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

// -----------------------------
// Inlined cart helpers
// -----------------------------

const CART_KEY = "so-cart";

// Normalize API/local product to the cart item shape:
// { Id, Name, Brand, Image, Price, quantity }
function toCartItem(product) {
  // Pick a good image (large → medium → small → legacy Image → fallback)
  const image =
    product?.Images?.PrimaryMedium ||
    product?.Images?.PrimaryLarge ||
    product?.Images?.PrimarySmall ||
    product?.Image ||
    "/images/noun_Tent_2517.svg";

  // Price can come from API (FinalPrice) or legacy JSON (Price/ListPrice)
  const price = Number(
    product?.FinalPrice ?? product?.Price ?? product?.ListPrice ?? 0
  );

  return {
    Id: String(product?.Id ?? product?.id ?? ""),
    Name: product?.Name ?? product?.NameWithoutBrand ?? "",
    Brand:
      typeof product?.Brand === "string"
        ? product.Brand
        : product?.Brand?.Name ?? "",
    Image: image,
    Price: isNaN(price) ? 0 : price,
    quantity: 1,
  };
}

// Add (or increment) an item in the cart
function addToCart(product) {
  const cart = getLocalStorage(CART_KEY) ?? [];
  const incoming = toCartItem(product);
  if (!incoming.Id) return; // don't add if we somehow have no id

  const idx = cart.findIndex((i) => String(i.Id) === String(incoming.Id));
  if (idx >= 0) {
    cart[idx].quantity = (cart[idx].quantity ?? 1) + 1;
  } else {
    cart.push(incoming);
  }
  setLocalStorage(CART_KEY, cart);
}

// -----------------------------
// Rendering helpers
// -----------------------------

// Normalize image URLs like "//cdn..." → "https://cdn..."
function normalizeImageUrl(url) {
  if (!url) return "";
  return url.startsWith("//") ? "https:" + url : url;
}

function getLargeImage(p) {
  const raw =
    p?.Images?.PrimaryLarge ||
    p?.Images?.PrimaryMedium ||
    p?.Images?.PrimarySmall ||
    p?.Image ||
    "";
  const normalized = normalizeImageUrl(raw);
  return normalized || "/images/noun_Tent_2517.svg";
}

function getBrand(p) {
  return typeof p?.Brand === "string" ? p.Brand : p?.Brand?.Name ?? "";
}

function getName(p) {
  return p?.Name ?? p?.NameWithoutBrand ?? "";
}

function getPrice(p) {
  return Number(p?.FinalPrice ?? p?.Price ?? p?.ListPrice ?? 0).toFixed(2);
}

function productTemplate(p) {
  const img = getLargeImage(p);
  const brand = getBrand(p);
  const name = getName(p);
  const price = getPrice(p);
  const desc = p?.DescriptionHtmlSimple ?? p?.Description ?? "";

  return `
    <section class="product-detail">
      <img
        class="product__image"
        src="${img}"
        alt="${name}"
        onerror="this.onerror=null;this.src='/images/noun_Tent_2517.svg';this.style.objectFit='contain';"
      />
      <hr />
      <h3 class="product__brand">${brand}</h3>
      <h1 class="product__name">${name}</h1>
      <p class="product__price">$${price}</p>
      <div class="product__desc">${desc}</div>
      <button id="addToCart" class="btn primary">Add to Cart</button>
    </section>
  `;
}

function renderProduct(p) {
  const container = qs("main") || document.body;
  container.innerHTML = productTemplate(p);

  const btn = qs("#addToCart", container);
  if (btn) {
    btn.addEventListener("click", () => {
      addToCart(p);
      btn.textContent = "Added!";
      setTimeout(() => (btn.textContent = "Add to Cart"), 900);
    });
  }
}

// -----------------------------
// Boot
// -----------------------------

(async function init() {
  try {
    const id = getParam("product");
    if (!id) {
      console.error("No product id in URL (?product=123)");
      return;
    }
    const services = new ProductData();
    const product = await services.findProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    renderProduct(product);
  } catch (err) {
    console.error("Failed to load product:", err);
    const container = qs("main") || document.body;
    container.innerHTML =
      "<p>Sorry, we couldn't load that product right now.</p>";
  }
})();