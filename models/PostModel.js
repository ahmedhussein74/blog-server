const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    postImage: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  try {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(this.authorId, { $push: { posts: this._id } });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Post", postSchema);
