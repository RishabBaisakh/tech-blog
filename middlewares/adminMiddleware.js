const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).send("Forbidden: Admins Only!");
};

module.exports = {
  requireAdmin,
};
