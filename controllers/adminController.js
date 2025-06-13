const Blog = require("../models/blog");

const dashboard = async (req, res) => {
  try {
    const blogs = await Blog.find().populate({
      path: "profile",
      populate: {
        path: "user",
      },
    });
    const pendingBlogs = blogs.filter(
      (blog) => blog.approvalStatus === "pending"
    );
    const approvedBlogs = blogs.filter(
      (blog) => blog.approvalStatus === "approved"
    );
    const rejectedBlogs = blogs.filter(
      (blog) => blog.approvalStatus === "rejected"
    );

    return res.render("admin/dashboard", {
      title: "Dashboard",
      pendingBlogs,
      approvedBlogs,
      rejectedBlogs,
    });
  } catch (err) {
    console.log("Dashboard: Error occurred while fetching blogs", err.message);
  }
};

const viewBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId)
      .populate("tags")
      .populate("profile");
    if (!blog) {
      return res.status(404).json({ error: "Blog Not Found" });
    }

    res.render("admin/blogDetails", { title: "Admin | Blog Details", blog });
  } catch (err) {
    console.log("viewBlog: Error occurred while fetching the blog");
  }
};

const approveBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog Not Found" });
    }
    blog.approvalStatus = "approved";

    await blog.validate();
    await blog.save();
    return res.status(200).json({ blog });
  } catch (err) {
    console.log(
      "approveBlog: Error occurred while approving the blog",
      err.message
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const rejectBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog Not Found" });
    }
    blog.approvalStatus = "rejected";

    await blog.validate();
    await blog.save();
    return res.status(200).json({ blog });
  } catch (err) {
    console.log("approveBlog: Error occurred while rejecting the blog");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  dashboard,
  viewBlog,
  approveBlog,
  rejectBlog,
};
