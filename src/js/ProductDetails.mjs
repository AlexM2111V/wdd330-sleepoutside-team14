import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails(list) {
        const parent = document.querySelector("main");
        const details = productDetailsTemplate(this.product);
        parent.appendChild(details);
    }
}

function productDetailsTemplate(product) {
    const container = document.createElement("section");
    container.classList.add("product-detail");

    container.innerHTML = `
    <h2>${product.Brand.Name}</h2>
    <h3 class="divider">${product.NameWithoutBrand}</h3>
    <img src="${product.Image}" alt="${product.NameWithoutBrand}" id="productImage" class="divider"/>
    <p id="productPrice">$${product.FinalPrice}</p>
    <p id="productColor">${product.Colors[0].ColorName}</p>
    <div id="productDesc">${product.DescriptionHtmlSimple}</div>
    <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
  `;

    return container;
}