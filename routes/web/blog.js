const { Router } = require("express");
const blogController = require("../../controllers/blogController");

const router = Router();

router.get("/", blogController.viewAll);
router.post("/create", blogController.create);
router.post("/update", blogController.update);
router.get("/:id", blogController.viewDetails);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
