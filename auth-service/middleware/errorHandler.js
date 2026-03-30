/**
 * Global error handler middleware.
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${statusCode} — ${message}`);
  if (statusCode === 500) console.error(err.stack);

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
