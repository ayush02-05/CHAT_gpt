const experess = require("express");
const authcontroller = require("../controllers/auth.controller");

const route = experess.Router();

route.post("/register", authcontroller.registerUser);
route.post("/login", authcontroller.loginUser);

module.exports = route;
