const slugify = require("slugify");
const Blog = require("../models/blog");

const generateUniqueSlug = async (title) => {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

module.exports = {
  generateUniqueSlug,
};
