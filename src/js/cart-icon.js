import { getLocalStorage } from "./utils.mjs";

export function getCartItemCount() {
    const cartItems = getLocalStorage("so-cart");
    let itemCount = 0;

    // Check if the cart is not empty and do contains an array object
    if (Array.isArray(cartItems)) {
        itemCount = cartItems.length;
    }
    return itemCount;
}