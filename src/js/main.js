import Alert from "./Alert.mjs";
import { displayCartCount } from "./cart-icon.js";
import { loadHeaderFooter } from "./utils.mjs";

const alertManager = new Alert();

loadHeaderFooter();

alertManager.displayAlerts();

displayCartCount();
