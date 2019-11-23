const uuid = require('uuid');
const path = require('path');

const { Product } = model;

class ProductController {
  /*
   * shows list of all products
   */
  async view(req, res) {
    const products = await Product.find();

    res.locals.products = products;

    return res.render('admin/ViewProducts');
  }

  /*
   * show form to add product
   */
  async add(req, res) {
    return res.render('admin/AddProduct');
  }

  /*
   *  stores a new product instance
   */
  async store(req, res) {
    const { name, price, live, category, description, details } = req.body;

    const options = JSON.parse(req.body.options);

    if (!name || !price || !live || !category || !description || !details) {
      return res.status(400).json({ error_msg: 'Please enter all fields' });
    }

    if (!req.files) {
      return res
        .status(400)
        .json({ error_msg: 'At Lease 3 Product Images Are Required' });
    }

    const image1 = req.files['images-1'];
    const image2 = req.files['images-2'];
    const image3 = req.files['images-3'];
    const image4 = req.files['images-4'];
    const image5 = req.files['images-5'];

    const images = [image1, image2, image3, image4, image5].filter(
      img => typeof img != 'undefined'
    );

    if (images.length < 3) {
      return res
        .status(400)
        .json({ error_msg: 'At Lease 3 Product Images Are Required' });
    }

    var imagePaths = [];

    for (let i = 0; i < images.length; i++) {
      var ext = images[i].mimetype.split('/')[1];
      var storageDirectories = uuid() + uuid() + '.' + ext;

      var pathToStorage = path.resolve(
        __dirname,
        '../../public/storage/product-images',
        storageDirectories
      );

      images[i].mv(pathToStorage);
      imagePaths.push('/storage/product-images/' + storageDirectories);
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      details,
      options,
      images: imagePaths,
      live: live == 'live' ? true : false
    });

    await product.save();

    return res.json({ success_msg: 'Product Created' });
  }

  /*
   *  shows form to edit product
   */
  async edit(req, res) {
    return res.render('admin/EditProduct');
  }

  /*
   *  updates product instance
   */
  async update(req, res) {
    //
  }

  /*
   *  deletes a product
   */
  async delete(req, res) {
    return res.redirect('/admin/products?success_msg=Product Deleted');
  }
}

module.exports = ProductController;
