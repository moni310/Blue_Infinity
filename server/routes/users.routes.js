const {
  createUser,
  userLogin,
  getUserProfile,
} = require("../controllers/users.controllers");
const auth = require("../middlewares/auth");
const router = require("express").Router();

router.post("/createUser", createUser);
router.post("/userLogin", userLogin);
router.get("/getUserProfile", auth, getUserProfile);

module.exports = router;
