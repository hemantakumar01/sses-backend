const { sendMessage, sendMail } = require("../helper/helper.js");
const Users = require("../models/userModle.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

exports.createUser = async (req, res) => {
  try {
    const { email, name, number, password, gender } = req.body;

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
    });
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
    console.log(req.user);
    const data = await Users.findById({ _id: req.user._id });
    data.password = null;
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
      Data: req.app.local.OTP,
    });
  } catch (error) {
    sendMessage({ res, message: "error", data: error.message });
  }
};

exports.verifyOtp = (req, res) => {
  try {
    if (req.app.local.resetSession) {
      if (parseInt(req.app.local.OTP) === req.body.OTP) {
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
        status: 500,
        success: false,
        message: "Invalid OTP, Regenerate Again",
      });
    }
    req.app.local.resetSession = false;
    req.app.local.OTP = null;
    res.status(500).send({
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
