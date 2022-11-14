const express = require("express");
const isAuth=require('../middlewares/isAuth')
const { body } = require("express-validator");
const Router = express.Router();
const commonControllers = require("../controllers/common.js");
const path=require('path');

Router.get("/all-songs",isAuth, commonControllers.getAllSongs);

Router.post(
  "/song-details",isAuth,
  [body("id", "Invalid song ID!").trim().isString().isMongoId()],
  commonControllers.getSongDetails
);
Router.post(
  "/vote",isAuth,
  [
    body("id", "Invalid song ID!").trim().isString().isMongoId(),
    body("vote", "Invalid vote value!").isNumeric().isIn([-1, 0, 1]),
  ],
  commonControllers.vote
);

Router.get("/liked-songs",isAuth, commonControllers.getLikedSongs);

Router.get("/",(req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, "../public/Welcome.html"));
});

module.exports = Router;
