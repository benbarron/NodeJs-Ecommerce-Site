const { Product } = model;

class PagesController {
  async home(req, res) {
    const products = await Product.find({ live: true }).limit(6);

    return res.render('Home', {
      products,
      hero: true,
      contentHeader: { title: 'Our Top Products' }
    });
  }

  async viewProduct(req, res) {
    const product = await Product.findOne({ _id: req.params._id });

    return res.render('Product', { product });
  }

  async shop(req, res) {}

  async contact(req, res) {}
}

module.exports = PagesController;
