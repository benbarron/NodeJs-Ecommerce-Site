const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const { engine } = require('express-edge');

const app = express();

// app.use((req, res, next) => {
//   try {
//     info(new Date() + ' - ' + req.path);
//   } catch (e) {
//     // =========
//   }

//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(env('mongoUri'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => success('MongoDB Connected...'))
  .catch(err => error(err));

app.use(
  session({
    secret: env('sessionSecret'),
    resave: true,
    saveUninitialized: true
  })
);

require('./http/middleware/passport')(passport);

if (env('mode') === 'PRODUCTION') {
  var options = {
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  };

  app.use(minifyHTML(options));
}

app.use(passport.initialize());
app.use(passport.session());

app.use(engine);
app.set('views', path.resolve(__dirname, 'resources/views'));

app.use('/assets', express.static('./public/assets'));
app.use('/storage', express.static('./public/storage'));

app.use('/api', require('./routes/api'));
app.use(require('./routes/web'));

module.exports = app;
