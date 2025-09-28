import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

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
        alertMessage(`"${this.product.NameWithoutBrand}" was added to cart`);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    const container = document.createElement("section");
    const percentageSaved = ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice * 100).toFixed(0);
    container.classList.add("product-detail");


    container.innerHTML = `
    <h2>${product.Brand.Name}</h2>
    <h3 class="divider">${product.NameWithoutBrand}</h3>
    <picture>  <source media="(min-width: 600px)" srcset="${product.Images.PrimaryExtraLarge}">
    <source media="(min-width: 300px)" srcset="${product.Images.PrimaryLarge}">
    <img src="${product.Images.PrimaryMedium}" alt="Responsive image">
    </picture>
    <p class="product-detail-price">$${product.FinalPrice} <span class="saved"> ${percentageSaved}% off</span></p>
    <p class="product-detail-suggested">$${product.SuggestedRetailPrice}</p>
    <p id="productColor">${product.Colors[0].ColorName}</p>
    <div id="productDesc">${product.DescriptionHtmlSimple}</div>
    <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
  `;

    document.querySelector("main").appendChild(container);

    return container;
}