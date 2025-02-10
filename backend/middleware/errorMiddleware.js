const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // If headers are already sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Set the response status code and send the error message
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
