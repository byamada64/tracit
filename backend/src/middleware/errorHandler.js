// backend/src/middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
}

module.exports = errorHandler;
