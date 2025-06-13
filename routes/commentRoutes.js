const Router = require("express");
const commentController = require("../controllers/commentController");

const router = Router();

router.post("/", commentController.post);

module.exports = router;
