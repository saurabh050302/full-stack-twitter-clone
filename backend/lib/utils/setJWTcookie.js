const jwt = require("jsonwebtoken");

const setJWTcookie = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_KEY, { expiresIn: "15d" });

  res.cookie("token", token);
};

module.exports = setJWTcookie;
