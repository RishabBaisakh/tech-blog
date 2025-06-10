const Profile = require("../models/profile");

const findProfileByUser = async (user) => {
  if (!user) return null;
  try {
    return await Profile.findOne({ user: user._id });
  } catch (err) {
    console.log(
      "profileUtils - findProfileByUser: Error while fetching the profile!"
    );
    throw new Error("PROFILE_NOT_FOUND");
  }
};

module.exports = {
  findProfileByUser,
};
