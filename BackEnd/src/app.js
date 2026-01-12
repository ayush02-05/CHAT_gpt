require("dotenv").config();
const express = require("express");
const cookieparser = require("cookie-parser");
const Cors = require("cors");

// ROutes require
const UserRoute = require("./routes/user.routes");
const ChatRoute = require("./routes/chat.routes");

const app = express();

// middleware
app.use(Cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieparser());

// Routes  middleware
app.use("/user", UserRoute);
app.use("/chat", ChatRoute);

module.exports = app;
