const express = require("express");
const {
  createUser,
  loginUser,
  logoutUser,
  generateOtp,
  verifyOtp,
  getSingleUser,
  updateUser,
  markAsRead,
  asignClass,
  asignType,
  asignStudent,
  asignTeacher,
  getAllUser,
  getSingleUsers,
  getClassStudent,
  takeAttendence,
  getAllTeachers,
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
router.get("/singleUsers/:id", authUser, getSingleUsers);
router.get("/getAllUser", authUser, getAllUser);
// Login User
router.post("/login", loginUser);
// LoggOut User
router.post("/logout", logoutUser);
// auth
router.post("/auth", authUser);

router.post("/generate-otp", authUser, localVariable, generateOtp);
router.post("/verify-otp", authUser, verifyOtp);
router.post("/update", authUser, updateUser);
router.post("/markAsRead", authUser, markAsRead);
router.post("/asignStudent", authUser, asignStudent);
router.post("/asignTeacher", authUser, asignTeacher);
// Get all students Basesd on Class teacher
router.get("/getClassStudent", authUser, getClassStudent);
// Take Attendence
router.post("/attendence", authUser, takeAttendence);
// Get All teachers
router.get("/getAllTeachers", authUser, getAllTeachers);
module.exports = router;
