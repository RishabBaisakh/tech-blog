const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  console.log("Admin Route Index");
  return res.render("dashboard/index", { title: "Admin Dashboard" });
});

module.exports = router;
