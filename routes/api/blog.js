const { Router } = require("express");
const blogController = require("../../controllers/blogController");

const router = Router();

router.post("/:id/like", blogController.like);
router.post("/:id/dislike", blogController.dislike);

module.exports = router;
