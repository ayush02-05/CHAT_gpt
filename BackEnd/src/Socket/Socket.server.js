const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const VectorService = require("../Services/vector.service");
const aiService = require("../Services/ai.service");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

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
    try {
      socket.on("ai-message", async (data) => {
        const message = typeof data === "string" ? JSON.parse(data) : data;

        if (!message?.content || typeof message.content !== "string") {
          console.error("Invalid ai-message payload:", message);
          return;
        }

        // user message saved in DB & user message convert into vector
        const [userMessage, userVector] = await Promise.all([
          messageModel.create({
            user: socket.user._id,
            chat: message.chat,
            content: message.content,
            role: "user",
          }),
          aiService.generateVectors(message.content),
        ]);

        // fetching vectors & saving vector to Pincone
        const [memory] = await Promise.all([
          VectorService.queryMemory({
            queryVector: userVector,
            limit: 5,
            chatId: message.chat,
          }),
        ]);

        const shouldstore =
          message.content.length > 30 && !message.content.includes("?");

        if (shouldstore) {
          VectorService.createMemory({
            vector: userVector,
            messageID: userMessage._id.toString(),
            metadata: {
              user: socket.user._id,
              chat: message.chat,
              text: message.content,
              role: "user",
            },
          });
        }

        const relevantMemory = memory.filter((m) => m.score > 0.75);

        // ChatHistory
        const chatHistory = (
          await messageModel
            .find({
              chat: message.chat,
            })
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
        ).reverse();

        // Short term memory
        const stm = chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        });

        let finalPrompt = [...stm];

        if (relevantMemory.length > 0) {
          finalPrompt.unshift({
            role: "user",
            parts: [
              {
                text: `Relevant memory context(use only if needed)${relevantMemory
                  .map((m) => m.metadata.text)
                  .join(" | ")}`,
              },
            ],
          });
        }

        // response is generating
        const response = await aiService.generateResponse(finalPrompt);

        // emitting response to client(user)
        socket.emit("ai-response", {
          chatId: message.chat,
          text: response,
        });

        // response message saved in DB & converting into vector
        const [responseMessage, responseVector] = await Promise.all([
          messageModel.create({
            user: socket.user._id,
            chat: message.chat,
            content: response,
            role: "model",
          }),
          await aiService.generateVectors(response),
        ]);

        const RvectorDB = await VectorService.createMemory({
          vector: responseVector,
          messageID: responseMessage._id.toString(),
          metadata: {
            user: socket.user._id,
            chat: message.chat,
            text: response,
            role: "model",
          },
        });
      });
    } catch (error) {
      console.error("AI socket error:", err);
      socket.emit("ai-error", "Something went wrong");
    }
  });
}

module.exports = initSocketServer;
