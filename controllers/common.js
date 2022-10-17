const Song = require("../models/music.js");
const { validationResult } = require("express-validator");
const Rating = require("../models/rating.js");

exports.getAllSongs = async (req, res, next) => {
  try {
    const response = await Song.find();
    if (!response) {
      const err = new Error("Could not fetch songs!");
      err.statusCode = 409;
      throw err;
    } else {
      if (!response.length !== 0) {
        res.status(200).json({ data: response });
      } else {
        res.status(200).json({ message: "No music found!", data: [] });
      }
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getSongDetails = async (req, res, next) => {
  try {
    const errList = validationResult(req);
    if (!errList.isEmpty()) {
      const err = new Error("Invalid song ID!");
      err.body = errList.array();
      err.statusCode = 422;
      throw err;
    }
    const songID = req.body.id;
    const response = await Song.findOne({ _id: songID });
    if (!response) {
      const err = new Error("Could not find the song!");
      err.statusCode = 404;
      throw err;
    } else {
      res.status(200).json({ data: response });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.vote = async (req, res, next) => {
  try {
    const errList = validationResult(req);
    if (!errList.isEmpty()) {
      const err = new Error("Invalid details!");
      err.body = errList.array();
      err.statusCode = 422;
      throw err;
    }
    const email = req.email;
    const songID = req.body.id;
    const vote = req.body.vote;
    const song = await Song.findOne({ _id: songID });
    if (song) {
      const response = await Rating.findOne({ userEmail: email, songID });
      let result = response;
      if (!response) {
        const rating = new Rating({
          songID,
          userEmail: email,
          vote,
        });
        result = await rating.save();
      } else {
        if (response.vote !== vote) {
          result = await Rating.where({ _id: response.id }).update({ vote });
        }
      }
      if (!result) {
        const err = new Error("Could not add the vote!");
        err.statusCode = 409;
        throw err;
      } else {
        res.status(200).json({
          message: "Successfully registered the vote!",
          data: result,
        });
      }
    } else {
      res.status(404).json({
        message: "Song not found!",
      });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getLikedSongs = async (req, res, next) => {
  try {
    const errList = validationResult(req);
    if (!errList.isEmpty()) {
      const err = new Error("Invalid details!");
      err.body = errList.array();
      err.statusCode = 422;
      throw err;
    }
    const email = req.email;
    const response = await Rating.find({ userEmail: email, vote: 1 });
    if (!response) {
      const err = new Error("Could not fetch the details!");
      err.body = errList.array();
      err.statusCode = 409;
      throw err;
    } else {
      res.status(200).json({
        message: "Successfully fetched your liked songs!",
        data: response,
      });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
