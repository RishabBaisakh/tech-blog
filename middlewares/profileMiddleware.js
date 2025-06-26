const { findProfileByUser } = require("../utils/profileUtils");

const checkProfile = async (req, res, next) => {
  res.locals.profile = null;

  const bypassRoutes = ["/profile/create", "/logout"];

  if (bypassRoutes.includes(req.originalUrl)) {
    return next();
  }

  const user = req.user;

  if (user) {
    try {
      const profile = await findProfileByUser(user, next);

      if (!profile) {
        return res.redirect("/profile/create");
      } else {
        res.locals.profile = profile;

        return next();
      }
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
};

module.exports = {
  checkProfile,
};
