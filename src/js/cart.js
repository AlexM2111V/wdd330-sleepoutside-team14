// src/js/cart.js
import {
  getLocalStorage,
  setLocalStorage,
  qs,
  renderListWithTemplate,
} from "./utils.mjs";

// Normalize "../images/..." => "/images/..."
function normalizeImagePath(p = "") {
  return p.replace(/^(\.\.\/)+/, "/");
}

function itemTotal(item) {
  const n = Number(item.Price ?? 0) * Number(item.quantity ?? 1);
  return isNaN(n) ? 0 : n;
}

function cartItemTemplate(item) {
  const price = Number(item.Price ?? 0).toFixed(2);
  const line = itemTotal(item).toFixed(2);
  const img = normalizeImagePath(item.Image ?? "");
  const brand = typeof item.Brand === "string" ? item.Brand : (item.Brand?.Name ?? "");
  const name = item.Name ?? item.NameWithoutBrand ?? "";

  // ⬇⬇⬇ match your CSS class names exactly
  return `
  <li class="cart-card" data-id="${item.Id}">
    <div class="cart-card__image">
      <img src="${img}" alt="${name}"
           onerror="this.onerror=null;this.src='/images/noun_Tent_2517.svg';this.style.objectFit='contain';"/>
    </div>

    <div class="cart-card__content">
      <h3 class="card__brand">${brand}</h3>
      <h4 class="card__name">${name}</h4>
      <p class="cart-card__quantity">Qty: <span class="qty">${item.quantity ?? 1}</span></p>
      <p class="cart-card__price">Unit: $${price}</p>
      <p class="cart-card__line">Line total: $<span class="line-total">${line}</span></p>

      <div class="cart-item__qty">
        <button class="cart-dec" aria-label="decrease quantity">−</button>
        <button class="cart-inc" aria-label="increase quantity">+</button>
        <button class="cart-remove" aria-label="remove item">Remove</button>
      </div>
    </div>
  </li>`;
}

function renderCart() {
  const listEl = qs(".cart-list");
  const cart = getLocalStorage("so-cart") ?? [];

  if (!listEl) return;

  if (!cart.length) {
    listEl.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    updateSummary(cart);
    return;
  }

  renderListWithTemplate(cartItemTemplate, listEl, cart, "afterbegin", true);
  updateSummary(cart);
  attachItemHandlers();
}

function updateSummary(cart) {
  const total = (cart ?? []).reduce((sum, i) => sum + itemTotal(i), 0);
  let summary = qs(".cart-summary");
  if (!summary) {
    const parent = qs("main") || document.body;
    summary = document.createElement("div");
    summary.className = "cart-summary";
    summary.style.marginTop = "1rem";
    parent.appendChild(summary);
  }
  summary.innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
}

function attachItemHandlers() {
  const listEl = qs(".cart-list");
  if (!listEl) return;

  listEl.addEventListener("click", (e) => {
    const li = e.target.closest(".cart-card"); // ⬅ changed to .cart-card
    if (!li) return;
    const id = li.dataset.id;

    const cart = getLocalStorage("so-cart") ?? [];
    const idx = cart.findIndex((p) => String(p.Id) === String(id));
    if (idx === -1) return;

    if (e.target.classList.contains("cart-inc")) {
      cart[idx].quantity = (cart[idx].quantity ?? 1) + 1;
    } else if (e.target.classList.contains("cart-dec")) {
      cart[idx].quantity = Math.max(1, (cart[idx].quantity ?? 1) - 1);
    } else if (e.target.classList.contains("cart-remove")) {
      cart.splice(idx, 1);
    } else {
      return;
    }

    setLocalStorage("so-cart", cart);
    renderCart(); // re-render to reflect changes
  });
}

// boot
renderCart();