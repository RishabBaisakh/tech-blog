const Blog = require("../models/blog");
const Tag = require("../models/tag");
const { findProfileByUser } = require("../utils/profileUtils");
const { sanitizeInput } = require("../utils/sanitizeUtils");

const viewAll = async (req, res, next) => {
  try {
    let blogs = [];
    const profile = await findProfileByUser(req.user, next);

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
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: { path: "author" },
        })
        .sort({ createdAt: -1 });
    } else {
      blogs = await Blog.find()
        .populate({ path: "profile", populate: { path: "user" } })
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: { path: "author" },
        })
        .sort({ createdAt: -1 });
    }

    res.render("blogs/index", {
      title: "Filtered Blogs",
      blogs,
      currentProfileId: profile._id.toString() || null,
    });
  } catch (err) {
    next(err);
  }
};

const viewDetails = async (req, res, next) => {
  const id = req.params.id;

  try {
    const allTags = await Tag.find();

    const profile = await findProfileByUser(req.user, next);

    const blog = await Blog.findById(id)
      .populate("tags")
      .populate({ path: "profile", populate: { path: "user" } })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author" },
      });

    if (!blog) {
      throw Object.assign(new Error("Blog not found"), { status: 404 });
    }

    res.render("blogs/detail", {
      blog: blog,
      title: "Blog Details",
      allTags,
      currentProfileId: profile._id.toString() || null,
    });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id).populate("profile");

    if (!blog) {
      throw Object.assign(new Error("Blog not found"), { status: 404 });
    }

    if (!blog.profile.user.equals(req.user._id)) {
      throw Object.assign(new Error("Unauthorized to delete this blog"), {
        status: 403,
      });
    }

    await blog.remove();
    return res.json({ redirect: "/blogs" });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  const { Filter } = await import("bad-words");
  const filter = new Filter();
  try {
    // TODO: Client Side Pending
    // Profanity/Spam Detection
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

    const profile = await findProfileByUser(req.user, next);

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
    next(err);
  }
};

const update = async (req, res, next) => {
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

    blog.title = sanitizeInput(req.body.title);
    blog.body = sanitizeInput(req.body.body);
    blog.tags = req.body.tags;

    if (req.file) {
      blog.image = req.file;
    }
    await blog.validate();
    await blog.save();

    return res.redirect(`/blogs/${blogId}`);
  } catch (err) {
    next(err);
  }
};

const like = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const profile = await findProfileByUser(req.user, next);

    const blog = await Blog.findOne({ _id: blogId }).populate("likes");
    if (!blog) throw new Error("BLOG_NOT_FOUND");

    const hasLiked = blog.likes
      .map((likedProfile) => likedProfile._id.toString())
      .includes(profile._id.toString());

    if (hasLiked) return res.send("ALREADY_LIKED");

    blog.likes.push(profile);

    const result = await blog.save();
    res.status(200).json({ message: "Successfully dislike the blog.", result });
  } catch (err) {
    next(err);
  }
};

const dislike = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const profile = await findProfileByUser(req.user, next);

    const blog = await Blog.findOne({ _id: blogId });

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
    next(err);
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
