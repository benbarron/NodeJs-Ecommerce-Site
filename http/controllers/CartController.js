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

    if (req.user) {
      const user = await User.findOne({ _id: req.user._id });
      user.cart = JSON.stringify(req.session.cart);
      await user.save();
    }
  }

  async removeOne(req, res) {
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

    if (req.user) {
      const user = await User.findOne({ _id: req.user._id });
      user.cart = JSON.stringify(req.session.cart);
      await user.save();
    }
  }

  async clear(req, res) {
    var path = req.query.redirect_to;

    if (!path) {
      path = '';
    }

    req.session.cart = {};

    res.redirect(path + '?success_msg=Shopping Cart Has Been Cleared');

    if (req.user) {
      const user = await User.findOne({ _id: req.user._id });
      user.cart = JSON.stringify(req.session.cart);
      await user.save();
    }
  }
}

module.exports = CartController;
