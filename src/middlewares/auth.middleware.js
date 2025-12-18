const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

async function authmiddleware(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised access !",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({
      _id: decoded.id,
    });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorised access !",
    });
  }
}

module.exports = { authmiddleware };
