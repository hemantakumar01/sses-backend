const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const colors = require("colors");
const mongoose = require("mongoose");
const router = require("./routes/userRoutes.js");
const cookieParser = require("cookie-parser");
const Admission = require("./models/admissionModle.js");
const upload = require("./helper/multer.js");

port = 8080;

const app = express();
app.use(cookieParser());
// middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://192.168.169.107:3000", process.env.CORS_URL],
  })
);
app.use(express.static("uploads"));
app.use(express.static(path.join(__dirname, "./client/build")));
app.use("/api", router);
app.use("/api", require("./routes/addmisionRoutes.js"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  } catch (error) {
    console.log("Error");
    console.log(error);
  }
});

// Express middleware for serving static files
app.use(express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is working in port `);
});
mongoose
  .connect(`${process.env.LOCALDBURL}`)
  .then(() => {
    console.log("DB is Connected");
  })
  .catch((error) => {
    console.log("Error in Connecting DB");
    console.log(error);
  });

// Call the function with specific parameters
