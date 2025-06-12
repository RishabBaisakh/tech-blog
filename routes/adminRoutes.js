const { Router } = require("express");
const adminController = require("../controllers/adminController");

const router = Router();

router.get("/", adminController.dashboard);
router.get("/blogs/:id", adminController.viewBlog);
router.post("/blogs/:id/approve", adminController.approveBlog);
router.post("/blogs/:id/reject", adminController.rejectBlog);

module.exports = router;
