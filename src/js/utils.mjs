// src/js/utils.mjs
// ------------------------------------------------------
// Common utilities used across the app.
// Includes:
//  - DOM helpers (qs)
//  - LocalStorage helpers
//  - URL param helper (getParam)
//  - Rendering helpers for lists and single templates
//  - Header/Footer partial loader
// ------------------------------------------------------

// Select a single element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// LocalStorage helpers
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get a URL query parameter by name, e.g. getParam('category')
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Render a list using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (!parentElement) return;
  if (clear) parentElement.innerHTML = "";
  const htmlStrings = (list ?? []).map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render a single HTML template into a container
export function renderWithTemplate(template, parentElement, data, callback) {
  const fragment = document.createRange().createContextualFragment(template);
  parentElement.replaceChildren(fragment);
  if (callback) callback(data);
}

// Load an HTML partial as a string
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load template: ${path}`);
  return await res.text();
}

// Insert header and footer partials into #main-header and #main-footer
export async function loadHeaderFooter() {
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate("/partials/header.html"),
    loadTemplate("/partials/footer.html"),
  ]);

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) renderWithTemplate(headerTemplate, headerElement);
  if (footerElement) renderWithTemplate(footerTemplate, footerElement);
}
// ADD to src/js/utils.mjs
export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main") || document.body;

  const alert = document.createElement("div");
  alert.className = "alert";
  alert.setAttribute("role", "alert");
  alert.innerHTML = `
    <span class="alert__msg">${message}</span>
    <button class="alert__close" aria-label="Dismiss">×</button>
  `;

  alert.addEventListener("click", (e) => {
    if (e.target.classList.contains("alert__close")) {
      alert.remove();
    }
  });

  main.prepend(alert);
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}
