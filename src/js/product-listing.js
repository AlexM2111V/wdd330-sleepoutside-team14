import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { displayCartCount } from "./cart-icon.js";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const category = getParam("category");

const dataSource = new ProductData();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

loadHeaderFooter();

productList.init();

displayCartCount();
