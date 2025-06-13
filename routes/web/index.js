const { Router } = require("express");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");

const { requireAdmin } = require("../../middlewares/adminMiddleware");

const router = Router();

router.use("/", authRoutes);
router.use("/admin", requireAdmin, adminRoutes);

module.exports = router;
