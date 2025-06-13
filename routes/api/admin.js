const { Router } = require("express");
const adminController = require("../../controllers/adminController");

const router = Router();

router.post("/blogs/:id/approve", adminController.approveBlog);
router.post("/blogs/:id/reject", adminController.rejectBlog);

module.exports = router;
