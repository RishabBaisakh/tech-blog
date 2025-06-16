// Connect to DB
const mongoose = require("mongoose");
const Blog = require("../models/blog");

const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 20000 })
  .then(async () => {
    // Migrate the Field
    const result = await Blog.updateMany(
      { approval_status: { $exists: true } },
      [
        { $set: { approvalStatus: "$approval_status" } },
        { $unset: "approval_status" },
      ]
    );
    console.log("Migration Complete: ", result);

    // Close connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("Migration Failed: ", err.message);
  });
