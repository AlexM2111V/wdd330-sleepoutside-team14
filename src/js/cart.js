import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

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
  <p class="cart-card__quantity">Qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function removeItemFromCart(e) {
  const cartItems = getLocalStorage("so-cart");
  const itemId = e.target.dataset.id;

  //! fix for removing multiple items of the same ID DO NOT REMOVE THIS
  const itemIndex = cartItems.findIndex((item) => item.Id == itemId);
  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    localStorage.setItem("so-cart", JSON.stringify(cartItems));
    renderCartContents();
  }
}

renderCartContents();

document
  .querySelector(".product-list")
  .addEventListener("click", removeItemFromCart);
