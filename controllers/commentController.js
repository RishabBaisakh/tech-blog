const Comment = require("../models/comment");
const Blog = require("../models/blog");
const { findProfileByUser } = require("../utils/profileUtils");

const handleCreate = async (req, res, next) => {
  const user = req.user;
  const blogId = req.body?.blogId;

  if (!blogId) throw new Error("blogId is required");

  try {
    const profile = await findProfileByUser(user._id, next);

    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      return res.redirect("/blogs");
    } else {
      if (blog.approvalStatus !== "approved") {
        throw new Error(
          "The blog needs to be approved by the admin for comments"
        );
      }
      const newComment = new Comment({
        content: req.body.content,
        author: profile,
      });
      await newComment.save();
      blog.comments.push(newComment);

      const result = await blog.save();
      return res.status(201).json({ newComment });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleCreate,
};
