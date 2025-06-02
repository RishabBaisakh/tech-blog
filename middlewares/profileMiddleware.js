const Profile = require("../models/profile");

const checkProfile = async (req, res, next) => {
  if (req.originalUrl.includes("/profile/create")) return next();

  const user = req.user;

  if (user) {
    const profile = await Profile.findOne({ user });
    if (!profile) {
      res.redirect("/profile/create");
    } else {
      return next();
    }
  } else {
    return next();
  }
};

module.exports = {
  checkProfile,
};
