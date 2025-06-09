const Router = require("express");
const tagController = require("../controllers/tagController");

const router = Router();

router.get("/", tagController.get_all_tags);

module.exports = router;
