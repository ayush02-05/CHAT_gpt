const { default: mongoose } = require("mongoose");

const ChatSchema = mongoose.Schema(
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
    timestamps: true,
  }
);

const ChatModel = mongoose.model("chat", ChatSchema);

module.exports = ChatModel;
