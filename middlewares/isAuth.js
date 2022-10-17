const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) {
      const err = new Error(
        "Unauthorized! Login to access the functionality of the API!"
      );
      err.statusCode = 401;
      throw err;
    }
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      maxAge: "24h",
    });
    if (!decodedToken) {
      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }
    req.role = decodedToken.role;
    req.email = decodedToken.userEmail;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
