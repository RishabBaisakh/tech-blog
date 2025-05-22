const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

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
app.listen(3000);

// register view engine
app.set("view engine", "ejs");

// middleware and static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});
app.use("/blogs", blogRoutes);
app.use("/auth", authRoutes);

// app.get("/about", (req, res) => {
//   res.render("about", { title: "About" });
// });

// app.get("/about-us", (req, res) => {
//   res.redirect("/about");
// });

// // 404 page
// app.use((req, res) => {
//   res.status(404).render("404", { title: "Oops!" });
// });
