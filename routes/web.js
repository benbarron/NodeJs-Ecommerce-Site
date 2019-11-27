const route = require('express').Router();

// pages controller routes -------------------------------------
route.get('/', async (req, res) => {
  const products = await db.Product.find({ live: true }).limit(6);

  return res.render('Home', {
    products,
    hero: true,
    contentHeader: { title: 'Our Top Products' }
  });
});

route.get('/shop', async (req, res) => {
  return res.render('Shop');
});

route.get('/products/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const product = await db.Product.findOne({ _id });

    if (!product) {
      throw 'not found error';
    }

    return res.render('Product', { product });
  } catch (e) {
    return res.redirect(
      '/?warning_msg=Product with id ' + _id + ' was not found'
    );
  }
});

route.get('/cart', async (req, res) => {
  return res.render('Cart', {
    contentHeader: {
      title: 'Your Shopping Cart',
      breadcrumbs: [
        {
          label: 'Cart',
          url: '/cart'
        },
        {
          label: 'Checkout',
          url: '/checkout'
        }
      ]
    }
  });
});

route.get('/checkout', async (req, res) => {
  if (req.session.cart.getItems().length == 0) {
    return res.redirect(
      "/cart?error_msg=You can't checkout because you don't have any products in your cart"
    );
  }

  return res.render('Checkout');
});

route.get('/contact', async (req, res) => {
  return res.render('Contact');
});

module.exports = route;
