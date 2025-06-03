const Profile = require("../models/profile");

const findProfileByUser = async (user) => {
  if (!user) return null;
  try {
    const profile = await Profile.findOne({ user: user._id });
    return profile;
  } catch (err) {
    console.log("findProfileByUser: Error while fetching the profile!");
    throw err;
  }
};

module.exports = {
  findProfileByUser,
};
