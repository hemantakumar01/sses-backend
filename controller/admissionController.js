const Admission = require("../models/admissionModle.js");
const { applyForAdmission } = require("../controller/admissionController.js");
const { sendMail } = require("../helper/helper.js");
const Users = require("../models/userModle.js");
exports.applyForAdmission = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      religion,
      residentialAddress,
      streetAddress,
      city,
      state,
      pin,
      grade,
    } = req.body;

    const markList = req.files["markList"][0].filename;
    const leavingCertificate = req.files["leavingCertificate"][0].filename;
    const additionalDocument = req.files["additionalDocument"]
      ? req.files["additionalDocument"][0].filename
      : null;
    if (!req.user)
      return res.status(400).send({
        success: false,
        message: "Login First",
      });
    const admission = new Admission({
      fullName,
      dateOfBirth,
      religion,
      residentialAddress,
      streetAddress,
      city,
      state,
      pin,
      grade,
      markList,
      leavingCertificate,
      additionalDocument,
      number: req.user.number,
      email: req.user.email,
      userId: req.user._id,
      profile: req.user.profile,
    });
    // console.log("Profile is : ", req.user.profile);
    // console.log(req.user);
    await admission.save();
    sendMail({
      subject: "SSES Apply Admision",
      text: `Hey ${fullName} you have successfully Applied For Admission . \n You will recive a conformation mail with in 6 to 7 working days`,
      email: req.user.email,
    });
    const admin = await Users.findOne({ type: "admin" });

    if (admin) {
      sendMail({
        subject: "SSES Apply Admision",
        text: `Hey ${admin.name} you have new Admission request from ${fullName} for class ${grade} .`,
        email: admin.email,
      });
    }
    res
      .status(200)
      .json({ success: true, message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({});
    if (!admissions)
      return res.status(201).send({
        success: false,
        message: "No addmissions Yet",
      });
    res.status(200).send({
      success: true,
      data: admissions,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

exports.getAdmissionsDetail = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const admissions = await Admission.findById({ _id: id });
    if (!admissions)
      return res.status(201).send({
        success: false,
        message: "No addmissions Yet",
      });
    res.status(200).send({
      success: true,
      data: admissions,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const user = await Admission.findById({ _id: req.body.id });
    const realUser = await Users.findById({ _id: user.userId });
    if (user) {
      user.status = user.status === "pending" ? "accept" : "pending";
      await user.save();
      if (user.status === "pending") {
        realUser.notification.push({
          subject: "Addmsion Rejected",
          message: `Dear ${user.fullName} your addmission hasbeen Rejected. Contact on 9395585260 / 8474856439 for more details`,
        });

        sendMail({
          subject: "Addmsion Rejected",
          text: `Dear ${user.fullName} your addmission hasbeen Rejected. Contact on 9395585260 / 8474856439 for more details`,
          email: user.email,
        });
      }
      if (user.status === "accept") {
        realUser.notification.push({
          subject: "Addmsion Accepted",
          message: `Dear ${user.fullName} your addmission hasbeen Accepted. School will contact you very soon on your number ${user.number} or in ${user.email} . Or you are asked to visit in School with in 2 to 7 working days`,
        });

        sendMail({
          subject: "Addmsion Accepted",
          text: `Dear ${realUser.fullName} your addmission hasbeen Accepted. School will contact you very soon on your number ${realUser.number} or in ${realUser.email} . Or you are asked to visit in School with in 2 to 7 working days`,
          email: realUser.email,
        });
      }
      realUser.admissionId = user._id;
      await realUser.save();
      res.status(200).send({
        success: true,
        message: user.status,
      });
    } else {
      res.status(400).send({
        success: true,
        message: "Error",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
