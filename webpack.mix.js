const mix = require('laravel-mix');

mix
  .sass('./resources/sass/main.scss', './public/assets/css/app.css')
  .sass('./resources/sass/darkly.scss', './public/assets/css')
  .sass('./resources/sass/sandstone.scss', './public/assets/css')
  .copy('./resources/js/viewUsers.js', './public/assets/js')
  .js('./resources/js/editConfig.js', './public/assets/js')
  .js('./resources/js/contact.js', './public/assets/js')
  .js('./resources/js/app.js', './public/assets/js')
  .js('./resources/js/addProduct.js', './public/assets/js')
  .js('./resources/js/editProduct.js', './public/assets/js')
  .js('./resources/js/addUser.js', './public/assets/js')
  .js('./resources/js/editUser.js', './public/assets/js')
  .js('./resources/js/tinyMceInit.js', './public/assets/js')
  .js('./resources/js/changeBackground.js', './public/assets/js');
