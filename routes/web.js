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
  const categories = await db.Product.find().distinct('category');

  return res.render('Shop', { products, categories });
});

route.get('/search', async (req, res) => {
  const { q, cat } = req.query;

  let products;
  let searchOptions;

  if(cat && !q) {
    searchOptions = { $or: [
      { category: { $regex: cat, $options: 'i' } }
    ]};
  } else if(q){
    searchOptions = { $or: [
      { name: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ]};
  } else {
    searchOptions = {};
  }

  products = await db.Product.find(searchOptions);

  const categories = await db.Product.find().distinct('category');

  return res.render('Shop', { products, query: q, category: cat, categories });
});



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

  let addresses;

  if(req.isAuthenticated()) {
    addresses = req.user.addresses;
  }

  return res.render('Checkout', {
    addresses,
    contentHeader: {
      title: 'Checkout',
      breadcrumbs: [
        {
          label: 'Checkout',
          url: '/checkout'
        }
      ]
    }
  });
});

route.post('/checkout', async (req, res) => {
  const stripe = require('stripe')(env('stripeSecretKey'));
  
  const { name, address, zip, state, stripeToken, stripeEmail, city, stripeTokenType } = req.body;


  const amount = Number(req.body.amount);
  const products = req.session.cart.getItems();
  const subTotal = req.session.cart.getSubTotal();
  const tax = req.session.cart.getTax();
  const total = req.session.cart.getTotal();

  if(!name || !address || !zip || !state || !city || !stripeToken || !stripeTokenType || !stripeEmail || !amount) {
    let addresses;

    if(req.isAuthenticated()) {
      addresses = req.user.addresses;
    }

    return res.render('Checkout', {
      ...req.body,
      addresses,
      contentHeader: {
        title: 'Checkout',
        breadcrumbs: [
          {
            label: 'Checkout',
            url: '/checkout'
          }
        ]
      }
    });
  }

  stripe
    .customers.create({
      email: stripeEmail,
      source: stripeToken
    })
    .then(customer => stripe.charges.create({
      amount: Math.round(amount),
      description: 'NodeJs ECommerce Site',
      currency: 'usd',
      customer: customer.id
    }))
    .then(async charge => {
      const order = new db.Order({
        name,
        email: stripeEmail,
        subTotal: subTotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        products,
        address,
        city,
        state,
        zip,
        amount,
        stripeToken,
        stripeTokenType
      });

      await order.save();

      req.session.cart = {};

      if (req.isAuthenticated()) {
        const user = await db.User.findOne({ _id: req.user._id });
        
        user.cart = JSON.stringify(req.session.cart);

        var { addresses } = user;
        var exists = false;

        var newAddress = { address, city, state, zip };

        for(let i = 0; i < addresses.length; i++) {
          if(JSON.stringify(addresses[i]).trim() === JSON.stringify(newAddress).trim()) {
            exists = true;
          }
        }

        if(!exists) {
          user.addresses.push(newAddress);
        }

        await user.save();
      }

      return res.redirect('/cart?success_msg=Your order has been placed');
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/checkout?error_msg=There was an error processing your payment');
    })

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
