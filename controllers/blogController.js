const Blog = require("../models/blog");
const Profile = require("../models/profile");
const Tag = require("../models/tag");
const { findProfileByUser } = require("../utils/profileUtils");
const sanitizeHtml = require("sanitize-html");
const { sanitizeInput } = require("../utils/sanitizeUtils");

const viewAll = async (req, res) => {
  try {
    let blogs = [];
    const profile = await findProfileByUser(req.user);

    if (req?.user?.role === "user") {
      blogs = await Blog.find({
        $or: [
          { approvalStatus: "approved" },
          {
            approvalStatus: { $in: ["pending", "rejected"] },
            profile: profile._id,
          },
        ],
      })
        .populate({ path: "profile", populate: { path: "user" } })
        .populate({ path: "comments", populate: { path: "author" } })
        .sort({ createdAt: -1 });
    } else {
      blogs = await Blog.find()
        .populate({ path: "profile", populate: { path: "user" } })
        .populate({ path: "comments", populate: { path: "author" } })
        .sort({ createdAt: -1 });
    }

    res.render("blogs/index", {
      title: "Filtered Blogs",
      blogs,
      currentProfileId: profile._id.toString() || null,
    });
  } catch (err) {
    console.log("Blog Index: Error occurred while fetching blogs!", err);
    res.status(500).send("Server Error");
  }
};

const viewDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const allTags = await Tag.find();

    const blog = await Blog.findById(id).populate("tags").populate("profile");

    if (!blog) {
      res.render("blogs/notfound", { title: "Not Found" });
    }
    res.render("blogs/detail", {
      blog: blog,
      title: "Blog Details",
      allTags,
    });
  } catch (err) {
    console.log(
      "Blog Details: Error occurred while fetching tags!",
      err.message
    );
  }
};

const deleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id).populate("profile");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (!blog.profile.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this blog" });
    }

    await blog.remove();

    return res.json({ redirect: "/blogs" });
  } catch (err) {
    console.error(
      "Blog Delete: Error occurred while deleting the blog",
      err.message
    );
    return res.status(500).json({ error: "Server error" });
  }
};

const create = async (req, res) => {
  const { Filter } = await import("bad-words");
  const filter = new Filter();
  try {
    // Profanity/Spam Detection
    // TODO: Client Side Pending
    if (filter.isProfane(req.body.body)) {
      return res
        .status(400)
        .json({ error: "Body contains inappropriate language." });
    }

    if (filter.isProfane(req.body.title)) {
      return res
        .status(400)
        .json({ error: "Title contains inappropriate language." });
    }

    const profile = await findProfileByUser(req.user);

    const blog = new Blog({
      ...req.body,
      image: req.file,
      profile,
      body: sanitizeInput(req.body.body),
      title: sanitizeInput(req.body.title),
    });

    await blog.validate();
    await blog.save();
    res.redirect("/blogs");
  } catch (err) {
    //  TODO: Do not remove the catch console.logs unless we have a global handler
    console.log(
      "Blog Create Post: Error occurred while creating blog!",
      err.message
    );
    return res.status(400).json({ errorMessage: err.message });
  }
};

const update = async (req, res) => {
  const { Filter } = await import("bad-words");
  const filter = new Filter();

  const blogId = req.body.blogId;

  try {
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required." });
    }
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    // Profanity/Spam detection
    // TODO: Client Side Pending
    if (filter.isProfane(req.body.body)) {
      return res
        .status(400)
        .json({ error: "Body contains inappropriate language." });
    }

    if (filter.isProfane(req.body.title)) {
      return res
        .status(400)
        .json({ error: "Title contains inappropriate language." });
    }

    blog.title = sanitizeHtml(req.body.title);
    blog.body = sanitizeHtml(req.body.body);
    blog.tags = req.body.tags;

    if (req.file) {
      blog.image = req.file;
    }
    await blog.validate();
    await blog.save();

    return res.redirect(`/blogs/${blogId}`);
  } catch (err) {
    console.log(
      "Blog Update Post: Error occurred while updating blog",
      err.message
    );
    return res.send(400).json({ errorMessage: err.message });
  }
};

const like = async (req, res) => {
  const blogId = req.params.id;

  try {
    const profile = await findProfileByUser(req.user);

    const blog = await Blog.findOne({ _id: blogId }).populate("likes");
    if (!blog) throw new Error("BLOG_NOT_FOUND");

    const hasLiked = blog.likes.includes(profile._id);
    if (hasLiked) return res.send("ALREADY_LIKED");

    blog.likes.push(profile);

    await blog.save();
    res.status(200).json({ result });
  } catch (err) {
    console.log(
      "Blog Like Post: Error occurred while fetch the blog/profile!",
      err.message
    );
  }
};

const dislike = async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findOne({ _id: blogId });

    const profile = await findProfileByUser(req.user);

    if (!blog) {
      return res.send("BLOG_NOT_FOUND");
    }

    const result = await Blog.updateOne(
      { _id: blogId },
      { $pull: { likes: profile._id } }
    );
    if (result.modifiedCount === 0) {
      return res.status(200).json({
        message: "User had not liked the post previously.",
        result,
      });
    }

    return res.status(200).json({
      message: "Successfully dislike the blog.",
      result,
    });
  } catch (err) {
    console.log(
      "Blog Dislike Post: Error occurred while fetching blog/profile!",
      err
    );
  }
};

module.exports = {
  viewAll,
  viewDetails,
  deleteBlog,
  create,
  like,
  dislike,
  update,
};
