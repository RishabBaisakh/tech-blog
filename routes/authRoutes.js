const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/signup", authController.renderSignup);
router.post("/signup", authController.handleSignup);
router.get("/login", authController.renderLogin);
router.post("/login", authController.handleLogin);
router.get("/logout", authController.performLogout);

module.exports = router;
