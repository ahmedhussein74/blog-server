const router = require("express").Router();
const post = require("../controllers/PostController");

router.post("/", post.uploadPostImage, post.resizePostImage, post.createPost);

router.get("/", post.getAllPosts);

router.get("/:postId", post.getPost);

router.put("/:postId", post.uploadPostImage, post.resizePostImage, post.updatePost);

router.delete("/", post.deletePost);

module.exports = router;
