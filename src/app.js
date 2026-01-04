require("dotenv").config();
const express = require("express");
const cookieparser = require("cookie-parser");

// ROutes require
const UserRoute = require("../src/routes/user.routes");
const ChatRoute = require("../src/routes/chat.routes");

const app = express();

// middleware
app.use(express.json());
app.use(cookieparser());

// Routes  middleware
app.use("/user", UserRoute);
app.use("/chat", ChatRoute);

module.exports = app;
