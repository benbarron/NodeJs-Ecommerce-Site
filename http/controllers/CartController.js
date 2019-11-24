const url = require('url');

class CartController {
  async add(req, res) {
    const { _id, name } = req.body;
    var price = Number(req.body.price);
    var quantity = Number(req.body.quantity);

    var optionsArr = req.query.options.split(',');
    var options = {};

    for (let i = 0; i < optionsArr.length; i++) {
      var option = optionsArr[i].trim();

      if (option != '') {
        options[option] = req.body[option];
      }
    }

    var id = req.session.cart.addItem({ _id, price, name }, quantity, options);

    req.session.cart.printCartNumbers();

    return res.redirect(
      url.format({
        pathname: '/cart',
        query: {
          success_msg: 'Product added to cart',
          ...req.body
        }
      })
    );
  }

  async view(req, res) {
    const { cart } = req.session;

    var subTotal = cart.getSubTotal().toFixed(2);
    var tax = cart.getTax().toFixed(2);
    var total = cart.getTotal().toFixed(2);
    var items = cart.getItems();

    console.log(items);

    return res.render('Cart');
  }

  checkout(req, res) {}

  async clear(req, res) {
    var path = req.query.redirect_to;

    if (!path) {
      path = '';
    }

    req.session.cart = {};

    return res.redirect(path + '?success_msg=Shopping Cart Has Been Cleared');
  }
}

module.exports = CartController;
