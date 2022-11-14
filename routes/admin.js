const express = require("express");
const Song = require("../models/music.js");
const { body } = require("express-validator");
const Router = express.Router();
const adminController = require("../controllers/admin.js");
const commonControllers = require("../controllers/common.js");
const clearFileFromFS = require("../utils/clearFileFromFS.js");

Router.post(
  "/add-song",
  [
    body("title", "Title length should be 3-30 characters")
      .trim()
      .isLength({ min: 3, max: 30 })
      .isString()
      .custom((value, { req }) => {
        return Song.findOne({ title: value }).then((song) => {
          if (song) {
            clearFileFromFS(req.file.path);
            return Promise.reject("The song already exists!");
          }
        });
      }),
    body("album", "Album length should be 3-30 characters")
      .trim()
      .isLength({ min: 3, max: 30 })
      .isString(),
    body("artist").trim().isLength({ min: 3, max: 100 }).isString(),
    body("dateOfRelease", "Invalid date").isNumeric(),
  ],
  adminController.addNewSong
);

Router.delete(
  "/delete-song",
  [body("id", "Invalid song ID!").trim().isString().isMongoId()],
  adminController.deleteSong
);

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

	Router.get("/liked-songs", commonControllers.getLikedSongs);

module.exports = Router;
