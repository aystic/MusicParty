const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  songID: {
    type: Schema.Types.ObjectId,
    ref: "Song",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  vote: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
