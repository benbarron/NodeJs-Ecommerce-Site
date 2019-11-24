const mix = require('laravel-mix');

mix
  .sass('./resources/sass/main.scss', './public/assets/css/app.css')
  .js('./resources/js/app.js', './public/assets/js')
  .js('./resources/js/addProduct.js', './public/assets/js')
  .js('./resources/js/editProduct.js', './public/assets/js')
  .js('./resources/js/tinyMceInit.js', './public/assets/js');
