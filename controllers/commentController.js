const Comment = require("../models/comment");
const Profile = require("../models/profile");
const Blog = require("../models/blog");

module.exports.comment_post = async (req, res) => {
  const user = req.user;
  const blogId = req.body.blogId;

  try {
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.redirect("/profile/create");
    }

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

      blog
        .save()
        .then((result) => {
          // TODO: Redirect to either previous page or blogs page there is none!
          res.redirect("/blogs");
        })
        .catch((err) =>
          console.log("Comment Post: Error occurred while saving the blog", err)
        );
    }
  } catch (err) {
    console.log(
      "Comment Post: Eror occurred while fetching current profile!",
      err
    );
  }
};
