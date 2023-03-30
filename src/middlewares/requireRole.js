const requireRole = (...roles) => {
  return (req, res, next) => {
    next();
  };
};

module.exports = requireRole;
