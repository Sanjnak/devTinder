const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config/env");

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send("Please Login!");
  }
  const decodedMessage = jwt.verify(token, JWT_SECRET);
  if (!decodedMessage) {
    throw Error("Error in finding user!");
  }
  const user = await User.findById(decodedMessage._id);
  if (user) {
    req.user = user;
  } else {
    throw Error("This user doesn't exist!");
  }
  next();
};

module.exports = {
  authUser,
};
