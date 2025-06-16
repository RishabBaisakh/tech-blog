const Profile = require("../models/profile");

const findProfileByUser = async (user, next) => {
  if (!user) return null;
  try {
    return await Profile.findOne({ user: user._id });
  } catch (err) {
    err.message = "PROFILE_NOT_FOUND";
    err.status = 404;
    next(err);
  }
};

module.exports = {
  findProfileByUser,
};
