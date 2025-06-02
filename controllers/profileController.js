const Profile = require("../models/profile");

module.exports.profile_get = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });

    if (profile) {
      return res.render("profile", { title: "Profile", profile });
    } else {
      return res.redirect("profile/create");
    }
  } catch (err) {
    console.log("Profile Get: Error occurred while fetch profile!", err);
  }
};

module.exports.profile_create_get = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne({ user: req.user });

    if (existingProfile) {
      return res.redirect("/profile");
    } else {
      return res.render("profile/create", { title: "Create Profile" });
    }
  } catch (err) {
    console.log("Profile Create Get: Error occurred while fetch profile!", err);
  }
};

module.exports.profile_create_post = async (req, res) => {
  const user = req.user;
  try {
    const existingProfile = await Profile.findOne({ user: req.user });

    if (existingProfile) {
      return res.redirect("/profile");
    } else {
      const profile = new Profile({ ...req.body, image: req.file, user });
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

module.exports.profile_edit_get = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });

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

module.exports.profile_update_post = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });

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
      return res.redirect("/profile");
    }
  } catch (err) {
    console.log(
      "Profile Update Post: Error occurred while fetching the profile!"
    );
  }
};
