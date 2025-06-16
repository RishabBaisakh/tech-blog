require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const upload = require("./middlewares/uploadImageMiddleware");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
const profileRoutes = require("./routes/profileRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middlewares/authMiddleware");
const { checkProfile } = require("./middlewares/profileMiddleware");
const routes = require("./routes");
const port = process.env.PORT || 3000;

// express app
const app = express();

// database connection
const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 20000 })
  .then((result) => {
    console.log("Connected to the DB");
  })
  .catch((err) => {
    console.log("Error while connecting to the db: ", err.message);
    // process.exit(1);
  });
// TODO: move it inside the mongoose connection completion!
app.listen(port);

// register view engine
app.set("view engine", "ejs");

// Serve Bootstrap
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

// middleware and static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);
app.use(checkProfile);

// routes
app.use(routes);
app.use("/blogs", requireAuth, upload.single("image"), blogRoutes);
app.use("/profile", requireAuth, upload.single("image"), profileRoutes);
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "Oops!" });
});
