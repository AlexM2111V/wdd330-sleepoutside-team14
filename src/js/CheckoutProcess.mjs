import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    // convert the form data to a JSON object
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

function packageItems(items) {
    const simplifiedItems = items.map((item) => {
        return {
            id: item.Id,
            price: item.FinalPrice,
            name: item.Name,
            quantity: item.quantity || 1,
        };
    });
    return simplifiedItems;
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        // calculate and display the total amount of the items in the cart, and the number of items.
        const summaryElement = document.querySelector(
            this.outputSelector + " #cartTotal"
        );
        const itemNumElement = document.querySelector(
            this.outputSelector + " #num-items"
        );
        
        const totalQuantity = this.list.reduce((total, item) => total + (item.quantity || 1), 0);
        itemNumElement.innerText = totalQuantity;
        
        const amounts = this.list.map((item) => item.FinalPrice * (item.quantity || 1));
        this.itemTotal = amounts.reduce((sum, item) => sum + item, 0).toFixed(2);
        summaryElement.innerText = `$${this.itemTotal}`;
    }

    calculateOrderTotal() {
        // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
        this.tax = (this.itemTotal * .06);
        const totalQuantity = this.list.reduce((total, item) => total + (item.quantity || 1), 0);
        this.shipping = 10 + (totalQuantity - 1) * 2;
        this.orderTotal = (
            parseFloat(this.itemTotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping)
        )
        // display the totals.
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // once the totals are all calculated display them in the order summary page
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout() {
        const formElement = document.forms["checkout"];
        const order = formDataToJSON(formElement);

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            const response = await services.checkout(order);
            setLocalStorage("so-cart", []);
            location.assign("/checkout/success.html");
        } catch (err) {
            // get rid of any preexisting alerts.
            removeAllAlerts();
            // loop through all the messages and display
            for (let message in err.message) {
                alertMessage(err.message[message]);
            }

            console.log(err);
        }
    }
}