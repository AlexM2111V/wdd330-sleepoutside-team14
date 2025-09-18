import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.mjs";
import { displayCartCount } from "./cart-icon.js";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

const alertManager = new Alert();

loadHeaderFooter();

alertManager.displayAlerts();

productList.init();

displayCartCount();
