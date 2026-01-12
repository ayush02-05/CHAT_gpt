const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised Access!",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: decode._id });
    req.user = user;
    next();
  } catch (error) {
    console.error("Token Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  authUser,
};
