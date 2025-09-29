import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { displayCartCount } from "./cart-icon.js";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img src="${item.Images.PrimaryMedium}" alt="${item.Name}"/>
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div class="cart-card__quantity">
    <label for="qty-${item.Id}">Qty:</label>
    <input type="number" id="qty-${item.Id}" class="quantity-input" value="${item.quantity || 1}" min="1" data-id="${item.Id}">
  </div>
  <p class="cart-card__price">$${(item.FinalPrice * (item.quantity || 1)).toFixed(2)}</p>
</li>`;

  return newItem;
}

function removeItemFromCart(e) {
  if (e.target.classList.contains("cart-card__remove")) {
    const cartItems = getLocalStorage("so-cart");
    const itemId = e.target.dataset.id;

    //! fix for removing multiple items of the same ID DO NOT REMOVE THIS
    const itemIndex = cartItems.findIndex((item) => item.Id == itemId);
    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      localStorage.setItem("so-cart", JSON.stringify(cartItems));
      renderCartContents();
      displayCartCount();
    }
  }
}

function updateQuantity(e) {
  if (e.target.classList.contains("quantity-input")) {
    const cartItems = getLocalStorage("so-cart");
    const itemId = e.target.dataset.id;
    const newQuantity = parseInt(e.target.value);

    if (newQuantity < 1) {
      e.target.value = 1;
      return;
    }

    const itemIndex = cartItems.findIndex((item) => item.Id == itemId);
    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity = newQuantity;
      localStorage.setItem("so-cart", JSON.stringify(cartItems));
      renderCartContents();
      displayCartCount();
    }
  }
}

renderCartContents();

setTimeout(() => {
  displayCartCount();
}, 100);

document
  .querySelector(".product-list")
  .addEventListener("click", removeItemFromCart);

document
  .querySelector(".product-list")
  .addEventListener("change", updateQuantity);
