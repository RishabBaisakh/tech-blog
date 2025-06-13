const { Router } = require("express");
const authController = require("../../controllers/authController");

const router = Router();

router.post("/signup", authController.handleSignup);
router.post("/login", authController.handleLogin);

module.exports = router;
