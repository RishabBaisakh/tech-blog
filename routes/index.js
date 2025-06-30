const { Router } = require("express");
const webRoutes = require("./web");
const apiRoutes = require("./api");
const router = Router();

router.use("/", webRoutes);
router.use("/api", apiRoutes);

// home
router.get("/", (req, res) => {
  console.log("req.user", req.user);
  if (req.user) {
    return res.redirect("/blogs");
  }
  res.render("home", { title: "Home" });
});

// 404 page
router.use((req, res) => {
  res.status(404).render("404", { title: "Oops!" });
});

module.exports = router;
