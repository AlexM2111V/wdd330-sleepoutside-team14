// src/js/checkout.js
import { loadHeaderFooter, qs } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const process = new CheckoutProcess("so-cart", "#summary");

// init summaries as soon as possible
process.init();

// Recalculate when ZIP changes (and also on blur to catch paste or autofill)
const zip = qs("#zip");
["input", "change", "blur"].forEach((evt) => {
  if (zip) zip.addEventListener(evt, () => process.calculateOrderTotal());
});

// Handle submit with native HTML5 validation
const form = qs("#checkout-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // One last recompute before posting (belt & suspenders)
    process.calculateItemSubTotal();
    process.calculateOrderTotal();
    process.checkout(form);
  });
}