import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.mjs";
import updateCartIcon from "./cart-icon.js";

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

const alertManager = new Alert();

alertManager.displayAlerts();
productList.init();
