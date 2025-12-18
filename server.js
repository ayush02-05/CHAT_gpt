require("dotenv").config();

//server
const app = require("./src/app");
const httpServer = require("http").createServer(app);

// connections
const ConnectDB = require("./src/db/db");
const initSocketServer = require("./src/Sockets/socket.server");

// Establisation
ConnectDB();
initSocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is now running on port ✅");
});
