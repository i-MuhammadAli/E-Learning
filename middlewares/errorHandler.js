const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  res.status(statusCode);

  switch (statusCode) {
    case 400:
      return res.json({
        title: "Bad Request",
        message:
          err.message || "The request could not be understood by the server.",
      });
    case 401:
      return res.json({
        title: "Unauthorized",
        message:
          err.message || "Authentication is required to access this resource.",
      });
    case 404:
      return res.json({
        title: "Not Found",
        message: err.message || "The requested resource could not be found.",
      });
    case 500:
      return res.json({
        title: "Internal Server Error",
        message: err.message || "An unexpected error occurred on the server.",
      });
    default:
      return res.json({
        title: "Error",
        message: err.message || "An unknown error occurred.",
      });
  }
};

module.exports = errorHandler;
