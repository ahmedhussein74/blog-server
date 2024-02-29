const sharp = require("sharp");
const multer = require("multer");
const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const Comment = require("../models/CommentModel");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  const isImage = file.mimetype.toLowerCase().startsWith("image");
  isImage
    ? cb(null, true)
    : cb(new Error("Not an image! Please upload only images."), 400);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostImage = upload.single("postImage");

exports.resizePostImage = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `post-${req.body.authorId}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/post/${req.file.filename}`);
  next();
};

exports.createPost = async (req, res) => {
  try {
    const { authorId, description } = req.body;
    const postImage = req.file?.path;
    const post = await Post.create({ authorId, description, postImage });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("authorId comments");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("authorId comments");
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { description } = req.body;
    const postImage = req.file?.path || undefined;
    const post = await Post.findByIdAndUpdate(
      postId,
      { description, postImage },
      { new: true }
    );
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId, authorId } = req.body;
    await Comment.deleteMany({ postId: postId });
    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
