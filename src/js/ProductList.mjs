import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {

    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        // use the datasource to get the list of products. getData will return a promise! use await or .then() to process it
        const list = await this.dataSource.getData();
        console.log(list);
        // the product list is needed before rendering the HTML
        this.renderProductList(list);
    }

    renderProductList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);

    }

}

function productCardTemplate(product) {
    return `
    <li class="product-card">
      <a href="product_pages/?products=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}