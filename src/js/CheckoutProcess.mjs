// src/js/CheckoutProcess.mjs
// Checkout totals, validation, and order submission.

import ExternalServices from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage, qs, alertMessage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;

    this.list = [];
    this.itemsCount = 0;
    this.itemTotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;

    this.services = new ExternalServices();
  }

  // ---------- lifecycle ----------
  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();   // items + subtotal
    this.calculateOrderTotal();     // <-- ensure tax & shipping appear on load
  }

  // ---------- helpers ----------
  lineTotal(item) {
    const price = Number(item?.Price ?? item?.price ?? 0);
    const qty = Number(item?.quantity ?? 1);
    const n = price * qty;
    return Number.isFinite(n) ? n : 0;
  }

  // ---------- summaries ----------
  calculateItemSubTotal() {
    const items = Array.isArray(this.list) ? this.list : [];
    this.itemsCount = items.reduce((sum, i) => sum + Number(i?.quantity ?? 1), 0);
    this.itemTotal = items.reduce((sum, i) => sum + this.lineTotal(i), 0);

    const root = qs(this.outputSelector);
    if (root) {
      const countEl = root.querySelector("#items-count");
      const subtotalEl = root.querySelector("#subtotal");
      if (countEl) countEl.textContent = String(this.itemsCount);
      if (subtotalEl) subtotalEl.textContent = this.itemTotal.toFixed(2);
    }
  }

  calculateOrderTotal() {
    // Per assignment: flat formulas (not address-based)
    this.tax = this.itemTotal * 0.06; // 6%

    // $10 first item + $2 each additional. 0 if cart empty.
    if (this.itemsCount <= 0) {
      this.shipping = 0;
    } else {
      this.shipping = 10 + Math.max(0, this.itemsCount - 1) * 2;
    }

    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const root = qs(this.outputSelector);
    if (!root) return;

    const taxEl = root.querySelector("#tax");
    const shipEl = root.querySelector("#shipping");
    const totalEl = root.querySelector("#orderTotal");

    if (taxEl) taxEl.textContent = this.tax.toFixed(2);
    if (shipEl) shipEl.textContent = this.shipping.toFixed(2);
    if (totalEl) totalEl.textContent = this.orderTotal.toFixed(2);
  }

  // ---------- data packaging ----------
  packageItems(items) {
    return (items || []).map((p) => ({
      id: String(p?.Id ?? p?.id ?? ""),
      name: p?.Name ?? p?.name ?? "",
      price: Number(p?.Price ?? p?.price ?? 0),
      quantity: Number(p?.quantity ?? 1),
    }));
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const out = {};
    formData.forEach((value, key) => (out[key] = value));
    return out;
  }

  // ---------- submit ----------
  async checkout(formEl) {
    // make sure browser validation runs
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    // totals should never be stale
    this.calculateItemSubTotal();
    this.calculateOrderTotal();

    try {
      const base = this.formDataToJSON(formEl);

      const order = {
        orderDate: new Date().toISOString(),
        fname: base.fname,
        lname: base.lname,
        street: base.street,
        city: base.city,
        state: base.state,
        zip: base.zip,
        cardNumber: base.cardNumber,
        expiration: base.expiration,
        code: base.code,
        items: this.packageItems(this.list),
        orderTotal: this.orderTotal.toFixed(2),
        shipping: this.shipping,
        tax: this.tax.toFixed(2),
      };

      const result = await this.services.checkout(order);
      setLocalStorage(this.key, []);           // clear cart
      window.location.assign("/checkout/success.html");
      return result;
    } catch (err) {
      console.error("[Checkout] failed:", err);
      document.querySelectorAll(".alert").forEach((n) => n.remove());

      const payload = err?.message ?? err ?? "Bad Request";
      if (Array.isArray(payload?.errors)) {
        payload.errors.forEach((m) => alertMessage(String(m), true));
        return;
      }
      if (payload && typeof payload === "object") {
        const msg = payload.message || payload.error || JSON.stringify(payload).slice(0, 300);
        alertMessage(String(msg), true);
        return;
      }
      alertMessage(String(payload), true);
    }
  }
}