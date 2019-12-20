const uuid = require('uuid');
const colors = require('colors');

class Cart {
  /* Cart Attributes -------------
   * items      -   array of product objects
   * subTotal   -   float
   * tax        -   float
   * total      -   float
   * --------------------------- */
  taxRate = 0.10;

  constructor(oldCart) {
    this.items = oldCart.items || [];
    this.quantity = oldCart.quantity || 0;
    this.tax = oldCart.tax || 0.0;
    this.subTotal = oldCart.subTotal || 0.0;
    this.total = oldCart.total || 0.0;

    this.updatePricesAndQuantity();
  }

  resetCart() {
    this.items = [];
    this.quantity = 0;
    this.tax = 0.0;
    this.subTotal = 0.0;
    this.total = 0.0;
  }

  addItem(newProduct, quantity, options) {
    let cartIndexId;
    var exists = false;

    for (let i = 0; i < this.items.length; i++) {
      var itemListString = JSON.stringify({
        ...this.items[i].product,
        ...this.items[i].options
      }).trim();

      var newProductString = JSON.stringify({
        ...newProduct,
        ...options
      }).trim();

      if (itemListString === newProductString) {
        this.items[i].quantity += quantity;

        if (isNaN(this.items[i].quantity)) {
          this.items[i].quantity = quantity;
        }

        cartIndexId = this.items[i].cartIndexId;
        exists = true;
      }
    }

    if (!exists) {

      this.items.push({
        cartIndexId: uuid() + uuid(),
        product: newProduct,
        options,
        quantity
      });
    }

    this.updatePricesAndQuantity();
  }

  getItemById(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (id === this.items[i].cartIndexId) {
        return this.items[i];
      }
    }

    return undefined;
  }

  updateQuantity(id, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      if (id === this.items[i].cartIndexId) {
        this.items[i].quantity = Number(newQuantity);
      }
    }

    this.updatePricesAndQuantity();
  }

  emptyCart() {
    this.resetCart();
  }

  removeItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].cartIndexId === id) {
        this.items.splice(i, 1);
      }
    }

    this.updatePricesAndQuantity();
  }

  updatePricesAndQuantity() {
    var priceSum = 0;
    var quantitySum = 0;

    for (let i = 0; i < this.items.length; i++) {
      priceSum += this.items[i].quantity * this.items[i].product.price;
      quantitySum += Number(this.items[i].quantity);
    }

    this.quantity = quantitySum;
    this.subTotal = priceSum;
    this.tax = this.taxRate * this.subTotal;
    this.total = this.tax + this.subTotal;
  }

  // getters --------------------------------------------------
  getSubTotal() {
    return this.subTotal;
  }

  getTax() {
    return this.tax;
  }

  getTotal() {
    return this.total;
  }

  getQuantity() {
    return this.quantity;
  }

  getItems() {
    return this.items;
  }

  printCartNumbers() {
    console.log(colors.green('Quantity: ') + this.quantity);
    console.log(colors.green('Subtotal: ') + '$' + this.subTotal);
    console.log(colors.green('Tax: ') + '$' + this.tax);
    console.log(colors.green('Total: ') + '$' + this.total);
  }

  printCartItems() {
    if (this.items.length > 0) {
      for (let i = 0; i < this.items.length; i++) {
        console.log(this.items[i]);
      }
    } else {
      console.log('Cart: empty');
    }
  }
}

module.exports = Cart;
