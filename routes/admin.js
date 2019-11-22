const route = require('express').Router();

route.get('/', (req, res) => {
  res.render('admin/Home');
});

route.get('/product/add', ProductController.add);
route.post('/product/store', ProductController.store);
route.get('/product/edit/:id', ProductController.edit);
route.post('/product/update/:id', ProductController.update);
route.delete('/product/delete/:id', ProductController.delete);

module.exports = route;
