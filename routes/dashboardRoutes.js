const { Router } = require("express");
const Blog = require("../models/blog");

const router = Router();

// TODO: Think a little more about the name: dashboard | admin
router.get("/", async (req, res) => {
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

    return res.render("dashboard/index", {
      title: "Admin Dashboard",
      pendingBlogs,
      approvedBlogs,
      rejectedBlogs,
    });
  } catch (err) {
    console.log("Dashboard: Error occurred while fetching blogs");
  }
});

module.exports = router;
