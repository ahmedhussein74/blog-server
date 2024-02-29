const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

commentSchema.pre("save", async function (next) {
  try {
    const Post = mongoose.model("Post");
    await Post.findByIdAndUpdate(this.postId, { $push: { comments: this._id }});
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Comment", commentSchema);
