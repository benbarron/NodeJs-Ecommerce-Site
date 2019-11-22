module.exports = (req, res, next) => {
  if (!req.user || !req.isAuthenticated()) {
    return res.render('admin/Login', {
      msg: 'Please log in to view this content'
    });
  }

  if (!req.user.isAdmin) {
    return res.redirect('/');
  }

  next();
};
