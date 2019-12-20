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
  const products = await db.Product.find();

  return res.render('Shop', { products });
});

route.get('/search', async (req, res) => {
  const { q } = req.query;


 const products = await db.Product.find({ $or: [
    { name: { $regex: q, $options: 'i' } },
    { category: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } }
  ]});
 
  return res.render('Shop', { products, query: q });
})

route.get('/products/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const product = await db.Product.findOne({ _id });

    if (!product) {
      throw 'not found error';
    }

    var productOptions = '';

    for (let i = 0; i < product.options.length; i++) {
      productOptions += `${product.options[i].name},`;
    }

    return res.render('Product', { product, productOptions });
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
  return res.render('Contact', {
    contentHeader: {
      title: 'Contact Form',
      breadcrumbs: [
        {
          label: 'Contact',
          url: '/contact'
        }
      ]
    }
  });
});

route.post('/contact', async (req, res) => {
  let { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error_msg: 'Please enter all fields' });
  }

  try {
    const html = `
      <strong>Name: ${name}</strong>
      <br/>
      <strong>Email: ${email}</strong>
      <br/>
      <strong>Message: </strong><p>${message}</p>
    `;

    await mware.sendMail(subject, html);
  } catch (e) {
    return res.status(501).json({ error_msg: 'Error: ' + e });
  }

  return res.json({ success_msg: 'Message has been sent' });
});

module.exports = route;
