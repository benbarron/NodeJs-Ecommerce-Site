const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.path = req.path;
  res.locals.user = req.user;
  res.locals.cart = req.session.cart;
  res.locals.wishlist = req.session.wishlist;

  fs.readFile(path.resolve(rootDirectory, 'config/AdminControls.json'), 'utf-8', (err, data) => {
  	try {
  		res.locals.config = JSON.parse(data);
  	} catch(e) {
  		res.locals.config = {};
  	}
  	next();
  });
};
