const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const device = require('express-device');
const fileUpload = require('express-fileupload');
const { engine } = require('express-edge');

const app = express();

app.use(device.capture());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({}));

app.use('/assets', express.static('./public/assets'));
app.use('/storage', express.static('./public/storage'));

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
      ttl: 14 * 24 * 60 * 60 * 1000
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

app.use(mware.initCart);
app.use(mware.initLocals);

if (env('mode') == 'PRODUCTION') {
  app.use(mware.traffic);
}

app.use('/admin', require('./routes/admin'));
app.use('/auth', require('./routes/auth'));
app.use('/cart', require('./routes/cart'));
app.use('/wishlist', require('./routes/wishlist'));
app.use('/', require('./routes/web'));

module.exports = app;
