const { User } = model;

class CartController {
  async add(req, res) {
    const { _id, name, image } = req.body;
    var price = Number(req.body.price);
    var quantity = Number(req.body.quantity);

    var options = {};

    if (req.query.options) {
      try {
        var optionsArr = req.query.options.split(',');

        for (let i = 0; i < optionsArr.length; i++) {
          var option = optionsArr[i].trim();

          if (option != '') {
            options[option] = req.body[option];
          }
        }
      } catch (e) {
        //
      }
    }

    req.session.cart.addItem({ _id, price, name, image }, quantity, options);

    res.redirect('/cart?success_msg=Product added to cart');

    if (req.isAuthenticated()) {
      const user = await User.findOne({ _id: req.user._id });
      user.cart = JSON.stringify(req.session.cart);
      await user.save();
    }
  }

  async removeItem(req, res) {
    const { cartIndexId } = req.params;

    if (!cartIndexId) {
      return res.redirect(
        '/cart?warning_msg=There was an error removing that item'
      );
    }

    if (!req.session.cart) {
      return res.redirect('/cart');
    }

    req.session.cart.removeItem(cartIndexId);

    res.redirect('/cart?success_msg=Item was removed from cart');

    if (req.isAuthenticated()) {
      const user = await User.findOne({ _id: req.user._id });
      user.cart = JSON.stringify(req.session.cart);
      await user.save();
    }
  }

  async updateQuantity(req, res) {
    for (const key of Object.keys(req.body)) {
      if (req.body[key] == 0) {
        req.session.cart.removeItem(key);
      } else {
        req.session.cart.updateQuantity(key, Number(req.body[key]));
      }
    }

    if (req.isAuthenticated()) {
      const user = await User.findOne({ _id: req.user._id });
      user.cart = JSON.stringify(req.session.cart);
      await user.save();
    }

    return res.redirect('/cart?success_msg=You cart has been updated');
  }

  async clear(req, res) {
    var path = req.query.redirect_to;

    if (!path) {
      path = '';
    }

    req.session.cart = {};

    res.redirect(path + '?success_msg=Shopping Cart Has Been Cleared');

    if (req.isAuthenticated()) {
      const user = await User.findOne({ _id: req.user._id });
      user.cart = JSON.stringify(req.session.cart);
      await user.save();
    }
  }
}

module.exports = CartController;
