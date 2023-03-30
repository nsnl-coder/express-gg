const requireLogin = (req, res, next) => {
  next();
};

module.exports = requireLogin;
