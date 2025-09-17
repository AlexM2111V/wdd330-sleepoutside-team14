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

export function displayCartCount() {
    const itemCount = getCartItemCount();
    //If the cart if not null display the number of items
    if (itemCount > 0) {
        //Get the class of the backpack
        const backPackIcon = document.querySelector(".cart");
        //This is for creating the badge
        const itemCountElement = document.createElement("span");
        //This is for placing the number in the new element(badge)
        itemCountElement.textContent = itemCount;
        //This is for adding style to the badge that contains the items amount number
        itemCountElement.classList.add("item-count-badge");
        //This is for conecting both css classes, the one that have the backpack and the new one that have the badge and number
        backPackIcon.appendChild(itemCountElement);
    }
}