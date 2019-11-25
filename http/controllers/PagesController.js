const { Product } = model;

class PagesController {
  /*
   *
   *
   */
  async home(req, res) {
    const products = await Product.find({ live: true }).limit(6);

    return res.render('Home', {
      products,
      hero: true,
      contentHeader: { title: 'Our Top Products' }
    });
  }

  /*
   *
   *
   */
  async shop(req, res) {
    return res.render('Shop');
  }

  /*
   *
   *
   */
  async product(req, res) {
    const product = await Product.findOne({ _id: req.params._id });

    return res.render('Product', { product });
  }

  /*
   *
   *
   */
  async shop(req, res) {
    return res.render('Shop');
  }

  /*
   *
   *
   */
  async checkout(req, res) {
    if (req.session.cart.getItems().length == 0) {
      return res.redirect(
        "/cart?error_msg=You can't checkout because you don't have any products in your cart"
      );
    }

    return res.render('Checkout');
  }

  /*
   *
   *
   */
  async cart(req, res) {
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
  }

  async contact(req, res) {}
}

module.exports = PagesController;
