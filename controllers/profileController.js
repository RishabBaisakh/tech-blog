const Profile = require("../models/profile");
const { findProfileByUser } = require("../utils/profileUtils");

const viewDetails = async (req, res, next) => {
  try {
    const profile = await findProfileByUser(req.user, next);

    if (profile) {
      return res.render("profile", { title: "Profile", profile });
    } else {
      return res.redirect("profile/create");
    }
  } catch (err) {
    next(err);
  }
};

const viewCreate = async (req, res, next) => {
  try {
    const profile = await findProfileByUser(req.user, next);

    if (profile) {
      return res.redirect("/profile");
    } else {
      return res.render("profile/create", { title: "Create Profile" });
    }
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const existingProfile = await findProfileByUser(req.user, next);

    if (existingProfile) {
      return res.redirect("/profile");
    } else {
      const profile = new Profile({
        ...req.body,
        image: req.file,
        user: req.user,
      });
      await profile.save();
      return res.redirect("/profile");
    }
  } catch (err) {
    next(err);
  }
};

const viewEdit = async (req, res, next) => {
  try {
    const profile = await findProfileByUser(req.user, next);

    if (profile) {
      return res.render("profile/edit", {
        title: "Edit Profile",
        profile,
      });
    } else {
      return res.redirect("/profile/create");
    }
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const profile = await findProfileByUser(req.user, next);

    if (!profile) {
      return res.redirect("/profile/create");
    } else {
      profile.firstName = req.body.firstName;
      profile.lastName = req.body.lastName;
      profile.about = req.body.about;

      if (req.file) {
        profile.image = req.file;
      }

      await profile.save();
      return res.redirect("/profile");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  viewDetails,
  viewCreate,
  create,
  viewEdit,
  update,
};
