const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
};

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = { errorHandler, createError };
