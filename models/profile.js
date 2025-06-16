const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minlength: [2, "First name must be at least 2 characters."],
      maxlength: [30, "First name cannot exceed 30 characters."],
      match: [
        /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/,
        "First name contains invalid characters.",
      ],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      minlength: [2, "Last name must be at least 2 characters."],
      maxlength: [30, "Last name cannot exceed 30 characters."],
      match: [
        /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/,
        "Last name contains invalid characters.",
      ],
      trim: true,
    },
    image: {
      filename: String,
      path: String,
      url: String,
      mimType: {
        type: String,
        match: [
          /^image\/(jpeg|png|webp)$/,
          "Only JPEG, PNG, or WebP files are allowed.",
        ],
      },
      size: {
        type: Number,
        max: [5 * 1024 * 1024, "Image must be smaller than 5MB."],
      },
      originlName: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // TODO: Finish this!
    // about: {},
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
