const { Router } = require("express");
const profileController = require("../controllers/profileController");

const router = Router();

router.get("/", profileController.viewDetails);
router.get("/create", profileController.viewCreate);
router.post("/create", profileController.create);
router.get("/edit", profileController.viewEdit);
router.post("/update", profileController.update);
module.exports = router;
