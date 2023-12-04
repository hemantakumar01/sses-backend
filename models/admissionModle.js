const mongoose = require("mongoose");
const admissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  dateOfBirth: Date,
  religion: {
    type: String,
    required: true,
  },
  residentialAddress: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  markList: {
    type: String,
    required: true,
  }, // Assuming you save the file path or URL
  leavingCertificate: {
    type: String,
    required: true,
  }, // Assuming you save the file path or URL
  additionalDocument: {
    type: String,
    required: true,
  }, // Assuming you save the file path or URL
  profile: {
    type: String,
    required: true,
  }, // Assuming you save the file path or URL
  status: {
    type: String,
    default: "pending",
  }, // Assuming you save the file path or URL
});

const Admission = mongoose.model("Admission", admissionSchema);
module.exports = Admission;
