const Blog = require("../models/blog");

const renderDashboard = async (req, res, next) => {
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
    err.message = `Dashboard Fetch Error: ${err.message}`;
    err.status = 500;
    next(err);
  }
};

const renderBlogDetails = async (req, res, next) => {
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
    err.message = `Blog Details Fetch Error: ${err.message}`;
    err.status = 500;
    next(err);
  }
};

const approveBlog = async (req, res, next) => {
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
    next(err);
  }
};

const rejectBlog = async (req, res, next) => {
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
    next(err);
  }
};

module.exports = {
  renderDashboard,
  renderBlogDetails,
  approveBlog,
  rejectBlog,
};
