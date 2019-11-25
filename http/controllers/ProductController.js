const uuid = require('uuid');
const path = require('path');

const { Product } = model;

class ProductController {
  /*
   *
   *
   */
  async view(req, res) {
    const products = await Product.find();

    return res.render('admin/ViewProducts', { products, ...req.query });
  }

  /*
   *
   *
   */
  async add(req, res) {
    return res.render('admin/AddProduct');
  }

  /*
   *
   *
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

    if (req.files) {
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
   *
   *
   */
  async edit(req, res) {
    const { _id } = req.params;

    const product = await Product.findOne({ _id });

    // console.log(product.options);

    return res.render('admin/EditProduct', { product });
  }

  /*
   *
   *
   */
  async update(req, res) {
    const { name, price, live, category } = req.body;
    const { description, details, resetImages } = req.body;

    const options = JSON.parse(req.body.options);

    if (!name || !price || !live || !category || !description || !details) {
      return res.status(400).json({ error_msg: 'Please enter all fields' });
    }

    const product = await Product.findOne({ _id: req.params._id });

    var imagePaths = [];

    if (req.files) {
      const image1 = req.body['images-1'] || req.files['images-1'];
      const image2 = req.body['images-2'] || req.files['images-2'];
      const image3 = req.body['images-3'] || req.files['images-3'];
      const image4 = req.body['images-4'] || req.files['images-4'];
      const image5 = req.body['images-5'] || req.files['images-5'];

      const images = [image1, image2, image3, image4, image5].filter(
        img => typeof img != 'undefined'
      );

      for (let i = 0; i < images.length; i++) {
        if (images[i] != 'current') {
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
      }
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.details = details;
    product.options = options;
    product.live = live == 'live' ? true : false;

    if (resetImages == 'false') {
      product.images = [...product.images, ...imagePaths];
    } else {
      product.images = imagePaths;
    }

    await product.save();

    res.json({ success_msg: 'Product Updated' });
  }

  /*
   *
   *
   */
  async delete(req, res) {
    await Product.deleteOne({ _id: req.params._id });
    return res.redirect('/admin/products?success_msg=Product Deleted');
  }
}

module.exports = ProductController;
