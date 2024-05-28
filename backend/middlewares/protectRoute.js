const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token)
      res.status(400).json({ error: "no token : protectRoute failed" });

    let result = jwt.verify(token, process.env.JWT_KEY);
    if (result) {
      req.userID = result.userID;
      // res.status(200).json({ message: "userID fetched" });
      next();
    } else {
      res.status(400).json({ error: "invalid token : protectRoute failed" });
    }
  } catch (error) {
    return;
    // res.status(500).json({ error: "protectRoute failed" });
  }
};

module.exports = protectRoute;
