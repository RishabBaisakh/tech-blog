const Router = require("express");
const commentController = require("../controllers/commentController");

const router = Router();

router.post("/", commentController.comment_post);

module.exports = router;
