const nodemailer = require("nodemailer");

exports.sendMessage = (options) => {
  const {
    res,
    status = 500,
    success = false,
    message = "No message",
    data = "No data",
  } = options;

  return res.status(status).send({
    success,
    message,
    data,
  });
};

exports.sendMail = async ({
  subject,
  text,
  email,

  attachments: { filename, path } = {},
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: "Senev Sister's English School <officialhemantpaswan1@gmail.com>",
      to: email || "hemantakumarpaswan@gmail.com",
      subject: subject || "Test Email",
      text: text || "Hello, this is a test email!",
      attachments:
        path && filename
          ? [
              {
                filename: filename,
                path: path,
              },
            ]
          : undefined,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.localVariable = (req, res, next) => {
  req.app.local = {
    OTP: "0000",
    resetSession: false,
  };
  next();
};
