module.exports = (err, req, res, next) => {
  // TODO: Call Sentry error logger right here!

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (req.originalUrl.startsWith("/api")) {
    return res.status(status).json({
      success: false,
      message,
      errors: err.mappedErrors,
    });
  } else {
    return res.status(status).render("error", {
      title: "Something went wrong",
      message,
      status,
    });
  }
};
