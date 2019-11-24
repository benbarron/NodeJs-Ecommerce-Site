const route = require('express').Router();

route.get('/', PagesController.home);
route.get('/shop', PagesController.shop);
route.get('/products/:_id', PagesController.product);
route.get('/cart', PagesController.cart);
route.get('/checkout', PagesController.checkout);

route.post('/cart/add', CartController.add);
// route.post('/cart/add-one', CartController.addOne);
route.get('/cart/remove/:cartIndexId', CartController.removeOne);
route.get('/cart/clear', CartController.clear);

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
