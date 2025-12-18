const express = require("express");
const CookieParser = require("cookie-parser");

// require of routes
const authroute = require("./routes/auth.routes");
const chatroute = require("./routes/chat.routes");

const app = express();

// Middlewares
app.use(express.json());
app.use(CookieParser());

//use of api routes
app.use("/api/user", authroute);
app.use("/api/chat", chatroute);

module.exports = app;
