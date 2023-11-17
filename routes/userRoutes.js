const express = require("express");
const {
  createUser,
  loginUser,
  logoutUser,
  generateOtp,
  verifyOtp,
  getSingleUser,
} = require("../controller/userController");
const { authUser } = require("../helper/authUser");
const { localVariable } = require("../helper/helper");

const router = express.Router();
// Create New User
router.post("/user", createUser);
// Get User
router.get("/user", authUser, (req, res) => {
  console.log(req.user);
});
// GET SINGLE USER
router.get("/singleUser", authUser, getSingleUser);
// Login User
router.post("/login", loginUser);
// LoggOut User
router.post("/logout", logoutUser);
// auth
router.post("/auth", authUser);

router.post("/generate-otp", authUser, localVariable, generateOtp);
router.post("/verify-otp", authUser, verifyOtp);
module.exports = router;
