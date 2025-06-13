const { Router } = require("express");
const webAdminRoutes = require("./web/admin");
const apiAdminRoutes = require("./api/admin");
const { requireAdmin } = require("../middlewares/adminMiddleware");
const router = Router();

// web routes
router.use("/admin", requireAdmin, webAdminRoutes);

// api routes
router.use("/api/admin", requireAdmin, apiAdminRoutes);

module.exports = router;
