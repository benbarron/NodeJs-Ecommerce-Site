const route = require('express').Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

const { apiAdmin, webAdmin } = mware;

route.get('/', webAdmin, (req, res) => {
  res.render('admin/Home');
});

route.get('/products', webAdmin, async (req, res) => {
  const products = await db.Product.find();

  return res.render('admin/ViewProducts', { products, ...req.query });
});

route.get('/products/add', webAdmin, async (req, res) => {
  return res.render('admin/AddProduct');
});

route.post('/products/store', apiAdmin, async (req, res) => {
  const { name, price, live, category, description, details } = req.body;

  const options = JSON.parse(req.body.options);

  for (let i = 0; i < options.length; i++) {
    options[i].values = options[i].values.trim();
  }

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

  const product = new db.Product();

  const productDir = path.resolve(
    __dirname,
    '../public/storage/product-images',
    String(product._id)
  );

  fs.mkdirSync(productDir);

  var imagePaths = [];

  for (let i = 0; i < images.length; i++) {
    var ext = images[i].mimetype.split('/')[1];
    var newImageFilename =
      String(new Date().getTime()) + '_' + uuid() + '.' + ext;

    var newImagePath = path.resolve(productDir, newImageFilename);

    images[i].mv(newImagePath);

    imagePaths.push(
      '/storage/product-images/' + product._id + '/' + newImageFilename
    );
  }

  product.name = name;
  product.price = price;
  product.description = description;
  product.details = details;
  product.category = category;
  product.options = options;
  product.images = imagePaths;
  product.live = live == 'live' ? true : false;

  await product.save();

  return res.json({ success_msg: 'Product Created' });
});

route.get('/products/edit/:_id', webAdmin, async (req, res) => {
  const product = await db.Product.findOne({ _id: req.params._id });

  return res.render('admin/EditProduct', { product });
});

route.post('/products/update/:_id', apiAdmin, async (req, res) => {
  const { name, price, live, category } = req.body;
  const { description, details, resetImages } = req.body;

  var options = JSON.parse(req.body.options);

  for (let i = 0; i < options.length; i++) {
    options[i].values = options[i].values.trim();
  }

  if (!name || !price || !live || !category || !description || !details) {
    return res.status(400).json({ error_msg: 'Please enter all fields' });
  }

  const product = await db.Product.findOne({ _id: req.params._id });

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

    const productDir = path.resolve(
      __dirname,
      '../public/storage/product-images',
      String(product._id)
    );

    for (let i = 0; i < images.length; i++) {
      if (images[i] != 'current') {
        var ext = images[i].mimetype.split('/')[1];

        var newImageFilename =
          String(new Date().getTime()) + '_' + uuid() + '.' + ext;

        var newImagePath = path.resolve(productDir, newImageFilename);

        images[i].mv(newImagePath);

        imagePaths.push(
          '/storage/product-images/' + product._id + '/' + newImageFilename
        );
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
});

route.get('/products/delete/:_id', webAdmin, async (req, res) => {
  const product = await db.Product.findOne({ _id: req.params._id });

  const productDir = path.resolve(
    __dirname,
    '../public/storage/product-images',
    String(product._id)
  );

  await product.delete();

  rimraf(productDir, () => {
    return res.redirect('/admin/products?success_msg=Product Deleted');
  });
});

route.get('/settings/background', async (req, res) => {
  return res.render('admin/SettingsBackground');
});

route.post('/settings/background', apiAdmin, async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ error_msg: 'There are no files' });
  }

  if (req.files.image.mimetype.split('/')[0] !== 'image') {
    return res.status(400).json({ error_msg: 'File must be an image' });
  }

  await req.files.image.mv(
    path.resolve(__dirname, '../public/storage/backgrounds/main-background.png')
  );

  return res.json({ success_msg: 'Background Changed' });
});

route.get('/settings/config', webAdmin, async (req, res) => {
  fs.readFile(path.resolve(rootDirectory, 'config', 'AdminControls.json'), 'utf-8', (err, data) => {
    if(err) {
      return res.redirect('/admin?error_msg=There was an internal server error');
    }

    return res.render('admin/EditConfigFile', { fileContents: data });
  });
});

route.post('/settings/config/update', apiAdmin, async (req, res) => {
  const { data } = req.body;

  fs.writeFile(path.resolve(rootDirectory, 'config', 'AdminControls.json'), data, err => {
    if(err) {
      return res.json({ error_msg: 'There was an error saving file. Please try again '});
    }

    return res.json({ success_msg: 'Configuration File Save Successfully' });
  });
});

route.get('/users', webAdmin, async (req, res) => {
  const users = await db.User.find().select('-password');

  return res.render('admin/ViewUsers', { users });
});

route.get('/users/add', webAdmin, async (req, res) => {
  return res.render('admin/AddUser');
});

route.post('/users/store', apiAdmin, async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  var { type } = req.body;

  if(!firstname || !lastname || !username || !email || !type || !password) {
    return res.status(400).json({ error_msg: 'Please enter all fields' });
  }

  const existingUser = await db.User.findOne({ username }).or({ email });

  if(existingUser) {
    return res.status(400).json({ error_msg: 'A user already exists with that email address' });
  }

  type = type == '0' ? false : true;

  const user = new db.User()

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.firstname = firstname;
  user.lastname = lastname;
  user.username = username;
  user.email = email;
  user.type = type;
  user.password = hashedPassword;

  try {
    await user.save();
  } catch(e) {    
    return res.status(501).json({ error_msg: 'Internal server error' });
  }


  return res.json({ success_msg: 'User has been created' });
});

module.exports = route;
