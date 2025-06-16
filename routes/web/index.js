const { Router } = require("express");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const profileRoutes = require("./profile");
const blogRoutes = require("./blog");
const upload = require("../../middlewares/uploadImageMiddleware");

const { requireAdmin } = require("../../middlewares/adminMiddleware");
const { requireAuth } = require("../../middlewares/authMiddleware");

const router = Router();

router.use("/", authRoutes);
router.use("/admin", requireAdmin, adminRoutes);
router.use("/profile", requireAuth, upload.single("image"), profileRoutes);
router.use("/blogs", requireAuth, upload.single("image"), blogRoutes);

module.exports = router;
