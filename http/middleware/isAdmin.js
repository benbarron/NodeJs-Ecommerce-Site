module.exports = (req, res, next) => {
  if (!req.user || !req.isAuthenticated()) {
    return res.redirect('/?error_msg=Unauthorized');
  }

  if (!req.user.isAdmin) {
    return res.redirect('/?error_msg=Unauthorized');
  }

  next();
};
