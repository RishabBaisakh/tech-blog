const mongoose = require("mongoose");
const commentSchema = require("../models/comment");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // tag: {
    //   type: [String],
    //   default: [],
    // },
    body: {
      type: String,
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    image: {
      filename: String,
      path: String,
      url: String, // stored as a file path or CDN/cloud url
      mimType: String,
      size: Number,
      originlName: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
