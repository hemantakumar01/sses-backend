const express = require("express");
const router = express.Router();
const upload = require("../helper/multer.js");
const {
  applyForAdmission,
  getAdmissions,
  getAdmissionsDetail,
  changeStatus,
} = require("../controller/admissionController.js");
const { authUser, isAdmin } = require("../helper/authUser");

// Express endpoint for handling form submissions
router.post(
  "/submit",
  authUser,
  upload.fields([
    { name: "markList" },
    { name: "leavingCertificate" },
    { name: "additionalDocument" },
  ]),
  applyForAdmission
);
// Admin route
router.get("/get-admission", authUser, isAdmin, getAdmissions);
router.get("/admission/:id", authUser, isAdmin, getAdmissionsDetail);
router.post("/changeStatus", authUser, isAdmin, changeStatus);
module.exports = router;
