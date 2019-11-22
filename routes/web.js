const route = require('express').Router();

const { isAdmin } = middleware;

const tempPayload = {
  hero: true,
  contentHeader: {
    title: 'Our Top Products'
  },
  shoppingCart: [
    {
      quantity: 2,
      product: {
        id: 2,
        name: 'Product 2',
        images: ['/storage/product-images/macbook.png'],
        price: 1499.99
      }
    },
    {
      quantity: 1,
      product: {
        id: 4,
        name: 'Product 4',
        images: ['/storage/product-images/macbook.png'],
        price: 1499.99
      }
    }
  ],
  products: [
    {
      id: 1,
      name: 'Product 1',
      images: ['/storage/product-images/macbook.png'],
      price: 1399.99
    },
    {
      id: 2,
      name: 'Product 2',
      images: ['/storage/product-images/macbook.png'],
      price: 1499.99
    },
    {
      id: 3,
      name: 'Product 3',
      images: ['/storage/product-images/macbook.png'],
      price: 1399.99
    },
    {
      id: 4,
      name: 'Product 4',
      images: ['/storage/product-images/macbook.png'],
      price: 1499.99
    },
    {
      id: 5,
      name: 'Product 5',
      images: ['/storage/product-images/macbook.png'],
      price: 1399.99
    },
    {
      id: 6,
      name: 'Product 6',
      images: ['/storage/product-images/macbook.png'],
      price: 1499.99
    }
  ]
};

route.get('/', (req, res) => {
  res.render('Home', { ...tempPayload });
});

route.get('/shop', (req, res) => {
  res.render('Shop');
});

route.get('/product', (req, res) => {
  res.render('Product');
});

route.get('/admin', isAdmin, (req, res) => {
  res.render('admin/Home');
});

route.get('/logout', AuthController.logout);

module.exports = route;
