const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) throw new Error("no token : protectRoute failed");

    let result = jwt.verify(token, process.env.JWT_KEY);
    if (result) {
      req.userID = result.userID;
      // res.status(200).json({ message: "userID fetched" });
      next();
    } else {
      throw new Error("invalid token : protectRoute failed");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = protectRoute;
