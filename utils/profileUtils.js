const Profile = require("../models/profile");

const findProfileByUser = async (user) => {
  if (!user) return null;

  try {
    return await Profile.findOne({ user });
  } catch (err) {
    console.log("findProfileByUser: Error while fetching the profile!");
    throw err;
  }
};

module.exports = {
  findProfileByUser,
};
