const Profile = require("../models/profile");
const { findProfileByUser } = require("../utils/profileUtils");

const checkProfile = async (req, res, next) => {
  if (req.originalUrl.includes("/profile/create")) return next();

  const user = req.user;

  if (user) {
    try {
      const profile = await findProfileByUser(user);

      if (!profile) {
        res.redirect("/profile/create");
      } else {
        return next();
      }
    } catch (err) {
      console.log(
        "Check Profile Middleware: Error occurred while fetching profile",
        err
      );
    }
  } else {
    return next();
  }
};

module.exports = {
  checkProfile,
};
