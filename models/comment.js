const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  { _id: true, timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
