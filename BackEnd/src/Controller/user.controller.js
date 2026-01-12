const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function userRegister(req, res) {
  try {
    const {
      email,
      username: { firstname, lastname },
      password,
    } = req.body;

    const isuserexist = await UserModel.findOne({ email });

    if (isuserexist) {
      return res.status(400).json({
        message: "User already exist !, please try again",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username: {
        firstname,
        lastname,
      },
      email,
      password: hashpassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // keep false for localhost
    });
    res.status(200).json({
      message: "User registered Successfully",
      firstname: user.username.firstname,
      lastname: user.username.lastname,
      email: user.email,
    });
  } catch (error) {
    console.log("ERrror", error);
  }
}

async function userlogin(req, res) {
  const { email, password } = req.body;

  const isuserexist = await UserModel.findOne({ email });

  if (!isuserexist) {
    return res.status(401).json({
      message: "Account not exists ! , please register first ",
    });
  }

  const ispasswordvalid = await bcrypt.compare(password, isuserexist.password);

  if (!ispasswordvalid) {
    return res.status(401).json({
      message: "Invalid password ! , please try again",
    });
  }

  const token = jwt.sign({ _id: isuserexist._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // keep false for localhost
  });
  res.status(200).json({
    message: "User logged in successfully ",
  });
}

async function userlogout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax",
    path: "/", // ⚡ make sure path matches the one used when setting the cookie
  });
  return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  userRegister,
  userlogin,
  userlogout,
};
4;
