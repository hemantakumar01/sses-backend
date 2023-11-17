const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const colors = require("colors");
const mongoose = require("mongoose");
const router = require("./routes/userRoutes.js");
const cookieParser = require("cookie-parser");
port = 8080;

const app = express();
app.use(cookieParser());
// middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.static(path.join(__dirname, "./client/build")));
app.use("/api", router);
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
