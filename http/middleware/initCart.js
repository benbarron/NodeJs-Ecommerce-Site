module.exports = (req, res, next) => {
  const { Cart } = interfaces;
  let currentCart;
  let wishlist;

  if (req.isAuthenticated()) {
    currentCart = JSON.parse(req.user.cart);
    wishlist = req.user.wishlist ? JSON.parse(req.user.wishlist) : {};
  } else {
    currentCart = req.session.cart;
    wishlist = {};
  }

  if (typeof currentCart == 'undefined') {
    currentCart = {};
  }

  req.session.cart = new Cart(currentCart);
  req.session.wishlist = new Cart(wishlist);

  next();
};
