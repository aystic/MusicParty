const Song = require("../models/music.js");
const Rating = require("../models/rating.js");
const { validationResult } = require("express-validator");
const clearFileFromFS = require("../utils/clearFileFromFS.js");

exports.addNewSong = async (req, res, next) => {
  try {
    const errList = validationResult(req);
    if (!errList.isEmpty()) {
      const err = new Error("Validation failed!");
      err.body = errList.array();
      err.statusCode = 422;
      throw err;
    }
    if (!req.file) {
      const err = new Error("File not provided!");
      err.statusCode = 422;
      throw err;
    }
    const title = req.body.title;
    const album = req.body.album;
    const artist = req.body.artist;
    const dateOfRelease = req.body.dateOfRelease;
    const songUrl = req.file.path;
    const song = new Song({
      title,
      album,
      artist,
      dateOfRelease,
      songUrl,
    });
    const response = await song.save();
    if (!response) {
      clearFileFromFS(req.file.path);
      const err = new Error("Some error occurred, Could not save the song!");
      err.statusCode = 409;
      throw err;
    } else {
      res.status(200).json({ message: "Song added successfully!", response });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteSong = async (req, res, next) => {
  try {
    const errList = validationResult(req);
    if (!errList.isEmpty()) {
      const err = new Error("Invalid song ID!");
      err.body = errList.array();
      err.statusCode = 422;
      throw err;
    }
    const songID = req.body.id;
    const response = await Song.findOneAndDelete({ _id: songID });
    if (!response) {
      const err = new Error("Cannot find song with the given ID!");
      err.statusCode = 404;
      throw err;
    } else {
      clearFileFromFS(response.songUrl);
      const response2 = await Rating.deleteMany({ songID: response.id });
      res.status(200).json({ message: "Deleted song successfully!" });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
