const router = require("express").Router();
const comment = require("../controllers/CommentController");

router.post("/", comment.createComment);

router.get("/post/:postId", comment.getCommentsByPostId);

router.get("/:commentId", comment.getComment);

router.put("/:commentId", comment.updateComment);

router.delete("/", comment.deleteComment);

module.exports = router;
