import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  /*Working on completing the Total$InCart feature*/
  if (!cartItems || cartItems.lenght === 0) {
    productList.innerHTML = "Your cart is empty";
    /*Hide total$InCart*/
    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter) {
      cartFooter.classList.add("hide");
    }
  } else {
    /*Render Product List*/
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productList.innerHTML = htmlItems.join("");

    /*Show the cart total*/
    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter) {
      cartFooter.classList.remove("hide");
    }

    /*Calaculate total amount of all the items in cart*/
    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
    /*Look for element where the total will be displayed*/
    const cartTotalElement = document.querySelector(".cart-total");
    if (cartTotalElement) {
      /*Update the element's text content with total and two decimal places (.toFix(2))*/
      cartTotalElement.textContent = `total: $${total.toFixed(2)}`;
    }
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
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
loadHeaderFooter();

document.querySelector(".product-list").addEventListener("click", removeItemFromCart);
