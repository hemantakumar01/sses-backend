const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  subject: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  filePath: {
    type: String,
    default: "",
  },
  data: {
    type: Date,
    default: Date.now(),
  },
});

const Notice = mongoose.model("notice", NoticeSchema);

module.exports = Notice;
