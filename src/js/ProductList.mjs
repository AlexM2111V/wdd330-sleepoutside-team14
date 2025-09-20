import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {

    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        // use the datasource to get the list of products. getData will return a promise! use await or .then() to process it
        const list = await this.dataSource.getData(this.category);
        console.log(list);
        this.updateTitle();
        this.renderProductList(list);
    }

    updateTitle() {
        const titleElement = document.querySelector('.products h2');
        if (titleElement && this.category) {
            const formattedCategory = this.category.charAt(0).toUpperCase() + this.category.slice(1);
            titleElement.textContent = `Top Products: ${formattedCategory}`;
        }
    }

    renderProductList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);

    }

}

function productCardTemplate(product) {
    const percentageSaved = ((product.SuggestedRetailPrice - product.FinalPrice)/product.SuggestedRetailPrice * 100).toFixed(0);
    return `
    <li class="product-card">
      <a href="../product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.NameWithoutBrand}</h3>
        <p class="product-card-price suggested">$${product.SuggestedRetailPrice}</p>
        <p class="product-card-price">$${product.FinalPrice} <span class="saved"> ${percentageSaved}% off</span></p>
      </a>
    </li>
    `;
}