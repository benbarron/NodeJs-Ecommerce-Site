module.exports = (req, res, next) => {
  const { Cart } = interfaces;
  var currentCart;

  if (req.isAuthenticated()) {
    currentCart = JSON.parse(req.user.cart);
  } else {
    currentCart = req.session.cart;
  }

  if (typeof currentCart == 'undefined') {
    currentCart = {};
  }

  req.session.cart = new Cart(currentCart);

  res.locals.path = req.path;
  res.locals.user = req.user;
  res.locals.cart = req.session.cart;

  next();
};
