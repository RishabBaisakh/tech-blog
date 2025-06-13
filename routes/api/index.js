const { Router } = require("express");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const commentRoutes = require("./comment");

const { requireAdmin } = require("../../middlewares/adminMiddleware");
const { requireAuth } = require("../../middlewares/authMiddleware");

const router = Router();

router.use("/", authRoutes);
router.use("/admin", requireAdmin, adminRoutes);
router.use("/comment", requireAuth, commentRoutes);

module.exports = router;
