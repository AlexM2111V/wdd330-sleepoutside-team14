// src/js/ProductList.mjs
// ------------------------------------------------------
// Renders a list of product cards, using a dataSource and a template function.
// With API data, image fields come from product.Images.PrimaryMedium, etc.
// ------------------------------------------------------

import { renderListWithTemplate } from "./utils.mjs";

/** Choose a medium image for cards, with safe fallbacks */
function getCardImage(product) {
  return (
    product?.Images?.PrimaryMedium ??
    product?.Images?.PrimarySmall ??
    "/images/noun_Tent_2517.svg"
  );
}

/** Normalize brand to a string whether it's object {Name} or raw string */
function getBrand(product) {
  return typeof product?.Brand === "string"
    ? product.Brand
    : product?.Brand?.Name ?? "";
}

/** Prefer Name, fallback to NameWithoutBrand */
function getName(product) {
  return product?.Name ?? product?.NameWithoutBrand ?? "";
}

/** Choose the best available price field from API */
function getPrice(product) {
  const n =
    product?.FinalPrice ??
    product?.ListPrice ??
    product?.SuggestedRetailPrice ??
    0;
  return Number(n).toFixed(2);
}

/** Template for a product card on the listing page */
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${getCardImage(product)}" alt="Image of ${getName(product)}" />
      <h3 class="card__brand">${getBrand(product)}</h3>
      <h2 class="card__name">${getName(product)}</h2>
      <p class="product-card__price">$${getPrice(product)}</p>
    </a>
  </li>`;
}

export default class ProductList {
  /**
   * @param {string} category - current category (tents, backpacks, sleeping-bags, hammocks)
   * @param {Object} dataSource - must have getData(category)
   * @param {HTMLElement} listElement - UL or other container to insert cards into
   */
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  /** Fetch and render the list */
  async init() {
    const list = await this.dataSource.getData(this.category);
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true // clear container first
    );
  }
}