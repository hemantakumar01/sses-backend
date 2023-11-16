const { sendMessage } = require("../helper/helper.js");
const Users = require("../models/userModle.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { email, name, number, password } = req.body;

    let user = await Users.findOne({ email, number });
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

    user = await Users.create({ email, name, number, password: hashPassword });
    const token = await jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    res
      .cookie("token", token, {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(200)
      .send({
        success: true,
        message: `Welcome ${user.name}`,
      });
    // sendMessage({ res, status: 200, message: "Success", data: token });
  } catch (error) {
    console.log(error);
    sendMessage({ res, data: error.message });
  }
};
