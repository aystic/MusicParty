const express = require("express");
// const User = require("../models/user");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const Router = express.Router();

Router.post(
  "/login",
  [
    body("email").trim().isEmail().normalizeEmail(),
    body("password").trim().isLength({ min: 4 }),
  ],
  authController.login
);

module.exports = Router;
