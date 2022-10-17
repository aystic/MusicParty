module.exports = (req, res, next) => {
  try {
    if (req.role !== "admin") {
      const err = new Error("Unauthorized!");
      err.statusCode = 401;
      throw err;
    }
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
