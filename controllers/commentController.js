const Comment = require("../models/comment");
const Profile = require("../models/profile");
const Blog = require("../models/blog");

module.exports.comment_post = async (req, res) => {
  const user = req.user;
  const blogId = req.body.blogId;

  try {
    const profile = await findProfileByUser(user._id);

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
    console.log(
      "Comment Post: Eror occurred while fetching current profile!",
      err
    );
  }
};
