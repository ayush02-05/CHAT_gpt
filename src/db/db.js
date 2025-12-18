const { default: mongoose } = require("mongoose");

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB ✅");
  } catch (err) {
    console.log(err);
  }
}

module.exports = ConnectDB;
