const { default: mongoose } = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lastactivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamp: true,
  }
);

const chatModel = mongoose.model("chat", chatSchema);

module.exports = { chatModel };
