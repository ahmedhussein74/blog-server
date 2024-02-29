const sharp = require("sharp");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith("image")
    ? cb(null, true)
    : cb(new Error("Not an image! Please upload only images."), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProfileImage = upload.single("profileImage");

exports.resizeProfileImage = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/users/${req.file.filename}`);
  next();
};

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const { oldPassword, newPassword } = req.body;
    if (await bcrypt.compare(oldPassword, user.password)) {
      await user.updateOne({
        password: bcrypt.hash(newPassword, bcrypt.genSalt()),
      });
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(401).json({ message: "Password doesn't match" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(403).json({ message: "Email is already in use" });
    }
    const user = await User.create({ name, password, email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: error.message });
  }
};
