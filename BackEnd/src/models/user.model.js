const { default: mongoose } = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
