const Blog = require("../models/blog");

const findBlogById = async (id) => {
  if (!id) return null;

  try {
    return await Blog.findOne({ _id: id });
  } catch (err) {
    console.log(
      "blogUtils - findBlogById:Error occurred while fetching blogs "
    );
  }
};

module.exports = {
  findBlogById,
};
