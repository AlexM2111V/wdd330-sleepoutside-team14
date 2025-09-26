import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ExternalServices();
const productID = getParam("product");

loadHeaderFooter();

const product = new ProductDetails(productID, dataSource);

product.init();

// add to cart button event handler
async function addToCartHandler(e) {
  const productInfo = await dataSource.findProductById(e.target.dataset.id);
  product.addProductToCart(productInfo);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
