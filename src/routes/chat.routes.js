const express = require("express");
const Chatcontroller = require("../Controller/chat.controller");
const { authUser } = require("../middlewares/authentication");

const route = express.Router();

route.post("/", authUser, Chatcontroller.createChat);

module.exports = route;
