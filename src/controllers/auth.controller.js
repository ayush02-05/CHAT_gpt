const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const {
    email,
    password,
    fullname: { firstname, lastname },
  } = req.body;

  const isuserexist = await UserModel.findOne({ email });

  if (isuserexist) {
    return res.status(400).json({ message: "User already exists !" });
  }

  const hashpassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashpassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User registered Successfully ✅",
    user: {
      email: user.email,
      _id: user._id,
      fullname: user.fullname,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const isuserexist = await UserModel.findOne({ email });

  if (!isuserexist) {
    return res.status(400).json({ message: "Invalid User!" });
  }

  const ispasswordValid = await bcrypt.compare(password, isuserexist.password);

  if (!ispasswordValid) {
    return res.status(401).json({ message: "Invalid Credential" });
  }

  const token = jwt.sign({ id: isuserexist._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User Logged in succefully ",
  });
}

module.exports = {
  registerUser,
  loginUser,
};
