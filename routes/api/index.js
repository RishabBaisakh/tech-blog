const { Router } = require("express");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const commentRoutes = require("./comment");
const tagRoutes = require("./tag");
const blogRoutes = require("./blog");
const upload = require("../../middlewares/uploadImageMiddleware");
const { requireAdmin } = require("../../middlewares/adminMiddleware");
const { requireAuth } = require("../../middlewares/authMiddleware");

const router = Router();

router.use("/", authRoutes);
router.use("/admin", requireAdmin, adminRoutes);
router.use("/comment", requireAuth, commentRoutes);
router.use("/tags", requireAuth, tagRoutes);
router.use("/blogs", requireAuth, upload.single("image"), blogRoutes);

module.exports = router;
