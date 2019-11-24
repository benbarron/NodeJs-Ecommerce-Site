const route = require('express').Router();

route.get('/', PagesController.home);

route.get('/shop', (req, res) => {
  res.render('Shop');
});

route.get('/product/:_id', PagesController.viewProduct);

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
