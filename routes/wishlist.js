const route = require('express').Router();

route.post('/add', async (req, res) => {
  if (!req.isAuthenticated()) {
    var redirect = req.query.redirect_to ? req.query.redirect_to : '/';

    return res.redirect(
      redirect +
        "?error_msg=You can't add product to a wish list because you are not logged in "
    );
  }

  const { _id, name, image } = req.body;
  var price = Number(req.body.price);

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

  req.session.wishlist.addItem({ _id, price, name, image }, 1, options);

  const user = await db.User.findOne({ _id: req.user._id });
  user.wishlist = JSON.stringify(req.session.wishlist);
  await user.save();

  return res.redirect('/cart?success_msg=Product added to wish list');
});

route.post('/transfer-to-cart', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/cart');
  }

  const { id } = req.body;

  var item = req.session.wishlist.getItemById(id);

  req.session.wishlist.removeItem(item.cartIndexId);
  req.session.cart.addItem(item.product, item.quantity, item.options);

  const user = await db.User.findOne({ _id: req.user._id });
  user.cart = JSON.stringify(req.session.cart);
  user.wishlist = JSON.stringify(req.session.wishlist);

  await user.save();

  return res.redirect(
    '/cart?success_msg=Product successfully moved to your cart'
  );
});

module.exports = route;
