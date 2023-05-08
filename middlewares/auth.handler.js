const boom = require("@hapi/boom");

const checkRole = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.forbidden("Admin permissions required"));
    }
  }
}

module.exports = { checkRole }
