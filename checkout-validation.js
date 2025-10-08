/* checkout-validation.js
   Client-side validation, error display, fake async checkout.
   Attach this script after the DOM (or use defer) - current HTML uses defer.
*/

(function () {
  const form = document.getElementById("checkout-form");
  const statusEl = document.getElementById("checkout-status");
  const summaryEl = document.getElementById("form-error-summary");
  const submitBtn = document.getElementById("checkout-btn");

  const qs = id => document.getElementById(id);
  const showError = (inputEl, msg) => {
    if (!inputEl) return;
    const err = qs("err-" + inputEl.id);
    inputEl.classList.add("field-invalid");
    if (err) err.textContent = msg;
    if (inputEl) inputEl.setAttribute("aria-invalid", "true");
  };
  const clearError = inputEl => {
    if (!inputEl) return;
    const err = qs("err-" + inputEl.id);
    inputEl.classList.remove("field-invalid");
    if (err) err.textContent = "";
    inputEl.removeAttribute("aria-invalid");
  };

  const isEmpty = v => !v || v.trim().length === 0;

  const validateEmail = (email) => {
    const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const luhnCheck = (num) => {
    const sanitized = (num || "").replace(/\\D/g, "");
    if (sanitized.length === 0) return false;
    let sum = 0, shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  };

  const validateExpiry = (val) => {
    if (!/^\\d{2}\\/\\d{2}$/.test(val)) return false;
    const [mmStr, yyStr] = val.split("/");
    const mm = parseInt(mmStr, 10);
    const yy = parseInt(yyStr, 10);
    if (Number.isNaN(mm) || Number.isNaN(yy)) return false;
    if (mm < 1 || mm > 12) return false;
    const year = 2000 + yy;
    # treat expiry as end of month
    const lastDay = new Date(year, mm, 0);
    const now = new Date();
    # compare by year/month (ignore day)
    const cmp = (lastDay.getFullYear() > now.getFullYear()) ||
                (lastDay.getFullYear() === now.getFullYear() && lastDay.getMonth() >= now.getMonth());
    return cmp;
  };

  const validateCVV = (val) => /^\\d{3,4}$/.test((val || "").trim());

  const getFormData = () => {
    return {
      name: qs("name").value || "",
      email: qs("email").value || "",
      address: qs("address").value || "",
      cardNumber: qs("card-number").value || "",
      expiry: qs("expiry").value || "",
      cvv: qs("cvv").value || "",
      quantity: parseInt(qs("quantity").value, 10) || 0,
    };
  };

  const validateAll = () => {
    ["name","email","address","card-number","expiry","cvv","quantity"].forEach(id => {
      const el = qs(id);
      if (el) clearError(el);
    });
    summaryEl.textContent = "";
    statusEl.textContent = "";
    statusEl.className = "";

    const data = getFormData();
    const errors = [];

    if (isEmpty(data.name)) {
      showError(qs("name"), "Full name is required.");
      errors.push("Name is required.");
    }

    if (!validateEmail(data.email)) {
      showError(qs("email"), "Enter a valid email address.");
      errors.push("Invalid email.");
    }

    if (isEmpty(data.address)) {
      showError(qs("address"), "Address is required.");
      errors.push("Address is required.");
    }

    const cardSan = (data.cardNumber || "").replace(/\\s+/g, "");
    if (cardSan.length < 12 || !/^\\d+$/.test(cardSan) || !luhnCheck(cardSan)) {
      showError(qs("card-number"), "Enter a valid card number.");
      errors.push("Invalid card number.");
    }

    if (!validateExpiry(data.expiry)) {
      showError(qs("expiry"), "Expiry date must be MM/YY and not expired.");
      errors.push("Invalid expiry date.");
    }

    if (!validateCVV(data.cvv)) {
      showError(qs("cvv"), "CVV must be 3 or 4 digits.");
      errors.push("Invalid CVV.");
    }

    if (!Number.isInteger(data.quantity) || data.quantity < 1) {
      showError(qs("quantity"), "Quantity must be 1 or more.");
      errors.push("Invalid quantity.");
    }

    return { valid: errors.length === 0, errors, data };
  };

  const fakeCheckout = (payload) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.15) {
          reject(new Error("Network error - please try again"));
        } else {
          resolve({ ok: true, orderId: "ORD" + Math.floor(Math.random() * 100000) });
        }
      }, 700);
    });
  };

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (submitBtn.disabled) return;

    const { valid, errors, data } = validateAll();

    if (!valid) {
      summaryEl.textContent = `Please fix the ${errors.length} error(s) and try again.`;
      const firstInvalid = form.querySelector(".field-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";
    statusEl.textContent = "Processing your order...";

    try {
      const result = await fakeCheckout(data);
      statusEl.textContent = `Order successful! Order ID: ${result.orderId}`;
      statusEl.classList.add("success");
      form.reset();
    } catch (err) {
      console.error("Checkout error:", err);
      statusEl.textContent = "Checkout failed: " + (err.message || "Try again later.");
      statusEl.classList.add("failure");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Checkout";
    }
  });

  // Inline field clearing
  ["name","email","address","card-number","expiry","cvv","quantity"].forEach(id => {
    const el = qs(id);
    if (!el) return;
    el.addEventListener("input", () => clearError(el));
  });

})();
