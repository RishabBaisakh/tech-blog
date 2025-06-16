const Tag = require("../models/tag");

const getAll = async (req, res, nextx) => {
  try {
    const tags = await Tag.find();
    return res.status(200).json({ tags });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
};
