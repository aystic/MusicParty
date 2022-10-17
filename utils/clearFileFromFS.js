const fs = require("fs");
const path = require("path");

module.exports = clearSongFromFS = async (filePath) => {
  fs.unlink(path.join(__dirname, "..", filePath), (err) => {
    try {
      if (err) {
        err.statusCode = 500;
        throw err;
      } else {
        console.log("File deleted successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  });
};
