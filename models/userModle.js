const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Make the email field unique
  },
  number: {
    type: String,
    required: true,
    unique: true, // Make the number field unique
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
    default: "user",
  },
  gender: {
    type: String,
    require: true,
  },
  dateOfBirth: {
    type: Date,
    default: "",
  },
  class: {
    type: String,

    default: "",
  },
  notification: [
    {
      subject: String,
      message: String,
      footer: {
        type: String,
        default: "Your Regardes",
      },
      read: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  classTeacher: {
    type: String,
  },
  roll: { type: String, default: "" },
  address: {
    type: String,
    default: "",
  },
  religion: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  addmissionId: {
    type: String,
    default: "",
  },
  attendence: [
    {
      date: Date,
      attendence: Boolean,
    },
  ],
});

const Users = mongoose.model("user", userSchema);

module.exports = Users;
