const route = require('express').Router();

const { apiAdmin, isAdmin } = middleware;

route.get('/', isAdmin, (req, res) => {
  res.render('admin/Home');
});

route.get('/products', isAdmin, ProductController.view);
route.get('/products/add', isAdmin, ProductController.add);
route.post('/products/store', apiAdmin, ProductController.store);
route.get('/products/edit/:_id', isAdmin, ProductController.edit);
route.post('/products/update/:_id', apiAdmin, ProductController.update);
route.get('/products/delete/:_id', isAdmin, ProductController.delete);
route.delete('/products/delete/:_id', apiAdmin, ProductController.delete);

module.exports = route;
