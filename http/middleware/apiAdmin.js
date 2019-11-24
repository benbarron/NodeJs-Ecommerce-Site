module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error_msg: 'Unauthorized' });
  }

  if (!req.user.isAdmin) {
    return res.status(401).json({ error_msg: 'Unauthorized' });
  }

  next();
};
