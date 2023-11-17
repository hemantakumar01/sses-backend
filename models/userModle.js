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
});

const Users = mongoose.model("user", userSchema);

module.exports = Users;
