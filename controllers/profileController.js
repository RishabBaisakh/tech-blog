const Profile = require("../models/profile");
const { findProfileByUser } = require("../utils/profileUtils");

const viewDetails = async (req, res) => {
  try {
    const profile = await findProfileByUser(req.user);

    if (profile) {
      return res.render("profile", { title: "Profile", profile });
    } else {
      return res.redirect("profile/create");
    }
  } catch (err) {
    console.log("Profile Get: Error occurred while fetch profile!", err);
  }
};

const viewCreate = async (req, res) => {
  try {
    const profile = await findProfileByUser(req.user);

    if (profile) {
      return res.redirect("/profile");
    } else {
      return res.render("profile/create", { title: "Create Profile" });
    }
  } catch (err) {
    console.log("Profile Create Get: Error occurred while fetch profile!", err);
  }
};

const create = async (req, res) => {
  try {
    const existingProfile = await findProfileByUser(req.user);

    if (existingProfile) {
      return res.redirect("/profile");
    } else {
      const profile = new Profile({
        ...req.body,
        image: req.file,
        user: req.user,
      });
      profile
        .save()
        .then((result) => {
          return res.redirect("/profile");
        })
        .catch((err) => {
          console.log("Error occured while editing the profile!", err);
        });
    }
  } catch (err) {
    console.log(
      "Profile Create Post: Error occurred while fetching profile!",
      err
    );
  }
};

const viewEdit = async (req, res) => {
  try {
    const profile = await findProfileByUser(req.user);

    if (profile) {
      return res.render("profile/edit", {
        title: "Edit Profile",
        profile,
      });
    } else {
      return res.redirect("/profile/create");
    }
  } catch (err) {
    console.log("Profile Edit Get: Error occurred while fetching the profile!");
  }
};

const update = async (req, res) => {
  try {
    const profile = await findProfileByUser(req.user);

    if (!profile) {
      return res.redirect("/profile/create");
    } else {
      profile.firstName = req.body.firstName;
      profile.lastName = req.body.lastName;

      if (req.file) {
        profile.image = req.file;
      }

      profile
        .save()
        .then((result) => res.redirect("/profile"))
        .catch((err) => {
          console.log("Error occurred while updating the profile!", err);
        });
    }
  } catch (err) {
    console.log(
      "Profile Update Post: Error occurred while fetching the profile!"
    );
  }
};

module.exports = {
  viewDetails,
  viewCreate,
  create,
  viewEdit,
  update,
};
