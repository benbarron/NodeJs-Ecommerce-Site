const route = require('express').Router();

const { apiAdmin } = middleware;

route.get('/', (req, res) => {
  res.render('admin/Home');
});

route.get('/products', ProductController.view);
route.get('/products/add', ProductController.add);
route.post('/products/store', apiAdmin, ProductController.store);
route.get('/products/edit/:_id', ProductController.edit);
route.post('/products/update/:_id', apiAdmin, ProductController.update);
route.get('/products/delete/:_id', ProductController.delete);
route.delete('/products/delete/:_id', ProductController.delete);

module.exports = route;
