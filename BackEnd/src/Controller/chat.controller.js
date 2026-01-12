const { response } = require("../app");
const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({
    user: user._id,
    title: title,
  });

  res.status(201).json({
    message: "Chat created successfully",
    chat: {
      _id: chat._id,
      title: chat.title,
      lastactivity: chat.lastactivity,
      user: chat.user,
    },
  });
}

async function getChats(req, res) {
  const user = req.user;

  const chat = await chatModel
    .find({ user: user._id })
    .sort({ lastactivity: -1 });

  res.status(200).json({
    message: "chat retireval successfully",
    chat: chat.map((chat) => {
      return {
        _id: chat._id,
        title: chat.title,
        lastactivity: chat.lastactivity,
        user: chat.user,
      };
    }),
  });
}

async function getmessages(req, res) {
  const id = req.params.id;

  const response = await messageModel.find({ chat: id });

  res.status(200).json({
    message: "fetched Successfully ",
    messages: response,
  });
}

module.exports = {
  createChat,
  getChats,
  getmessages,
};
