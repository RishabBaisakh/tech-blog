require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const { generateUniqueSlug } = require("../utils/slugUtils");

const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 20000 })
  .then(async () => {
    const blogs = await Blog.find();

    for (const blog of blogs) {
      if (blog.slug) continue;

      if (blog.body.length < 100) continue;

      const uniqueSlug = await generateUniqueSlug(blog.title);
      blog.slug = uniqueSlug;

      await blog.save();
      console.log(`Slug added to blog ${blog._id}: ${uniqueSlug}`);
    }

    // Close connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("Migration Failed: ", err.message);
  });
