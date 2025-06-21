const Comment = require("../models/comment");
const Blog = require("../models/blog");
const { findProfileByUser } = require("../utils/profileUtils");

const handleCreate = async (req, res, next) => {
  console.log("what!");
  const user = req.user;
  const blogId = req.body?.blogId;
  console.log("🚀 ~ handleCreate ~ req.body:", req.body);

  if (!blogId) throw new Error("blogId is required");

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

      const result = await blog.save();
      return res.status(200).json({ result });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleCreate,
};
