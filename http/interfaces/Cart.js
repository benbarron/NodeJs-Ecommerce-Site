const uuid = require('uuid');
const colors = require('colors');

class Cart {
  /* Cart Attributes -------------
   * items      -   array of product objects
   * subTotal   -   float
   * tax        -   float
   * total      -   float
   * --------------------------- */
  constructor(oldCart) {
    this.taxRate = 0.09;
    this.items = oldCart.items || [];
    this.quantity = oldCart.quantity || 0;
    this.tax = oldCart.tax || 0.0;
    this.subTotal = oldCart.subTotal || 0.0;
    this.total = oldCart.total || 0.0;
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
      });

      var newProductString = JSON.stringify({
        ...newProduct,
        ...options
      });

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
      cartIndexId = uuid();

      this.items.push({
        cartIndexId,
        product: newProduct,
        options,
        quantity
      });
    }

    this.updatePricesAndQuantity();

    return cartIndexId;
  }

  updateQuantity(id, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      if (id === this.items[i].cartIndexId) {
        this.items[i].quantity = newQuantity;
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
      quantitySum += this.items[i].quantity;
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

// const products = [
//   {
//     id: 1,
//     name: 'Product 1',
//     images: ['/storage/product-images/macbook.png'],
//     price: 1399.99
//   },
//   {
//     id: 2,
//     name: 'Product 2',
//     images: ['/storage/product-images/macbook.png'],
//     price: 1499.99
//   },
//   {
//     id: 3,
//     name: 'Product 3',
//     images: ['/storage/product-images/macbook.png'],
//     price: 1399.99
//   },
//   {
//     id: 4,
//     name: 'Product 4',
//     images: ['/storage/product-images/macbook.png'],
//     price: 1499.99
//   },
//   {
//     id: 5,
//     name: 'Product 5',
//     images: ['/storage/product-images/macbook.png'],
//     price: 1399.99
//   },
//   {
//     id: 6,
//     name: 'Product 6',
//     images: ['/storage/product-images/macbook.png'],
//     price: 1499.99
//   }
// ];

// const cart = new Cart();

// var i1 = cart.addItem(products[1], 2, { ram: '16gb', size: '15in' });
// var i2 = cart.addItem(products[1], 2, { ram: '16gb', size: '17in' });
// // var i2 = cart.addItem(products[0], 1);
// // var i3 = cart.addItem(products[1], 1, { ram: '16gb', size: '13in' });

// // cart.removeItem(i2);
// // cart.updateQuantity(i1, 3);

// // cart.emptyCart();

// cart.printCartNumbers();
// cart.printCartItems();

module.exports = Cart;
