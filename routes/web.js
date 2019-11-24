const route = require('express').Router();

route.get('/', PagesController.home);

route.get('/shop', (req, res) => {
  res.render('Shop');
});

route.get('/products/:_id', PagesController.viewProduct);

route.post('/cart/add', CartController.add);
route.get('/cart', CartController.view);
route.get('/cart/clear', CartController.clear);

route.get('/checkout', CartController.checkout);

route.post('/api/register', AuthController.register);
route.post('/api/login', AuthController.login);
route.get('/logout', AuthController.logout);

/*
 *
 *
 *
 *
 */

module.exports = route;
