const jwt = require("jsonwebtoken");
const { createError } = require("./errorHandler");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  try {
    if (!token) {
      throw createError(401, "Unauthorized access");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw createError(403, "Forbidden");
      }

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyToken,
};
