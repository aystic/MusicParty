// const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const url = require("url");
// const user = require("../models/user");

exports.login = (req, res, next) => {
  try {
    const errList = validationResult(req);
    if (!errList.isEmpty()) {
      const err = new Error("Validation failed!");
      err.body = errList.array();
      err.statusCode = 422;
      throw err;
    }
    const isAdmin = url.parse(req.url, true).query.admin;
    const email = req.body.email;
    // const password = req.body.password;
    let token;
    if (isAdmin === "true") {
      token = jwt.sign(
        { userEmail: email, role: "admin" },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
    }
    if (isAdmin === undefined || isAdmin === "false") {
      token = jwt.sign(
        { userEmail: email, role: "user" },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
    }
    res
      .status(200)
      .json({ token, email, admin: isAdmin === "true" ? true : false });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
