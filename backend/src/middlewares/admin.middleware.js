const ApiError = require("../utils/apiError");

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError(403, "Access denied. Admin role required.");
  }
};

module.exports = { isAdmin };
