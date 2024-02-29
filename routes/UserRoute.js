const router = require("express").Router();
const user = require("../controllers/UserController");
const { authenticate } = require("../middlewares/auth");

router.post("/singup", user.signup);

router.post("/login", user.login);

router.post("/changePassword/:userId", user.changePassword);

// router.post("/", user.uploadUserImage, user.resizeUserImage, user.createUser);

module.exports = router;
