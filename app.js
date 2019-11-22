const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const { engine } = require('express-edge');
const MongoStore = require('connect-mongo')(session);

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
  .connect(env('mongoLinuxUri'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => success('MongoDB Connected...'))
  .catch(err => error(err));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60
    }),
    secret: env('sessionSecret'),
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 540000 }
  })
);

require('./http/middleware/passport')(passport);

app.use(engine);
app.set('views', path.resolve(__dirname, 'resources/views'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static('./public/assets'));
app.use('/storage', express.static('./public/storage'));

app.use((req, res, next) => {
  if (!req.session.cart) {
    const { Cart } = interfaces;

    req.session.cart = new Cart();
  }

  res.locals.path = req.path;
  res.locals.user = req.user;
  res.locals.cart = req.session.cart;

  next();
});

app.use('/api', require('./routes/api'));
app.use(require('./routes/web'));

module.exports = app;
