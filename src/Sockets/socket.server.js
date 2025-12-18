const { Server, Socket } = require("socket.io");
const cookie = require("cookie");
const UserModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const ai_services = require("../Services/ai.service");
const vector_services = require("../Services/vector.service");
const jwt = require("jsonwebtoken");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // middleware
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie);

    if (!cookies) {
      next(Error("Authentication error :  Token Not Provided "));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (error) {
      next(Error("Authentication error :  Invalid Token "));
    }
  });

  io.on("connection", (socket) => {
    console.log("New Socket Connection", socket.id);
    console.log("User Connected");

    // customisable sockets
    socket.on("ai-message", async (data) => {
      try {
        const message = typeof data === "string" ? JSON.parse(data) : data;

        if (!message?.content || typeof message.content !== "string") {
          console.error("Invalid ai-message payload:", message);
          return;
        }

        // // storing user message in DB
        // const userMessage = await messageModel.create({
        //   user: socket.user._id,
        //   chat: message.chat,
        //   content: message.content,
        //   role: "user",
        // });

        // // generate vector of user message
        // const vector = await ai_services.generateVector(message.content);

        const [userMessage, vector] = await Promise.all([
          messageModel.create({
            user: socket.user._id,
            chat: message.chat,
            content: message.content,
            role: "user",
          }),
          ai_services.generateVector(message.content),
        ]);

        // // searching the existing data
        // const memory = await vector_services.queryMemory({
        //   queryvector: vector,
        //   limit: 2,
        //   metadata: {},
        // });

        // // storing in vector DB
        // await vector_services.createMemory({
        //   vectors: vector,
        //   messageId: userMessage._id.toString(),
        //   metadata: {
        //     user: socket.user._id,
        //     chat: message.chat,
        //     text: message.content,
        //   },
        // });

        const [memory] = await Promise.all([
          vector_services.queryMemory({
            queryvector: vector,
            limit: 2,
            metadata: {},
          }),
          vector_services.createMemory({
            vectors: vector,
            messageId: userMessage._id.toString(),
            metadata: {
              user: socket.user._id,
              chat: message.chat,
              text: message.content,
            },
          }),
        ]);

        // chathistory STM
        const chatHistory = await messageModel
          .find({
            chat: message.chat,
          })
          .sort({ createdAt: -1 });

        // short term memory
        const stm = chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        });

        // long term memory
        const ltm = [
          {
            role: "user",
            parts: [
              {
                text: ` these are some prevs messgaes from chat , use them to generate response ${memory
                  .map((item) => {
                    item.metadata?.text;
                  })
                  .join(" | ")}`,
              },
            ],
          },
        ];

        // generate response
        const response = await ai_services.generateResponse([...ltm, ...stm]);

        const [Modelvector, modelMessage] = await Promise.all([
          ai_services.generateVector(response),
          messageModel.create({
            user: socket.user._id,
            chat: message.chat,
            content: response,
            role: "model",
          }),
        ]);
        // vector of response
        // const Modelvector = await ai_services.generateVector(response);

        // // storing response in database
        // const modelMessage = await messageModel.create({
        //   user: socket.user._id,
        //   chat: message.chat,
        //   content: response,
        //   role: "model",
        // });

        // storing response in vector DB
        await vector_services.createMemory({
          vectors: Modelvector,
          messageId: modelMessage._id.toString(),
          metadata: {
            user: socket.user._id,
            chat: message.chat,
            text: response,
          },
        });

        // emitting response to client(user)
        socket.emit("ai-response", response);
      } catch (err) {
        console.error("AI socket error:", err);
        socket.emit("ai-error", "Something went wrong");
      }
    });
  });
}

module.exports = initSocketServer;
