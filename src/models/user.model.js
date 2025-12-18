const { default: mongoose } = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
  },
  password: {
    type: String,
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
