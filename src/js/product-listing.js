import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { displayCartCount } from "./cart-icon.js";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, element);

productList.init();

displayCartCount();
