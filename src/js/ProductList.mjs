// ProductList.mjs
// W02 Individual Activity: Dynamic Product List
// ⚠️ Keep comments: This module renders product cards using a reusable template+renderer approach.

import { renderListWithTemplate } from "./utils.mjs";

// Simple template function for a product card.
// We keep the HTML here minimal and allow CSS to style it.
// Note: product.Image in the JSON already points to ../images/... which resolves to /images after build.
function productCardTemplate(product) {
  // Defensive text fallbacks to avoid 'undefined' in UI
  const brand = product.Brand?.Name ?? "";
  const name = product.Name ?? "";
  const price = (product.FinalPrice ?? product.ListPrice ?? product.SuggestedRetailPrice ?? "").toString();
  const img = product.Image ?? "";
  const id = product.Id ?? "";

  return `<li class="product-card">
    <a href="product_pages/index.html?product=${id}">
      <img src="${img}" alt="Image of ${name}">
      <h2 class="card__brand">${brand}</h2>
      <h3 class="card__name">${name}</h3>
      <p class="product-card__price">$${price}</p>
    </a>
  </li>`;
}

export default class ProductList {
  /**
   * @param {string} category - product category, e.g., "tents"
   * @param {object} dataSource - an object exposing getData(): Promise<Array<Product>>
   * @param {HTMLElement} listElement - output target UL/OL element
   */
  constructor(category, dataSource, listElement) {
    // You passed in this information to make the class as reusable as possible.
    // Being able to define these things when you use the class will make it very flexible
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // the dataSource will return a Promise...so you can use await to resolve it.
    const list = await this.dataSource.getData();
    // next, render the list
    this.renderList(list);
  }

  // Keep this thin; delegate to the reusable util function
  renderList(list) {
    // We use 'afterbegin' and clear=true so we always replace any placeholder content.
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}