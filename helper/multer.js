const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;

    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
