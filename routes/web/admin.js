const { Router } = require("express");
const adminController = require("../../controllers/adminController");

const router = Router();

router.get("/dashboard", adminController.dashboard);
router.get("/blogs/:id", adminController.viewBlog);

module.exports = router;
