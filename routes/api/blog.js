const { Router } = require("express");
const blogController = require("../../controllers/blogController");

const router = Router();

router.post("/:id/like", blogController.like);
router.post("/:id/dislike", blogController.dislike);

router.get("/blog/:slug", blogController.getBlogBySlug);

module.exports = router;
