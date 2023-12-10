const { sendMessage, sendMail } = require("../helper/helper.js");
const Users = require("../models/userModle.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const moment = require("moment");
const Notice = require("../models/NoticeModle.js");

exports.createUser = async (req, res) => {
  try {
    const { email, name, number, password, gender, profile } = req.body;

    let user = await Users.findOne({ email });
    if (user)
      return sendMessage({
        res,
        status: 200,
        success: false,
        message: "User already exist",
        data: user,
      });

    // haspaag
    const hashPassword = await bcrypt.hash(password, 10);
    // whndw

    user = await Users.create({
      email,
      name,
      number,
      password: hashPassword,
      gender,
      profile,
    });
    user.notification.push({
      subject:
        " Welcome to Seven Sister's English School - Your Educational Journey Begins!",
      message: `Dear ${user.name} n\ Welcome to the Seven Sister's
English School family! We're thrilled to have you on board for an exciting year of learning and growth. At Seven Sisiters English School, we're dedicated to fostering a supportive environment where each student can excel academically and personally. Our committed team is here to guide you through this journey, ensuring you have a well-rounded and enriching experience. Explore our clubs, sports, and events to make the most of your time here. If you have any questions or need assistance, don't hesitate to reach out. Get ready for an amazing academic adventure at Seven Sister's
English School!`,
      footer: "Biswajeet Dhar",
    });
    sendMail({
      subject:
        " Welcome to Seven Sister's English School - Your Educational Journey Begins!",
      text: `Dear ${user.name} n\ Welcome to the Seven Sister's
English School family! We're thrilled to have you on board for an exciting year of learning and growth. At [School Name], we're dedicated to fostering a supportive environment where each student can excel academically and personally. Our committed team is here to guide you through this journey, ensuring you have a well-rounded and enriching experience. Explore our clubs, sports, and events to make the most of your time here. If you have any questions or need assistance, don't hesitate to reach out. Get ready for an amazing academic adventure at Seven Sister's
English School!`,
      to: user.email,
    });
    await user.save();
    const token = await jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
    res.status(200).send({
      success: true,
      message: `Welcome ${user.name}`,
      data: user,
    });
    // sendMessage({ res, status: 200, message: "Success", data: token });
  } catch (error) {
    console.log(error);
    sendMessage({ res, data: error.message });
  }
};
exports.getSingleUser = async (req, res) => {
  try {
    const data = await Users.findById({ _id: req.user._id });
    data.password = null;
    sendMessage({ res, status: 200, data: data, success: true });
  } catch (error) {
    sendMessage({ res, status: 500, data: error.message });
    console.log(error);
  }
};
exports.getSingleUsers = async (req, res) => {
  try {
    const data = await Users.findById({ _id: req.params.id });
    data.password = null;
    sendMessage({ res, status: 200, data: data, success: true });
  } catch (error) {
    sendMessage({ res, status: 500, data: error.message });
    console.log(error);
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) {
      filters.name = { $regex: new RegExp(req.query.name, "i") };
    }
    if (req.query.roll) filters.roll = req.query.roll;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.class) filters.class = req.query.class;
    if (req.query.classteacher) filters.classteacher = req.query.classteacher;

    const data = await Users.find(filters).select("-password");

    sendMessage({ res, status: 200, data: data, success: true });
  } catch (error) {
    sendMessage({ res, status: 500, data: error.message });
    console.log(error);
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user)
      return sendMessage({ res, status: 200, message: "User Not Found" });
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return sendMessage({
        res,
        status: 200,
        message: "Invalid Email or Password",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "2d",
    });

    res.status(200).send({
      success: true,
      message: "Login Success",
      data: token,
    });
  } catch (error) {
    sendMessage({ res, status: 500, data: error.message });
    console.log(error);
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // Assuming your cookie is named 'userToken'
    res.clearCookie("token");

    // Redirect the user to the login page or any other desired page
    res.status(200).send({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    sendMessage({ res, status: 500, data: error.message });

    console.log(error);
  }
};

exports.generateOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });
    // sendMail({
    //   subject: "OTP verification",
    //   text: `Your OTP to resetPassword is : ${otp}`,
    // });
    req.app.local.OTP = otp;
    req.app.local.resetSession = true;

    // Send the OTP via email or SMS (implement this part based on your needs)

    res.status(200).send({
      OTP: otp,
      success: true,
      message: "OTP Sent",
    });
  } catch (error) {
    sendMessage({ res, message: "error", data: error.message });
  }
};

