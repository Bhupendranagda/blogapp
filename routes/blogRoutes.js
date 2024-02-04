const express = require("express");
const {
  getAllBlogsController,
  createBlogController,
  updateBLogController,
  deleteBlogController,
  getBlogByIdController,
  userBlogController,
} = require("../controllers/blogController");

const router = express.Router();

router.get("/all-blogs", getAllBlogsController);
router.post("/create-blog", createBlogController);
router.put("/update-blog/:id", updateBLogController);
router.delete("/delete-blog/:id", deleteBlogController);
router.get("/get-blog/:id", getBlogByIdController);
router.get("/user-blog/:id", userBlogController);

module.exports = router;
