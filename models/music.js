const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const musicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  dateOfRelease: {
    type: Date,
    required: true,
  },
  songUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Song", musicSchema);
