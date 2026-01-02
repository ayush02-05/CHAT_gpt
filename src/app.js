require("dotenv").config();
const express = require("express");
const UserRoute = require("../src/routes/user.routes");

const app = express();

// middleware
app.use(express.json());
app.use("/user", UserRoute);

module.exports = app;
