// Connect to DB
const mongoose = require("mongoose");
const Blog = require("../models/blog");

const dbUri =
  "mongodb+srv://rishabbaisakh:FFBvtUWlYBGe40Ez@node-course.vwki4x3.mongodb.net/test-db?retryWrites=true&w=majority&appName=node-course";
mongoose
  .connect(dbUri, { serverSelectionTimeoutMS: 20000 })
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
