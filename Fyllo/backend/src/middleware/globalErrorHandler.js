export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err?.statusCode || 500;
  const success = err?.success || false;
  const message = err?.message || "Internal server error!";
  const data = err?.data;

  console.error(err);

  res.status(statusCode).json({
    statusCode,
    message,
    success,
    data,
  });
};

