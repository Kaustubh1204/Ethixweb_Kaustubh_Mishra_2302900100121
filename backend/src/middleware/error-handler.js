const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: statusCode === 500 && process.env.NODE_ENV === "production"
        ? "An unexpected error occurred. Please try again later."
        : err.message || "An unexpected error occurred",
    },
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
