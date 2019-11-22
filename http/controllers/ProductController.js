class ProductController {
  /*
   * show form to add product
   */
  add(req, res) {
    return res.render('admin/AddProduct');
  }

  /*
   *  stores a new product instance
   */
  store(req, res) {
    //
  }

  /*
   *  shows form to edit product
   */
  edit(req, res) {
    //
  }

  /*
   *  updates product instance
   */
  update(req, res) {
    //
  }

  /*
   *  deletes a product
   */
  delete(req, res) {
    //
  }
}

module.exports = ProductController;
