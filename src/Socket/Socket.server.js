const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const aiService = require("../Services/ai.service");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // middleware
  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers?.cookie;

    if (!cookieHeader) {
      return next(Error("Not logged in! , Login first"));
    }
    const cookies = cookie.parse(cookieHeader);

    try {
      const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await UserModel.findOne({ _id: decode._id });
      socket.user = user;
      next();
    } catch (error) {
      console.log("Token Error : ", error);
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (data) => {
      const message = typeof data === "string" ? JSON.parse(data) : data;

      if (!message?.content || typeof message.content !== "string") {
        console.error("Invalid message payload : ", message);
        return;
      }

      const userMessage = await messageModel.create({
        user: socket.user._id,
        chat: message.chat,
        content: message.content,
        role: "user",
      });

      const response = await aiService.generateResponse(message.content);

      const responseMessage = await messageModel.create({
        user: socket.user._id,
        chat: message.chat,
        content: response,
        role: "model",
      });

      socket.emit("ai-response", response);
    });
  });
}

module.exports = initSocketServer;
