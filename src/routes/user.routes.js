const express = require("express");
const UserModel = require("../models/user.model");
const { userRegister } = require("../Controller/user.controller");

const route = express.Router();

// register
route.post("/register", userRegister);

module.exports = route;
