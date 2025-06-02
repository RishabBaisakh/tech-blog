const { Router } = require("express");
const profileController = require("../controllers/profileController");

const router = Router();

router.get("/", profileController.profile_get);
router.get("/create", profileController.profile_create_get);
router.post("/create", profileController.profile_create_post);
router.get("/edit", profileController.profile_edit_get);
router.post("/update", profileController.profile_update_post);

module.exports = router;
