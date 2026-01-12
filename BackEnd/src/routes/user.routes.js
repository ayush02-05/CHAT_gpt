const express = require("express");
const UserModel = require("../models/user.model");
const controller = require("../Controller/user.controller");

const route = express.Router();

// register
route.post("/register", controller.userRegister);
route.post("/login", controller.userlogin);
route.post("/logout", controller.userlogout);

module.exports = route;
