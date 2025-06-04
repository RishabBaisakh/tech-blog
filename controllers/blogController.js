const Blog = require("../models/blog");
const { findProfileByUser } = require("../utils/profileUtils");

const blog_index = (req, res) => {
  // Create 2 calls based on the role: admin | user
  if (req?.user?.role === "user") {
    // User
    // Only keep the approved blogs and the pending blogs from the current user
    Blog.find({ approvalStatus: { $in: ["approved", "pending"] } })
      .populate({
        path: "profile",
        populate: { path: "user" },
      })
      .sort({ createdAt: -1 })
      .then((blogs) => {
        // Filter pending blogs by current user
        const filtered = blogs.filter(
          (blog) =>
            blog.approvalStatus === "approved" ||
            (blog.approvalStatus === "pending" &&
              blog.profile.user._id.equals(req.user._id))
        );
        res.render("blogs/index", { title: "Filtered Blogs", blogs: filtered });
      })
      .catch(console.error);
  } else {
    console.log("role", req.user.role);
    // Admin
    Blog.find()
      .sort({ createdAt: -1 })
      .then((blogs) => {
        res.render("blogs/index", { title: "Filtered Blogs", blogs });
      })
      .catch(console.error);
  }
};

const blog_detals = (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((blog) => {
      if (!blog) {
        res.render("blogs/notfound", { title: "Not Found" });
      }
      res.render("blogs/detail", { blog: blog, title: "Blog Details" });
    })
    .catch((err) => res.render("404", { title: "Blog Not Found" }));
};

const blog_create_get = (req, res) => {
  res.render("blogs/create", { title: "Create New Blog" });
};

const blog_delete = (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => res.json({ redirect: "/blogs" }))
    .catch((err) =>
      console.log(`Error occurred while deleting the blog on the server`)
    );
};

const blog_create_post = async (req, res) => {
  // TODO: this is without form validation!
  try {
    const profile = await findProfileByUser(req.user);

    const blog = new Blog({ ...req.body, image: req.file, profile });

    blog
      .save()
      .then((result) => res.redirect("/blogs"))
      .catch((err) => console.log(`Error occured while creating new blog!`));
  } catch {
    console.log("Blog Create Post: Error occurred while fetching profile!");
  }
};

module.exports = {
  blog_index,
  blog_detals,
  blog_create_get,
  blog_delete,
  blog_create_post,
};
