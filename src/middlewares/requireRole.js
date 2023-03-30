const requireRole = (...roles) => {
  return (req, res, next) => {
    next();
  };
};

// sample code
// exports.requireRole = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         status: 'fail',
//         message: 'You do not have permission to perform this action',
//       });
//     }

//     next();
//   };
// };

module.exports = requireRole;
