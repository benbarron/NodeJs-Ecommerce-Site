const mix = require('laravel-mix');

mix
  .sass('./resources/sass/main.scss', './public/assets/css/app.css')
  .js('./resources/js/app.js', './public/assets/js');
