// src/js/cart-helpers.js
// Tiny helpers to add items to the cart in a consistent shape

import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export const CART_KEY = "so-cart";

// Normalize a product (API or local) into the cart item shape
export function toCartItem(product) {
  const image =
    product?.Images?.PrimaryMedium ||
    product?.Images?.PrimaryLarge ||
    product?.Image ||
    "/images/noun_Tent_2517.svg";

  const price = Number(
    product?.FinalPrice ?? product?.Price ?? product?.ListPrice ?? 0
  );

  return {
    Id: String(product?.Id ?? product?.id ?? ""),
    Name: product?.Name ?? "",
    Brand: product?.Brand ?? "",
    Image: image,
    Price: isNaN(price) ? 0 : price,
    quantity: 1,
  };
}

// Add (or increment) an item in the cart and persist it
export function addToCart(product) {
  const cart = getLocalStorage(CART_KEY) ?? [];
  const incoming = toCartItem(product);
  if (!incoming.Id) return;

  const idx = cart.findIndex((i) => String(i.Id) === String(incoming.Id));
  if (idx >= 0) {
    cart[idx].quantity = (cart[idx].quantity ?? 1) + 1;
  } else {
    cart.push(incoming);
  }
  setLocalStorage(CART_KEY, cart);
}