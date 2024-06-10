const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const setJWTcookie = require("../lib/utils/setJWTcookie");

const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // console.log({
    //   fullname: fullname,
    //   username: username,
    //   email: email,
    //   password: password,
    // });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new Error("invalid email address : signup failed");

    const emailExists = await User.findOne({ email });
    if (emailExists) throw new Error("email already in use");

    const userExists = await User.findOne({ username });
    if (userExists) throw new Error("username already taken");

    if (password.length < 6) throw new Error("password too short");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      setJWTcookie(newUser._id, res);
      await newUser.save();
      res.status(200).json(newUser);
    } else {
      throw new Error("new user not created");
    }

    //
  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req, res) => {
  try {
    const { loginText, password } = req.body;

    let username, email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailRegex.test(loginText) ? (email = loginText) : (username = loginText);

    const user =
      (await User.findOne({ email })) || (await User.findOne({ username }));
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ error: "bcrypt compare failed : login failed" });
        } else {
          if (result) {
            setJWTcookie(user._id, res);
            res.status(200).json(user);
            // res.status(200).json({ message: "login successful" });
          } else {
            res.status(400).json({ error: "Wrong password" });
          }
        }
      });
    } else {
      return res.status(400).json({ error: "User does not exist" });
    }

    //
  } catch (error) {
    res.status(500).json(error);
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userID }).select("-password");
    if (!user) throw new Error("Could not get authUser");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { signup, login, logout, getMe };
