const app = require("./src/app");
const ConnectTODB = require("./src/db/db");

app.listen("3000", (req, res) => {
  console.log("server is now running on port 3000✅");
  ConnectTODB();
});
