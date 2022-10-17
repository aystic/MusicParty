const express = require("express");
const Song = require("../models/music.js");
const { body } = require("express-validator");
const Router = express.Router();
const commonControllers = require("../controllers/common.js");

Router.get("/all-songs", commonControllers.getAllSongs);

Router.post(
  "/song-details",
  [body("id", "Invalid song ID!").trim().isString().isMongoId()],
  commonControllers.getSongDetails
);
Router.post(
  "/vote",
  [
    body("id", "Invalid song ID!").trim().isString().isMongoId(),
    body("vote", "Invalid vote value!").isNumeric().isIn([-1, 0, 1]),
  ],
  commonControllers.vote
);

Router.post("/liked-songs", commonControllers.getLikedSongs);

module.exports = Router;
