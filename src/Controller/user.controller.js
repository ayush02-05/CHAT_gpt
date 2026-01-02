const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
async function userRegister(req, res) {
  const {
    email,
    username: { firstname, lastname },
    password,
  } = req.body;

  const isuserexist = await UserModel.findOne({ email });

  if (isuserexist) {
    return res.status(401).json("User already exist !, please try again");
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

  res.status(201).json("User registered Successfully");
}

module.exports = {
  userRegister,
};
