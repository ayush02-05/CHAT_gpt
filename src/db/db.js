const { default: mongoose } = require("mongoose");

async function ConnectTODB() {
  await mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("Connected to Database ✅");
    })
    .catch((err) => {
      console.log("database error : ", err);
    });
}

module.exports = ConnectTODB;
