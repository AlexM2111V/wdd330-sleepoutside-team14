import { getLocalStorage, setLocalStorage} from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  //DON'T USE setLocalStorage("so-cart", product);
  //We should use the getLocalStorage first to put the values of the cart on the cartItems then
  //We include the value in the cart (line 15) abd then we use the setLocalStorage variable
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

