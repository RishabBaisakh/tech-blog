const Blog = require("../models/blog");
const { findProfileByUser } = require("../utils/profileUtils");

const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("blogs/index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => console.log(`Error while fetching blogs: ${err}`));
};

const blog_detals = (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((result) => {
      if (!result) {
        res.render("blogs/notfound", { title: "Not Found" });
      }
      res.render("blogs/detail", { blog: result, title: "Blog Details" });
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
    const blog = new Blog({ ...req.body, profile });

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
