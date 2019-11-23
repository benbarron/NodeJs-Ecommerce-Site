const route = require('express').Router();

const { apiAuth } = middleware;

route.get('/', (req, res) => {
  res.render('admin/Home');
});

route.get('/products', ProductController.view);
route.get('/products/add', ProductController.add);
route.post('/products/store', apiAuth, ProductController.store);
route.get('/products/edit/:id', ProductController.edit);
route.post('/products/update/:id', apiAuth, ProductController.update);
route.get('/products/delete/:id', ProductController.delete);
route.delete('/products/delete/:id', ProductController.delete);

module.exports = route;
