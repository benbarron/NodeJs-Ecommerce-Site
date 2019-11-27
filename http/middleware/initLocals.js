module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.path = req.path;
  res.locals.user = req.user;
  res.locals.cart = req.session.cart;
  res.locals.wishlist = req.session.wishlist;

  next();
};
