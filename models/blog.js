const mongoose = require("mongoose");
const commentSchema = require("../models/comment");

// TODO: Add validation in the schemas and enforce it everywhere
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      maxlength: [70, "Title cannot exceed 70 characters."],
      trim: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    body: {
      type: String,
      required: [true, "Body is required."],
      maxlength: [5000, "Body cannot exceed 5000 characters."],
      trim: true,
    },
    approvalStatus: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Status must be one of pending, approved or rejected.",
      },
      default: "pending",
      set: (v) => v.toLowerCase(), // normalize input
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
