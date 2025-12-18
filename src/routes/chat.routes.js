const express = require("express");
const route = express.Router();

const chatcontroller = require("../controllers/chat.controller");
const authmiddleware = require("../middlewares/auth.middleware");

route.post("/", authmiddleware.authmiddleware, chatcontroller.createchat);

module.exports = route;
