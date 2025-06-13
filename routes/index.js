const { Router } = require("express");
const webRoutes = require("./web");
const apiRoutes = require("./api");
const router = Router();

router.use("/", webRoutes);
router.use("/api", apiRoutes);

module.exports = router;
