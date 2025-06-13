const { Router } = require("express");
const adminController = require("../../controllers/adminController");

const router = Router();

router.get("/dashboard", adminController.renderDashboard);
router.get("/blogs/:id", adminController.renderBlogDetails);

module.exports = router;
