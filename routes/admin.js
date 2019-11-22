const route = require('express').Router();

route.get('/', (req, res) => {
  res.render('admin/Home');
});

route.get('/products/add', ProductController.add);
route.post('/products/store', ProductController.store);
route.get('/products/edit/:id', ProductController.edit);
route.post('/products/update/:id', ProductController.update);
route.delete('/products/delete/:id', ProductController.delete);

module.exports = route;
