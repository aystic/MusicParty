const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
//Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const utilityRoutes = require("./routes/utility");

//custom middlewares for checking the authentication status and whether the user is an admin or not
const isAuth = require("./middlewares/isAuth");
const isAdmin = require("./middlewares/isAdmin");

const app = express();

//setting up the parser for json data in the request body
app.use(bodyParser.json());

//statically serving the music folder
app.use("/music", express.static(path.join(__dirname, "music")));
app.use(express.static(path.join(__dirname, "public")));

//allowing cross origin sharing
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//setting up the storage for music files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "music");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//setting up multer for storage
app.use(
  multer({ dest: "music", storage: fileStorage, fileFilter }).single("file")
);

//Routes
app.use("/auth", authRoutes); //login routes
app.use("/admin", isAuth, isAdmin, adminRoutes);
app.use("/", utilityRoutes);
app.use("*", (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public/404.html"));
});
//global error handler
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const details = error.body;
  res.status(status).json({
    message,
    details,
  });
});

//setting up the database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connection to DB successfull!");
    app.listen(process.env.PORT || "8080");
  })
  .catch((err) => {
    console.log(err);
  });