exports.verifyOtp = (req, res) => {
  try {
    if (req.app.local.resetSession) {
      console.log("first");
      if (parseInt(req.app.local.OTP) === parseInt(req.body.OTP)) {
        console.log("first");
        req.app.local.resetSession = false;
        req.app.local.OTP = null;
        return sendMessage({
          res,
          status: 200,
          success: true,
          message: "OTP verified Successfully",
        });
      }
      req.app.local.resetSession = false;
      req.app.local.OTP = null;
      return sendMessage({
        res,
        status: 400,
        success: false,
        message: "Invalid OTP, Regenerate Again",
      });
    }
    req.app.local.resetSession = false;
    req.app.local.OTP = null;
    res.status(200).send({
      success: false,
      message: "Invalid OTP, Regenerate Again",
    });
  } catch (error) {
    sendMessage({ res, message: "error", data: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId, name } = req.body;
  } catch (error) {
    console.log(error);
    sendMessage({ res, message: "error", data: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    req.user.notification.map((item) => {
      if (item._id == req.body.id) {
        item.read = true;
      }
    });
    await req.user.save();

    res.status(200).send({
      success: true,
      message: "success",
      data: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    // Assuming req.body.id is the _id of the item you want to remove
    const idToRemove = req.body.id;
    const result = await Users.updateOne(
      { _id: req.user._id }, // Assuming req.user._id is the user's _id
      { $pull: { notification: { _id: idToRemove } } }
    );

    // result contains information about the update operation

    // If you need to access the modified document after the update, you can use findOne
    const updatedUser = await Users.findOne({ _id: req.user._id });
    res.status(200).send({
      success: true,
      message: "success",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.asignStudent = async (req, res) => {
  try {
    const { roll, type } = req.body;
    const user = await Users.findOne({ _id: req.body.id });

    if (!user)
      return res.status(400).send({
        success: false,
        message: "User Not Found2",
      });
    const assignedUser = await Users.findOne({
      roll,
      type,
      class: req.body.class,
    });
    if (assignedUser) {
      return res.status(200).send({
        success: false,
        message: "Try different Roll number",
        roll,
        data: assignedUser,
      });
    }

    user.class = req.body.class;
    user.type = req.body.type;
    user.roll = req.body.roll;
    user.notification.push({
      subject: "Class Assigned ...",
      message: `Hey ${user.name} you  are  Assigned to class ${user.class}`,
    });
    await user.save();
    res.status(200).send({
      message: "Class Updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

exports.asignTeacher = async (req, res) => {
  try {
    const { roll, type } = req.body;
    const user = await Users.findOne({ _id: req.body.id });

    if (!user)
      return res.status(400).send({
        success: false,
        message: "User Not Found",
      });
    const assignedUser = await Users.findOne({
      roll,

      classTeacher: req.body.class,
    });
    if (assignedUser) {
      return res.status(200).send({
        success: false,
        message: "Try different Roll number",
        roll,
        data: assignedUser,
      });
    }

    user.classTeacher = req.body.class;
    user.class = "";
    user.type = req.body.type;
    user.roll = req.body.roll;
    user.notification.push({
      subject: "Class Assigned ...",
      message: `Hey ${user.name} you  are  Assigned to class ${user.class}`,
    });
    await user.save();
    res.status(200).send({
      message: "Teacher Updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};
// To get all students basen on classs teacher
exports.getClassStudent = async (req, res) => {
  try {
    const students = await Users.find({ class: req.user.classTeacher });
    if (students.length < 0)
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    res.status(200).send({
      message: "",
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

exports.takeAttendence = async (req, res) => {
  try {
    const { id, attendence } = req.body;

    const user = await Users.findById({ _id: id });

    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    }

    const date = Date.now();
    let item = user.attendence.map((item) => {
      if (
        moment(item?.date).format("DD-MM-YYYY") ===
        moment(date).format("DD-MM-YYYY")
      ) {
        item = item;
      }
    });

    if (item.length > 0) {
      return res.status(200).send({
        message: "Attendence Taken",
        success: false,
      });
    }
    user.attendence.push({
      date,
      attendence,
    });
    await user.save();
    res.status(200).send({
      message: "user not found",
      success: true,
      data: { user, attendence, date },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

// GEt all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const students = await Users.find({ type: "teacher" });
    if (students.length < 0)
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    res.status(200).send({
      message: "",
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

exports.sendNotice = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const filters = {};
    if (req.query.name) {
      filters.name = { $regex: new RegExp(req.query.name, "i") };
    }
    if (req.query.roll) filters.roll = req.query.roll;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.class) filters.class = req.query.class;
    if (req.query.classteacher) filters.classteacher = req.query.classteacher;

    const data = await Users.find(filters).select("-password");
    if (req.body.subject) {
      if (data.length > 0) {
        await Notice.create({ subject, message, filePath: req.file?.path });

        data.map((item) => {
          item.notification.push({
            subject: req.body?.subject,
            message: req.body?.message,
          });
          item.save();
          sendMail({
            email: item.email,
            subject: req.body.subject,
            text: req.body.message,
            attachments: req.file
              ? {
                  filename: req.file.filename,
                  path: req.file.path,
                }
              : {
                  filename: "",
                  path: "",
                },
          });
        });
      }
    }

    sendMessage({
      res,
      status: 200,
      data: data,
      success: true,
      message: `Email send to ${data.length} Users`,
    });
  } catch (error) {
    sendMessage({ res, status: 500, data: error.message });
    console.log(error);
  }
};
