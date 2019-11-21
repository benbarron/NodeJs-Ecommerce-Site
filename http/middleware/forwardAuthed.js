module.exports = function forwardAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/users/home')
}
