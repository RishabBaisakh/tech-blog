const { Router } = require("express");
const authController = require("../../controllers/authController");

const router = Router();

router.get("/signup", authController.renderSignup);
router.get("/login", authController.renderLogin);
router.get("/logout", authController.performLogout);

module.exports = router;
