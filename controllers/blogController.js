const Blog = require("../models/blog");
const Profile = require("../models/profile");
const Tag = require("../models/tag");
const { findProfileByUser } = require("../utils/profileUtils");

const blog_index = async (req, res) => {
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

const blog_detals = async (req, res) => {
  const id = req.params.id;

  try {
    const allTags = await Tag.find();

    const blog = await Blog.findById(id).populate("tags");

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

const blog_delete = (req, res) => {
  const id = req.params.id;

  // TODO: implement try/catch everywhere!
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
    await blog.save();
    res.redirect("/blogs");
  } catch (err) {
    console.log(
      "Blog Create Post: Error occurred while creating blog!",
      err.message
    );
  }
};

const blog_update_post = async (req, res) => {
  // TODO: this is without form validation!
  const blogId = req.body.blogId;
  try {
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required." });
    }

    const profile = await findProfileByUser(req.user);

    const updateData = {
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,
      profile,
    };

    if (req.file) {
      updateData.image = req.file;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      throw new Error("BLOG_NOT_FOUND");
    }

    res.redirect(`/blogs/${blogId}`);
  } catch (err) {
    console.log(
      "Blog Update Post: Error occurred while updating blog".err.message
    );
  }
};

const blog_like_post = async (req, res) => {
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

const blog_dislike_post = async (req, res) => {
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
  blog_index,
  blog_detals,
  blog_delete,
  blog_create_post,
  blog_like_post,
  blog_dislike_post,
  blog_update_post,
};
