const route = require('express').Router();
const path = require('path');
const uuid = require('uuid');

route.post('/register', AuthController.register);
route.post('/login', AuthController.login);

route.post('/products/add', ProductController.store);

// route.post('/accept-images', (req, res) => {
//   if (!req.files) {
//     return res.status(400).json({ error_msg: 'Please upload a file ' });
//   }

//   const { image } = req.files;

//   const ext = image.mimetype.split('/')[1];

//   const storageDirectories = uuid() + uuid() + '.' + ext;

//   const pathToStorage = path.resolve(
//     __dirname,
//     '../public/storage/product-images',
//     storageDirectories
//   );

//   console.log(pathToStorage);

//   image.mv(pathToStorage);

//   return res.json({
//     success_msg: 'ok',
//     path: '/storage/product-images/' + storageDirectories
//   });
// });

module.exports = route;
