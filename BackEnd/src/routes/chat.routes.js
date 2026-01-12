const express = require("express");
const Chatcontroller = require("../Controller/chat.controller");
const authentication = require("../middlewares/authentication");

const route = express.Router();

// create chat
route.post("/", authentication.authUser, Chatcontroller.createChat);

// retrieve Chat
route.get("/", authentication.authUser, Chatcontroller.getChats);

// message of id
route.get("/messages/:id", authentication.authUser, Chatcontroller.getmessages);

module.exports = route;
