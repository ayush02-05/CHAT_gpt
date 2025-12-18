const ChatModel = require("../models/chat.model");

async function createchat(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await ChatModel.create({
    user: user._id,
    title,
  });

  res.status(201).json({
    message: "Chat created Successfully ",
    chat: {
      _id: chat._id,
      title: chat.title,
      lastactivity: chat.lastactivity,
      user: chat.user,
    },
  });
}

module.exports = {
  createchat,
};
