const express = require("express");
const morgan = require("morgan");
const upload = require("./middlewares/uploadImageMiddleware");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middlewares/authMiddleware");
const { checkProfile } = require("./middlewares/profileMiddleware");
const { authorizeAdmin } = require("./middlewares/authorizeAdminMiddleware");

// express app
const app = express();

// database connection
const dbUri =
  "mongodb+srv://rishabbaisakh:FFBvtUWlYBGe40Ez@node-course.vwki4x3.mongodb.net/test-db?retryWrites=true&w=majority&appName=node-course";
mongoose
  .connect(dbUri, { serverSelectionTimeoutMS: 20000 })
  .then((result) => {
    console.log("Connected to the DB");
  })
  .catch((err) => {
    console.log("Error while connecting to the db: ", err.message);
    // process.exit(1);
  });
// TODO: move it inside the mongoose connection completion!
app.listen(3000);

// register view engine
app.set("view engine", "ejs");

// middleware and static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);
app.use(checkProfile);

// routes
app.use("/blogs", requireAuth, upload.single("image"), blogRoutes);
app.use("/profile", requireAuth, upload.single("image"), profileRoutes);
app.use("/", authRoutes);
app.use("/dashboard", authorizeAdmin, dashboardRoutes);
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "Oops!" });
});
