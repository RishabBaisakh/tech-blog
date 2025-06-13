const Tag = require("../models/tag");

const getAll = async (req, res) => {
  try {
    const tags = await Tag.find();
    return res.status(200).json({ tags });
  } catch (err) {
    console.log("Get All Tags: Error occurred while fetching the tags!");
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  getAll,
};
