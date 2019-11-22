const { Product } = model;

class ProductController {
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
    const { name, price, live, description, details } = req.body;

    const img1 = req.body['file-1'];
    const img2 = req.body['file-2'];
    const img3 = req.body['file-3'];
    const img4 = req.body['file-4'];
    const img5 = req.body['file-5'];

    var images = [img1, img2, img3, img4, img5].filter(
      img => typeof img !== 'undefined'
    );

    if (images.length < 3) {
      return res.render('admin/AddProduct', {});
    }

    if (!name || !price || !description || !details) {
      return res.render('admin/AddProduct', {});
    }

    var options = [];
    var i = 0;

    while (1) {
      var obj = {
        name: req.body['option-' + i + '-name'],
        display: req.body['option-' + i + '-method'],
        values: req.body['option-' + i + '-values']
      };

      if (!obj.name || !obj.display || !obj.values) {
        break;
      }

      options.push(obj);

      i++;
    }

    const product = new Product();

    product.name = name;
    product.price = price;
    product.description = description;
    product.details = details;
    product.options = options;
    product.images = images;
    product.live = live == 'live' ? true : false;

    await product.save();

    // console.log({
    //   name,
    //   price,
    //   live,
    //   description,
    //   details,
    //   img1,
    //   img2,
    //   img3,
    //   img4,
    //   img5
    // });

    return res.redirect('/admin?success_msg=Product Created');
  }

  /*
   *  shows form to edit product
   */
  async edit(req, res) {
    //
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
    //
  }
}

module.exports = ProductController;
