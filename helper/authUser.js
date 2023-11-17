const express = require("express");
const sendMessage = require("./helper.js");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModle.js");

exports.authUser = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || authorization === "Bearer null")
      return res.status(400).send({
        success: false,
        message: "Login First",
      });
    let token = authorization.replace("Bearer ", "");
    if (!token || token === null)
      return res.status(400).send({
        success: false,
        message: "Login First",
      });

    const { id } = jwt.verify(token, process.env.JWT_TOKEN);

    const user = await Users.findOne({ _id: id });
    console.log(user);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error",
      data: error.message,
    });
  }
};
exports.isTeacher = async (req, res, next) => {
  try {
    if (req.user.type === "user" || "admin" || "student") {
      return res.status(500).send({
        success: false,
        message: "Invalid User",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error",
      data: error.message,
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.type === "user" || "admin" || "teacher") {
      return res.status(500).send({
        success: false,
        message: "Invalid User",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error",
      data: error.message,
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.type === "user" || "student" || "teacher") {
      return res.status(500).send({
        success: false,
        message: "Invalid User",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error",
      data: error.message,
    });
  }
};
