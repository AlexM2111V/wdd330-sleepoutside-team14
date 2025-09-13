// W02 Individual Activity: wire up ProductData + ProductList on the home page
import ProductData from "./ProductData.mjs"; // data access for /json/<category>.json
import ProductList from "./ProductList.mjs";  // renders a list of product cards

// Find the UL that will hold the product cards
const listElement = document.querySelector(".product-list");
if (listElement) {
  // Use 'tents' per current data source
  const dataSource = new ProductData("tents");
  const productList = new ProductList("tents", dataSource, listElement);
  productList.init();
}