const Comment = require("../models/comment");
const Blog = require("../models/blog");
const { findProfileByUser } = require("../utils/profileUtils");

const handleCreate = async (req, res, next) => {
  const user = req.user;
  const blogId = req.body.blogId;

  try {
    const profile = await findProfileByUser(user._id, next);

    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      return res.redirect("/blogs");
    } else {
      // TODO: return comments for the approval status: rejected | pending
      const newComment = new Comment({
        content: req.body.content,
        author: profile,
      });
      await newComment.save();
      blog.comments.push(newComment);

      await blog.save();
      res.redirect("/blogs");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleCreate,
};
