const { Router } = require("express");
const blogController = require("../controllers/blogController");

const router = Router();

router.get("/", blogController.blog_index);
router.post("/", blogController.blog_create_post);
router.get("/create", blogController.blog_create_get);
router.get("/:id", blogController.blog_detals);
router.delete("/:id", blogController.blog_delete);

module.exports = router;
